import initialState from './initialState';
import * as actions from "../constants/investmentActionTypes.js";
import { cloneDeep, find } from 'lodash';

export const deletedInvestmentReducer = (state = initialState.deletedInvestments, action, investments) => {
  
  switch (action.type) {
    case actions.DELETE_INVESTMENT:
      return [
        ...state,
        Object.assign({}, find(investments, i => i.investmentId === action.investmentId))
      ];
    case actions.UNDO_DELETE_INVESTMENT:
      return [
        cloneDeep(state.filter(el => el.investmentId !== action.investmentId))
      ];
    default:
      return state;
  }
};
