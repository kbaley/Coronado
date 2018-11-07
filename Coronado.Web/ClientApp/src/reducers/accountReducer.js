import initialState from './initialState';
import { sumBy } from 'lodash'; 
import * as actions from "../constants/accountActionTypes.js";

function computeBalance(transactions, newTransactions) {
  var total = sumBy(transactions, (t) => { return (t.credit - t.debit); });
  if (newTransactions) total += sumBy(newTransactions, t => { return (t.credit - t.debit); });
  return total;
}

export const accountReducer = (state = initialState.accountState, action) => {

  switch (action.type) {
    
    case actions.LOAD_TRANSACTIONS:

      return {
        ...state,
        isAccountLoading: true
      };

    case actions.SELECT_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.accountId
      };

    case actions.LOAD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isAccountLoading: false
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

    case actions.CREATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        accounts: state.accounts.map(a => {
          return {
            ...a,
            currentBalance: a.currentBalance + sumBy(action.newTransaction, t => t.accountId === a.accountId ? t.amount : 0)
          }
        })
      }

    case actions.DELETE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter(el => el.accountId !== action.accountId),
        deletedAccounts: state.deletedAccounts.concat(state.accounts.filter(el => el.accountId === action.accountId))
      }

    case actions.UNDO_DELETE_ACCOUNT:
      var undeletedAccount = state.deletedAccounts.filter(a => a.accountId === action.accountId);
      return {
        ...state,
        accounts: state.accounts.concat(undeletedAccount),
        deletedAccounts: state.deletedAccounts.filter(el => el.accountId !== action.accountId)
      }

    case actions.LOAD_ACCOUNT_TYPES_SUCCESS:
      return {
        ...state,
        accountTypes: action.accountTypes
      }
    default:
      return state;
  }
};
