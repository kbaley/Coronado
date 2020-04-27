import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import AccountNavList from './AccountNavList';
import './NavMenu.css';
import InvoicesMenu from './invoices/InvoicesMenu';
import InvestmentsMenu from './investments_page/InvestmentsMenu';
import ReportsMenu from './reports_page/ReportsMenu';
import NewAccount from './account_page/NewAccount';
import ToggleAllAccounts from './account_page/ToggleAllAccounts';
import NetWorth from './NetWorth';

export default props => (
  localStorage.getItem('coronado-user') &&
  <div id="sidebar-wrapper">
    <div className="sidebar-heading">
      <Link to={'/'}>Coronado</Link>
      <NetWorth />
    </div>
    <Navbar.Brand>Accounts <NewAccount /><ToggleAllAccounts /></Navbar.Brand>
    <AccountNavList />
    <div className="otherMenus">
      <InvoicesMenu />
      <ReportsMenu />
      <InvestmentsMenu />
    </div>
  </div>
);
