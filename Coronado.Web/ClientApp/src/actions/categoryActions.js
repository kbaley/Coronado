import * as types from '../constants/categoryActionTypes';
import { info } from 'react-notification-system-redux';
import CategoryApi from '../api/categoryApi';
import handleApiCall from './responseHandler';

export function loadCategoriesSuccess(categories) {
  return {type: types.LOAD_CATEGORIES_SUCCESS, categories};
}

export function loadCategoriesAction() {
  return {type: types.LOAD_CATEGORIES};
}

export function updateCategorySuccess(category) {
  return {type: types.UPDATE_CATEGORY_SUCCESS, category};
}

export function createCategorySuccess(category) {
  return {type: types.CREATE_CATEGORY_SUCCESS, category};
}

export const loadCategories = () => {
  return async (dispatch) => {
    if (!localStorage.getItem('coronado-user')) return;
    dispatch(loadCategoriesAction());
    await handleApiCall(dispatch,
      () => CategoryApi.getAllCategories(),
      loadCategoriesSuccess);
  };
}

export const updateCategory = (category) => {
  return async (dispatch) => {
    await handleApiCall(dispatch,
      async () => await CategoryApi.updateCategory(category),
      updateCategorySuccess);
  }
}

export const deleteCategory = (categoryId, categoryName) => {
  return async function(dispatch, getState) {
    const notificationOpts = {
      message: 'Category ' + categoryName + ' deleted',
      position: 'bl',
      onRemove: () => { deleteCategoryForReal(categoryId, getState().deletedCategories, dispatch) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: types.UNDO_DELETE_CATEGORY, categoryId: categoryId })}
      }
    };
    dispatch( { type: types.DELETE_CATEGORY, categoryId: categoryId } );
    dispatch(info(notificationOpts));
  }
}

export const createCategory = (category) => {
  return async (dispatch) => {
    await handleApiCall(dispatch,
      () => CategoryApi.createCategory(category),
      createCategorySuccess);
  }
}

async function deleteCategoryForReal(categoryId, deletedCategories, dispatch) {
  if (deletedCategories.some(c => c.categoryId === categoryId)) {
    await handleApiCall(dispatch,
      async () => await CategoryApi.deleteCategory(categoryId));
  }
}
