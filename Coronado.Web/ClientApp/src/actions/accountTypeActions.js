import * as types from '../constants/accountTypeActionTypes';
import AccountTypeApi from '../api/accountTypeApi';
import handleApiCall from './responseHandler';

export function loadAccountTypesSuccess(accountTypes) {
  return { type: types.LOAD_ACCOUNT_TYPES_SUCCESS, accountTypes };
}

export const loadAccountTypes = () => {
  return async function(dispatch, getState) {
    if (getState().accountTypes.length > 0) return null;
    await handleApiCall(dispatch, async() => await AccountTypeApi.getAccountTypes(), loadAccountTypesSuccess);
  };
}