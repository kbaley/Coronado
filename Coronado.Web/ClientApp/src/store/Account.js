import { push } from 'react-router-redux';
import { filter, orderBy, concat, forEachRight, sumBy } from 'lodash'; 
const requestAccountsType = 'REQUEST_ACCOUNT_LIST';
const selectAccountType = 'SELECT_ACCOUNT';
const receiveAccountsType = 'RECEIVE_ACCOUNT_LIST';
const receiveNewAccountType = 'RECEIVE_NEW_ACCOUNT';
const deleteAccountType = 'DELETE_ACCOUNT';
const deleteTransactionType = 'DELETE_TRANSACTION';
const receiveNewTransactionType = 'RECEIVE_NEW_TRANSACTION';
const requestAccountDataType = 'REQUEST_ACCOUNT_DATA';
const receiveAccountDataType = 'RECEIVE_ACCOUNT_DATA';
const initialState = { isAccountLoading: true, isNavListLoading: true};

function computeRunningTotal(transactions) {
  var total = 0;
  var sorted = orderBy(transactions, ['date'], ['desc']);
  forEachRight(sorted, (value) => {
    total += value.amount;
    value.runningTotal = total; 
  });
  return sorted;
}

function computeBalance(transactions, newTransaction) {
  var total = sumBy(transactions, (t) => { return t.amount; });
  if (newTransaction) total += newTransaction.amount;
  return total;
}

export const actionCreators = {

  requestAccountData: (accountId) => async (dispatch, getState) => {
    dispatch({ type: requestAccountDataType });
    dispatch({ type: selectAccountType, accountId} );
    const response = await fetch('api/Transactions/?accountId=' + accountId);
    const transactions = await response.json();

    dispatch({ type: receiveAccountDataType, transactions, accountId });
  },

  deleteTransaction: (transactionId) => async (dispatch, getState) => {
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

  saveTransaction: (transaction) => async (dispatch) => {

    const response = await fetch('/api/SimpleTransactions', {
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

  deleteAccount: (accountId) => async (dispatch, getState) => {

    const response = await fetch('/api/Accounts/' + accountId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const deletedAccount = await response.json();
    dispatch( { type: deleteAccountType, deletedAccount } );
    dispatch(push('/account/' + getState().account.accounts[0].accountId));
  },

  saveNewAccount: (account) => async (dispatch, getState) => {
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
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestAccountDataType) {
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

  if (action.type === receiveAccountDataType) {
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
      transactionList: computeRunningTotal(filter(state.transactionList, (n) => { return n.transactionId !== action.transactionId }))
    }
  }

  if (action.type === receiveNewTransactionType) {
    return {
      ...state,
      accounts: state.accounts.map( (a) => a.accountId === state.selectedAccount
        ? { ...a, 
          transactions: computeRunningTotal(concat(a.transactions, action.newTransaction)),
          currentBalance: computeBalance(a.transactions, action.newTransaction) }
        : a)
    };
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

  if (action.type === deleteAccountType) {
    return {
      ...state,
      accounts: state.accounts.filter(el => el.accountId !== action.deletedAccount.accountId )
    }
  }

  return state;
};
