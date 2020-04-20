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
import ToggleAllAccounts from './account_page/ToggleAllAccounts';
import NetWorth from './NetWorth';

export default props => (
  localStorage.getItem('coronado-user') &&
  <div className="bg-dark border-right" id="sidebar-wrapper">
    <div className="sidebar-heading">
      <Link to={'/'}>Coronado</Link>
    </div>
    <Navbar.Brand style={{ width: "100%", paddingRight: "0" }}>
      <Link to={'/'}>Coronado</Link>
      {/* <NetWorth /> */}
    </Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Brand>Accounts <NewAccount /><ToggleAllAccounts /></Navbar.Brand>
    <AccountNavList />
    <Nav>
      <InvoicesMenu />
      <ReportsMenu />
      <CategoriesMenu />
      <InvestmentsMenu />
      <CustomersMenu />
    </Nav>
  </div>
);
