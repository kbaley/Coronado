import * as types from '../constants/investmentCategoryActionTypes';
import { info } from 'react-notification-system-redux';
import InvestmentCategoryApi from '../api/investmentCategoryApi';
import handleApiCall, { handleResponse } from './responseHandler';

export function loadCategoriesSuccess(categories) {
  return { type: types.LOAD_CATEGORIES_SUCCESS, categories };
}

export function updateCategoriesSuccess(categories) {
  return { type: types.UPDATE_CATEGORIES_SUCCESS, categories };
}

export const loadInvestmentCategories = () => {
  return async (dispatch) => {
    if (!localStorage.getItem('coronado-user')) return;
    await handleApiCall(dispatch,
      () => InvestmentCategoryApi.getAllCategories(),
      loadCategoriesSuccess);
  };
}

export const updateInvestmentCategories = (categories) => {
  return async (dispatch) => {

    const response = await InvestmentCategoryApi.updateCategories(categories);
    await handleResponse(dispatch, response,
      async () => {
        const updatedCategories = await response.json();
        dispatch(updateCategoriesSuccess(updatedCategories));
        const notificationOpts = {
          message: "Investment categories updated",
          position: 'bl',
          level: 'success',
          autoDismiss: 5,
          dismissible: 'click'
        };
        dispatch(info(notificationOpts));
      });
  }
}
