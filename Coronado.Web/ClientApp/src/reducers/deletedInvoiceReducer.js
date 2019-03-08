import initialState from './initialState';
import * as actions from "../constants/invoiceActionTypes.js";
import { cloneDeep, find } from 'lodash';

export const deletedInvoiceReducer = (state = initialState.deletedInvoices, action, invoices) => {
  
  switch (action.type) {
    case actions.DELETE_INVOICE:
      return [
        ...state,
        Object.assign({}, find(invoices, c => c.invoiceId === action.invoiceId))
      ];
    case actions.UNDO_DELETE_INVOICE:
      return [
        cloneDeep(state.filter(el => el.invoiceId !== action.invoiceId))
      ];
    default:
      return state;
  }
};
