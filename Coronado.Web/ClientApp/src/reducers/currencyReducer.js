import initialState from './initialState';
import * as actions from "../constants/currencyActionTypes";

export const currencyReducer = (state = initialState.currencies, action) => {

  switch (action.type) {
    case actions.LOAD_CURRENCIES_SUCCESS:
      // Support only CAD for now
      return { 
        "CAD": action.currencies,
        "USD": 1.0 
      };
    default:
      return state;
  }
};
