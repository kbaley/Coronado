import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Grid } from '@material-ui/core';
import Spinner from '../../common/Spinner';
import MiniTransactionRow from './MiniTransactionRow';
import { groupBy, map, orderBy } from 'lodash';

const styles = theme => ({
  date: {
    padding: 6,
    backgroundColor: "#eee",
  }
})

const useStyles = makeStyles(styles);

function DateTransactionList({ transactions }) {

  const classes = useStyles();
  const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return (
    <React.Fragment>
      <Grid item 
        xs={12} 
        className={classes.date}
      >
        {new Date(transactions.date).toLocaleDateString("en-US", formatOptions)}
      </Grid>
      {transactions.items.map(trx =>
        <MiniTransactionRow key={trx.transactionId} transaction={trx} />
      )}
    </React.Fragment>
  )
}

export default function MiniTransactionList() {
  const transactions = useSelector(state => state.transactionModel.transactions);
  const grouped = groupBy(transactions, "transactionDate");
  const mapped = map(grouped, (items, transactionDate) => ({
    date: transactionDate,
    items: items,
  }));
  const sorted = orderBy(mapped, 'date', 'desc');
  const isLoading = useSelector(state => state.loading.transactions);

  return (
    <React.Fragment>
      <Grid container spacing={0}>
        {isLoading ? <Grid item xs={12}><Spinner /></Grid> :
          sorted.map(trx =>
            <DateTransactionList key={trx.date} transactions={trx} />
          )
        }
      </Grid>
    </React.Fragment>
  );
}