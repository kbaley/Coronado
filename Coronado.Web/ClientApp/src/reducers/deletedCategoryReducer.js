import initialState from './initialState';
import * as actions from "../constants/categoryActionTypes.js";
import { cloneDeep, find } from 'lodash';

export const deletedCategoryReducer = (state = initialState.deletedCategories, action, categories) => {
  switch (action.type) {
    case actions.DELETE_CATEGORY:
      return [
        ...state,
        Object.assign({}, find(categories, c => c.categoryId === action.categoryId))
      ];
    case actions.UNDO_DELETE_CATEGORY:
      return [
        cloneDeep(state.filter(el => el.categoryId !== action.categoryId))
      ];
    default:
      return state;
  }
};
