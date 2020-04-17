import initialState from './initialState';
import * as actions from "../constants/reportActionTypes";
import { orderBy } from 'lodash';

export const reportReducer = (state = initialState.reports, action, deletedCustomers) => {
  switch (action.type) {
    case actions.LOAD_NET_WORTH_REPORT_SUCCESS:
      return {
        ...state,
        netWorth: orderBy(action.report, ['date'], ['desc']),
      };
    case actions.LOAD_EXPENSES_BY_CATEGORY_REPORT_SUCCESS:
      return {
        ...state,
        expensesByCategory: action.report
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
