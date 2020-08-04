import initialState from './initialState';
import * as actions from "../constants/navListActionTypes";

export const navListReducer = (state = initialState.showAllAccounts, action) => {

  if (action.type === actions.TOGGLE_ALL_ACCOUNTS) {
    return action.newValue;
  }

  return state;

};
