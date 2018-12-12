import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import AccountNavList from './AccountNavList';
import './NavMenu.css';
import CategoriesMenu from './categories/CategoriesMenu';
import InvoicesMenu from './invoices/InvoicesMenu';
import CustomersMenu from './customers/CustomersMenu';
import InvestmentsMenu from './investments_page/InvestmentsMenu';
import ReportsMenu from './reports_page/ReportsMenu';
import NewAccount from './account_page/NewAccount';
import NetWorth from './NetWorth';

export default props => (
  <Navbar inverse fixedTop fluid collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand style={{ width: "100%", paddingRight: "0" }}>
        <Link to={'/'}>Coronado</Link>
        <NetWorth />
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
        <InvoicesMenu />
        <ReportsMenu />
        <CategoriesMenu />
        <InvestmentsMenu />
        <CustomersMenu />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
