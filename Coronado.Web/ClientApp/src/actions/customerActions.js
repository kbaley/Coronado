import * as types from '../constants/customerActionTypes';
import CustomerApi from '../api/customerApi';
import { info } from 'react-notification-system-redux';
import { authHeader } from '../api/auth-header';

export function loadCustomersSuccess(customers) {
  return {type: types.LOAD_CUSTOMERS_SUCCESS, customers};
}

export function loadCustomersAction() {
  return {type: types.LOAD_CUSTOMERS};
}

export function createCustomerSuccess(customer) {
  return {type: types.CREATE_CUSTOMER_SUCCESS, customer};
}

export function updateCustomerSuccess(customer) {
  return {type: types.UPDATE_CUSTOMER_SUCCESS, customer};
}

export const loadCustomers = () => {
  return async (dispatch) => {
    dispatch(loadCustomersAction());
    const customers = await CustomerApi.getAllCustomers();
    dispatch(loadCustomersSuccess(customers));
  };
}

export const updateCustomer = (customer) => {
  return async (dispatch) => {
    const updatedCustomer = await CustomerApi.updateCustomer(customer);
    dispatch(updateCustomerSuccess(updatedCustomer));
  }
}

export const createCustomer = (customer) => {
  return async (dispatch) => {
    const newCustomer = await CustomerApi.createCustomer(customer);
    dispatch(createCustomerSuccess(newCustomer));
  }
}

export const deleteCustomer = (customerId, customerName) => {
  return async function(dispatch, getState) {
    const notificationOpts = {
      message: 'Customer ' + customerName + ' deleted',
      position: 'bl',
      onRemove: () => { deleteCustomerForReal(customerId, getState().deletedCustomers) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: types.UNDO_DELETE_CUSTOMER, customerId: customerId })}
      }
    };
    dispatch( { type: types.DELETE_CUSTOMER, customerId: customerId } );
    dispatch(info(notificationOpts));
  }
}

async function deleteCustomerForReal(customerId, deletedCustomers) {
  if (deletedCustomers.some(c => c.customerId === customerId)) {
    await fetch('/api/Customers/' + customerId, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}
