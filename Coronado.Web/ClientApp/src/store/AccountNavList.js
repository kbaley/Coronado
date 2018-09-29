const requestAccountsType = 'REQUEST_ACCOUNT_LIST';
const receiveAccountsType = 'RECEIVE_ACCOUNT_LIST';
const receiveNewAccountType = 'RECEIVE_NEW_ACCOUNT';
const deleteAccountType = 'DELETE_ACCOUNT';
const initialState = { accounts: [], isLoading: true};

export const actionCreators = {
  requestAccountList: () => async (dispatch, getState) => {
    dispatch({ type: requestAccountsType });
    const url = "api/Accounts";
    const response = await fetch(url);
    const accounts = await response.json();

    dispatch({ type: receiveAccountsType, accounts });
  },

  deleteAccount: (accountId) => async (dispatch) => {

    const response = await fetch('/api/Accounts/' + accountId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const deletedAccount = await response.json();
    dispatch( { type: deleteAccountType, deletedAccount } );
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
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

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

  if (action.type === receiveNewAccountType) {
    return {
      ...state,
      accounts: state.accounts.concat(action.newAccount)
    };
  }

  if (action.type === deleteAccountType) {
    console.log(state.accounts.filter(e => e.accountId !== action.deletedAccount.accountId));
    return {
      ...state,
      accounts: state.accounts.filter(el => el.accountId !== action.deletedAccount.accountId )
    }
  }

  return state;
};
