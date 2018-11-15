import * as types from '../constants/customerActionTypes';
import CustomerApi from '../api/customerApi';

export function loadCustomersSuccess(customers) {
  return {type: types.LOAD_CUSTOMERS_SUCCESS, customers};
}

export function loadCustomersAction() {
  return {type: types.LOAD_CUSTOMERS};
}

export function createCustomerSuccess(customer) {
  return {type: types.CREATE_CUSTOMER_SUCCESS, customer};
}

export const loadCustomers = () => {
  return async (dispatch) => {
    dispatch(loadCustomersAction());
    const customers = await CustomerApi.getAllCustomers();
    dispatch(loadCustomersSuccess(customers));
  };
}

export const createCustomer = (customer) => {
  return async (dispatch) => {
    const newCustomer = await CustomerApi.createCustomer(customer);
    dispatch(createCustomerSuccess(newCustomer));
  }
}
