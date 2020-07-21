import * as types from '../constants/accountActionTypes';
import * as transactionTypes from '../constants/transactionActionTypes';
import { info } from 'react-notification-system-redux';
import AccountApi from '../api/accountApi';
import history from "../history";
import handleApiCall, { handleResponse } from './responseHandler';

export function loadAccountsSuccess(accounts) {
  return { type: types.LOAD_ACCOUNTS_SUCCESS, accounts };
}

export function removeDeletedAccount(accountId) {
  return { type: types.REMOVE_DELETED_ACCOUNT, accountId };
}

export function updateAccountSuccess(updatedAccount) {
  return { type: types.UPDATE_ACCOUNT_SUCCESS, updatedAccount };
}

function createAccountSuccess(newAccount) {
  return { type: types.CREATE_ACCOUNT_SUCCESS, newAccount };
}

function uploadQifSuccess(transactions) {
  return { type: transactionTypes.UPLOAD_QIF_SUCCESS, transactions }
}

function loadAccountsAction() {
  return { type: types.LOAD_ACCOUNTS }
}

export const loadAccounts = () => {
  return async function (dispatch) {
    if (!localStorage.getItem('coronado-user')) return;
    dispatch(loadAccountsAction());
    await handleApiCall(dispatch, async () => await AccountApi.getAllAccounts(), loadAccountsSuccess);
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
        callback: () => { dispatch({ type: types.UNDO_DELETE_ACCOUNT, accountId }) }
      }
    };
    dispatch({ type: types.DELETE_ACCOUNT, accountId });
    dispatch(info(notificationOpts));

    var accounts = getState().accounts;
    if (accounts.length === 0) {
      history.push('/');
    } else {
      history.push('/account/' + getState().accounts[0].accountId);
    }
  }
}

export const updateAccount = (account) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async() => await AccountApi.updateAccount(account), updateAccountSuccess);
  }
}

export const createAccount = (account) => {
  return async (dispatch) => {
    const response = await AccountApi.createAccount(account);
    await handleResponse(dispatch, response,
      async () => {
        const newAccount = await response.json();
        dispatch(createAccountSuccess(newAccount));
        history.push('/account/' + newAccount.accountId);
      })
  }
}

export const uploadQif = (accountId, file, fromDate) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async () => await AccountApi.uploadQif(accountId, file, fromDate), uploadQifSuccess);
  }
}

async function deleteAccountForReal(accountId, dispatch, deletedAccounts) {
  if (deletedAccounts.some(a => a.accountId === accountId)) {
    await handleApiCall(dispatch, async () => await AccountApi.deleteAccount(accountId), removeDeletedAccount);
  }
}
