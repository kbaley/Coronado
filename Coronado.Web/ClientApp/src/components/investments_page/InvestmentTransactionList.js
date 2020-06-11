import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { MoneyFormat } from '../common/DecimalFormat';
import DateFormat from '../common/DateFormat';

function Header({ children }) {
  return (
    <Typography
      variant="h6"
    >{children}</Typography>
  );
}
export default function InvestmentTransactionList({ investment }) {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Transactions</Typography>
      </Grid>
      <Grid item xs={2}><Header>Date</Header></Grid>
      <Grid item xs={4}><Header>Account</Header></Grid>
      <Grid item xs={2}><Header>Shares</Header></Grid>
      <Grid item xs={2}><Header>Price</Header></Grid>
      <Grid item xs={2}><Header>Total</Header></Grid>
      {investment.transactions && investment.transactions.map((t, index) =>
        <React.Fragment key={t.investmentTransactionId}>
          <Grid item xs={2}>{DateFormat(t.date)}</Grid>
          <Grid item xs={4}>{t.sourceAccountName}</Grid>
          <Grid item xs={2}>{t.shares}</Grid>
          <Grid item xs={2}>{t.price.toFixed(4)}</Grid>
          <Grid item xs={2}>
            <MoneyFormat amount={(t.shares * t.price).toFixed(2)} />
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );
}
