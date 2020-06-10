import initialState from './initialState';
import * as actions from "../constants/investmentActionTypes";

export const portfolioStatsReducer = (state = initialState.portfolioStats, action) => {
  switch (action.type) {
    case actions.LOAD_INVESTMENTS_SUCCESS:
      return {
        irr: action.portfolioIrr
      }
      
    default:
      return state;
  }
}
