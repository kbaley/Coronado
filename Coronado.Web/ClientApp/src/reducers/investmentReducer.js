import initialState from './initialState';
import * as actions from "../constants/investmentActionTypes";
import { cloneDeep, find, findIndex } from 'lodash';

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
      
    case actions.PURCHASE_INVESTMENT_SUCCESS:
      const investments = cloneDeep(state);
      const index = findIndex(investments, i => i.investmentId === action.investment.investmentId);
      if (index > -1) {
        investments.splice(index, 1, action.investment);
        return investments;
      } else {
        return [
          ...state,
          Object.assign({}, action.investment),
        ];
      }
      
    case actions.UPDATE_INVESTMENT_SUCCESS:
      return [
        ...state.filter(i => i.investmentId !== action.investment.investmentId),
        Object.assign({}, action.investment)
      ];
      
    default:
      return state;
  }
};
