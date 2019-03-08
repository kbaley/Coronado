import * as types from '../constants/accountActionTypes';
import { info } from 'react-notification-system-redux';
import { push } from 'react-router-redux';
import AccountApi from '../api/accountApi';
import { sortBy } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import { authHeader } from '../api/auth-header';

export function loadAccountsSuccess(accounts) {
  return { type: types.LOAD_ACCOUNTS_SUCCESS, accounts };
}

export function updateAccountSuccess(updatedAccount) {
  return { type: types.UPDATE_ACCOUNT_SUCCESS, updatedAccount };
}

function createAccountSuccess(newAccount) {
  return { type: types.CREATE_ACCOUNT_SUCCESS, newAccount };
}

function loadAccountsAction() {
  return { type: types.LOAD_ACCOUNTS }
}

export const loadAccounts = () => {
  return async function(dispatch) {
    dispatch(loadAccountsAction());
    const accounts = await AccountApi.getAllAccounts();
    dispatch(loadAccountsSuccess(accounts));
  };
}

export const reorderAccounts = (oldIndex, newIndex) => {
  return async function(dispatch, getState) {
    let accounts = sortBy(getState().accounts, a => a.displayOrder);
    accounts = arrayMove(accounts, oldIndex, newIndex);
    let accountsToUpdate = [];
    for (let index = 0; index < accounts.length; index++) {
      if (accounts[index].displayOrder !== index) {
        accounts[index].displayOrder = index;
        accountsToUpdate.push(accounts[index]);
      }
    }
    dispatch(loadAccountsSuccess(accounts));
    for ( let i = 0; i < accountsToUpdate.length; i++ ) {
      await AccountApi.updateAccount(accountsToUpdate[i]);
    }
  }
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
    if (getState().accounts.length > 0)
      dispatch(push('/account/' + getState().accounts[0].accountId));
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

export const uploadQif = (accountId, file, fromDate) => {
  return async (dispatch) => {
    await AccountApi.uploadQif(accountId, file, fromDate);
  }
}

async function deleteAccountForReal(accountId, dispatch, deletedAccounts) {
  if (deletedAccounts.some(a => a.accountId === accountId)) {
    const response = await fetch('/api/Accounts/' + accountId, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    await response.json();
    dispatch({type: types.REMOVE_DELETED_ACCOUNT, accountId});
  }
}
