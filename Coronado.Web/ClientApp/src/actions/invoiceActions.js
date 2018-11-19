import * as types from '../constants/invoiceActionTypes';
import InvoiceApi from '../api/invoiceApi';

export function loadInvoicesSuccess(invoices) {
  return {type: types.LOAD_INVOICES_SUCCESS, invoices};
}

export function loadInvoicesAction() {
  return {type: types.LOAD_INVOICES};
}

export function createInvoiceSuccess() {
  return {type: types.CREATE_INVOICE_SUCCESS};
}

export const loadInvoices = () => {
  return async (dispatch) => {
    dispatch(loadInvoicesAction());
    const invoices = await InvoiceApi.getAllInvoices();
    dispatch(loadInvoicesSuccess(invoices));
  };
}

export const createInvoice = (invoice) => {
  return async (dispatch) => {
    const newInvoice = await InvoiceApi.createInvoice(invoice);
    dispatch(createInvoiceSuccess(newInvoice));
  }
}
