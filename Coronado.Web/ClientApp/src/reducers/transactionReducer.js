import initialState from './initialState';
import { cloneDeep, concat, filter, orderBy, forEachRight, last } from 'lodash'; 
import * as actions from "../constants/transactionActionTypes.js";

function computeRunningTotal(transactions) {
  var sorted = orderBy(transactions, ['transactionDate', 'enteredDate'], ['desc', 'desc']);
  var lastTransaction = last(sorted);
  var total = lastTransaction.runningTotal - lastTransaction.credit + lastTransaction.debit;
  forEachRight(sorted, (value) => {
    total += (value.credit - value.debit);
    value.runningTotal = total;
  });
  return sorted;
}

export const transactionReducer = (state = initialState.transactions, action, selectedAccount) => {

  let transactions;
  switch (action.type) {
    
    case actions.LOAD_TRANSACTIONS_SUCCESS:
      transactions = computeRunningTotal(action.transactions);
      return transactions;

    case actions.DELETE_TRANSACTION_SUCCESS:
      return computeRunningTotal(filter(state, t => {return t.transactionId !== action.transaction.transactionId}));

    case actions.CREATE_TRANSACTION_SUCCESS:
      transactions = concat(cloneDeep(state), cloneDeep(action.transactions.filter(t => t.accountId === selectedAccount)));
      
      return computeRunningTotal(transactions)

    case actions.UPDATE_TRANSACTION_SUCCESS:
      transactions = state.filter(t => t.transactionId !== action.transaction.transactionId);
      transactions = concat(transactions, Object.assign({}, action.transaction));
      return computeRunningTotal(transactions);

    default:
      return state;
  }
};
