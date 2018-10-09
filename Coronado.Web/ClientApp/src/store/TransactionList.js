const deleteTransactionType = 'DELETE_TRANSACTION';
const setTransactionListType = 'SET_TRANSACTION';
const receiveNewTransactionType = 'RECEIVE_TRANSACTION';

const initialState = { };

export const actionCreators = {
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
    const deleteTransactionModel = await response.json();
    dispatch( { type: deleteTransactionType, deleteTransactionModel } );
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
    const newTransactionModel = await response.json();

    dispatch({ type: receiveNewTransactionType, newTransactionModel });
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
      transactionList: action.deleteTransactionModel
    }
  }

  if (action.type === receiveNewTransactionType) {

    return {
      ...state,
      transactionList: action.newTransactionModel
    }
  }

  return state;
};
