import React from 'react';
import { Grid, } from '@material-ui/core';
import { MoneyFormat, PercentageFormat } from '../common/DecimalFormat';

export default function InvestmentStats({ investment }) {
  return (
          <Grid container spacing={2}>
            <Grid item xs={6}>Shares</Grid>
            <Grid item xs={6}><MoneyFormat amount={investment.shares} /></Grid>
            <Grid item xs={6}>Average price paid</Grid>
            <Grid item xs={6}><MoneyFormat amount={investment.averagePrice} /></Grid>
            <Grid item xs={6}>Last price (date)</Grid>
            <Grid item xs={6}><MoneyFormat amount={investment.lastPrice} /></Grid>
            <Grid item xs={6}>Value</Grid>
            <Grid item xs={6}><MoneyFormat amount={investment.currentValue} /></Grid>
            <Grid item xs={6}>Book value</Grid>
            <Grid item xs={6}><MoneyFormat amount={investment.bookValue} /></Grid>
            <Grid item xs={6}>Total gain</Grid>
            <Grid item xs={6}><MoneyFormat amount={investment.currentValue - investment.bookValue} /></Grid>
            <Grid item xs={6}>Total return</Grid>
            <Grid item xs={6}><PercentageFormat isCredit={true} amount={investment.totalReturn} /></Grid>
            <Grid item xs={6}>Annualized return</Grid>
            <Grid item xs={6}><PercentageFormat amount={investment.totalAnnualizedReturn} /></Grid>
          </Grid>
  );
}
