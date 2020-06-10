import * as types from '../constants/investmentActionTypes';
import * as transactionTypes from '../constants/transactionActionTypes';
import InvestmentApi from '../api/investmentApi';
import { info } from 'react-notification-system-redux';
import { authHeader } from '../api/auth-header';

export function loadInvestmentsSuccess(loadInvestmentsResult) {
  return {type: types.LOAD_INVESTMENTS_SUCCESS, ...loadInvestmentsResult};
}

export function loadInvestmentsAction() {
  return {type: types.LOAD_INVESTMENTS};
}

export function purchaseInvestmentSuccess(investment) {
  return {type: types.PURCHASE_INVESTMENT_SUCCESS, ...investment};
}

export function updateInvestmentSuccess(investment) {
  return {type: types.UPDATE_INVESTMENT_SUCCESS, ...investment};
}

export function makeCorrectingEntriesSuccess(correctingEntryModel) {
  return {type: transactionTypes.CREATE_TRANSACTION_SUCCESS, ...correctingEntryModel};
}

export const loadInvestments = () => {
  return async (dispatch) => {
    dispatch(loadInvestmentsAction());
    const investments = await InvestmentApi.getAllInvestments();
    dispatch(loadInvestmentsSuccess(investments));
  };
}

export const getLatestPrices = () => {
  return async (dispatch) => {
    const updatedInvestments = await InvestmentApi.getLatestPrices();
    if (updatedInvestments) {
      let message = 'Investments updated to latest prices.';
      if (updatedInvestments.investments.length === 0)
        message = 'Investments have been updated already for today. No changes made.'
      else
        dispatch(loadInvestmentsSuccess(updatedInvestments));
      const notificationOpts = {
        message: message,
        position: 'bl',
        level: 'success',
        autoDismiss: 5,
        dismissible: 'click',
        title: 'Prices updated'
      };
      dispatch(info(notificationOpts));
    } else {

      const notificationOpts = {
        message: 'Something went wrong updating the prices',
        position: 'bl',
        level: 'warning',
        autoDismiss: 5,
        dismissible: 'click',
        title: 'Something went wrong'
      };
      dispatch(info(notificationOpts));
    }
  }
}

export const makeCorrectingEntries = () => {
  return async (dispatch) => {
    const correctingEntryModel = await InvestmentApi.makeCorrectingEntries();
    if (correctingEntryModel && correctingEntryModel !== "")
    {

      const notificationOpts = {
        message: 'The entry to sync the investments with the investment account has been created',
        position: 'bl',
        level: 'success',
        autoDismiss: 5,
        dismissible: 'click',
        title: 'Adjusting entry created'
      };
      dispatch(info(notificationOpts));
      dispatch(makeCorrectingEntriesSuccess(correctingEntryModel));
    } else {
      const notificationOpts = {
        message: 'Either no entry is necessary or no investment account was found.',
        position: 'bl',
        level: 'warning',
        autoDismiss: 5,
        dismissible: 'click',
        title: 'No entry created'
      };
      dispatch(info(notificationOpts));
    }
  }
}

export const updateInvestment = (investment) => {
  return async (dispatch) => {
    const updatedInvestment = await InvestmentApi.updateInvestment(investment);
    dispatch(updateInvestmentSuccess(updatedInvestment));
  }
}

export const buySellInvestment = (investment) => {
  return async (dispatch) => {
    const updatedInvestment = await InvestmentApi.buySellInvestment(investment);
    dispatch(updateInvestmentSuccess(updatedInvestment));
  }
}

export const saveTodaysPrices = (investments) => {
  return async (dispatch) => {
    const updatedInvestments = await InvestmentApi.saveTodaysPrices(investments);
    dispatch(loadInvestmentsSuccess(updatedInvestments));
  }
}

export const updatePriceHistory = (investment, prices) => {
  return async (dispatch) => {
    const updatedInvestment = await InvestmentApi.updatePriceHistory(investment, prices);
    dispatch(updateInvestmentSuccess(updatedInvestment));
  }
}

export const purchaseInvestment = (investment) => {
  return async (dispatch) => {
    const newInvestment = await InvestmentApi.purchaseInvestment(investment);
    dispatch(purchaseInvestmentSuccess(newInvestment));
  }
}

export const deleteInvestment = (investmentId, investmentName) => {
  return async function(dispatch, getState) {
    const notificationOpts = {
      message: 'Investment ' + investmentName + ' deleted',
      position: 'bl',
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
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}
