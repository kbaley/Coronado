import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Currency } from './common/CurrencyFormat';
import * as reportActions from '../actions/reportActions';
import NetWorthGraph from './reports_page/NetWorthGraph';
import moment from 'moment';
import { 
  Table, 
  TableBody, 
  TableRow, 
  TableCell,
  Grid,
  Hidden,
} from '@material-ui/core';
import ExpensesByCategoryChart from './reports_page/ExpensesByCategoryChart';
import IncomeChart from './reports_page/IncomeChart';
import { makeStyles } from '@material-ui/core/styles';
import InvestmentGraph from './reports_page/InvestmentGraph';

const styles = (theme) => ({
  table: {
    '& td': {
      fontWeight: 200,
      fontSize: "1.25em",
      border: 0
    },
    border: 0,
    maxWidth: 550,
    marginBottom: 50,
  },
})

const useStyles = makeStyles(styles);

export default function Home() {
  const dashboardStats = useSelector(state => state.reports.dashboardStats);
  const dispatch = useDispatch();
  const classes = useStyles();

  React.useEffect(() => {
    dispatch(reportActions.loadDashboardStats());
  }, [dispatch]);

  const getGainLossForMonth = (month) => {
    const stats = dashboardStats.investmentGains;
    if (!stats || !stats.length) return Currency(0);
    if (stats.length < month) return Currency(0);

    const today = moment();
    const desiredDate = moment(today).add(0 - month, 'M').startOf('M');
    const statsDate = moment(stats[month].date);

    if (!statsDate.isSame(desiredDate)) return Currency(0);
    return Currency(stats[month].amount);
  }

    var liquidAssets = dashboardStats ? dashboardStats.liquidAssetsBalance : 0;
    var ccTotal = dashboardStats ? dashboardStats.creditCardBalance : 0;

    return (
      <div>
        <h1>Coronado Financial App for Me</h1>
        <Table className={classes.table} size="small">
          <TableBody>
            <TableRow>
              <TableCell>Liquid assets</TableCell>
              <TableCell align="right">{Currency(liquidAssets)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Credit cards</TableCell>
              <TableCell align="right">{Currency(ccTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Investment change this month</TableCell>
              <TableCell align="right">{getGainLossForMonth(0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Investment change last month</TableCell>
              <TableCell align="right">{getGainLossForMonth(1)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Hidden smDown>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <h2>Net worth</h2>
            <NetWorthGraph />
          </Grid>
          <Grid item xs={3}>
            <h2>Expenses</h2>
            <ExpensesByCategoryChart />
          </Grid>
          <Grid item xs={3}>
            <h2>Income</h2>
            <IncomeChart />
          </Grid>
          <Grid item xs={3}>
            <h2>Investments</h2>
            <InvestmentGraph />
          </Grid>
        </Grid>
        </Hidden>
      </div>
    )
}
