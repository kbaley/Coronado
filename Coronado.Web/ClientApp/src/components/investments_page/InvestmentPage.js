import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InvestmentApi from '../../api/investmentApi';
import { find } from 'lodash';
import InvestmentStats from './InvestmentStats';
import InvestmentTransactionList from './InvestmentTransactionList';

const styles = theme => ({
  stats: {
    width: 400,
    fontSize: "15px",
    margin: 10,
  },
  transactionList: {
    width: 600,
    fontSize: "15px",
    margin: 10,
  }
})

const useStyles = makeStyles(styles);

export default function InvestmentPage({ match }) {

  const classes = useStyles();
  const symbol = match.params.symbol;
  const investments = useSelector(state => state.investments);
  const matchingInvestment = find(investments, i => i.symbol === symbol);
  const [investment, setInvestment] = React.useState({ investmentId: '', name: '', symbol: '' });

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
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card className={classes.stats}>
            <CardContent>
              <InvestmentStats investment={investment} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card className={classes.transactionList}>
            <CardContent>
              <InvestmentTransactionList investment={investment} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <br /><br />
      <div>Price history graph</div>
    </div>
  );
}
