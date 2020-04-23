import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { sumBy, filter } from 'lodash';
import { Currency } from './common/CurrencyFormat';
import * as reportActions from '../actions/reportActions';
import { bindActionCreators } from 'redux';
import NetWorthReport from './reports_page/NetWorthReport';
import moment from 'moment';

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
    var bankAccounts = filter(this.props.accounts, a => a.accountType === 'Bank Account' || a.accountType === 'Cash');
    var creditCards = filter(this.props.accounts, a => a.accountType === 'Credit Card');
    var liquidAssets = sumBy(bankAccounts, a => a.currentBalance);
    var ccTotal = sumBy(creditCards, c => c.currentBalance);
    
    return (
      <div>
        <h2>Coronado Financial App for Me</h2>
        <Row>
          <Col sm={3}>
            <h5>Liquid assets</h5>   
            <h5>Credit cards</h5>
            <h5>Investment Gain/Loss this month</h5>
            <h5>Investment Gain/Loss last month</h5>
            <br/>
            <br/>
            <NetWorthReport />
          </Col>
          <Col sm={2}>
            <h5 style={{textAlign: "right"}}>{Currency(liquidAssets)}</h5>
            <h5 style={{textAlign: "right"}}>{Currency(ccTotal)}</h5>
            <h5 style={{textAlign: "right"}}>{this.getGainLossForMonth(0)}</h5>
            <h5 style={{textAlign: "right"}}>{this.getGainLossForMonth(1)}</h5>
          </Col>
          <Col sm={7}></Col>
        </Row>
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
)(Home);
