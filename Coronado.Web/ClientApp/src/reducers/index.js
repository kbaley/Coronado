import { categoryReducer } from "./categoryReducer";
import { customerReducer } from "./customerReducer";
import { accountReducer } from "./accountReducer";
import { deletedCategoryReducer } from "./deletedCategoryReducer";
import { deletedCustomerReducer } from "./deletedCustomerReducer";
import { deletedAccountReducer } from "./deletedAccountReducer";
import { transactionReducer } from "./transactionReducer";
import { accountTypeReducer } from "./accountTypeReducer";
import { selectedAccountReducer } from "./selectedAccountReducer";
import { ajaxStatusReducer } from "./ajaxStatusReducer";
import {reducer as notifications} from 'react-notification-system-redux';
import { routerReducer } from 'react-router-redux';

function rootReducer(state, action) {
  return {
    accounts: accountReducer(state.accounts, action, state.deletedAccounts || []),
    selectedAccount: selectedAccountReducer(state.selectedAccount, action),
    deletedAccounts: deletedAccountReducer(state.deletedAccounts, action, state.accounts ? state.accounts : []),
    categories: categoryReducer(state.categories, action, state.deletedCategories || []),
    deletedCategories: deletedCategoryReducer(state.deletedCategories, action, state.categories || []),
    deletedCustomers: deletedCustomerReducer(state.deletedCustomers, action, state.customers || []),
    transactions: transactionReducer(state.transactions, action, state.selectedAccount || ''),
    accountTypes: accountTypeReducer(state.accountTypes, action),
    customers: customerReducer(state.customers, action),
    router: routerReducer(state.router, action),
    loading: ajaxStatusReducer(state.loading, action),
    notifications: notifications(state.notifications, action)
  }
}

export default rootReducer;
