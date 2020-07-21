import * as types from '../constants/customerActionTypes';
import CustomerApi from '../api/customerApi';
import { info } from 'react-notification-system-redux';
import handleApiCall from './responseHandler';

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
    if (!localStorage.getItem('coronado-user')) return;
    dispatch(loadCustomersAction());
    await handleApiCall(dispatch, async() => await CustomerApi.getAllCustomers(), loadCustomersSuccess);
  };
}

export const updateCustomer = (customer) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async() => await CustomerApi.updateCustomer(customer), updateCustomerSuccess);
  }
}

export const createCustomer = (customer) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async() => await CustomerApi.createCustomer(customer), createCustomerSuccess);
  }
}

export const deleteCustomer = (customerId, customerName) => {
  return async function(dispatch, getState) {
    const notificationOpts = {
      message: 'Customer ' + customerName + ' deleted',
      position: 'bl',
      onRemove: () => { deleteCustomerForReal(customerId, getState().deletedCustomers, dispatch) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: types.UNDO_DELETE_CUSTOMER, customerId: customerId })}
      }
    };
    dispatch( { type: types.DELETE_CUSTOMER, customerId: customerId } );
    dispatch(info(notificationOpts));
  }
}

async function deleteCustomerForReal(customerId, deletedCustomers, dispatch) {
  if (deletedCustomers.some(c => c.customerId === customerId)) {
    await handleApiCall(dispatch, async () => CustomerApi.deleteCustomer(customerId));
  }
}
