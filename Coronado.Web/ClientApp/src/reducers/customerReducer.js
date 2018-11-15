import initialState from './initialState';
import * as actions from "../constants/customerActionTypes";
import { cloneDeep, find } from 'lodash';

export const customerReducer = (state = initialState.customers, action, deletedCustomers) => {
  switch (action.type) {
    case actions.LOAD_CUSTOMERS_SUCCESS:
      return action.customers;
      
    case actions.DELETE_CUSTOMER:
      return cloneDeep(state.filter(c => c.customerId !== action.customerId));
      
    case actions.UNDO_DELETE_CUSTOMER:
      const deletedCustomer = find(deletedCustomers, c => c.customerId === action.customerId);
      
      return [
        ...state,
        Object.assign({}, deletedCustomer)
      ];
      
    case actions.CREATE_CUSTOMER_SUCCESS:
      return [
        ...state,
        Object.assign({}, action.customer),
      ];
      
    case actions.UPDATE_CUSTOMER_SUCCESS:
      return [
        ...state.filter(c => c.customerId !== action.customer.customerId),
        Object.assign({}, action.customer)
      ];
      
    default:
      return state;
  }
};
