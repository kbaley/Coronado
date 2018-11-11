import * as accountTypes from '../constants/accountActionTypes';
import * as categoryTypes from '../constants/categoryActionTypes';
import initialState from './initialState';

export const ajaxStatusReducer = (state = initialState.loading, action) => {
  switch (action.type) {
    case accountTypes.LOAD_ACCOUNTS:
      return {
        ...state,
        accounts: true
      }
    case accountTypes.LOAD_ACCOUNTS_SUCCESS:
      return {
        ...state,
        accounts: false
      };
    case categoryTypes.LOAD_CATEGORIES:
      return {
        ...state,
        categories: true
      }
    case categoryTypes.LOAD_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: false
      }
    default:
      return state;
  }
}
