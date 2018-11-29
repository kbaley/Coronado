import React, { Component } from 'react';
import { Nav, NavItem, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import * as accountActions from '../actions/accountActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';
import './AccountNavList.css'
import { CurrencyFormat } from './common/CurrencyFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from './common/Spinner';

class AccountNavList extends Component {
  displayName = AccountNavList.name;

  constructor(props) {
    super(props);
    this.goToAccount = this.goToAccount.bind(this);
    this.state = { isLoading: true };
  }

  componentDidUpdate() {

    if (this.state.isLoading && this.props.accounts && this.props.accounts.length > 0) {
      for (var i = 0; i < this.props.accounts.length; i++) {
        if (i < 10) {
          Mousetrap.bind('g ' + (i+1), this.goToAccount);
        }
      }
      this.setState({isLoading: false});
    }
  }

  componentWillUnmount() {
    for (var i = 0; i < 10; i++) {
      Mousetrap.unbind('g ' + (i+1));
    }
  }

  goToAccount(e) {
    var key = parseInt(e.key, 10) - 1;
    this.props.history.push('/account/' + this.props.accounts[key].accountId);
  }

  getIcon(accountType) {
    switch (accountType) {
      case "Credit Card":
        return "credit-card";
      case "Asset":
        return "car";
      case "Mortgage":
        return "home";
      case "Investment":
        return "dollar-sign";
      case "Loan":
        return "hand-holding-usd";
      case "Cash":
        return "money-bill-wave";
      default:
        return "piggy-bank";
    }
  }

  render() {
    return (
      <Nav className="accountNav">
        {this.props.isLoadingData ? <Spinner /> : 
        this.props.accounts.map(account =>
          <LinkContainer to={'/account/' + account.accountId} key={account.accountId}>
            <NavItem>
              <Row>
                <Col sm={1}>
                  <FontAwesomeIcon icon={this.getIcon(account.accountType)} />
                </Col>
                <Col sm={6} style={{overflow: "hidden", textOverflow: "ellipsis"}}>{account.name}</Col>
                <Col sm={4} style={{textAlign: "right"}}>
                  <CurrencyFormat value={account.currentBalance} />
                </Col>
              </Row>
            </NavItem>
          </LinkContainer>
        )}
      </Nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    isLoadingData: state.loading ? state.loading.accounts : true
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(accountActions, dispatch)
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {pure:false}
)(AccountNavList));