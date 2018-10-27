import { each } from "lodash";

const receiveCategoriesType = 'RECEIVE_CATEGORIES';
const initialState = { categoryDisplay: []};

export const actionCreators = {
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === receiveCategoriesType) {
    
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
