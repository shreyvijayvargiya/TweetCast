import { SET_USER, REMOVE_USER, SET_TIMELINE_DATA } from './constants';

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


