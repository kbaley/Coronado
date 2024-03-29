import initialState from './initialState';
import { cloneDeep, concat, filter, orderBy, forEachRight, forEach } from 'lodash'; 
import * as actions from "../constants/transactionActionTypes.js";

function computeRunningTotal(transactions, startingBalance) {
  const sorted = orderBy(transactions, ['transactionDate', 'enteredDate'], ['desc', 'desc']);
  let total = startingBalance ? startingBalance : 0;
  forEachRight(sorted, (value) => {
    total += (value.credit - value.debit);
    total = Math.round((total + Number.EPSILON) * 100) / 100;
    value.runningTotal = total;
  });
  return sorted;
}

export const transactionReducer = (state = initialState.transactionModel, action, selectedAccount) => {

  let transactions;
  switch (action.type) {
    
    case actions.LOAD_TRANSACTIONS_SUCCESS:
      return {
        transactions: action.transactions,
        startingBalance: action.startingBalance,
        remainingTransactionCount: action.remainingTransactionCount
      }

    case actions.UPLOAD_QIF_SUCCESS:
      forEach(action.transactions, (trx) => {
        trx.isEditing = true;
      });
      transactions = concat(cloneDeep(state.transactions), cloneDeep(action.transactions));
      
      return {
        ...state,
        transactions: computeRunningTotal(transactions, state.startingBalance)
      }

    case actions.DELETE_TRANSACTION_SUCCESS:
      transactions = cloneDeep(state.transactions); 
      transactions = computeRunningTotal(filter(transactions, t => {return t.transactionId !== action.transaction.transactionId}), state.startingBalance)
      return {
        ...state,
        transactions: transactions,
      }

    case actions.CREATE_TRANSACTION_SUCCESS:
      transactions = concat(cloneDeep(state.transactions), cloneDeep(action.transactions.filter(t => t.accountId === selectedAccount)));
      
      return {
        ...state,
        transactions: computeRunningTotal(transactions, state.startingBalance)
      }

    case actions.UPDATE_TRANSACTION_SUCCESS:
      transactions = state.transactions.filter(t => t.transactionId !== action.transaction.transactionId);
      transactions = concat(transactions, Object.assign({}, action.transaction));
      return {
        ...state,
        transactions: computeRunningTotal(transactions, state.startingBalance)
      }

    default:
      return state;
  }
};
