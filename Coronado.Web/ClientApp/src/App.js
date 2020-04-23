import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Account from './components/account_page/Account';
import Categories from './components/categories/Categories';
import InvoicesPage from './components/invoices/InvoicesPage';
import LoginPage from './components/LoginPage';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPiggyBank, faCreditCard, faHome, faHandHoldingUsd, faMinusCircle,
  faDollarSign, faCar, faMoneyBillWave, faChartLine, faCog, faUser, faExternalLinkAlt,
  faSignOutAlt, faExchangeAlt, faArrowDown, faUpload, faEnvelope, faFileDownload,
  faListAlt, faTrashAlt, faPencilAlt, faPlusCircle, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import CustomersPage from './components/customers/CustomersPage';
import ReportsPage from "./components/reports_page/ReportsPage";
import InvestmentsPage from "./components/investments_page/InvestmentsPage";
import { PrivateRoute } from "./components/common/PrivateRoute";

library.add(faPiggyBank, faCreditCard, faHome, faHandHoldingUsd, faDollarSign, faCar, faMoneyBillWave, faChartLine,
  faCog, faUser, faListAlt, faTrashAlt, faPencilAlt, faPlusCircle, faCheckCircle, faTrash, faSignOutAlt, faExchangeAlt,
  faArrowDown, faUpload, faEnvelope, faFileDownload, faExternalLinkAlt, faMinusCircle );

export default () => (
  <Layout>
    <Switch>
      <PrivateRoute exact path='/' component={Home} />
      <Route exact path='/login' component={LoginPage} />
      <PrivateRoute path='/account/:accountId' component={props => <Account {...props} />} />
      <PrivateRoute exact path='/categories' component={Categories} />
      <PrivateRoute exact path='/invoices' component={InvoicesPage} />
      <PrivateRoute exact path='/customers' component={CustomersPage} />
      <PrivateRoute exact path='/reports' component={ReportsPage} />
      <PrivateRoute exact path='/investments' component={InvestmentsPage} />
    </Switch>
  </Layout>
);