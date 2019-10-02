// import firebase from "firebase/app";
import "firebase/auth";
import { ThunkAction } from "redux-thunk";
import React from "react";
import { Action } from "redux";
import {
    db,
    projects,
    profiles,
    usernames,
    tags
} from "../../config/firestore";
import {
    GET_USER_PROJECTS,
    ProfileActionTypes,
    ADD_USER_PROJECT,
    DELETE_USER_PROJECT,
    GET_USER_PROFILE,
    GET_USER_IMAGE_URL,
    SET_CURRENT_TAG_TEXT,
    SET_TAGS_INPUT,
    GET_TAGS,
    SET_PREVIOUS_PROJECT_TAGS,
    SET_LIST_PLAY_STATE,
    SET_CURRENTLY_PLAYING_PROJECT,
    SET_CSOUND_STATUS
} from "./types";
import defaultCsd from "../../templates/DefaultCsd.json";
import defaultOrc from "../../templates/DefaultOrc.json";
import defaultSco from "../../templates/DefaultSco.json";
import firebase from "firebase/app";
import { openSnackbar } from "../Snackbar/actions";
import { SnackbarType } from "../Snackbar/types";
import { push } from "connected-react-router";
import { openSimpleModal } from "../Modal/actions";
import { ProjectModal } from "./ProjectModal";
import { getDeleteProjectModal } from "./DeleteProjectModal";
import { selectPreviousProjectTags, selectCsoundStatus } from "./selectors";
import { runCsound, playPauseCsound } from "../Csound/actions";
import { syncProjectDocumentsWithEMFS } from "../Projects/actions";

const getUserProfileAction = (payload: any): ProfileActionTypes => {
    return {
        type: GET_USER_PROFILE,
        payload
    };
};

export const getUserProfile = (
    username: string
): ThunkAction<void, any, null, Action<string>> => dispatch => {
    firebase.auth().onAuthStateChanged(async user => {
        if (user != null) {
            let uid;
            if (username === null) {
                uid = firebase.auth().currentUser!.uid;
            } else {
                const result = await usernames.doc(username).get();
                const data = result.data() || null;

                if (data === null) {
                    dispatch(push("/404", { message: "Profile Not Found" }));
                    return;
                } else {
                    uid = data!.userUid;
                }
            }
            const profile = await profiles.doc(uid).get();

            if (!profile.exists) {
                dispatch(push("/404"));
                openSnackbar("User profile not found", SnackbarType.Error);
            } else {
                dispatch(
                    getUserProfileAction({
                        profile: profile.data(),
                        loggedInUid: user.uid,
                        profileUid: uid
                    })
                );
            }
        }
    });
};

const getUserProjectsAction = (payload: any): ProfileActionTypes => {
    return {
        type: GET_USER_PROJECTS,
        payload
    };
};

export const getUserProjects = (): ThunkAction<
    void,
    any,
    null,
    Action<string>
> => dispatch => {
    firebase.auth().onAuthStateChanged(user => {
        if (user != null) {
            const uid = firebase.auth().currentUser!.uid;
            projects.where("userUid", "==", uid).onSnapshot(querySnapshot => {
                const projects: any = [];
                querySnapshot.forEach(d => {
                    return projects.push({
                        ...d.data(),
                        projectUid: querySnapshot.docs[projects.length].id
                    });
                });
                dispatch(getUserProjectsAction(projects));
            });
        }
    });
};

const addUserProjectAction = (): ProfileActionTypes => {
    return {
        type: ADD_USER_PROJECT
    };
};

export const addUserProject = (
    name: string,
    description: string,
    currentTags: string[],
    projectID: string
): ThunkAction<void, any, null, Action<string>> => (dispatch, getState) => {
    firebase.auth().onAuthStateChanged(async user => {
        if (user != null) {
            const newProject = {
                userUid: user.uid,
                name,
                description,
                public: false,
                tags: currentTags
            };

            try {
                const newProjectRef = await projects.add(newProject);
                const tagsResult = currentTags.map(async tag => {
                    const result = await tags.doc(tag).get();
                    if (result.exists) {
                        return tags.doc(tag).update({
                            projectUids: firebase.firestore.FieldValue.arrayUnion(
                                newProjectRef.id
                            )
                        });
                    } else {
                        return tags.doc(tag).set({
                            projectUids: firebase.firestore.FieldValue.arrayUnion(
                                newProjectRef.id
                            )
                        });
                    }
                });
                await Promise.all(tagsResult);
                await newProjectRef
                    .collection("files")
                    .add({ ...defaultCsd, userUid: user.uid });
                await newProjectRef
                    .collection("files")
                    .add({ ...defaultOrc, userUid: user.uid });
                await newProjectRef
                    .collection("files")
                    .add({ ...defaultSco, userUid: user.uid });
                dispatch(addUserProjectAction());
                dispatch(openSnackbar("Project Added", SnackbarType.Success));
            } catch (e) {
                console.log(e);

                dispatch(
                    openSnackbar("Could not add Project", SnackbarType.Error)
                );
            }
        }
    });
};

export const editUserProject = (
    name: string,
    description: string,
    currentTags: string[],
    projectID: string
): ThunkAction<void, any, null, Action<string>> => (dispatch, getState) => {
    firebase.auth().onAuthStateChanged(async user => {
        if (user !== null) {
            const newProject = {
                userUid: user.uid,
                name: name || "",
                description: description || "",
                public: false,
                tags: currentTags || []
            };

            const state = getState();
            const previousProjectTags = selectPreviousProjectTags(state);
            const deletedTags = previousProjectTags.filter(
                e => !currentTags.includes(e)
            );

            try {
                const newProjectRef = await projects.doc(projectID);

                let tagsResult = deletedTags.map(async tag => {
                    const result = await tags.doc(tag).get();
                    if (result.exists) {
                        return tags.doc(tag).update({
                            projectUids: firebase.firestore.FieldValue.arrayRemove(
                                newProjectRef.id
                            )
                        });
                    }
                });
                await Promise.all(tagsResult);

                tagsResult = deletedTags.map(async tag => {
                    const result = await tags.doc(tag).get();
                    const obj = result.data() || {
                        projectUids: []
                    };

                    if (obj.projectUids.length === 0) {
                        await tags.doc(tag).delete();
                    }
                });
                await Promise.all(tagsResult);

                tagsResult = currentTags.map(async tag => {
                    const result = await tags.doc(tag).get();
                    if (result.exists) {
                        return tags.doc(tag).update({
                            projectUids: firebase.firestore.FieldValue.arrayUnion(
                                newProjectRef.id
                            )
                        });
                    } else {
                        return tags.doc(tag).set({
                            projectUids: firebase.firestore.FieldValue.arrayUnion(
                                newProjectRef.id
                            )
                        });
                    }
                });
                await newProjectRef.update(newProject);
                dispatch(addUserProjectAction());
                dispatch(openSnackbar("Project Edited", SnackbarType.Success));
            } catch (e) {
                console.log(e);

                dispatch(
                    openSnackbar("Could not edit Project", SnackbarType.Error)
                );
            }
        }
    });
};

const deleteUserProjectAction = (): ProfileActionTypes => {
    return {
        type: DELETE_USER_PROJECT
    };
};

export const deleteUserProject = (
    doc: any
): ThunkAction<void, any, null, Action<string>> => dispatch => {
    firebase.auth().onAuthStateChanged(async user => {
        if (user != null) {
            const files = await projects
                .doc(doc.projectUid)
                .collection("files")
                .get();

            const batch = db.batch();
            const docRef = projects.doc(doc.projectUid);
            batch.delete(docRef);
            files.forEach(d => batch.delete(d.ref));

            try {
                await batch.commit();
                dispatch(deleteUserProjectAction());
                dispatch(openSnackbar("Project Deleted", SnackbarType.Success));
            } catch (e) {
                dispatch(
                    openSnackbar("Could Not Delete Project", SnackbarType.Error)
                );
            }
        }
    });
};

export const getUserImageURLAction = (url: string): ProfileActionTypes => {
    return {
        type: GET_USER_IMAGE_URL,
        payload: url
    };
};

export const setCurrentTagText = (text: string): ProfileActionTypes => {
    return {
        type: SET_CURRENT_TAG_TEXT,
        payload: text
    };
};

export const setTagsInput = (tags: any[]): ProfileActionTypes => {
    return {
        type: SET_TAGS_INPUT,
        payload: tags
    };
};

export const setCsoundStatus = (
    status: string
): ThunkAction<void, any, null, Action<string>> => (dispatch, getStore) => {
    const state = getStore();
    const csoundStatus = selectCsoundStatus(state);

    if (status !== csoundStatus) {
        dispatch({
            type: SET_CSOUND_STATUS,
            payload: status
        });
    }
};

export const getTags = (): ThunkAction<void, any, null, Action<string>> => (
    dispatch,
    getStore
) => {
    firebase.auth().onAuthStateChanged(async user => {
        if (user != null) {
            tags.onSnapshot(snapshot => {
                const result = snapshot.docs.map(doc => doc.id);
                dispatch({ type: GET_TAGS, payload: result });
            });
        }
    });
};

export const getUserImageURL = (
    username: string
): ThunkAction<void, any, null, Action<string>> => (dispatch, getStore) => {
    firebase.auth().onAuthStateChanged(async user => {
        if (user !== null) {
            let imageUrl: string;
            let profileUid: string;
            if (username === null) {
                profileUid = user.uid;
            } else {
                const result = await usernames.doc(username).get();
                const data = result.data() || null;

                profileUid = data!.userUid;
            }

            try {
                imageUrl = await firebase
                    .storage()
                    .ref()
                    .child(`images/${profileUid}/profile.jpeg`)
                    .getDownloadURL();

                dispatch(getUserImageURLAction(imageUrl));
                return;
            } catch (e) {
                console.log("no profile pic");
            }

            // try {
            //     const md5Email = crypto
            //         .createHash("md5")
            //         .update("phasereset@gmail.com")
            //         .digest("hex");
            //     imageUrl = `https://www.gravatar.com/avatar/${md5Email}`;
            //     const response = await fetch(`${imageUrl}?d=404`);

            //     dispatch(getUserImageURLAction(imageUrl));
            //     return;
            // } catch (e) {
            //     console.log("no gravatar");
            // }
        }
    });
};

export const addProject = () => {
    return async (dispatch: any) => {
        dispatch(
            openSimpleModal(() => (
                <ProjectModal
                    name={"New Project"}
                    description={""}
                    projectAction={addUserProject}
                    label={"Create"}
                    projectID=""
                />
            ))
        );
    };
};

export const editProject = (project: any) => {
    return async (dispatch: any) => {
        dispatch({ type: SET_TAGS_INPUT, payload: project.tags || [] });
        dispatch({
            type: SET_PREVIOUS_PROJECT_TAGS,
            payload: project.tags || []
        });
        dispatch(
            openSimpleModal(() => (
                <ProjectModal
                    name={project.name}
                    description={project.description}
                    projectAction={editUserProject}
                    label={"Edit"}
                    projectID={project.projectUid}
                />
            ))
        );
    };
};

export const deleteProject = (doc: any) => {
    return async (dispatch: any) => {
        const DeleteProjectModal = getDeleteProjectModal(doc);
        dispatch(openSimpleModal(DeleteProjectModal));
    };
};

export const uploadImage = (
    file: File
): ThunkAction<void, any, null, Action<string>> => dispatch => {
    firebase.auth().onAuthStateChanged(async user => {
        if (user != null) {
            try {
                await firebase
                    .storage()
                    .ref()
                    .child(`images/${user.uid}/profile.jpeg`)
                    .put(file);
                const imageUrl = await firebase
                    .storage()
                    .ref()
                    .child(`images/${user.uid}/profile.jpeg`)
                    .getDownloadURL();

                dispatch(getUserImageURLAction(imageUrl));
                dispatch(
                    openSnackbar(
                        "Profile Picture Uploaded",
                        SnackbarType.Success
                    )
                );
            } catch (e) {
                dispatch(
                    openSnackbar(
                        "Profile Picture Upload Failed",
                        SnackbarType.Error
                    )
                );
            }
        }
    });
};

export const playListItem = (
    projectUid: string | false
): ThunkAction<void, any, null, Action<string>> => (dispatch, getState) => {
    const state = getState();

    const csoundStatus = selectCsoundStatus(state);

    if (projectUid === false) {
        console.log("playListItem: projectUid is false");
        return;
    }

    if (csoundStatus === "paused") {
        dispatch(playPauseCsound());
        dispatch({ type: SET_LIST_PLAY_STATE, payload: "playing" });
    } else {
        dispatch({
            type: SET_CSOUND_STATUS,
            payload: false
        });
        dispatch({
            type: SET_CURRENTLY_PLAYING_PROJECT,
            payload: projectUid
        });
        dispatch(
            syncProjectDocumentsWithEMFS(projectUid, () => {
                dispatch({ type: SET_LIST_PLAY_STATE, payload: "playing" });

                dispatch(runCsound());
            })
        );
    }
};

export const pauseListItem = (
    projectUid: string | false
): ThunkAction<void, any, null, Action<string>> => (dispatch, getState) => {
    dispatch({ type: SET_LIST_PLAY_STATE, payload: "paused" });

    dispatch(playPauseCsound());
};
