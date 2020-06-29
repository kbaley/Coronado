import * as types from '../constants/transactionActionTypes';
import * as selectedAccountTypes from "../constants/selectAccountActionTypes";
import TransactionApi from '../api/transactionApi';
import handleApiCall, { handleResponse } from './responseHandler';

export function loadTransactionsSuccess(model, accountId) {
  return { 
    type: types.LOAD_TRANSACTIONS_SUCCESS, 
    transactions: model.transactions, 
    startingBalance: model.startingBalance,
    page: model.page,
    remainingTransactionCount: model.remainingTransactionCount,
    accountId };
}

export function selectAccount(accountId) {
  return { type: selectedAccountTypes.SELECT_ACCOUNT, accountId };
}

export function updateTransactionSuccess(updatedTransactionModel) {
  return { type: types.UPDATE_TRANSACTION_SUCCESS, ...updatedTransactionModel };
}

export function createTransactionSuccess(newTransactionModel) {
  return { type: types.CREATE_TRANSACTION_SUCCESS, ...newTransactionModel };
}

export function deleteTransactionSuccess(deleteTransactionModel) {
  return { type: types.DELETE_TRANSACTION_SUCCESS, ...deleteTransactionModel };
}

export const loadTransactions = (accountId) => {
  return async (dispatch) => {
    dispatch(selectAccount(accountId) );
    const response = await TransactionApi.getTransactions(accountId);
    await handleResponse(dispatch, response,
      async () => dispatch(loadTransactionsSuccess(await response.json(), accountId)));
  }
}

export const loadAllTransactions = (accountId) => {
  return async (dispatch) => {
    dispatch(selectAccount(accountId) );
    const response = await TransactionApi.getAllTransactions(accountId);
    await handleResponse(dispatch, response,
      async () => dispatch(loadTransactionsSuccess(await response.json(), accountId)));
  }
}

export const deleteTransaction = (transactionId) => {
  return async (dispatch) => {
    await handleApiCall(dispatch,
      async () => await TransactionApi.deleteTransaction(transactionId),
      deleteTransactionSuccess);
  }
}

export const updateTransaction = (transaction) => {
  return async (dispatch) => {
    await handleApiCall(dispatch,
      async () => await TransactionApi.updateTransaction(transaction),
      updateTransactionSuccess);
  }
}

export const createTransaction = (transaction) => {
  return async (dispatch) => {
    await handleApiCall(dispatch,
      async () => await TransactionApi.createTransaction(transaction),
      createTransactionSuccess);
  }
}
