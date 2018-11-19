import initialState from './initialState';
import * as actions from "../constants/invoiceActionTypes";
import { cloneDeep, find } from 'lodash';

export const invoiceReducer = (state = initialState.invoices, action, deletedInvoices) => {
  switch (action.type) {
    case actions.LOAD_INVOICES_SUCCESS:
      return action.categories;
      
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
      return [
        ...state.filter(c => c.invoiceId !== action.invoice.invoiceId),
        Object.assign({}, action.invoice)
      ];
      
    default:
      return state;
  }
};
