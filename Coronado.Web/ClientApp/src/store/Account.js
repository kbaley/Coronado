import { info } from 'react-notification-system-redux';
import { push } from 'react-router-redux';
import { filter, orderBy, forEachRight, sumBy, find, some } from 'lodash'; 
const requestAccountsType = 'REQUEST_ACCOUNT_LIST';
const selectAccountType = 'SELECT_ACCOUNT';
const receiveAccountsType = 'RECEIVE_ACCOUNT_LIST';
const receiveNewAccountType = 'RECEIVE_NEW_ACCOUNT';
const receiveUpdatedAccountType = 'UPDATE_ACCOUNT';
const deleteAccountType = 'DELETE_ACCOUNT';
const deleteTransactionType = 'DELETE_TRANSACTION';
const updateTransactionType = 'UPDATE_TRANSACTION';
const receiveNewTransactionType = 'RECEIVE_NEW_TRANSACTION';
const requestTransactionsType = 'REQUEST_TRANSACTIONS';
const receiveTransactionsType = 'RECEIVE_TRANSACTIONS';
const undoDeleteAccountType = 'UNDO_DELETE_ACCOUNT';
const removeDeletedAccountType = 'REMOVE_DELETED_ACCOUNT';
const receiveAccountTypesType = 'RECEIVE_ACCOUNT_TYPES';
const initialState = { 
  isAccountLoading: true, 
  isNavListLoading: true, 
  accounts: [], 
  accountTypes: []
};

let deletedAccounts = [];

///////////////////////
// Private functions //
///////////////////////
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
    dispatch({type: removeDeletedAccountType, accountId});
  }
}

///////////////////////
//      Actions      //
///////////////////////
export const actionCreators = {

  requestTransactions: (accountId) => async (dispatch) => {
    dispatch({ type: requestTransactionsType });
    dispatch({ type: selectAccountType, accountId} );
    const response = await fetch('api/Transactions/?accountId=' + accountId);
    const transactions = await response.json();

    dispatch({ type: receiveTransactionsType, transactions, accountId });
  },

  deleteTransaction: (transactionId) => async (dispatch) => {
    const response = await fetch('/api/Transactions/' + transactionId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    await response.json();
    dispatch( { type: deleteTransactionType, transactionId } );
  },

  updateTransaction: (transaction) => async (dispatch) => {

    const response = await fetch('/api/Transactions/' + transaction.transactionId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    const updatedTransaction = await response.json();
    dispatch({ type: updateTransactionType, updatedTransaction });
  },

  saveTransaction: (transaction, transactionType) => async (dispatch) => {

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

    dispatch({ type: receiveNewTransactionType, newTransaction });
  },

  requestAccountList: () => async (dispatch, getState) => {
    dispatch({ type: requestAccountsType });
    const url = "api/Accounts";
    const response = await fetch(url);
    const accounts = await response.json();

    dispatch({ type: receiveAccountsType, accounts });
  },

  deleteAccount: (accountId, accountName) => async (dispatch, getState) => {

    const notificationOpts = {
      message: 'Account ' + accountName + ' deleted',
      position: 'bl',
      autoDismiss: 10,
      onRemove: () => { deleteAccountForReal(accountId, dispatch, deletedAccounts) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: undoDeleteAccountType, accountId })}
      }
    };
    dispatch( { type: deleteAccountType, accountId } );
    dispatch(info(notificationOpts));
    if (getState().account.accounts.length > 0)
      dispatch(push('/account/' + getState().account.accounts[0].accountId));
    else
      dispatch(push('/'));
  },

  updateAccount: (account) => async (dispatch) => {
    const response = await fetch('api/Accounts/' + account.accountId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    });
    const updatedAccount = await response.json();

    dispatch({type: receiveUpdatedAccountType, updatedAccount});
  },

  saveNewAccount: (account) => async (dispatch) => {
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

    dispatch({ type: receiveNewAccountType, newAccount });
    dispatch(push('/account/' + newAccount.accountId));
  },

  requestAccountTypes: () => async (dispatch, getState) => {
    if (getState().account.accountTypes.length > 0) return null;

    const response = await fetch('api/AccountTypes');
    const accountTypes = await response.json();

    dispatch({ type: receiveAccountTypesType, accountTypes });
  }
};

