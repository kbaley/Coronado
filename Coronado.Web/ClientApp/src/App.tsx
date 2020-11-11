import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import { PrivateRoute } from "./components/common/PrivateRoute";
import { CssBaseline } from '@material-ui/core';
import routes from "./routes";

export default () => (
  <Layout>
    <CssBaseline />
    <Switch>
      { routes.map((route, index) => (
        route.isPublic ? 
        <Route key={index} exact {...route} />
        :
        <PrivateRoute key={index} {...route} />
      ))};
    </Switch>
  </Layout>
);