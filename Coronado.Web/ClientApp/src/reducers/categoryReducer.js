import initialState from './initialState';
import * as actions from "../constants/categoryActionTypes.js";
import { concat, find, cloneDeep } from 'lodash';

export const categoryReducer = (state = initialState.categoryState, action) => {
  switch (action.type) {
    case actions.REQUEST_CATEGORIES:
      return {
        ...state,
        isLoading: true
      };
    case actions.RECEIVE_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
        isLoading: false
      };
    case actions.DELETE_CATEGORY:
      return {
        ...state,
        categories: cloneDeep(state.categories.filter(c => c.categoryId !== action.categoryId)),
        deletedCategories: cloneDeep(concat(state.deletedCategories, find(state.categories, c => c.categoryId === action.categoryId)))
      };
    case actions.UNDO_DELETE_CATEGORY:
      var deletedCategory = state.deletedCategories.filter(c => c.categoryId === action.categoryId);
      return {
        ...state,
        categories: cloneDeep(state.categories.concat(deletedCategory)),
        deletedCategories: cloneDeep(state.deletedCategories.filter(el => el.categoryId !== action.categoryId))
      };
    case actions.RECEIVE_NEW_CATEGORY:
      return {
        ...state,
        categories: cloneDeep(state.categories.concat(action.newCategory)),
        deletedCategories: cloneDeep(state.deletedCategories.filter(el => el.categoryId !== action.categoryId))
      };
    case actions.RECEIVE_UPDATED_CATEGORY:
      return {
        ...state,
        categories: state.categories.map( c => c.categoryId === action.updatedCategory.categoryId
          ? Object.assign({}, action.updatedCategory)
          : c )
      };
    default:
      return state;
  }
};
