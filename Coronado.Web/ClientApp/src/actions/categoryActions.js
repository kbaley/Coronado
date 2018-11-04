import * as types from '../constants/categoryActionTypes';

export const loadCategories = () => {
  return async function(dispatch) {
    const url = "api/Categories";
    const response = await fetch(url);
    const categories = await response.json();
    dispatch({ type: types.RECEIVE_CATEGORIES, categories });
  };
}
