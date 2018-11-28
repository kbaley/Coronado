import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';
import App from './App';
import {loadAccounts} from './actions/accountActions';
import {loadAccountTypes} from './actions/accountTypeActions';
import {loadCategories} from './actions/categoryActions';
import {loadCustomers} from './actions/customerActions';
import { loadInvoices } from "./actions/invoiceActions";
import { loadVendors } from "./actions/vendorActions";
import registerServiceWorker from './registerServiceWorker';

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = configureStore(history, initialState);
store.dispatch(loadAccounts());
store.dispatch(loadCategories());
store.dispatch(loadAccountTypes());
store.dispatch(loadCustomers());
store.dispatch(loadInvoices());
store.dispatch(loadVendors());

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  rootElement);

registerServiceWorker();