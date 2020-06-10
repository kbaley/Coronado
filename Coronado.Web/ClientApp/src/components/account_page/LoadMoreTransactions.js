import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import * as transactionActions from '../../actions/transactionActions';

export default function LoadMoreTransactions() {
  const remainingTransactionCount = useSelector(state => state.transactionModel.remainingTransactionCount);
  const selectedAccount = useSelector(state => state.selectedAccount);
  const dispatch = useDispatch();

  const loadMore = () => {
    dispatch(transactionActions.loadAllTransactions(selectedAccount));
  }

    return (
      <div style={{"margin": "15px 15px 40px 15px"}}>
        <Button onClick={loadMore}>Load {remainingTransactionCount} more transactions</Button>
      </div>
    );
}
