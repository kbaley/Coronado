import * as types from '../constants/categoryActionTypes';
import { info } from 'react-notification-system-redux';

export const loadCategories = () => {
  return async function(dispatch) {
    const url = "api/Categories";
    const response = await fetch(url);
    const categories = await response.json();
    dispatch({ type: types.RECEIVE_CATEGORIES, categories });
  };
}

export const updateCategory = (category) => {
  return async function(dispatch) {
    const response = await fetch('/api/Categories/' + category.categoryId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    const updatedCategory = await response.json();
    dispatch({type: types.RECEIVE_UPDATED_CATEGORY, updatedCategory});
  }
}

export const deleteCategory = (categoryId, categoryName) => {
  return async function(dispatch, getState) {
    const notificationOpts = {
      message: 'Category ' + categoryName + ' deleted',
      position: 'bl',
      onRemove: () => { deleteCategoryForReal(categoryId, dispatch, getState().categoryState.deletedCategories) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: types.UNDO_DELETE_CATEGORY, categoryId: categoryId })}
      }
    };
    dispatch( { type: types.DELETE_CATEGORY, categoryId: categoryId } );
    dispatch(info(notificationOpts));
  }
}

export const saveNewCategory = (category) => {
  return async (dispatch) => {
    const response = await fetch('/api/Categories', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    const newCategory = await response.json();

    dispatch({ type: types.RECEIVE_NEW_CATEGORY, newCategory });
  }
}

async function deleteCategoryForReal(categoryId, dispatch, deletedCategories) {
  if (deletedCategories.some(c => c.categoryId === categoryId)) {
    await fetch('/api/Categories/' + categoryId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}
