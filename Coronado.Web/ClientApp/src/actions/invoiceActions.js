import * as types from '../constants/invoiceActionTypes';
import InvoiceApi from '../api/invoiceApi';

export function loadInvoicesSuccess(invoices) {
  return {type: types.LOAD_INVOICES_SUCCESS, invoices};
}

export function loadInvoicesAction() {
  return {type: types.LOAD_INVOICES};
}

export const loadInvoices = () => {
  return async (dispatch) => {
    dispatch(loadInvoicesAction());
    const invoices = await InvoiceApi.getAllInvoices();
    dispatch(loadInvoicesSuccess(invoices));
  };
}
