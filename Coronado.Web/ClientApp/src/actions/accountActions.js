import * as types from '../constants/accountActionTypes';
import { info } from 'react-notification-system-redux';
import { push } from 'react-router-redux';

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

export const requestTransactions = (accountId) => {
  return async (dispatch) => {
    dispatch({ type: types.REQUEST_TRANSACTIONS });
    dispatch({ type: types.SELECT_ACCOUNT, accountId} );
    const response = await fetch('api/Transactions/?accountId=' + accountId);
    const transactions = await response.json();

    dispatch({ type: types.RECEIVE_TRANSACTIONS, transactions, accountId });
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
    await response.json();
    dispatch( { type: types.DELETE_TRANSACTION, transactionId } );
  }
}

export const updateTransaction = (transaction) => {
  return async (dispatch) => {

    const response = await fetch('/api/Transactions/' + transaction.transactionId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    const updatedTransaction = await response.json();
    dispatch({ type: types.UPDATE_TRANSACTION, updatedTransaction });
  }
}

export const saveTransaction = (transaction, transactionType) => {
  return async (dispatch) => {

    var url = "/api/Transactions";
    if (transactionType === "Transfer") url = "/api/Transfers"
    if (transactionType === "Mortgage") url = "/api/Mortgages"
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    const newTransaction = await response.json();

    dispatch({ type: types.RECEIVE_NEW_TRANSACTION, newTransaction });
  }
}

export const deleteAccount = (accountId, accountName) => { 
  return async (dispatch, getState) => {

    const notificationOpts = {
      message: 'Account ' + accountName + ' deleted',
      position: 'bl',
      autoDismiss: 10,
      onRemove: () => { deleteAccountForReal(accountId, dispatch, getState().accountState.deletedAccounts) },
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
    const response = await fetch('api/Accounts/' + account.accountId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    });
    const updatedAccount = await response.json();

    dispatch({type: types.UPDATE_ACCOUNT, updatedAccount});
  }
}

export const saveNewAccount = (account) => {
  return async (dispatch) => {
    const newIdResponse = await fetch('api/Accounts/newId');
    const newId = await newIdResponse.json();
    account.accountId = newId;
    const response = await fetch('/api/Accounts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    });
    const newAccount = await response.json();

    dispatch({ type: types.RECEIVE_NEW_ACCOUNT, newAccount });
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
