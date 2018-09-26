import React from 'react';
import { Link } from 'react-router-dom';
import { NewAccount } from './NewAccount';
import { Navbar } from 'react-bootstrap';
import AccountNavList from './AccountNavList';
import './NavMenu.css';

export default props => (
  <Navbar inverse fixedTop fluid collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to={'/'}>Accounts</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
        <AccountNavList />
        <NewAccount />
    </Navbar.Collapse>
  </Navbar>
);