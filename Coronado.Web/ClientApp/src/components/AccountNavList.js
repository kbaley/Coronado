import React, { Component } from 'react';
import { Glyphicon, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { actionCreators } from '../store/AccountNavList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';

class AccountNavList extends Component {
  displayName = AccountNavList.name;

  constructor(props) {
    super(props);
    this.goToAccount = this.goToAccount.bind(this);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    this.props.requestAccountList();
      // Mousetrap.bind('3', (e) => {this.goToAccount(e)});
  }

  componentDidUpdate() {

    if (this.state.isLoading && this.props.accounts.length > 0) {
      for (var i = 0; i < this.props.accounts.length; i++) {
        if (i < 10) {
          Mousetrap.bind((i+1) + '', this.goToAccount);
        }
      }
      this.setState(...this.state, {isLoading: false});
    }
  }

  goToAccount(e) {
    var key = parseInt(e.key, 10) - 1;
    this.props.history.push('/account/' + this.props.accounts[key].accountId);
  }

  render() {
    return (
      <Nav>
          {this.props.isLoading ? "loading..." : 
          this.props.accounts.map(account =>
            <LinkContainer to={'/account/' + account.accountId} key={account.accountId}>
              <NavItem>
                <Glyphicon glyph='piggy-bank' /> {account.name}
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

function CurrencyFormat(props) {
  return (
    <span>{Number(props.value).toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2})}</span>
  );
}

export default withRouter(connect(
  state => state.accountNavList,
  dispatch => bindActionCreators(actionCreators, dispatch),
  null,
  {pure:false}
)(AccountNavList));