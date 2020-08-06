import initialState from './initialState';
import * as actions from "../constants/investmentCategoryActionTypes.js";

export const investmentCategoryReducer = (state = initialState.investmentCategories, action) => {
  switch (action.type) {
    case actions.LOAD_CATEGORIES_SUCCESS:
      return action.categories;
      
    case actions.UPDATE_CATEGORIES_SUCCESS:
      return action.categories;
    default:
      return state;
  }
};
