const requestCategoriesType = 'REQUEST_CATEGORIES';
const receiveCategoriesType = 'RECEIVE_CATEGORIES';
const deleteCategoryType = 'DELETE_CATEGORY';
const receiveNewCategoryType = 'RECEIVE_NEW_CATEGORY';
const initialState = { categories: [], isLoading: true};

export const actionCreators = {
  requestCategories: () => async (dispatch, getState) => {
    dispatch({ type: requestCategoriesType });
    const response = await fetch('api/Categories');
    const categories = await response.json();

    dispatch({ type: receiveCategoriesType, categories });
  },
  deleteCategory: (categoryId) => async (dispatch) => {
    const response = await fetch('/api/Categories/' + categoryId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const deleted = await response.json();
    dispatch( { type: deleteCategoryType, categoryId: deleted.categoryId } );
  },
  saveNewCategory: (category) => async (dispatch, getState) => {
    const newIdResponse = await fetch('api/Accounts/newId');
    const newId = await newIdResponse.json();
    category.category = newId;
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

  if (action.type === deleteCategoryType) {
    return {
      ...state,
      categories: state.categories.filter(el => el.categoryId !== action.categoryId )
    };
  }

  if (action.type === receiveNewCategoryType) {
    return {
      ...state,
      categories: state.categories.concat(action.newCategory)
    }
  }

  return state;
};
