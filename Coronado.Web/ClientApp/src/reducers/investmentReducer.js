import initialState from './initialState';
import * as actions from "../constants/investmentActionTypes";
import { cloneDeep, find, forEach } from 'lodash';

export const investmentReducer = (state = initialState.investments, action, deletedInvestments) => {
  switch (action.type) {
    case actions.LOAD_INVESTMENTS_SUCCESS:
      return action.investments;
      
    case actions.DELETE_INVESTMENT:
      return cloneDeep(state.filter(c => c.investmentId !== action.investmentId));
      
    case actions.UNDO_DELETE_INVESTMENT:
      const deletedInvestment = find(deletedInvestments, i => i.investmentId === action.investmentId);
      
      return [
        ...state,
        Object.assign({}, deletedInvestment)
      ];
      
    case actions.CREATE_INVESTMENT_SUCCESS:
      return [
        ...state,
        Object.assign({}, action.investment),
      ];
      
    case actions.UPDATE_INVESTMENT_SUCCESS:
      return [
        ...state.filter(i => i.investmentId !== action.investment.investmentId),
        Object.assign({}, action.investment)
      ];
      
    default:
      return state;
  }
};
