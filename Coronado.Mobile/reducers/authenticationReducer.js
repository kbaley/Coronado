import * as actions from "../constants/loginActionTypes";

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : { }

export const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOGIN:
      return {
        loggingIn: true,
        user: action.user
      }
      
    case actions.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      }      
    case actions.LOGIN_FAILURE:
      return { };
    case actions.LOGOUT:
      return { };
      
    default:
      return state;
  }
};
