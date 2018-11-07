import initialState from './initialState';
import { sumBy } from 'lodash'; 
import * as actions from "../constants/accountActionTypes.js";
import * as transactionActions from "../constants/transactionActionTypes";

export const accountReducer = (state = initialState.accountState, action, deletedAccounts) => {

  switch (action.type) {

    case actions.SELECT_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.accountId
      };

    case actions.LOAD_ACCOUNTS_SUCCESS:
      return {
        ...state,
        accounts: action.accounts,
      };

    case actions.CREATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        accounts: state.accounts.concat(action.newAccount)
      };

    case actions.UPDATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedAccount: action.updatedAccount.accountId,
        accounts: state.accounts.map(a => a.accountId === action.updatedAccount.accountId
          ? {
            ...a,
            name: action.updatedAccount.name,
            vendor: action.updatedAccount.vendor,
            accountType: action.updatedAccount.accountType,
            currency: action.updatedAccount.currency
          }
          : a)
      }

    case actions.DELETE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter(el => el.accountId !== action.accountId),
      }

    case actions.UNDO_DELETE_ACCOUNT:
      var undeletedAccount = deletedAccounts.filter(a => a.accountId === action.accountId);
      return {
        ...state,
        accounts: state.accounts.concat(undeletedAccount),
      }

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
