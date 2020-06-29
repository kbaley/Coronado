import * as types from '../constants/reportActionTypes';
import ReportApi from '../api/reportApi';
import handleApiCall from './responseHandler';

export function loadInvestmentReportSuccess(report) {
  return {type: types.LOAD_INVESTMENT_REPORT_SUCCESS, report};
}

export function loadInvestmentReportAction() {
  return {type: types.LOAD_INVESTMENT_REPORT};
}

export function loadNetWorthReportSuccess(report) {
  return {type: types.LOAD_NET_WORTH_REPORT_SUCCESS, report};
}

export function loadNetWorthReportAction() {
  return {type: types.LOAD_NET_WORTH_REPORT};
}

export function loadExpensesByCategoryReportSuccess(report) {
  return {type: types.LOAD_EXPENSES_BY_CATEGORY_REPORT_SUCCESS, report};
}

export function loadExpensesByCategoryReportAction() {
  return {type: types.LOAD_EXPENSES_BY_CATEGORY_REPORT};
}

export function loadIncomeReportSuccess(report) {
  return {type: types.LOAD_INCOME_REPORT_SUCCESS, report};
}

export function loadIncomeReportAction() {
  return {type: types.LOAD_INCOME_REPORT};
}

export function loadDashboardStatsAction() {
  return {type: types.LOAD_DASHBOARD_STATS};
}

export function loadDashboardStatsSuccess(report) {
  return {type: types.LOAD_DASHBOARD_STATS_SUCCESS, report};
}

export const loadInvestmentReport = (year) => {
  return async (dispatch) => {
    dispatch(loadInvestmentReportAction());
    await handleApiCall(dispatch,
      async () => await ReportApi.getInvestmentReport(year), loadInvestmentReportSuccess);
  };
}

export const loadNetWorthReport = (year) => {
  return async (dispatch) => {
    dispatch(loadNetWorthReportAction());
    await handleApiCall(dispatch,
      async () => await ReportApi.getNetWorthReport(year), loadNetWorthReportSuccess);
  };
}

export const loadExpensesByCategoryReport = (year) => {
  return async (dispatch) => {
    dispatch(loadExpensesByCategoryReportAction());
    await handleApiCall(dispatch,
      async () => await ReportApi.getExpensesByCategoryReport(year), loadExpensesByCategoryReportSuccess);
  }
}

export const loadIncomeReport = (year) => {
  return async (dispatch) => {
    dispatch(loadIncomeReportAction());
    await handleApiCall(dispatch,
      async () => await ReportApi.getIncomeReport(year), loadIncomeReportSuccess);
  }
}

export const loadDashboardStats = () => {
  return async (dispatch) => {
    dispatch(loadDashboardStatsAction());
    await handleApiCall(dispatch,
      async () => await ReportApi.getDashboardStats(), loadDashboardStatsSuccess);
  }
}