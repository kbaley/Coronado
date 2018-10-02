import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import NewAccount from './NewAccount';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import AccountNavList from './AccountNavList';
import './NavMenu.css';

export default props => (
  <Navbar inverse fixedTop fluid collapseOnSelect maxHeight>
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
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to={'/categories'}>
        <NavItem>
          <Glyphicon glyph='cog' /> Categories
        </NavItem>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);