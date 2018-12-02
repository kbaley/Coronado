import initialState from './initialState';
import { cloneDeep, find, each, sortBy } from 'lodash'; 
import * as actions from "../constants/accountActionTypes.js";
import * as transactionActions from "../constants/transactionActionTypes";

export const accountReducer = (state = initialState.accounts, action, deletedAccounts) => {

  switch (action.type) {

    case actions.LOAD_ACCOUNTS_SUCCESS:
      return sortBy(action.accounts, a => a.displayOrder);

    case actions.CREATE_ACCOUNT_SUCCESS:
      return sortBy([
        ...state,
        Object.assign({}, action.newAccount),
      ], a => a.displayOrder);

    case actions.UPDATE_ACCOUNT_SUCCESS:
      return sortBy([
        ...state.filter(a => a.accountId !== action.updatedAccount.accountId),
        Object.assign({}, action.updatedAccount)
      ], a => a.displayOrder);

    case actions.DELETE_ACCOUNT:
      return cloneDeep(state.filter(a => a.accountId !== action.accountId));

    case actions.UNDO_DELETE_ACCOUNT:
      const deletedAccount = find(deletedAccounts, a => a.accountId === action.accountId);
      return sortBy([
        ...state,
        Object.assign({}, deletedAccount)
      ], a => a.displayOrder);

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