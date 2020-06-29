import * as types from '../constants/reportActionTypes';
import ReportApi from '../api/reportApi';
import handleResponse from './responseHandler';

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
    const response = await ReportApi.getInvestmentReport(year);
    await handleResponse(dispatch, response,
      async () => dispatch(loadInvestmentReportSuccess(await response.json())));
  };
}

export const loadNetWorthReport = (year) => {
  return async (dispatch) => {
    dispatch(loadNetWorthReportAction());
    const response = await ReportApi.getNetWorthReport(year);
    await handleResponse(dispatch, response,
      async () => dispatch(loadNetWorthReportSuccess(await response.json())));
  };
}

export const loadExpensesByCategoryReport = (year) => {
  return async (dispatch) => {
    dispatch(loadExpensesByCategoryReportAction());
    const response = await ReportApi.getExpensesByCategoryReport(year);
    await handleResponse(dispatch, response,
      async () => dispatch(loadExpensesByCategoryReportSuccess(await response.json())));
  }
}

export const loadIncomeReport = (year) => {
  return async (dispatch) => {
    dispatch(loadIncomeReportAction());
    const response = await ReportApi.getIncomeReport(year);
    await handleResponse(dispatch, response,
      async () => dispatch(loadIncomeReportSuccess(await response.json())));
  }
}

export const loadDashboardStats = () => {
  return async (dispatch) => {
    dispatch(loadDashboardStatsAction());
    const response = await ReportApi.getDashboardStats();
    await handleResponse(dispatch, response,
      async () => dispatch(loadDashboardStatsSuccess(await response.json())));
  }
}