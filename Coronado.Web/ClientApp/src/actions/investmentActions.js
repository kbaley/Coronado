import * as types from '../constants/investmentActionTypes';
import * as transactionTypes from '../constants/transactionActionTypes';
import InvestmentApi from '../api/investmentApi';
import { info } from 'react-notification-system-redux';
import handleApiCall, { handleResponse } from './responseHandler';

export function loadInvestmentsSuccess(loadInvestmentsResult) {
  return { type: types.LOAD_INVESTMENTS_SUCCESS, ...loadInvestmentsResult };
}

export function loadInvestmentsAction() {
  return { type: types.LOAD_INVESTMENTS };
}

export function purchaseInvestmentSuccess(investment) {
  return { type: types.PURCHASE_INVESTMENT_SUCCESS, ...investment };
}

export function updateInvestmentSuccess(investment) {
  return { type: types.UPDATE_INVESTMENT_SUCCESS, ...investment };
}

export function makeCorrectingEntriesSuccess(correctingEntryModel) {
  return { type: transactionTypes.CREATE_TRANSACTION_SUCCESS, ...correctingEntryModel };
}

export const loadInvestments = () => {
  return async (dispatch) => {
    if (!localStorage.getItem('coronado-user')) return;
    dispatch(loadInvestmentsAction());
    await handleApiCall(dispatch, async () => await InvestmentApi.getAllInvestments(), loadInvestmentsSuccess);
  };
}

export const getLatestPrices = () => {
  return async (dispatch) => {
    const response = await InvestmentApi.getLatestPrices();
    await handleResponse(dispatch, response,
      async () => {
        const updatedInvestments = await response.json();
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
      });
  }
}

export const makeCorrectingEntries = () => {
  return async (dispatch) => {
    const response = await InvestmentApi.makeCorrectingEntries();
    await handleResponse(dispatch, response,
      async () => {
        const correctingEntryModel = await response.json();
        if (correctingEntryModel && correctingEntryModel !== "") {

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
      });
  }
}

export const updateInvestment = (investment) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async() => InvestmentApi.updateInvestment(investment), updateInvestmentSuccess);
  }
}

export const buySellInvestment = (investment) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async() => InvestmentApi.buySellInvestment(investment), updateInvestmentSuccess);
  }
}

export const recordDividend = (investment) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async() => InvestmentApi.recordDividend(investment), updateInvestmentSuccess);
  }
}

export const saveTodaysPrices = (investments) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async() => InvestmentApi.saveTodaysPrices(investments), loadInvestmentsSuccess);
  }
}

export const purchaseInvestment = (investment) => {
  return async (dispatch) => {
    await handleApiCall(dispatch, async() => InvestmentApi.purchaseInvestment(investment), purchaseInvestmentSuccess);
  }
}

export const deleteInvestment = (investmentId, investmentName) => {
  return async function (dispatch, getState) {
    const notificationOpts = {
      message: 'Investment ' + investmentName + ' deleted',
      position: 'bl',
      onRemove: () => { deleteInvestmentForReal(investmentId, getState().deletedInvestments, dispatch) },
      action: {
        label: 'Undo',
        callback: () => { dispatch({ type: types.UNDO_DELETE_INVESTMENT, investmentId }) }
      }
    };
    dispatch({ type: types.DELETE_INVESTMENT, investmentId });
    dispatch(info(notificationOpts));
  }
}

async function deleteInvestmentForReal(investmentId, deletedInvestments, dispatch) {
  if (deletedInvestments.some(i => i.investmentId === investmentId)) {
    await handleApiCall(dispatch, async() => await InvestmentApi.deleteInvestment(investmentId));
  }
}
