import * as types from '../constants/currencyActionTypes';
import CurrencyApi from '../api/currencyApi';

export function loadCurrenciesSuccess(currencies) {
  return { type: types.LOAD_CURRENCIES_SUCCESS, currencies };
}

export const loadCurrencies = () => {
  return async function(dispatch, getState) {
    if (getState().currencies.length > 0) return null;
    const currencies = await CurrencyApi.getCurrencies();
    dispatch(loadCurrenciesSuccess(currencies));
  };
}