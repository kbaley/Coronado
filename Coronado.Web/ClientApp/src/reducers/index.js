import { categoryReducer } from "./categoryReducer";
import { accountReducer } from "./accountReducer";
import { deletedCategoryReducer } from "./deletedCategoryReducer";
import { deletedAccountReducer } from "./deletedAccountReducer";
import { transactionReducer } from "./transactionReducer";
import {reducer as notifications} from 'react-notification-system-redux';
import { routerReducer } from 'react-router-redux';

function rootReducer(state, action) {
  return {
    accountState: accountReducer(state.accountState, action),
    deletedAccounts: deletedAccountReducer(state.deletedAccounts, action, state.accountState ? state.accountState.accounts : []),
    categories: categoryReducer(state.categories, action, state.deletedCategories || []),
    deletedCategories: deletedCategoryReducer(state.deletedCategories, action, state.categories || []),
    transactions: transactionReducer(state.transactions, action),
    router: routerReducer(state.router, action),
    notifications: notifications(state.notifications, action)
  }
}

export default rootReducer;
