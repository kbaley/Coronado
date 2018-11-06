import initialState from './initialState';
import * as actions from "../constants/categoryActionTypes.js";
import { cloneDeep } from 'lodash';

export const categoryReducer = (state = initialState.categoryState, action, deletedCategories) => {
  switch (action.type) {
    case actions.LOAD_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.categories
      };
    case actions.DELETE_CATEGORY:
      return {
        ...state,
        categories: cloneDeep(state.categories.filter(c => c.categoryId !== action.categoryId)),
      };
    case actions.UNDO_DELETE_CATEGORY:
      var deletedCategory = deletedCategories.filter(c => c.categoryId === action.categoryId);
      return {
        ...state,
        categories: cloneDeep(state.categories.concat(deletedCategory)),
      };
    case actions.CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: cloneDeep(state.categories.concat(action.category)),
      };
    case actions.UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.map( c => c.categoryId === action.category.categoryId
          ? Object.assign({}, action.category)
          : c )
      };
    default:
      return state;
  }
};
