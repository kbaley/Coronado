import * as types from '../constants/currencyActionTypes';
import CurrencyApi from '../api/currencyApi';
import handleResponse from './responseHandler';

export function loadCurrenciesSuccess(currencies) {
  return { type: types.LOAD_CURRENCIES_SUCCESS, currencies };
}

export const loadCurrencies = () => {
  return async function(dispatch, getState) {
    if (getState().currencies.length > 0) return null;
    const response = await CurrencyApi.getCurrencies();
    await handleResponse(dispatch, response,
      async () => dispatch(loadCurrenciesSuccess(await response.json())));
  };
}