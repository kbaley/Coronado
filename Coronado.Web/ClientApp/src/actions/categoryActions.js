import * as types from '../constants/categoryActionTypes';
import { info } from 'react-notification-system-redux';
import CategoryApi from '../api/categoryApi';
import { authHeader } from '../api/auth-header';

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
    dispatch(loadCategoriesAction());
    const categories = await CategoryApi.getAllCategories();
    dispatch(loadCategoriesSuccess(categories));
  };
}

export const updateCategory = (category) => {
  return async (dispatch) => {
    const updatedCategory = await CategoryApi.updateCategory(category);
    dispatch(updateCategorySuccess(updatedCategory));
  }
}

export const deleteCategory = (categoryId, categoryName) => {
  return async function(dispatch, getState) {
    const notificationOpts = {
      message: 'Category ' + categoryName + ' deleted',
      position: 'bl',
      onRemove: () => { deleteCategoryForReal(categoryId, getState().deletedCategories) },
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
    const newCategory = await CategoryApi.createCategory(category);
    dispatch(createCategorySuccess(newCategory));
  }
}

async function deleteCategoryForReal(categoryId, deletedCategories) {
  if (deletedCategories.some(c => c.categoryId === categoryId)) {
    await fetch('/api/Categories/' + categoryId, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}
