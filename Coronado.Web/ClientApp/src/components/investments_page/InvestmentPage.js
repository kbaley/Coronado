import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Card, CardContent } from '@material-ui/core';
import { MoneyFormat, DecimalFormat, PercentageFormat } from '../common/DecimalFormat';
import { makeStyles } from '@material-ui/core/styles';
import InvestmentApi from '../../api/investmentApi';
import { find } from 'lodash';

const styles = theme => ({
  stats: {
    width: 400,
    fontSize: "15px"
  }
})

const useStyles = makeStyles(styles);
function InvestmentPage({match}) {

  const classes = useStyles();
  const symbol = match.params.symbol;
  const investments = useSelector(state => state.investments);
  const matchingInvestment = find(investments, i => i.symbol === symbol);
  const [investment, setInvestment] = React.useState({investmentId: '', name: '', symbol: ''});

  React.useEffect(() => {
    async function fetchInvestment() {
      const loadedInvestment = await InvestmentApi.getInvestment(matchingInvestment.investmentId);
      setInvestment(loadedInvestment);
    }
    if (matchingInvestment) {
      fetchInvestment();  
    }
  }, [matchingInvestment]);

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
        <Grid item xs={6}><MoneyFormat amount={investment.currentValue} /></Grid>
        <Grid item xs={6}>Total return</Grid>
        <Grid item xs={6}><PercentageFormat isCredit={true} amount={investment.totalReturn} /></Grid>
        <Grid item xs={6}>Annualized return</Grid>
        <Grid item xs={6}><PercentageFormat amount={investment.totalAnnualizedReturn} /></Grid>
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