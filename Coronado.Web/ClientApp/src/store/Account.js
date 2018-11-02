import { info } from 'react-notification-system-redux';
import { push } from 'react-router-redux';
import * as actions from "../constants/accountActionTypes.js";

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
    dispatch({type: actions.REMOVE_DELETED_ACCOUNT, accountId});
  }
}

///////////////////////
//      Actions      //
///////////////////////
export const actionCreators = {

  requestTransactions: (accountId) => async (dispatch) => {
    dispatch({ type: actions.REQUEST_TRANSACTIONS });
    dispatch({ type: actions.SELECT_ACCOUNT, accountId} );
    const response = await fetch('api/Transactions/?accountId=' + accountId);
    const transactions = await response.json();

    dispatch({ type: actions.RECEIVE_TRANSACTIONS, transactions, accountId });
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
    dispatch( { type: actions.DELETE_TRANSACTION, transactionId } );
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
    dispatch({ type: actions.UPDATE_TRANSACTION, updatedTransaction });
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

    dispatch({ type: actions.RECEIVE_NEW_TRANSACTION, newTransaction });
  },

  requestAccountList: () => async (dispatch, getState) => {
    dispatch({ type: actions.REQUEST_ACCOUNT_LIST });
    const url = "api/Accounts";
    const response = await fetch(url);
    const accounts = await response.json();

    dispatch({ type: actions.RECEIVE_ACCOUNT_LIST, accounts });
  },

  deleteAccount: (accountId, accountName) => async (dispatch, getState) => {

    const notificationOpts = {
      message: 'Account ' + accountName + ' deleted',
      position: 'bl',
      autoDismiss: 10,
      onRemove: () => { deleteAccountForReal(accountId, dispatch, getState().account.deletedAccounts) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: actions.UNDO_DELETE_ACCOUNT, accountId })}
      }
    };
    dispatch( { type: actions.DELETE_ACCOUNT, accountId } );
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

    dispatch({type: actions.UPDATE_ACCOUNT, updatedAccount});
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

    dispatch({ type: actions.RECEIVE_NEW_ACCOUNT, newAccount });
    dispatch(push('/account/' + newAccount.accountId));
  },

  requestAccountTypes: () => async (dispatch, getState) => {
    if (getState().account.accountTypes.length > 0) return null;

    const response = await fetch('api/AccountTypes');
    const accountTypes = await response.json();

    dispatch({ type: actions.RECEIVE_ACCOUNT_TYPES, accountTypes });
  }
};

