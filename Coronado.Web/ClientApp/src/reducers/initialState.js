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
  customers: [],
  investments: [],
  currencies: [],
  vendors: [],
  reports: {
    netWorth: [],
    expensesByCategory: [],
    income: [],
    investment: [],
    dashboardStats: { }
  },
  transactionModel: {
    transactions: [],
    startingBalance: 0,
    remainingTransactionCount: 0,
  },
  loading: {
    accounts: true,
    categories: true,
    transactions: false,
    customers: true,
    invoices: true,
    investments: true
  },
  showAllAccounts: false,
  portfolioStats: {
    irr: 0.0,
  },
  accountListOpen: false,
  investmentCategories: [],
}

