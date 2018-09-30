import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Account from './components/Account';
import Categories from './components/Categories';

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/account/:accountId' render={props => <Account {...props} />} />
    <Route exact path='/categories' component={Categories} />
  </Layout>
);