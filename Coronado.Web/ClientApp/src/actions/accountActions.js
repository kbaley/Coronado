import * as types from '../constants/accountActionTypes';

export const loadAccounts = () => {
  return async function(dispatch) {
    const url = "api/Accounts";
    const response = await fetch(url);
    const accounts = await response.json();
    dispatch({ type: types.RECEIVE_ACCOUNT_LIST, accounts });
  };
}

export const loadAccountTypes = () => {
  return async function(dispatch, getState) {
    if (getState().accountState.accountTypes.length > 0) return null;
    const url = "api/AccountTypes";
    const response = await fetch(url);
    const accountTypes = await response.json();
    dispatch({ type: types.RECEIVE_ACCOUNT_TYPES, accountTypes });
  };
}