import React from 'react';
import { useSelector } from 'react-redux';
import { find } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Table, TableRow, Grid, Card, CardContent } from '@material-ui/core';
import { MoneyFormat } from '../common/DecimalFormat';
import { makeStyles } from '@material-ui/core/styles';

const styles = theme => ({
  stats: {
    width: 400,
    fontSize: "15px"
  }
})

const useStyles = makeStyles(styles);
function InvestmentPage({match}) {

  const classes = useStyles();
  const investments = useSelector(state => state.investments);
  const investment = find(investments, i => i.symbol === match.params.symbol) || { name: ''};

  console.log(investment);

  return (
    <div>
      <h1>
        {investment.name} ({investment.symbol})
      </h1>
      <Card className={classes.stats}>
        <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={6}>Shares</Grid>
        <Grid item xs={6}><MoneyFormat amount={investment.shares} /></Grid>
        <Grid item xs={6}>Average price paid</Grid>
        <Grid item xs={6}><MoneyFormat amount={investment.averagePrice} /></Grid>
        <Grid item xs={6}>Last price (date)</Grid>
        <Grid item xs={6}><MoneyFormat amount={investment.lastPrice} /></Grid>
        <Grid item xs={6}>Value</Grid>
        <Grid item xs={6}><MoneyFormat amount={investment.lastPrice * investment.shares} /></Grid>
      </Grid>
      </CardContent>
      </Card>
      <br/><br/>
      <div>Price history graph</div>
      <div>Price history list</div>
      <div>Performance this year</div>
      <div>Performance in total</div>
    </div>
  );
}

export default withRouter(InvestmentPage);