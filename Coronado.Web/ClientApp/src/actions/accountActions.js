import * as types from '../constants/accountActionTypes';
import { info } from 'react-notification-system-redux';
import { push } from 'react-router-redux';
import AccountApi from '../api/accountApi';

export function loadAccountsSuccess(accounts) {
  return { type: types.LOAD_ACCOUNTS_SUCCESS, accounts };
}

export function loadTransactionsSuccess(transactions, accountId) {
  return { type: types.LOAD_TRANSACTIONS_SUCCESS, transactions, accountId };
}

export function selectAccount(accountId) {
  return { type: types.SELECT_ACCOUNT, accountId };
}

export function requestTransactions() {
  return { type: types.LOAD_TRANSACTIONS };
}

export function loadAccountTypesSuccess(accountTypes) {
  return { type: types.LOAD_ACCOUNT_TYPES_SUCCESS, accountTypes };
}

export function updateTransactionSuccess(updatedTransactionModel) {
  return { type: types.UPDATE_TRANSACTION_SUCCESS, ...updatedTransactionModel };
}

export function createTransactionSuccess(newTransaction) {
  return { type: types.CREATE_TRANSACTION_SUCCESS, newTransaction };
}

export function updateAccountSuccess(updatedAccount) {
  return { type: types.UPDATE_ACCOUNT_SUCCESS, updatedAccount };
}

function createAccountSuccess(newAccount) {
  return { type: types.CREATE_ACCOUNT_SUCCESS, newAccount };
}

export function deleteTransactionSuccess(transaction) {
  return { type: types.DELETE_TRANSACTION_SUCCESS, transaction };
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

export const loadTransactions = (accountId) => {
  return async (dispatch) => {
    dispatch(requestTransactions());
    dispatch(selectAccount(accountId) );
    const transactions = await AccountApi.getTransactions(accountId);

    dispatch(loadTransactionsSuccess(transactions, accountId));
  }
}

export const deleteTransaction = (transactionId) => {
  return async (dispatch) => {
    const response = await fetch('/api/Transactions/' + transactionId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const transaction = await response.json();
    dispatch( deleteTransactionSuccess(transaction) );
  }
}

export const updateTransaction = (transaction) => {
  return async (dispatch) => {

    const updatedTransactionModel = await AccountApi.updateTransaction(transaction);
    dispatch(updateTransactionSuccess(updatedTransactionModel));
  }
}

export const createTransaction = (transaction, transactionType) => {
  return async (dispatch) => {

    const newTransaction = await AccountApi.createTransaction(transaction, transactionType);

    dispatch(createTransactionSuccess(newTransaction));
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
