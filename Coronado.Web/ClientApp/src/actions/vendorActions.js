import * as types from '../constants/vendorActionTypes';
import VendorApi from '../api/vendorApi';
import handleApiCall from './responseHandler';

export function loadVendorsSuccess(vendors) {
  return { type: types.LOAD_VENDORS_SUCCESS, vendors };
}

export const loadVendors = () => {
  return async function(dispatch, getState) {
    if (getState().vendors.length > 0) return null;
    await handleApiCall(dispatch,
      async() => VendorApi.getVendors(),
      loadVendorsSuccess);
  };
}