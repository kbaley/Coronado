import * as types from '../constants/investmentActionTypes';
import InvestmentApi from '../api/investmentApi';
import { info } from 'react-notification-system-redux';

export function loadInvestmentsSuccess(investments) {
  return {type: types.LOAD_INVESTMENTS_SUCCESS, investments};
}

export function loadInvestmentsAction() {
  return {type: types.LOAD_INVESTMENTS};
}

export function createInvestmentSuccess(investment) {
  return {type: types.CREATE_INVESTMENT_SUCCESS, investment};
}

export function updateInvestmentSuccess(investment) {
  return {type: types.UPDATE_INVESTMENT_SUCCESS, investment};
}

export function makeCorrectingEntriesSuccess(transactions) {
  return {type: types.MAKE_CORRECTING_ENTRIES_SUCCESS, transactions};
}

export const loadInvestments = () => {
  return async (dispatch) => {
    dispatch(loadInvestmentsAction());
    const investments = await InvestmentApi.getAllInvestments();
    dispatch(loadInvestmentsSuccess(investments));
  };
}

export const makeCorrectingEntries = () => {
  return async (dispatch) => {
    const transactions = await InvestmentApi.makeCorrectingEntries();
    dispatch(makeCorrectingEntriesSuccess(transactions));
  }
}

export const updateInvestment = (investment) => {
  return async (dispatch) => {
    const updatedInvestment = await InvestmentApi.updateInvestment(investment);
    dispatch(updateInvestmentSuccess(updatedInvestment));
  }
}

export const createInvestment = (investment) => {
  return async (dispatch) => {
    const newInvestment = await InvestmentApi.createInvestment(investment);
    dispatch(createInvestmentSuccess(newInvestment));
  }
}

export const deleteInvestment = (investmentId, investmentName) => {
  return async function(dispatch, getState) {
    const notificationOpts = {
      message: 'Investment ' + investmentName + ' deleted',
      position: 'br',
      onRemove: () => { deleteInvestmentForReal(investmentId, getState().deletedInvestments) },
      action: {
        label: 'Undo',
        callback: () => {dispatch({type: types.UNDO_DELETE_INVESTMENT, investmentId })}
      }
    };
    dispatch( { type: types.DELETE_INVESTMENT, investmentId } );
    dispatch(info(notificationOpts));
  }
}

async function deleteInvestmentForReal(investmentId, deletedInvestments) {
  if (deletedInvestments.some(i => i.investmentId === investmentId)) {
    await fetch('/api/Investments/' + investmentId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}
