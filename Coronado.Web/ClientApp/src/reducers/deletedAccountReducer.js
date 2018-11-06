import initialState from './initialState';
import * as actions from "../constants/accountActionTypes.js";
import { cloneDeep, find } from 'lodash';

export const deletedAccountReducer = (state = initialState.deletedAccounts, action, accounts) => {
  switch (action.type) {
    case actions.DELETE_ACCOUNT:
      return [
        ...state,
        Object.assign({}, find(accounts, c => c.accountId === action.accountId))
      ];
    case actions.UNDO_DELETE_ACCOUNT:
      return [
        cloneDeep(state.filter(el => el.accountId !== action.accountId))
      ];
    default:
      return state;
  }
};
