import * as types from '../constants/accountActionTypes';
import initialState from './initialState';

export const ajaxStatusReducer = (state = initialState.loading, action) => {
  if (action.type === types.LOAD_ACCOUNTS) {
    return {
      ...state,
      accounts: true
    }
  } else if (action.type === types.LOAD_ACCOUNTS_SUCCESS) {
    return {
      ...state,
      accounts: false
    };
  }

  return state;
}
