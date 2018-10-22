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
  deletedAccounts: [], 
  accountTypes: []
};

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

  saveTransaction: (transaction) => async (dispatch) => {

    const response = await fetch('/api/Transactions', {
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
      onRemove: () => { deleteAccountForReal(accountId, dispatch, getState().account.deletedAccounts) },
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

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestTransactionsType) {
    return {
      ...state,
      isAccountLoading: true
    };
  }

  if (action.type === selectAccountType) {
    return {
      ...state,
      selectedAccount: action.accountId
    }
  }

  if (action.type === receiveTransactionsType) {
    const transactions = computeRunningTotal(action.transactions);
    return {
      ...state,
      isAccountLoading: false,
      accounts: state.accounts.map( (a) => a.accountId === action.accountId 
      ? { ...a, transactions: transactions }
      : a)
    };
  }

  if (action.type === deleteTransactionType) {
    return {
      ...state,
      accounts: state.accounts.map( (a) => a.accountId === state.selectedAccount
        ? { ...a,
            transactions: 
              computeRunningTotal(filter(a.transactions, (t) => 
              { return t.transactionId !== action.transactionId })),
            currentBalance: computeBalance(filter(a.transactions, (t) => 
              { return t.transactionId !== action.transactionId}))
          }
        : a)
    }
  }

  if (action.type === receiveNewTransactionType) {
    var transactionsForCurrentAccount = filter(action.newTransaction, t => !t.account);
    var transactionsForOtherAccounts = filter(action.newTransaction, t => t.account);
    var accounts = state.accounts.map( (a) => a.accountId === state.selectedAccount
        ? { ...a, 
          transactions: computeRunningTotal(a.transactions.concat(transactionsForCurrentAccount)),
          currentBalance: computeBalance(a.transactions, transactionsForCurrentAccount) }
        : a);
    accounts = accounts.map( a => some(transactionsForOtherAccounts, t => t.account.accountId === a.accountId) 
      ? { ...a,
        transactions: computeRunningTotal(a.transactions.concat(transactionsForOtherAccounts)),
        currentBalance: a.currentBalance - sumBy(transactionsForCurrentAccount, t => (t.credit - t.debit))
       }
      : a)
    return {
      ...state,
      accounts: accounts
    };
  }

  if (action.type === updateTransactionType) {
    var account = find(state.accounts, a => a.accountId === state.selectedAccount);
    var transactions = computeRunningTotal(account.transactions.map( t => 
      t.transactionId === action.updatedTransaction.transactionId ? action.updatedTransaction : t));
    return {
      ...state,
      accounts: state.accounts.map( a => a.accountId === state.selectedAccount
        ? { ...a,
          transactions: computeRunningTotal(a.transactions.map( t => 
            t.transactionId === action.updatedTransaction.transactionId ? action.updatedTransaction : t)),
          currentBalance: computeBalance(transactions) }
        : a)
    }
  }

  if (action.type === requestAccountsType) {
    return {
      ...state,
      isNavListLoading: true
    };
  }

  if (action.type === receiveAccountsType) {
    return {
      ...state,
      accounts: action.accounts,
      isNavListLoading: false
    };
  }

  if (action.type === receiveNewAccountType) {
    return {
      ...state,
      accounts: state.accounts.concat(action.newAccount)
    };
  }

  if (action.type === receiveUpdatedAccountType) {
    return {
      ...state,
      selectedAccount: action.updatedAccount.accountId,
      accounts: state.accounts.map( a => a.accountId === action.updatedAccount.accountId
        ? {...a, 
          name: action.updatedAccount.name, 
          vendor: action.updatedAccount.vendor, 
          accountType: action.updatedAccount.accountType,
          currency: action.updatedAccount.currency }
        : a )
    }
  }

  if (action.type === deleteAccountType) {
    return {
      ...state,
      deletedAccounts: state.deletedAccounts.concat(state.accounts.filter(el => el.accountId === action.accountId)),
      accounts: state.accounts.filter(el => el.accountId !== action.accountId )
    }
  }

  if (action.type === undoDeleteAccountType) {
    return {
      ...state,
      accounts: state.accounts.concat(state.deletedAccounts.filter(el => el.accountId === action.accountId)),
      deletedAccounts: state.deletedAccounts.filter(el => el.accountId !== action.accountId)
    }
  }

  if (action.type === receiveAccountTypesType) {
    return {
      ...state,
      accountTypes: action.accountTypes
    }
  }

  return state;
};
