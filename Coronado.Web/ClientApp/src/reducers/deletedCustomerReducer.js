import initialState from './initialState';
import * as actions from "../constants/customerActionTypes.js";
import { cloneDeep, find } from 'lodash';

export const deletedCustomerReducer = (state = initialState.deletedCustomers, action, customers) => {
  switch (action.type) {
    case actions.DELETE_CUSTOMER:
      return [
        ...state,
        Object.assign({}, find(customers, c => c.customerId === action.customerId))
      ];
    case actions.UNDO_DELETE_CUSTOMER:
      return [
        cloneDeep(state.filter(el => el.customerId !== action.customerId))
      ];
    default:
      return state;
  }
};
