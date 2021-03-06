import { SIGNIN_FAIL, SIGNIN_SUCCESS, SIGNIN_REQUEST } from "./types";

const INITIAL_STATE = {
    authenticated: false,
    requesting: false,
    failed: false
};

const EditorReducer = (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case SIGNIN_REQUEST: {
            return { authenticated: false, requesting: true, failed: false };
        }
        case SIGNIN_FAIL: {
            return { authenticated: false, requesting: false, failed: true };
        }
        case SIGNIN_SUCCESS: {
            return { authenticated: true, requesting: false, failed: false };
        }
        default: {
            return state;
        }
    }
};

export default EditorReducer;
