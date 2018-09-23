import React, { Component } from 'react';
import { Glyphicon, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export class AccountNavList extends Component {
  displayName = AccountNavList.name;

  constructor(props) {
    super(props);
    this.state = { loading: true };

    fetch('api/Accounts')
      .then(response => response.json())
      .then(data => {
        this.setState({ accounts: data, loading: false });
      });
  }
  static renderAccountsTable(accounts) {
    return (
      <Nav>
          {accounts.map(account =>
            <LinkContainer to={'/account/' + account.accountId} key={account.accountId}>
              <NavItem>
                <Glyphicon glyph='piggy-bank' /> {account.name}
              </NavItem>
            </LinkContainer>
          )}
      </Nav>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : AccountNavList.renderAccountsTable(this.state.accounts);
    return (
      <div>{contents}</div>
    );
  }
}

