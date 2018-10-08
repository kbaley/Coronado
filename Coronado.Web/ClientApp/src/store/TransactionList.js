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
    const deletedTrx = await response.json();
    dispatch( { type: deleteTransactionType, transactionId: deletedTrx.transactionId } );
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
      transactionList: state.transactionList.filter(el => el.transactionId !== action.transactionId )
    }
  }

  if (action.type === receiveNewTransactionType) {
    return {
      ...state,
      transactionList: state.transactionList.concat(action.newTransaction)
    }
  }

  return state;
};
