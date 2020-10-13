import React from 'react';
import * as transactionActions from '../../actions/transactionActions';
import { useDispatch, useSelector } from 'react-redux';
import TransactionRow from './TransactionRow';
import NewTransactionRow from './NewTransactionRow';
import { Grid } from '@material-ui/core';
import Spinner from '../common/Spinner';
import GridHeader from '../common/grid/GridHeader';
import * as widths from './TransactionWidths';

export default function TransactionList(props) {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactionModel.transactions);
  const isLoading = useSelector(state => state.loading.transactions);

  const deleteTransaction = (transactionId) => {
    dispatch(transactionActions.deleteTransaction(transactionId));
  }

  return (
    <Grid container spacing={0}>
      <GridHeader xs={widths.ICON_WIDTH}></GridHeader>
      <GridHeader xs={widths.DATE_WIDTH}>Date</GridHeader>
      <GridHeader xs={widths.VENDOR_WIDTH}>Vendor</GridHeader>
      <GridHeader xs={widths.CATEGORY_WIDTH}>Category</GridHeader>
      <GridHeader xs={widths.DESCRIPTION_WIDTH}>Description</GridHeader>
      <GridHeader xs={widths.DEBIT_WIDTH}>Debit</GridHeader>
      <GridHeader xs={widths.CREDIT_WIDTH}>Credit</GridHeader>
      <GridHeader xs={widths.BALANCE_WIDTH}></GridHeader>
      <NewTransactionRow
        account={props.account} />
      { isLoading ? <Grid item xs={12}><Spinner /></Grid> :
        transactions.map(trx =>
          <TransactionRow key={trx.transactionId} transaction={trx}
            onDelete={() => deleteTransaction(trx.transactionId)} />
        )
      }
    </Grid>
  );
}