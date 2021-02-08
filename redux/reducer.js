import { SET_USER, REMOVE_USER, SET_TIMELINE_DATA, SET_USERS, SET_ACCESS_DATA } from './constants';

const initialState = {
    email: "",
    userId: "",
    userType: "",
    timelineData: [],
    users: [],
    accessData: false
}
export const userReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_USER:
            return {
                ...state, 
                email: action.payload.email,
                userId: action.payload.userId,
                userType: action.payload.userType
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
        case SET_USERS: {
            return {
                ...state,
                users: action.payload
            }
        }
        case SET_ACCESS_DATA: {
            return {
                ...state,
                accessData: action.payload
            }
        }
        default:
            return state;
    }
};
