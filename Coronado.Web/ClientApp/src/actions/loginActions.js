import * as types from '../constants/loginActionTypes';
import {loadCategories} from './categoryActions';
import {loadAccounts} from './accountActions';
import AuthApi from '../api/authApi';
import { push } from 'react-router-redux';
import { loadCustomers } from './customerActions';
import { loadInvoices } from './invoiceActions';
import { loadVendors } from './vendorActions';
import { loadInvestments } from './investmentActions';
import { loadCurrencies } from './currencyActions';

export function loginSuccess(user) {
  return {type: types.LOGIN_SUCCESS, user};
}

export function loginAction() {
  return {type: types.LOGIN};
}

export const login = (email, password, next) => {
  return async (dispatch) => {
    dispatch(loginAction());
    const user = await AuthApi.login(email, password);
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
      dispatch(push(next));
    }
  };
}
