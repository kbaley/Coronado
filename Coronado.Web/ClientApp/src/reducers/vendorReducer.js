import initialState from './initialState';
import * as actions from "../constants/vendorActionTypes";
import * as transactionActions from "../constants/transactionActionTypes";

export const vendorReducer = (state = initialState.vendors, action) => {

  switch (action.type) {
    case actions.LOAD_VENDORS_SUCCESS:
      return action.vendors
    case transactionActions.CREATE_TRANSACTION_SUCCESS:
      if (action.vendor) {
        return [
          ...state.filter(c => c.vendorId !== action.vendor.vendorId),
          Object.assign({}, action.vendor)
        ];
      } else {
        return state;
      }
    default:
      return state;
  }
};
