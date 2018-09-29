import React, { Component } from 'react';
import { Glyphicon, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { actionCreators } from '../store/AccountNavList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class AccountNavList extends Component {
  displayName = AccountNavList.name;

  componentDidMount() {
    this.props.requestAccountList();
  }

  render() {
    return (
      <Nav>
          {this.props.isLoading ? "loading..." : 
          this.props.accounts.map(account =>
            <LinkContainer to={'/account/' + account.accountId} key={account.accountId}>
              <NavItem>
                <Glyphicon glyph='piggy-bank' /> {account.name}
              </NavItem>
            </LinkContainer>
          )}
      </Nav>
    );
  }
}

export default connect(
  state => state.accountNavList,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(AccountNavList);