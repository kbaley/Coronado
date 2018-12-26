import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { sumBy, filter } from 'lodash';
import { Currency } from './common/CurrencyFormat';
import NetWorthReport from './reports_page/NetWorthReport';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  componentDidUpdate() {

  }

  render() {
    console.log(this.props.accounts);
    var bankAccounts = filter(this.props.accounts, a => a.accountType === 'Bank Account' || a.accountType === 'Cash');
    var creditCards = filter(this.props.accounts, a => a.accountType === 'Credit Card');
    var mortgages = filter(this.props.accounts, a => a.accountType === 'Mortgage');
    var liquidAssets = sumBy(bankAccounts, a => a.currentBalance);
    var ccTotal = sumBy(creditCards, c => c.currentBalance);
    var mortgageTotal = sumBy(mortgages, m => m.currentBalance);
    return (
      <div>
        <h1>Coronado Financial App for Me</h1>
        <Row>
          <Col sm={3}>
            <h4>Liquid assets</h4>   
            <h4>Credit cards</h4>
            <h4>Mortgages</h4>
            <h4>Investment Gain/Loss this month</h4>
            <h4>Investment Gain/Loss last month</h4>
            <br/>
            <br/>
            <NetWorthReport />
          </Col>
          <Col sm={2}>
            <h4 style={{textAlign: "right"}}>{Currency(liquidAssets)}</h4>
            <h4 style={{textAlign: "right"}}>{Currency(ccTotal)}</h4>
            <h4 style={{textAlign: "right"}}>{Currency(mortgageTotal)}</h4>
          </Col>
          <Col sm={7}></Col>
        </Row>
      </div>
  )}
} 

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    isLoadingData: state.loading ? state.loading.accounts : true
  }
}

export default connect(
  mapStateToProps
)(Home);
