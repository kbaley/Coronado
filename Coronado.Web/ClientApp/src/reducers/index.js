import { categoryReducer } from "./categoryReducer";
import { accountReducer } from "./accountReducer";
import { categoryDisplayReducer } from "./categoryDisplayReducer";
import {reducer as notifications} from 'react-notification-system-redux';
import { routerReducer } from 'react-router-redux';

function rootReducer(state, action) {
  return {
    accountState: accountReducer(state.accountState, action),
    categoryState: categoryReducer(state.categoryState, action),
    categoryDisplay: categoryDisplayReducer(state.categoryDisplay, {...action, accounts: state.accountState ? state.accountState.accounts : null}),
    router: routerReducer(state.router, action),
    notifications: notifications(state.notifications, action)
  }
}

export default rootReducer;
