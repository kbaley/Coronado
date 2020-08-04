import initialState from './initialState';
import * as actions from "../constants/selectAccountActionTypes";

export const selectedAccountReducer = (state = initialState.selectedAccount, action) => {

  if (action.type === actions.SELECT_ACCOUNT) {
    return action.accountId;
  }

  return state;

};
