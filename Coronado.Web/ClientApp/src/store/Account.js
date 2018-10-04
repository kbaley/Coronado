const requestAccountDataType = 'REQUEST_ACCOUNT_DATA';
const receiveAccountDataType = 'RECEIVE_ACCOUNT_DATA';
const initialState = { isLoading: true};

export const actionCreators = {
  requestAccountData: (accountId) => async (dispatch, getState) => {
    dispatch({ type: requestAccountDataType });
    const response = await fetch('api/Accounts/' + accountId);
    const account = await response.json();

    dispatch({ type: receiveAccountDataType, account });
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

  return state;
};
