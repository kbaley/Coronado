import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Account from './components/account_page/Account';
import Categories from './components/categories/Categories';
import InvoicesPage from './components/invoices/InvoicesPage';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPiggyBank, faCreditCard, faHome, faHandHoldingUsd, 
  faDollarSign, faCar, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import CustomersPage from './components/customers/CustomersPage';

library.add(faPiggyBank, faCreditCard, faHome, faHandHoldingUsd, faDollarSign, faCar, faMoneyBillWave);

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/account/:accountId' render={props => <Account {...props} />} />
    <Route exact path='/categories' component={Categories} />
    <Route exact path='/invoices' component={InvoicesPage} />
    <Route exact path='/customers' component={CustomersPage} />
  </Layout>
);