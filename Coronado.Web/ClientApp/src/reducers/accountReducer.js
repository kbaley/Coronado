import initialState from './initialState';
import { sumBy, cloneDeep, find } from 'lodash'; 
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
      return {
        ...state,
        accounts: state.accounts.map(a => {
          return {
            ...a,
            currentBalance: a.currentBalance + sumBy(action.newTransaction, t => t.accountId === a.accountId ? t.amount : 0)
          }
        })
      }

    case transactionActions.UPDATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        accounts: state.accounts.map(a => {
          return {
            ...a,
            currentBalance: a.currentBalance + (action.transaction.accountId === a.accountId ? (action.transaction.amount - action.originalAmount) : 0)
          }
        })
      }
    
    case transactionActions.DELETE_TRANSACTION_SUCCESS:
      return {
        ...state,
        accounts: state.accounts.map(a => {
          return {
            ...a,
            currentBalance: a.currentBalance - (action.transaction.accountId === a.accountId ? action.transaction.amount : 0)
          }
        })
      }
      
    default:
      return state;
  }
};
