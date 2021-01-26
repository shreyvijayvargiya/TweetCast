import { SET_USER, REMOVE_USER } from './constants';

const initialState = {
    email: "",
    userId: ""
}
export const userReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_USER:
            console.log(action.payload, 'in reducer');
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
        default:
            return state;
    }
};
