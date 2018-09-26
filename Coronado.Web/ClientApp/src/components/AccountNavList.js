import React, { Component } from 'react';
import { Glyphicon, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { actionCreators } from '../store/NavMenu';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class AccountNavList extends Component {
  displayName = AccountNavList.name;

  componentDidMount() {
    // This method runs when the component is first added to the page
    this.props.requestAccountList();
  }

  render() {
    return (
      <Nav>
          {!this.props.accounts ? "" : 
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