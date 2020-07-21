import * as types from '../constants/currencyActionTypes';
import CurrencyApi from '../api/currencyApi';
import handleApiCall from './responseHandler';

export function loadCurrenciesSuccess(currencies) {
  return { type: types.LOAD_CURRENCIES_SUCCESS, currencies };
}

export const loadCurrencies = () => {
  return async function(dispatch, getState) {
    if (!localStorage.getItem('coronado-user')) return;
    if (getState().currencies.length > 0) return null;
    await handleApiCall(dispatch,
      async () => await CurrencyApi.getCurrencies(),
      loadCurrenciesSuccess);
  };
}