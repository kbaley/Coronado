import initialState from './initialState';
import { filter, orderBy, forEachRight, sumBy, find, some } from 'lodash'; 
import * as actions from "../constants/accountActionTypes.js";

function computeRunningTotal(transactions) {
  var total = 0;
  var sorted = orderBy(transactions, ['transactionDate', 'enteredDate'], ['desc', 'desc']);
  forEachRight(sorted, (value) => {
    total += (value.credit - value.debit);
    value.runningTotal = total;
  });
  return sorted;
}

function computeBalance(transactions, newTransactions) {
  var total = sumBy(transactions, (t) => { return (t.credit - t.debit); });
  if (newTransactions) total += sumBy(newTransactions, t => { return (t.credit - t.debit); });
  return total;
}

export const accountReducer = (state = initialState.accountState, action) => {

  switch (action.type) {
    
    case actions.REQUEST_TRANSACTIONS:

      return {
        ...state,
        isAccountLoading: true
      };

    case actions.SELECT_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.accountId
      };

    case actions.RECEIVE_TRANSACTIONS:
      const transactions = computeRunningTotal(action.transactions);
      return {
        ...state,
        isAccountLoading: false,
        accounts: state.accounts.map((a) => a.accountId === action.accountId
          ? {...a, transactions: transactions}
          : a)
      };

    case actions.DELETE_TRANSACTION:
      return {
        ...state,
        accounts: state.accounts.map((a) => a.accountId === state.selectedAccount
          ? {
            ...a,
            transactions:
              computeRunningTotal(filter(a.transactions, (t) => {
                return t.transactionId !== action.transactionId
              })),
            currentBalance: computeBalance(filter(a.transactions, (t) => {
              return t.transactionId !== action.transactionId
            }))
          }
          : a)
      }

    case actions.RECEIVE_NEW_TRANSACTION:
      var transactionsForCurrentAccount = filter(action.newTransaction, t => t.accountId === state.selectedAccount);
      var transactionsForOtherAccounts = filter(action.newTransaction, t => t.accountId !== state.selectedAccount);
      var accounts = state.accounts.map((a) => a.accountId === state.selectedAccount
        ? {
          ...a,
          transactions: computeRunningTotal(a.transactions.concat(transactionsForCurrentAccount)),
          currentBalance: computeBalance(a.transactions, transactionsForCurrentAccount)
        }
        : a);
      accounts = accounts.map(a => some(transactionsForOtherAccounts, t => t.accountId === a.accountId)
        ? {
          ...a,
          currentBalance: a.currentBalance - sumBy(transactionsForCurrentAccount, t => (t.credit - t.debit))
        }
        : a)
      return {
        ...state,
        accounts: accounts
      };

    case actions.UPDATE_TRANSACTION:
      var account = Object.assign({}, find(state.accounts, a => a.accountId === state.selectedAccount));
      account.transactions = computeRunningTotal(account.transactions.map(t =>
        t.transactionId === action.updatedTransaction.transactionId ? action.updatedTransaction : t));
      account.currentBalance = computeBalance(account.transactions);
      return {
        ...state,
        accounts: state.accounts.map(a => a.accountId === state.selectedAccount ? account : a)
      }

    case actions.RECEIVE_ACCOUNT_LIST:
      return {
        ...state,
        accounts: action.accounts,
      };

    case actions.RECEIVE_NEW_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.concat(action.newAccount)
      };

    case actions.UPDATE_ACCOUNT:
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
        deletedAccounts: state.deletedAccounts.concat(state.accounts.filter(el => el.accountId === action.accountId))
      }

    case actions.UNDO_DELETE_ACCOUNT:
      var undeletedAccount = state.deletedAccounts.filter(a => a.accountId === action.accountId);
      return {
        ...state,
        accounts: state.accounts.concat(undeletedAccount),
        deletedAccounts: state.deletedAccounts.filter(el => el.accountId !== action.accountId)
      }

    case actions.RECEIVE_ACCOUNT_TYPES:
      return {
        ...state,
        accountTypes: action.accountTypes
      }
    default:
      return state;
  }
};
