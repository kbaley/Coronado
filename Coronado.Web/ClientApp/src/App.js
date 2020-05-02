import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPiggyBank, faCreditCard, faHome, faHandHoldingUsd, faMinusCircle,
  faDollarSign, faCar, faMoneyBillWave, faChartLine, faCog, faUser, faExternalLinkAlt,
  faSignOutAlt, faExchangeAlt, faArrowDown, faUpload, faEnvelope, faFileDownload,
  faListAlt, faTrashAlt, faPencilAlt, faPlusCircle, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { PrivateRoute } from "./components/common/PrivateRoute";
import { CssBaseline } from '@material-ui/core';
import routes from "./routes";

library.add(faPiggyBank, faCreditCard, faHome, faHandHoldingUsd, faDollarSign, faCar, faMoneyBillWave, faChartLine,
  faCog, faUser, faListAlt, faTrashAlt, faPencilAlt, faPlusCircle, faCheckCircle, faTrash, faSignOutAlt, faExchangeAlt,
  faArrowDown, faUpload, faEnvelope, faFileDownload, faExternalLinkAlt, faMinusCircle );

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