import { SET_USER, REMOVE_USER, SET_TIMELINE_DATA, SET_USERS, SET_ACCESS_DATA, SET_USER_PROFILE } from './constants';

export const setUserInStore = (userData) => {
    return async dispatch => {
        dispatch({ type: SET_USER, payload: userData });
    };
};
export const removeUserFromStore = () => {
    return async dispatch => {
        dispatch({ type: REMOVE_USER, payload: null })
    };
};

export const setTimelineInRedux = ( timelineData ) => {
    return async dispatch => {
        dispatch({ type: SET_TIMELINE_DATA, payload: timelineData })
    };
};


export const setUsersInStore = (users) => {
    return async dispatch => {
        dispatch({ type: SET_USERS, payload: users })
    }
};
export const setAccessDataStore = (accessData) => {
    return async dispatch => {
        dispatch({ type: SET_ACCESS_DATA, payload: accessData })
    }
};
export const setSearchUserProfileInStore = (userProfile) => {
    return async dispatch => {
        dispatch({ type: SET_USER_PROFILE, payload: userProfile });
    };
};


