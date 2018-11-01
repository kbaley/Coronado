import { info } from 'react-notification-system-redux';

const requestCategoriesType = 'REQUEST_CATEGORIES';
const receiveCategoriesType = 'RECEIVE_CATEGORIES';
const deleteCategoryType = 'DELETE_CATEGORY';
const receiveNewCategoryType = 'RECEIVE_NEW_CATEGORY';
const undoDeleteCategoryType = 'UNDO_DELETE_CATEGORY';
const removeDeletedCategoryType = 'REMOVE_DELETED_CATEGORY';
const receiveUpdatedCategoryType = 'RECEIVE_UPDATED_CATEGORY';
const initialState = { categories: [], isLoading: true, deletedCategories: []};

async function deleteCategoryForReal(categoryId, dispatch, deletedCategories) {
  if (deletedCategories.some(c => c.categoryId === categoryId)) {
    await fetch('/api/Categories/' + categoryId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    dispatch({type: removeDeletedCategoryType, categoryId: categoryId});
  }
}

export const actionCreators = {
  requestCategories: () => async (dispatch, getState) => {
    
    if (getState().categories.categories.length > 0) return null;
    dispatch({ type: requestCategoriesType });
    const response = await fetch('api/Categories');
    const categories = await response.json();

    dispatch({ type: receiveCategoriesType, categories });
  },
  deleteCategory: (categoryId, categoryName) => async (dispatch, getState) => {

    const notificationOpts = {
      message: 'Category ' + categoryName + ' deleted',
      position: 'bl',
      onRemove: () => { deleteCategoryForReal(categoryId, dispatch, getState().categories.deletedCategories) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: undoDeleteCategoryType, categoryId: categoryId })}
      }
    };
    dispatch( { type: deleteCategoryType, categoryId: categoryId } );
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
    dispatch({type: receiveUpdatedCategoryType, updatedCategory});
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

    dispatch({ type: receiveNewCategoryType, newCategory });
  }
};

