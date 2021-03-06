import initialState from './initialState';
import * as actions from "../constants/reportActionTypes";

export const reportReducer = (state = initialState.reports, action, deletedCustomers) => {
  switch (action.type) {
    case actions.LOAD_NET_WORTH_REPORT_SUCCESS:
      return {
        ...state,
        netWorth: action.report,
      };
    case actions.LOAD_INVESTMENT_REPORT_SUCCESS:
      return {
        ...state,
        investment: action.report,
      };
    case actions.LOAD_EXPENSES_BY_CATEGORY_REPORT_SUCCESS:
      return {
        ...state,
        expensesByCategory: action.report
      }

    case actions.LOAD_INCOME_REPORT_SUCCESS:
      return {
        ...state,
        income: action.report
      }

    case actions.LOAD_DASHBOARD_STATS_SUCCESS:
        return {
          ...state,
          dashboardStats: action.report
        }
      
    default:
      return state;
  }
};
