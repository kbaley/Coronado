import * as types from '../constants/accountActionTypes';

export const loadAccounts = () => {
  return async function(dispatch) {
    const url = "api/Accounts";
    const response = await fetch(url);
    const accounts = await response.json();
    dispatch({ type: types.RECEIVE_ACCOUNT_LIST, accounts });
  };
}
