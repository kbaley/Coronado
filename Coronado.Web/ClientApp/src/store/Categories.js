﻿import { info } from 'react-notification-system-redux';
import { each } from 'lodash';

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
    dispatch({ type: 'SOME_SPECIAL_ACTION', categories });
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

export const specialReducer = (categoryState, action, accountState) => {

}

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestCategoriesType) {
    
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveCategoriesType) {
    console.log(action.accounts);
    return {
      ...state,
      categories: action.categories,
      isLoading: false
    };
  }

  if (action.type === deleteCategoryType) {
    return {
      ...state,
      deletedCategories: state.deletedCategories.concat(state.categories.filter(el => el.categoryId === action.categoryId)),
      categories: state.categories.filter(el => el.categoryId !== action.categoryId )
    };
  }

  if (action.type === undoDeleteCategoryType) {
    return {
      ...state,
      categories: state.categories.concat(state.deletedCategories.filter(el => el.categoryId === action.categoryId)),
      deletedCategories: state.deletedCategories.filter(el => el.categoryId !== action.categoryId)
    }
  }

  if (action.type === removeDeletedCategoryType) {
    return {
      ...state,
      deletedCategories: state.deletedCategories.filter(el => el.categoryId !== action.categoryId)
    }
  }

  if (action.type === receiveNewCategoryType) {
    return {
      ...state,
      categories: state.categories.concat(action.newCategory)
    }
  }

  if (action.type === receiveUpdatedCategoryType) {
    return {
      ...state,
      categories: state.categories.map( c => c.categoryId === action.updatedCategory.categoryId
        ? Object.assign({}, action.updatedCategory)
        : c )
    }

  }
  if (action.type === 'SOME_SPECIAL_ACTION') {
    var categories = action.categories.slice();
    each(action.accounts, a => {
      categories.push({categoryId: 'TRF:' + a.accountId, name: 'TRANSFER: ' + a.name});
    });
    
    return {
      ...state,
      categoryDisplay: categories
    }
  }

  return state;
};
