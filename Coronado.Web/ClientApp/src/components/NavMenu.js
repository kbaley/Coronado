import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NewAccount } from './NewAccount';
import { Navbar } from 'react-bootstrap';
import { AccountNavList } from './AccountNavList';
import './NavMenu.css';

export class NavMenu extends Component {
  displayName = NavMenu.name

  constructor(props) {
    super(props);
    this.handleAccountAdded = this.handleAccountAdded.bind(this);
    this.handleAccountDeleted = this.handleAccountDeleted.bind(this);
    this.state = { accounts: [], loading: true };
  }

  handleAccountDeleted(account) {
    this.setState((prevState) => ({
      accounts: prevState.accounts.filter(accountToDelete => accountToDelete.accountId !== account.accountId)
    }));
    this.props.history.push('/');
  }

  handleAccountAdded(account) {
    this.setState(prevState => ({
      accounts: [...prevState.accounts, account]
    }));
  }

  render() {

    return (
      <Navbar inverse fixedTop fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={'/'}>Accounts</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <AccountNavList onAccountDeleted={this.handleAccountDeleted} />
            <NewAccount onAccountAdded={this.handleAccountAdded} />
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
