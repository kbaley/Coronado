import * as types from '../constants/accountTypeActionTypes';
import AccountTypeApi from '../api/accountTypeApi';

export function loadAccountTypesSuccess(accountTypes) {
  return { type: types.LOAD_ACCOUNT_TYPES_SUCCESS, accountTypes };
}

export const loadAccountTypes = () => {
  return async function(dispatch, getState) {
    if (getState().accountTypes.length > 0) return null;
    const accountTypes = await AccountTypeApi.getAccountTypes();
    dispatch(loadAccountTypesSuccess(accountTypes));
  };
}