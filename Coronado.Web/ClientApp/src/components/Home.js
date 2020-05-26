import React from 'react';
import { connect } from 'react-redux';
import { sumBy, filter } from 'lodash';
import { Currency } from './common/CurrencyFormat';
import * as reportActions from '../actions/reportActions';
import { bindActionCreators } from 'redux';
import NetWorthGraph from './reports_page/NetWorthGraph';
import moment from 'moment';
import { 
  withStyles, 
  Table, 
  TableBody, 
  TableRow, 
  TableCell,
  Grid,
  Typography,
} from '@material-ui/core';
import ExpensesByCategoryChart from './reports_page/ExpensesByCategoryChart';
import IncomeChart from './reports_page/IncomeChart';

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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.getGainLossForMonth = this.getGainLossForMonth.bind(this);
    this.state = {
    }
  }

  componentDidMount() {
    this.props.actions.loadDashboardStats();
  }

  getGainLossForMonth(month) {
    const stats = this.props.dashboardStats;
    if (!stats || !stats.length) return Currency(0);
    if (stats.length < month) return Currency(0);

    const today = moment();
    const desiredDate = moment(today).add(0 - month, 'M').startOf('M');
    const statsDate = moment(stats[month].date);

    if (!statsDate.isSame(desiredDate)) return Currency(0);
    return Currency(stats[month].amount);
  }

  render() {
    const { classes } = this.props;
    var bankAccounts = filter(this.props.accounts, a => a.accountType === 'Bank Account' || a.accountType === 'Cash');
    var creditCards = filter(this.props.accounts, a => a.accountType === 'Credit Card');
    var liquidAssets = sumBy(bankAccounts, a => a.currentBalance);
    var ccTotal = sumBy(creditCards, c => c.currentBalance);

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
              <TableCell align="right">{this.getGainLossForMonth(0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Investment change last month</TableCell>
              <TableCell align="right">{this.getGainLossForMonth(1)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <h2>Net worth</h2>
            <NetWorthGraph />
          </Grid>
          <Grid item xs={4}>
            <h2>Expenses</h2>
            <ExpensesByCategoryChart />
          </Grid>
          <Grid item xs={4}>
            <h2>Income</h2>
            <IncomeChart />
          </Grid>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    dashboardStats: state.reports.dashboardStats,
    isLoadingData: state.loading ? state.loading.accounts : true,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(reportActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
