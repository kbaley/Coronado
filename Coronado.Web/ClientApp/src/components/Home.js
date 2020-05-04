import React from 'react';
import { connect } from 'react-redux';
import { sumBy, filter } from 'lodash';
import { Currency } from './common/CurrencyFormat';
import * as reportActions from '../actions/reportActions';
import { bindActionCreators } from 'redux';
import NetWorthReport from './reports_page/NetWorthReport';
import moment from 'moment';
import { withStyles, Table, TableBody, TableRow, TableCell } from '@material-ui/core';

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
        <h2>Coronado Financial App for Me</h2>
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
        <NetWorthReport />
      </div>
  )}
} 

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    dashboardStats: state.reports.dashboardStats,
    isLoadingData: state.loading ? state.loading.accounts : true
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
