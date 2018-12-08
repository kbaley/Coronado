import * as accountTypes from '../constants/accountActionTypes';
import * as categoryTypes from '../constants/categoryActionTypes';
import * as customerTypes from '../constants/customerActionTypes';
import * as invoiceTypes from '../constants/invoiceActionTypes';
import initialState from './initialState';

export const ajaxStatusReducer = (state = initialState.loading, action) => {
  switch (action.type) {
    case invoiceTypes.LOAD_INVOICES:
      return {
        ...state,
        invoices: true
      }
    case invoiceTypes.LOAD_INVOICES_SUCCESS:

      return {
        ...state,
        invoices: false
      }
    case accountTypes.LOAD_ACCOUNTS:
      return {
        ...state,
        accounts: false
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
      };
    case categoryTypes.LOAD_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: false
      };
    case customerTypes.LOAD_CUSTOMERS:
      return {
        ...state,
        customers: true
      };
    case customerTypes.LOAD_CUSTOMERS_SUCCESS:
      return {
        ...state,
        customers: false
      };

    default:
      return state;
  }
}
