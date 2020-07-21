import * as types from '../constants/invoiceActionTypes';
import InvoiceApi from '../api/invoiceApi';
import { info } from 'react-notification-system-redux';
import handleApiCall, { handleResponse } from './responseHandler';

export function loadInvoicesSuccess(invoices) {
  return { type: types.LOAD_INVOICES_SUCCESS, invoices };
}

export function loadInvoicesAction() {
  return { type: types.LOAD_INVOICES };
}

export function createInvoiceSuccess(invoice) {
  return { type: types.CREATE_INVOICE_SUCCESS, invoice };
}

export function updateInvoiceSuccess(invoice) {
  return { type: types.UPDATE_INVOICE_SUCCESS, invoice };
}

export function loadInvoiceSuccess(invoice) {
  return { type: types.LOAD_INVOICE_SUCCESS, invoice };
}

export function emailInvoiceSuccess(invoice) {
  return { type: types.EMAIL_INVOICE_SUCCESS, invoice };
}

export const loadInvoices = () => {
  return async (dispatch) => {
    if (!localStorage.getItem('coronado-user')) return;
    dispatch(loadInvoicesAction());
    await handleApiCall(dispatch, async () => await InvoiceApi.getAllInvoices(), loadInvoicesSuccess);
  };
}

export const updateInvoice = (invoice) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async () => await InvoiceApi.updateInvoice(invoice), updateInvoiceSuccess);
  }
}

export const createInvoice = (invoice) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async () => await InvoiceApi.createInvoice(invoice), createInvoiceSuccess);
  }
}

export const emailInvoice = (invoiceId) => {
  return async (dispatch) => {
    const response = await InvoiceApi.emailInvoice(invoiceId);
    await handleResponse(dispatch, response,
      async () => {
        const invoice = await response.json();
        const notificationOpts = {
          message: 'Invoice ' + invoice.invoiceNumber + ' sent to ' + invoice.customer.email,
          position: 'bl'
        };
        dispatch(emailInvoiceSuccess(invoice));
        dispatch(info(notificationOpts));
      });
  }
}

export const deleteInvoice = (invoiceId, invoiceNumber) => {
  return async function (dispatch, getState) {
    const notificationOpts = {
      message: 'Invoice ' + invoiceNumber + ' deleted',
      position: 'bl',
      onRemove: () => { deleteInvoiceForReal(invoiceId, getState().deletedInvoices, dispatch) },
      action: {
        label: 'Undo',
        callback: () => { dispatch({ type: types.UNDO_DELETE_INVOICE, invoiceId }) }
      }
    };
    dispatch({ type: types.DELETE_INVOICE, invoiceId });
    dispatch(info(notificationOpts));
  }
}

export const uploadTemplate = (file) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async () => await InvoiceApi.uploadTemplate(file));

  }
}

async function deleteInvoiceForReal(invoiceId, deletedInvoices, dispatch) {
  if (deletedInvoices.some(c => c.invoiceId === invoiceId)) {
    await handleApiCall(dispatch, async() => await InvoiceApi.deleteInvoice(invoiceId));
  }
}