import initialState from './initialState';
import * as actions from "../constants/vendorActionTypes";

export const vendorReducer = (state = initialState.vendors, action) => {

  switch (action.type) {
    case actions.LOAD_VENDORS_SUCCESS:
      return action.vendors
    default:
      return state;
  }
};
