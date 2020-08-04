import initialState from './initialState';
import * as actions from "../constants/invoiceActionTypes";
import * as transactionActions from "../constants/transactionActionTypes";
import { cloneDeep, find, sumBy, orderBy } from 'lodash';

export const invoiceReducer = (state = initialState.invoices, action, deletedInvoices) => {
  switch (action.type) {
    case actions.LOAD_INVOICES_SUCCESS:
      return orderBy(action.invoices, ['date'], ['desc']);

    case actions.LOAD_INVOICE_SUCCESS:
      return [
        ...state.filter(c => c.invoiceId !== action.invoice.invoiceId),
        Object.assign({}, action.invoice)
      ];
      
    case actions.DELETE_INVOICE:
      return cloneDeep(state.filter(c => c.invoiceId !== action.invoiceId));
      
    case actions.UNDO_DELETE_INVOICE:
      const deletedInvoice = find(deletedInvoices, c => c.invoicedId === action.invoicedId);
      return [
        ...state,
        Object.assign({}, deletedInvoice)
      ];
      
    case actions.CREATE_INVOICE_SUCCESS:
      return [
        ...state,
        Object.assign({}, action.invoice),
      ];
      
    case actions.UPDATE_INVOICE_SUCCESS:
      action.invoice.balance = sumBy(action.invoice.lineItems, i => (i.quantity * i.unitAmount));
      return [
        ...state.filter(c => c.invoiceId !== action.invoice.invoiceId),
        Object.assign({}, action.invoice)
      ];
    case transactionActions.CREATE_TRANSACTION_SUCCESS:
    case transactionActions.UPDATE_TRANSACTION_SUCCESS:
    case transactionActions.DELETE_TRANSACTION_SUCCESS:
      if (!action.invoice) return state;
      return [
        ...state.filter(c => c.invoiceId !== action.invoice.invoiceId),
        Object.assign({}, action.invoice)
      ];
      
    default:
      return state;
  }
};
