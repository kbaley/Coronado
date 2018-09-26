const requestAccountsType = 'REQUEST_ACCOUNT_LIST';
const receiveAccountsType = 'RECEIVE_ACCOUNT_LIST';
const initialState = { accounts: [], isLoading: true };

export const actionCreators = {
  requestAccountList: () => async (dispatch, getState) => {
    console.log("Fetching");
    dispatch({ type: requestAccountsType });
    const url = "api/Accounts";
    const response = await fetch(url);
    const accounts = await response.json();
    console.log(accounts);

    dispatch({ type: receiveAccountsType, accounts });
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  console.log("reducing: " + action.type);
  if (action.type === requestAccountsType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveAccountsType) {
    return {
      ...state,
      accounts: action.accounts,
      isLoading: false
    };
  }

  return state;
};
