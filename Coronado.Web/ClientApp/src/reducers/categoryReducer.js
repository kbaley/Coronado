import initialState from './initialState';
import * as actions from "../constants/categoryActionTypes.js";
import { cloneDeep, find } from 'lodash';

export const categoryReducer = (state = initialState.categories, action, deletedCategories) => {
  switch (action.type) {
    case actions.LOAD_CATEGORIES_SUCCESS:
      return action.categories;
      
    case actions.DELETE_CATEGORY:
      return cloneDeep(state.filter(c => c.categoryId !== action.categoryId));
      
    case actions.UNDO_DELETE_CATEGORY:
      const deletedCategory = find(deletedCategories, c => c.categoryId === action.categoryId);
      return [
        ...state,
        Object.assign({}, deletedCategory)
      ];
      
    case actions.CREATE_CATEGORY_SUCCESS:
      return [
        ...state,
        Object.assign({}, action.category),
      ];
      
    case actions.UPDATE_CATEGORY_SUCCESS:
      return [
        ...state.filter(c => c.categoryId !== action.category.categoryId),
        Object.assign({}, action.category)
      ];
      
    default:
      return state;
  }
};
