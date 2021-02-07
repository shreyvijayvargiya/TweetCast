import { SET_USER, REMOVE_USER, SET_TIMELINE_DATA } from './constants';

const initialState = {
    email: "",
    userId: "",
    timelineData: []
}
export const userReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_USER:
            return {
                ...state, 
                email: action.payload.email,
                userId: action.payload.userId
            }
        case REMOVE_USER: {
            return {
                ...state, email: "", userId: ""
            }
        }
        case SET_TIMELINE_DATA: {
            return {
                ...state, timelineData: action.payload
            }
        }
        default:
            return state;
    }
};
