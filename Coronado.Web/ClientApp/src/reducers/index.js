import { categoryReducer } from "./categoryReducer";
import { accountReducer } from "./accountReducer";
import * as CategoryDisplay from '../store/CategoryDisplay';
import {reducer as notifications} from 'react-notification-system-redux';
import { routerReducer } from 'react-router-redux';

function rootReducer(state, action) {
  return {
    account: accountReducer(state.account, action),
    categories: categoryReducer(state.categories, action),
    categoryDisplay: CategoryDisplay.reducer(state.categoryDisplay, {...action, accounts: state.account ? state.account.accounts : null}),
    router: routerReducer(state.router, action),
    notifications: notifications(state.notifications, action)
  }
}

export default rootReducer;
