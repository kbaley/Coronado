const requestAccountDataType = 'REQUEST_ACCOUNT_DATA';
const receiveAccountDataType = 'RECEIVE_ACCOUNT_DATA';
const initialState = { transactions: [], isLoading: true};

export const actionCreators = {
  requestAccountData: (accountId) => async (dispatch, getState) => {
    dispatch({ type: requestAccountDataType });
    const transactionResponse = await fetch('api/Transactions/?accountId=' + accountId)
    const transactions = await transactionResponse.json();
    const accountResponse = await fetch('api/Accounts/' + accountId);
    const account = await accountResponse.json();

    dispatch({ type: receiveAccountDataType, transactions, account });
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
      transactions: action.transactions,
      account: action.account,
      isLoading: false
    };
  }

  return state;
};
