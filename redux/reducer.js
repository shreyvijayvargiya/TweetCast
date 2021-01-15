import { SET_USER } from './constants';

const initialState = {
    user: null
}
export const userReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_USER:
            console.log(action.paylaod, 'in reducer');
            return {
                ...state, 
                user: action.paylaod
            }
        default:
            return state;
    }
};
