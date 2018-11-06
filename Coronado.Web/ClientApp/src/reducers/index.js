import { categoryReducer } from "./categoryReducer";
import { accountReducer } from "./accountReducer";
import { deletedCategoryReducer } from "./deletedCategoryReducer";
import {reducer as notifications} from 'react-notification-system-redux';
import { routerReducer } from 'react-router-redux';

function rootReducer(state, action) {
  return {
    accountState: accountReducer(state.accountState, action),
    categories: categoryReducer(state.categories, action, state.deletedCategories || []),
    deletedCategories: deletedCategoryReducer(state.deletedCategories, action, state.categories || []),
    router: routerReducer(state.router, action),
    notifications: notifications(state.notifications, action)
  }
}

export default rootReducer;
