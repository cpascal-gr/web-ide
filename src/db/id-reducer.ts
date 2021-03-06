import {
    SIGNIN_SUCCESS,
    LOG_OUT,
    UPDATE_USER_PROFILE
} from "../components/login/types";
import { mergeAll } from "ramda";
import { IUserProfile } from "./types";

const IdReducer = (state = {}, action: any): IUserProfile => {
    switch (action.type) {
        case SIGNIN_SUCCESS: {
            return {
                name: action.user.displayName,
                email: action.user.email,
                photoUrl: action.user.photoURL
            };
        }
        case UPDATE_USER_PROFILE: {
            return mergeAll([state, action.profile]);
        }
        case LOG_OUT: {
            return {} as IUserProfile;
        }
        default: {
            return state as IUserProfile;
        }
    }
};

export default IdReducer;
