const requestCategoriesType = 'REQUEST_CATEGORIES';
const receiveCategoriesType = 'RECEIVE_CATEGORIES';
const initialState = { categories: [], isLoading: true};

export const actionCreators = {
  requestCategories: () => async (dispatch, getState) => {
    dispatch({ type: requestCategoriesType });
    const response = await fetch('api/Categories');
    const categories = await response.json();

    dispatch({ type: receiveCategoriesType, categories });
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestCategoriesType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveCategoriesType) {
    return {
      ...state,
      categories: action.categories,
      isLoading: false
    };
  }

  return state;
};
