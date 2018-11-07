import * as types from '../constants/accountActionTypes';
import { info } from 'react-notification-system-redux';
import { push } from 'react-router-redux';
import AccountApi from '../api/accountApi';

export function loadAccountsSuccess(accounts) {
  return { type: types.LOAD_ACCOUNTS_SUCCESS, accounts };
}

export function loadAccountTypesSuccess(accountTypes) {
  return { type: types.LOAD_ACCOUNT_TYPES_SUCCESS, accountTypes };
}

export function updateAccountSuccess(updatedAccount) {
  return { type: types.UPDATE_ACCOUNT_SUCCESS, updatedAccount };
}

function createAccountSuccess(newAccount) {
  return { type: types.CREATE_ACCOUNT_SUCCESS, newAccount };
}

export const loadAccounts = () => {
  return async function(dispatch) {
    const accounts = await AccountApi.getAllAccounts();
    dispatch(loadAccountsSuccess(accounts));
  };
}

export const loadAccountTypes = () => {
  return async function(dispatch, getState) {
    if (getState().accountState.accountTypes.length > 0) return null;
    const accountTypes = await AccountApi.getAccountTypes();
    dispatch(loadAccountTypesSuccess(accountTypes));
  };
}

export const deleteAccount = (accountId, accountName) => { 
  return async (dispatch, getState) => {

    const notificationOpts = {
      message: 'Account ' + accountName + ' deleted',
      position: 'bl',
      autoDismiss: 10,
      onRemove: () => { deleteAccountForReal(accountId, dispatch, getState().deletedAccounts) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: types.UNDO_DELETE_ACCOUNT, accountId })}
      }
    };
    dispatch( { type: types.DELETE_ACCOUNT, accountId } );
    dispatch(info(notificationOpts));
    if (getState().accountState.accounts.length > 0)
      dispatch(push('/account/' + getState().accountState.accounts[0].accountId));
    else
      dispatch(push('/'));
  }
}

export const updateAccount = (account) => {
  return async (dispatch) => {
    const updatedAccount = await AccountApi.updateAccount(account);

    dispatch(updateAccountSuccess(updatedAccount));
  }
}

export const createAccount = (account) => {
  return async (dispatch) => {
    const newAccount = await AccountApi.createAccount(account);

    dispatch(createAccountSuccess(newAccount));
    dispatch(push('/account/' + newAccount.accountId));
  }
}

async function deleteAccountForReal(accountId, dispatch, deletedAccounts) {
  if (deletedAccounts.some(a => a.accountId === accountId)) {
    const response = await fetch('/api/Accounts/' + accountId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    await response.json();
    dispatch({type: types.REMOVE_DELETED_ACCOUNT, accountId});
  }
}
