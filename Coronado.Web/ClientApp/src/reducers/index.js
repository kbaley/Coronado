import { categoryReducer } from "./categoryReducer";
import { accountReducer } from "./accountReducer";
import { deletedCategoryReducer } from "./deletedCategoryReducer";
import {reducer as notifications} from 'react-notification-system-redux';
import { routerReducer } from 'react-router-redux';

function rootReducer(state, action) {
  return {
    accountState: accountReducer(state.accountState, action),
    categoryState: categoryReducer(state.categoryState, action, state.deletedCategories || []),
    deletedCategories: deletedCategoryReducer(state.deletedCategories, action, state.categoryState ? state.categoryState.categories : []),
    router: routerReducer(state.router, action),
    notifications: notifications(state.notifications, action)
  }
}

export default rootReducer;
