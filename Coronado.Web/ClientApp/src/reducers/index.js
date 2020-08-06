import { categoryReducer } from "./categoryReducer";
import { investmentCategoryReducer } from "./investmentCategoryReducer";
import { invoiceReducer } from "./invoiceReducer";
import { customerReducer } from "./customerReducer";
import { investmentReducer } from "./investmentReducer";
import { vendorReducer } from "./vendorReducer";
import { accountReducer } from "./accountReducer";
import { deletedCategoryReducer } from "./deletedCategoryReducer";
import { deletedInvoiceReducer } from "./deletedInvoiceReducer";
import { deletedCustomerReducer } from "./deletedCustomerReducer";
import { deletedAccountReducer } from "./deletedAccountReducer";
import { deletedInvestmentReducer } from "./deletedInvestmentReducer";
import { transactionReducer } from "./transactionReducer";
import { accountTypeReducer } from "./accountTypeReducer";
import { selectedAccountReducer } from "./selectedAccountReducer";
import { ajaxStatusReducer } from "./ajaxStatusReducer";
import {reducer as notifications} from 'react-notification-system-redux';
import { reportReducer } from "./reportReducer";
import { currencyReducer } from "./currencyReducer";
import { navListReducer } from "./navListReducer";
import { portfolioStatsReducer } from "./portfolioStatsReducer";

function rootReducer(state, action) {
  return {
    accounts: accountReducer(state.accounts, action, state.deletedAccounts || []),
    selectedAccount: selectedAccountReducer(state.selectedAccount, action),
    deletedAccounts: deletedAccountReducer(state.deletedAccounts, action, state.accounts ? state.accounts : []),
    categories: categoryReducer(state.categories, action, state.deletedCategories || []),
    invoices: invoiceReducer(state.invoices, action, state.deletedInvoices || []),
    deletedCategories: deletedCategoryReducer(state.deletedCategories, action, state.categories || []),
    deletedCustomers: deletedCustomerReducer(state.deletedCustomers, action, state.customers || []),
    deletedInvoices: deletedInvoiceReducer(state.deletedInvoices, action, state.invoices || []),
    deletedInvestments: deletedInvestmentReducer(state.deletedInvestments, action, state.investments || []),
    transactionModel: transactionReducer(state.transactionModel, action, state.selectedAccount || ''),
    accountTypes: accountTypeReducer(state.accountTypes, action),
    currencies: currencyReducer(state.currencies, action),
    customers: customerReducer(state.customers, action, state.deletedCustomers || []),
    investments: investmentReducer(state.investments, action, state.deletedInvestments || []),
    vendors: vendorReducer(state.vendors, action),
    reports: reportReducer(state.reports, action),
    loading: ajaxStatusReducer(state.loading, action),
    notifications: notifications(state.notifications, action),
    showAllAccounts: navListReducer(state.showAllAccounts, action),
    portfolioStats: portfolioStatsReducer(state.portfolioStats, action),
    investmentCategories: investmentCategoryReducer(state.investmentCategories, action),
  }
}

export default rootReducer;
