export default {
  categories: [],
  deletedCategories: [],
  accounts: [],
  selectedAccount: '',
  accountTypes: [],
  deletedAccounts: [],
  deletedCustomers: [],
  deletedInvoices: [],
  deletedInvestments: [],
  invoices: [],
  ajaxCallsInProgress: 0,
  transactions: [],
  customers: [],
  investments: [],
  currencies: [],
  vendors: [],
  reports: {
    netWorth: [],
    expensesByCategory: []
  },
  loading: {
    accounts: true,
    categories: true,
    transactions: false,
    customers: true,
    invoices: true,
    investments: true
  }
}

