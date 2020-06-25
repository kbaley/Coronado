import * as types from '../constants/reportActionTypes';
import ReportApi from '../api/reportApi';

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
    const report = await ReportApi.getInvestmentReport(year);
    dispatch(loadInvestmentReportSuccess(report));
  };
}

export const loadNetWorthReport = (year) => {
  return async (dispatch) => {
    dispatch(loadNetWorthReportAction());
    const report = await ReportApi.getNetWorthReport(year);
    dispatch(loadNetWorthReportSuccess(report));
  };
}

export const loadExpensesByCategoryReport = (year) => {
  return async (dispatch) => {
    dispatch(loadExpensesByCategoryReportAction());
    const report = await ReportApi.getExpensesByCategoryReport(year);
    dispatch(loadExpensesByCategoryReportSuccess(report));
  }
}

export const loadIncomeReport = (year) => {
  return async (dispatch) => {
    dispatch(loadIncomeReportAction());
    const report = await ReportApi.getIncomeReport(year);
    dispatch(loadIncomeReportSuccess(report));
  }
}

export const loadDashboardStats = () => {
  return async (dispatch) => {
    dispatch(loadDashboardStatsAction());
    const report = await ReportApi.getDashboardStats();
    dispatch(loadDashboardStatsSuccess(report));
  }
}