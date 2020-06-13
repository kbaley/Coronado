import initialState from './initialState';
import * as actions from "../constants/categoryActionTypes.js";
import { cloneDeep, find, orderBy } from 'lodash';

export const categoryReducer = (state = initialState.categories, action, deletedCategories) => {
  switch (action.type) {
    case actions.LOAD_CATEGORIES_SUCCESS:
      return orderBy(action.categories, ['name'], ['asc']);
      
    case actions.DELETE_CATEGORY:
      return cloneDeep(state.filter(c => c.categoryId !== action.categoryId));
      
    case actions.UNDO_DELETE_CATEGORY:
      const deletedCategory = find(deletedCategories, c => c.categoryId === action.categoryId);
      const newState = [
        ...state,
        Object.assign({}, deletedCategory)
      ];
      return orderBy(newState, ['name'], ['asc']);
      
    case actions.CREATE_CATEGORY_SUCCESS:
      var newState = [
        ...state,
        Object.assign({}, action.category),
      ];
      return orderBy(newState, ['name'], ['asc']);
      
    case actions.UPDATE_CATEGORY_SUCCESS:
      var newState = [
        ...state.filter(c => c.categoryId !== action.category.categoryId),
        Object.assign({}, action.category)
      ];
      return orderBy(newState, ['name'], ['asc']);
      
    default:
      return state;
  }
};
