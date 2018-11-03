import { info } from 'react-notification-system-redux';
import * as actions from "../constants/categoryActionTypes.js";

async function deleteCategoryForReal(categoryId, dispatch, deletedCategories) {
  if (deletedCategories.some(c => c.categoryId === categoryId)) {
    await fetch('/api/Categories/' + categoryId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    dispatch({type: actions.REMOVE_DELETED_CATEGORY, categoryId: categoryId});
  }
}

export const actionCreators = {
  requestCategories: () => async (dispatch, getState) => {
    
    if (getState().categoryState.categories.length > 0) return null;
    dispatch({ type: actions.REQUEST_CATEGORIES });
    const response = await fetch('api/Categories');
    const categories = await response.json();

    dispatch({ type: actions.RECEIVE_CATEGORIES, categories });
  },
  deleteCategory: (categoryId, categoryName) => async (dispatch, getState) => {

    const notificationOpts = {
      message: 'Category ' + categoryName + ' deleted',
      position: 'bl',
      onRemove: () => { deleteCategoryForReal(categoryId, dispatch, getState().categoryState.deletedCategories) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: actions.UNDO_DELETE_CATEGORY, categoryId: categoryId })}
      }
    };
    dispatch( { type: actions.DELETE_CATEGORY, categoryId: categoryId } );
    dispatch(info(notificationOpts));
  },
  updateCategory: (category) => async (dispatch) => {
    const response = await fetch('/api/Categories/' + category.categoryId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    const updatedCategory = await response.json();
    dispatch({type: actions.RECEIVE_UPDATED_CATEGORY, updatedCategory});
  },
  saveNewCategory: (category) => async (dispatch) => {
    const response = await fetch('/api/Categories', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    const newCategory = await response.json();

    dispatch({ type: actions.RECEIVE_NEW_CATEGORY, newCategory });
  }
};

