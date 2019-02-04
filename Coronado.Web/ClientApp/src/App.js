import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Account from './components/account_page/Account';
import Categories from './components/categories/Categories';
import InvoicesPage from './components/invoices/InvoicesPage';
import LoginPage from './components/LoginPage';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPiggyBank, faCreditCard, faHome, faHandHoldingUsd, 
  faDollarSign, faCar, faMoneyBillWave, faChartLine } from '@fortawesome/free-solid-svg-icons'
import CustomersPage from './components/customers/CustomersPage';
import ReportsPage from "./components/reports_page/ReportsPage";
import InvestmentsPage from "./components/investments_page/InvestmentsPage";
import { PrivateRoute } from "./components/common/PrivateRoute";

library.add(faPiggyBank, faCreditCard, faHome, faHandHoldingUsd, faDollarSign, faCar, faMoneyBillWave, faChartLine);

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route exact path='/login' component={LoginPage} />
    <Route path='/account/:accountId' render={props => <Account {...props} />} />
    <PrivateRoute exact path='/categories' component={Categories} />
    <Route exact path='/invoices' component={InvoicesPage} />
    <Route exact path='/customers' component={CustomersPage} />
    <Route exact path='/reports' component={ReportsPage} />
    <Route exact path='/investments' component={InvestmentsPage} />
  </Layout>
);