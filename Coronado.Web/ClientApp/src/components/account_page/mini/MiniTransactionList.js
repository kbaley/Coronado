import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Grid } from '@material-ui/core';
import Spinner from '../../common/Spinner';
import MiniTransactionRow from './MiniTransactionRow';
import { groupBy, map, orderBy } from 'lodash';
import { SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import { DeleteIcon } from './icons';
import * as transactionActions from '../../../actions/transactionActions';

const styles = theme => ({
  date: {
    padding: 6,
    backgroundColor: "#eee",
  },
  listItem: {
    backgroundColor: "red",
    color: "white",
    flex: 1,
    height: "100%",
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
  },
  listItemContent: {
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    fontWeight: 100,
    fontSize: "14px",
    width: "64px",
    maxWidth: "64px",
    textAlign: "center",
    padding: "4px",
    paddingTop: "8px",
  },
  icon: {
    fill: "white",
    width: 32,
    height: 32,
    marginTop: -4,
  },
})

const useStyles = makeStyles(styles);

function DateTransactionList({ transactions }) {

  const classes = useStyles();
  const dispatch = useDispatch();
  const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const swipeRightOptions = (trx) => ({
    content: (
      <div className={classes.listItem}>
        <div className={classes.listItemContent}>
          <span className={classes.icon}><DeleteIcon /></span>
        </div>
      </div>
    ),
    action: () => deleteTransaction(trx.transactionId)
  });

  const deleteTransaction = (transactionId) => {
    dispatch(transactionActions.deleteTransaction(transactionId));
  }

  return (
    <React.Fragment>
      <Grid item
        xs={12}
        className={classes.date}
      >
        {new Date(transactions.date).toLocaleDateString("en-US", formatOptions)}
      </Grid>
      {transactions.items.map(trx =>
        <SwipeableListItem
          key={trx.transactionId}
          threshold={0.25}
          swipeRight={swipeRightOptions(trx)}
        >
          <MiniTransactionRow transaction={trx} />
        </SwipeableListItem>
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