import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './NavMenu.css';

export class NavMenu extends Component {
  displayName = NavMenu.name

  constructor(props) {
    super(props);
    this.state = { accounts: [], loading: true };

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
            <LinkContainer to={'/counter'}>
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
      : NavMenu.renderAccountsTable(this.state.accounts);

    return (
      <Navbar inverse fixedTop fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={'/'}>Accounts</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            {contents}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
