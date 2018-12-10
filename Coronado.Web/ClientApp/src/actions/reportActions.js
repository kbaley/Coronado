import * as types from '../constants/reportActionTypes';
import ReportApi from '../api/reportApi';

export function loadNetWorthReportSuccess(report) {
  return {type: types.LOAD_NET_WORTH_REPORT_SUCCESS, report};
}

export function loadNetWorthReportAction() {
  return {type: types.LOAD_NET_WORTH_REPORT};
}

export const loadNetWorthReport = () => {
  return async (dispatch) => {
    dispatch(loadNetWorthReportAction());
    const report = await ReportApi.getNetWorthReport();
    dispatch(loadNetWorthReportSuccess(report));
  };
}

