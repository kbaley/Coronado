import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import DateFormat from '../common/DateFormat';
import { sumBy } from 'lodash';

function Header({ children }) {
  return (
    <Typography
      variant="h6"
    >{children}</Typography>
  );
}

export default function InvestmentDividendList({ investment }) {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Dividends</Typography>
      </Grid>
      <Grid item xs={3}><Header>Date</Header></Grid>
      <Grid item xs={3}><Header>Amount</Header></Grid>
      <Grid item xs={3}><Header>Tax</Header></Grid>
      <Grid item xs={3}><Header>Total</Header></Grid>
      {investment.dividends && investment.dividends.map((t, index) =>
        <React.Fragment key={index}>
          <Grid item xs={3}>{DateFormat(t.date)}</Grid>
            <Grid item xs={3}>{t.amount.toFixed(2)}</Grid>
          <Grid item xs={3}>{t.incomeTax.toFixed(2)}</Grid>
          <Grid item xs={3}>{t.total.toFixed(2)}</Grid>
        </React.Fragment>
      )}
      <Grid item xs={3}><Header>Total</Header></Grid>
      <Grid item xs={3}>{sumBy(investment.dividends, d => d.amount).toFixed(2)}</Grid>
      <Grid item xs={3}>{sumBy(investment.dividends, d => d.incomeTax).toFixed(2)}</Grid>
      <Grid item xs={3}>{sumBy(investment.dividends, d => d.total).toFixed(2)}</Grid>
    </Grid>
  );
}
