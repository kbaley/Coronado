import React from 'react';
import { CurrencyFormat } from '../common/CurrencyFormat';
import {
  makeStyles,
  Grid,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { filter, sumBy } from 'lodash';

const styles = (theme) => ({
  header: {
    ...theme.table.head,
  },
  row: {
    ...theme.table.body,
  },
  right: {
    textAlign: "right",
  },
  report: {
    maxWidth: 450,
  },
});

const useStyles = makeStyles(styles);

export default function NetWorthBreakdown() {

  const accounts = useSelector(state => state.showAllAccounts ? state.accounts : filter(state.accounts, a => !a.isHidden));
  const netWorth = sumBy(accounts, a => a.currentBalanceInUsd);

  const classes = useStyles();
  return (
    <Grid container spacing={0} className={classes.report}>
      <Grid item xs={6} className={classes.header}>Account</Grid>
      <Grid item xs={6} className={classes.header + " " + classes.right}>Amount</Grid>
      {accounts.map((a, index) => {
          return (
            <React.Fragment key={index}>
              <Grid item xs={6} className={classes.row}>
                {a.name}
              </Grid>
              <Grid item xs={6} className={classes.row}>
                <CurrencyFormat value={a.currentBalanceInUsd} />
              </Grid>
            </React.Fragment>
          )
      })}
      <Grid item xs={12} className={classes.header + " " + classes.right}>
        <CurrencyFormat value={netWorth} />
      </Grid>
    </Grid>
  );
}
