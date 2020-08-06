import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import history from './history';
import { Router } from "react-router-dom";
import configureStore from './store/configureStore';
import App from './App';
import {loadAccounts} from './actions/accountActions';
import {loadAccountTypes} from './actions/accountTypeActions';
import {loadCategories} from './actions/categoryActions';
import {loadCustomers} from './actions/customerActions';
import { loadInvoices } from "./actions/invoiceActions";
import { loadVendors } from "./actions/vendorActions";
import { loadCurrencies } from "./actions/currencyActions";
import { loadInvestments } from "./actions/investmentActions";
import registerServiceWorker from './registerServiceWorker';
import { ThemeProvider } from '@material-ui/core';
import theme from './theme';
import { loadInvestmentCategories } from './actions/investmentCategoryActions';

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = configureStore(history, initialState);
export default store;
store.dispatch(loadAccounts());
store.dispatch(loadCategories());
store.dispatch(loadAccountTypes());
store.dispatch(loadCustomers());
store.dispatch(loadInvoices());
store.dispatch(loadVendors());
store.dispatch(loadInvestments());
store.dispatch(loadCurrencies());
store.dispatch(loadInvestmentCategories());

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <App />
      </Router>
    </ThemeProvider>
  </Provider>,
  rootElement);

registerServiceWorker();