import * as types from '../constants/vendorActionTypes';
import VendorApi from '../api/vendorApi';
import handleResponse from './responseHandler';

export function loadVendorsSuccess(vendors) {
  return { type: types.LOAD_VENDORS_SUCCESS, vendors };
}

export const loadVendors = () => {
  return async function(dispatch, getState) {
    if (getState().vendors.length > 0) return null;
    const response = await VendorApi.getVendors();
    await handleResponse(dispatch, response,
      async () => dispatch(loadVendorsSuccess(await response.json())));
  };
}