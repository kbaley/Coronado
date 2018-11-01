import { RECEIVE_CATEGORIES} from "../constants/categoryActionTypes";
import { each } from "lodash";

export const categoryDisplayReducer = (state = { }, action) => {

  if (action.type === RECEIVE_CATEGORIES) {

    var categories = action.categories.slice();
    each(action.accounts, a => {
      categories.push({categoryId: 'TRF:' + a.accountId, name: 'TRANSFER: ' + a.name});
    });
    each(action.accounts, a => {
      if (a.accountType === "Mortgage") {
        categories.push({categoryId: 'MRG:' + a.accountId, name: 'MORTGAGE: ' + a.name});
      }
    });
    return {
      ...state,
      categoryDisplay: categories
    }
  }

  return state;
};
