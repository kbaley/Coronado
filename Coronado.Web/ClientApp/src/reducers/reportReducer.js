import initialState from './initialState';
import * as actions from "../constants/reportActionTypes";
import { orderBy } from 'lodash';

export const reportReducer = (state = initialState.reports, action, deletedCustomers) => {
  switch (action.type) {
    case actions.LOAD_NET_WORTH_REPORT_SUCCESS:
      return {
        ...state,
        netWorth: orderBy(action.report, ['date'], ['desc'])
      };
      
    default:
      return state;
  }
};
