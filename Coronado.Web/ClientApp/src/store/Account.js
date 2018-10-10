import { filter, orderBy, concat, forEachRight } from 'lodash'; 
const deleteTransactionType = 'DELETE_TRANSACTION';
const setTransactionListType = 'SET_TRANSACTION';
const receiveNewTransactionType = 'RECEIVE_TRANSACTION';
const requestAccountDataType = 'REQUEST_ACCOUNT_DATA';
const receiveAccountDataType = 'RECEIVE_ACCOUNT_DATA';
const initialState = { isLoading: true};

function computeRunningTotal(transactions) {
  var total = 0;
  console.log(transactions);
  var sorted = orderBy(transactions, ['transactionDate'], ['desc']);
  forEachRight(sorted, (value) => {
    total += value.amount;
    value.runningTotal = total; 
  });
  return sorted;
}

export const actionCreators = {
  requestAccountData: (accountId) => async (dispatch, getState) => {
    dispatch({ type: requestAccountDataType });
    const response = await fetch('api/Accounts/' + accountId);
    const account = await response.json();

    dispatch({ type: receiveAccountDataType, account });
  },
  setTransactionList: (transactions) => async (dispatch, getState) => {
    dispatch( {type: setTransactionListType, transactions});
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
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestAccountDataType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveAccountDataType) {
    return {
      ...state,
      account: action.account,
      isLoading: false
    };
  }

  if (action.type === setTransactionListType) {
    return {
      ...state,
      transactionList: action.transactions
    }
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
      transactionList: computeRunningTotal(concat(state.transactionList, action.newTransaction))
    }
  }

  return state;
};
