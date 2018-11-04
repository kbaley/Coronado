import { RECEIVE_CATEGORIES} from "../constants/categoryActionTypes";
import { RECEIVE_ACCOUNT_LIST } from "../constants/accountActionTypes";
import { each } from "lodash";

function getCategoryDisplay(categoryList, accounts) {

    var categories = categoryList.slice();
    each(accounts, a => {
      categories.push({categoryId: 'TRF:' + a.accountId, name: 'TRANSFER: ' + a.name});
    });
    each(accounts, a => {
      if (a.accountType === "Mortgage") {
        categories.push({categoryId: 'MRG:' + a.accountId, name: 'MORTGAGE: ' + a.name});
      }
    });
    return categories;
}

export const categoryDisplayReducer = (state = { accountsLoaded: false, categoriesLoaded: false }, action) => {

  
  if (action.type === RECEIVE_ACCOUNT_LIST) {
    if (state.categoriesLoaded) {
      return {
        ...state,
        accountsLoaded: true,
        categoryDisplay: getCategoryDisplay(action.savedCategories, action.accounts)
      }
    }
    return {
      ...state,
      accountsLoaded: true
    }
  }

  if (action.type === RECEIVE_CATEGORIES) {
    if (state.accountsLoaded) {
      return {
        ...state,
        categoriesLoaded: true,
        categoryDisplay: getCategoryDisplay(action.categories, action.savedAccounts)
      }
    }
    return {
      ...state,
      categoriesLoaded: true
    }
  }

  return state;
};
