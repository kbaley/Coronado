import { filter, orderBy, concat } from 'lodash'; 
import { createSelector } from 'reselect';
const deleteTransactionType = 'DELETE_TRANSACTION';
const setTransactionListType = 'SET_TRANSACTION';
const receiveNewTransactionType = 'RECEIVE_TRANSACTION';

const initialState = { };
const getTransactions = state => state.transactionList;

export const getTransactionsWithRunningTotal = createSelector(
  [getTransactions],
  (transactions) => {
    console.log(transactionId);
    return orderBy(transactions, ['transactionDate'], ['desc'])
  }
)

export const actionCreators = {
  setTransactionList: (transactions) => async (dispatch, getState) => {
    dispatch( {type: setTransactionListType, transactions});
  },
  deleteTransaction: (transactionId) => async (dispatch, getState) => {
    // const response = await fetch('/api/Transactions/' + transactionId, {
    //   method: 'DELETE',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   }
    // });
    // const transaction = await response.json();
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

  if (action.type === setTransactionListType) {
    return {
      transactionList: action.transactions
    }
  }

  if (action.type === deleteTransactionType) {
    return {
      ...state,
      transactionList: filter(state.transactions, (n) => { return n.transactionId !== action.transactionId })
    }
  }

  if (action.type === receiveNewTransactionType) {
    return {
      ...state,
      transactionList: orderBy(concat(state.transactionList, action.newTransaction), ['transactionDate'], ['desc'])
    }
  }

  return state;
};
