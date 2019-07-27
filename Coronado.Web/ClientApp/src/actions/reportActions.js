import * as types from '../constants/reportActionTypes';
import ReportApi from '../api/reportApi';

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

export const loadNetWorthReport = () => {
  return async (dispatch) => {
    dispatch(loadNetWorthReportAction());
    const report = await ReportApi.getNetWorthReport();
    dispatch(loadNetWorthReportSuccess(report));
  };
}

export const loadExpensesByCategoryReport = () => {
  return async (dispatch) => {
    dispatch(loadExpensesByCategoryReportAction());
    const report = await ReportApi.getExpensesByCategoryReport();
    dispatch(loadExpensesByCategoryReportSuccess(report));
  }
}