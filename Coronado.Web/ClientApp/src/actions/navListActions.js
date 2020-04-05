import * as types from '../constants/navListActionTypes';

export function toggleAllAccountsSuccess(newValue) {
  return { type: types.TOGGLE_ALL_ACCOUNTS, newValue };
}

export const toggleAllAccounts = () => {
  return async function(dispatch, getState) {
    var showAllAccounts = getState().showAllAccounts;
    dispatch(toggleAllAccountsSuccess(!showAllAccounts));
  };
}