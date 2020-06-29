import * as types from '../constants/loginActionTypes';
import { loadCategories } from './categoryActions';
import { loadAccounts } from './accountActions';
import AuthApi from '../api/authApi';
import { loadCustomers } from './customerActions';
import { loadInvoices } from './invoiceActions';
import { loadVendors } from './vendorActions';
import { loadInvestments } from './investmentActions';
import { loadCurrencies } from './currencyActions';
import history from "../history";
import { handleResponse } from './responseHandler';

export function loginSuccess(user) {
  return { type: types.LOGIN_SUCCESS, user };
}

export function loginAction() {
  return { type: types.LOGIN };
}

export const login = (email, password, next) => {
  return async (dispatch) => {
    dispatch(loginAction());
    const response = await AuthApi.login(email, password);
    await handleResponse(dispatch, response,
      async () => {
        const user = await response.json();
        localStorage.setItem('coronado-user', JSON.stringify(user))
        dispatch(loginSuccess(user));
        dispatch(loadCategories());
        dispatch(loadAccounts());
        dispatch(loadCustomers());
        dispatch(loadInvoices());
        dispatch(loadVendors());
        dispatch(loadInvestments());
        dispatch(loadCurrencies());
        if (next) {
          history.push(next);
        }
      });
  };
}
