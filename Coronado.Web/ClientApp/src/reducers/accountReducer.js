import initialState from './initialState';
import { cloneDeep, find, each } from 'lodash'; 
import * as actions from "../constants/accountActionTypes.js";
import * as transactionActions from "../constants/transactionActionTypes";

export const accountReducer = (state = initialState.accounts, action, deletedAccounts) => {

  switch (action.type) {

    case actions.LOAD_ACCOUNTS_SUCCESS:
      return action.accounts;

    case actions.CREATE_ACCOUNT_SUCCESS:
      return [
        ...state,
        Object.assign({}, action.newAccount),
      ];

    case actions.UPDATE_ACCOUNT_SUCCESS:
      return [
        ...state.filter(a => a.accountId !== action.updatedAccount.accountId),
        Object.assign({}, action.updatedAccount)
      ];

    case actions.DELETE_ACCOUNT:
      return cloneDeep(state.filter(a => a.accountId !== action.accountId));

    case actions.UNDO_DELETE_ACCOUNT:
      const deletedAccount = find(deletedAccounts, a => a.accountId === action.accountId);
      return [
        ...state,
        Object.assign({}, deletedAccount)
      ];

    case transactionActions.CREATE_TRANSACTION_SUCCESS:
    case transactionActions.UPDATE_TRANSACTION_SUCCESS:
    case transactionActions.DELETE_TRANSACTION_SUCCESS:
      return setAccountBalances(state, action.accountBalances);
      
    default:
      return state;
  }
};


function setAccountBalances(state, accountBalances) {
  let accounts = cloneDeep(state);
  each(accounts, a => {
    const accountBalance = find(accountBalances, ab => ab.accountId === a.accountId);
    a.currentBalance = accountBalance ? accountBalance.currentBalance : 0;
  });
  return accounts;
}