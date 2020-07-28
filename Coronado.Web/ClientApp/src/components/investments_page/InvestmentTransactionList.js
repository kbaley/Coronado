import React from 'react';
import { Grid, Typography, Hidden, Divider } from '@material-ui/core';
import { MoneyFormat } from '../common/DecimalFormat';
import DateFormat from '../common/DateFormat';
import { makeStyles } from '@material-ui/core/styles';

const styles = theme => ({
  accountName: {
    color: theme.palette.gray[6],
    padding: 0,
    borderBottom: "1px solid",
  }
})

function Header({ children }) {
  return (
    <Typography
      variant="h6"
    >{children}</Typography>
  );
}

const useStyles = makeStyles(styles);

export default function InvestmentTransactionList({ investment }) {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Transactions</Typography>
      </Grid>
      <Grid item xs={3} md={2}><Header>Date</Header></Grid>
      <Hidden smDown>
        <Grid item md={4}><Header>Account</Header></Grid>
      </Hidden>
      <Grid item xs={3} md={2}><Header>Shares</Header></Grid>
      <Grid item xs={3} md={2}><Header>Price</Header></Grid>
      <Grid item xs={3} md={2}><Header>Total</Header></Grid>
      {investment.transactions && investment.transactions.map((t, index) =>
        <React.Fragment key={t.investmentTransactionId}>
          <Grid item xs={3} md={2}>{DateFormat(t.date)}</Grid>
          <Hidden smDown>
            <Grid item md={4}>{t.sourceAccountName}</Grid>
          </Hidden>
          <Grid item xs={3} md={2}>{t.shares}</Grid>
          <Grid item xs={3} md={2}>{t.price.toFixed(4)}</Grid>
          <Grid item xs={3} md={2}>
            <MoneyFormat amount={(t.shares * t.price).toFixed(2)} />
          </Grid>
          <Hidden mdUp>
            <Grid item xs={1} className={classes.accountName}></Grid>
            <Grid item xs={11} className={classes.accountName}>{t.sourceAccountName}</Grid>
            <Divider light />
          </Hidden>
        </React.Fragment>
      )}
    </Grid>
  );
}
