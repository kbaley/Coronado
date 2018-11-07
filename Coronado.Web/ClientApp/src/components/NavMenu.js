import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import AccountNavList from './AccountNavList';
import './NavMenu.css';
import CategoriesMenu from './categories/CategoriesMenu';
import NewAccount from './NewAccount';

export default props => (
  <Navbar inverse fixedTop fluid collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to={'/'}>Coronado</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
        <Navbar.Header>
          <Navbar.Brand>Accounts <NewAccount /></Navbar.Brand>
        </Navbar.Header>
        <AccountNavList />
    </Navbar.Collapse>
    <Navbar.Collapse>
      <Nav>
        <CategoriesMenu />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

;
