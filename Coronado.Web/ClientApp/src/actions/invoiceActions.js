import * as types from '../constants/invoiceActionTypes';
import InvoiceApi from '../api/invoiceApi';
import { info } from 'react-notification-system-redux';

export function loadInvoicesSuccess(invoices) {
  return {type: types.LOAD_INVOICES_SUCCESS, invoices};
}

export function loadInvoicesAction() {
  return {type: types.LOAD_INVOICES};
}

export function createInvoiceSuccess() {
  return {type: types.CREATE_INVOICE_SUCCESS};
}

export function updateInvoiceSuccess(invoice) {
  return {type: types.UPDATE_INVOICE_SUCCESS, invoice};
}

export function loadInvoiceSuccess(invoice) {
  return {type: types.LOAD_INVOICE_SUCCESS, invoice};
}

export function emailInvoiceSuccess(invoice) {
  return {type: types.EMAIL_INVOICE_SUCCESS, invoice};
}

export const loadInvoices = () => {
  return async (dispatch) => {
    dispatch(loadInvoicesAction());
    const invoices = await InvoiceApi.getAllInvoices();
    dispatch(loadInvoicesSuccess(invoices));
  };
}

export const loadInvoice = (invoiceId) => {
  return async (dispatch) => {
    const invoice = await InvoiceApi.getInvoice(invoiceId);
    dispatch(loadInvoiceSuccess(invoice));
  }
}

export const updateInvoice = (invoice) => {
  return async (dispatch) => {
    const updatedInvoice = await InvoiceApi.updateInvoice(invoice);
    dispatch(updateInvoiceSuccess(updatedInvoice));
  }
}

export const createInvoice = (invoice) => {
  return async (dispatch) => {
    const newInvoice = await InvoiceApi.createInvoice(invoice);
    dispatch(createInvoiceSuccess(newInvoice));
  }
}

export const emailInvoice = (invoiceId) => {
  return async (dispatch) => {
    const invoice = await InvoiceApi.emailInvoice(invoiceId);
    const notificationOpts = {
      message: 'Invoice ' + invoice.invoiceNumber + ' sent to ' + invoice.customerEmail,
      position: 'br'
    };
    dispatch(emailInvoiceSuccess(invoice));
    dispatch(info(notificationOpts));
  }
}

export const deleteInvoice = (invoiceId, invoiceNumber) => {
  return async function(dispatch, getState) {
    const notificationOpts = {
      message: 'Invoice ' + invoiceNumber + ' deleted',
      position: 'br',
      onRemove: () => { deleteInvoiceForReal(invoiceId, getState().deletedInvoices) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: types.UNDO_DELETE_INVOICE, invoiceId })}
      }
    };
    dispatch( { type: types.DELETE_INVOICE, invoiceId } );
    dispatch(info(notificationOpts));
  }
}

async function deleteInvoiceForReal(invoiceId, deletedInvoices) {
  if (deletedInvoices.some(c => c.invoiceId === invoiceId)) {
    await fetch('/api/Invoices/' + invoiceId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}