import { SET_USER } from './constants';

export const setUserInStore = (userData) => {
    return async (dispatch) => {
        dispatch({ type: SET_USER, payload: userData })
    };
};

