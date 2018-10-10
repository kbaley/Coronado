import React, { Component } from 'react';
import { Glyphicon, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';
import './AccountNavList.css'
import { CurrencyFormat } from './CurrencyFormat';

class AccountNavList extends Component {
  displayName = AccountNavList.name;

  constructor(props) {
    super(props);
    this.goToAccount = this.goToAccount.bind(this);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    this.props.requestAccountList();
  }

  componentDidUpdate() {

    if (this.state.isLoading && this.props.accounts && this.props.accounts.length > 0) {
      for (var i = 0; i < this.props.accounts.length; i++) {
        if (i < 10) {
          Mousetrap.bind((i+1) + '', this.goToAccount);
        }
      }
      this.setState(...this.state, {isLoading: false});
    }
  }

  componentWillUnmount() {
    for (var i = 0; i < 10; i++) {
      Mousetrap.unbind((i+1) + '');
    }
  }

  goToAccount(e) {
    var key = parseInt(e.key, 10) - 1;
    this.props.history.push('/account/' + this.props.accounts[key].accountId);
  }

  render() {
    return (
      <Nav>
          {this.props.isNavListLoading ? "loading..." : 
          this.props.accounts.map(account =>
            <LinkContainer to={'/account/' + account.accountId} key={account.accountId}>
              <NavItem>
                <div className='accountName'>
                  <Glyphicon glyph='piggy-bank' /> {account.name}
                </div>
                <div style={{float: "right"}}>
                  <CurrencyFormat value={account.currentBalance} />
                </div>
              </NavItem>
            </LinkContainer>
          )}
      </Nav>
    );
  }
}

export default withRouter(connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch),
  null,
  {pure:false}
)(AccountNavList));