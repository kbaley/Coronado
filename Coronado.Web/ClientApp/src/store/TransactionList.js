const deleteTransactionType = 'DELETE_TRANSACTION';
const setTransactionListType = 'SET_TRANSACTION';

const initialState = { };

export const actionCreators = {
  setTransactionList: (transactions) => async (dispatch, getState) => {
    console.log(getState());
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

  return state;
};
