import initialState from './initialState';
import * as actions from "../constants/accountTypeActionTypes";

export const accountTypeReducer = (state = initialState.accountTypes, action) => {

  switch (action.type) {
    case actions.LOAD_ACCOUNT_TYPES_SUCCESS:
      return action.accountTypes
    default:
      return state;
  }
};
