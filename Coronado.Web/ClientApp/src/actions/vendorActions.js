import * as types from '../constants/vendorActionTypes';
import VendorApi from '../api/vendorApi';

export function loadVendorsSuccess(vendors) {
  return { type: types.LOAD_VENDORS_SUCCESS, vendors };
}

export const loadVendors = () => {
  return async function(dispatch, getState) {
    if (getState().vendors.length > 0) return null;
    const vendors = await VendorApi.getVendors();
    dispatch(loadVendorsSuccess(vendors));
  };
}