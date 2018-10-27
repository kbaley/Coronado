import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import {reducer as notifications} from 'react-notification-system-redux';
import * as Account from './Account';
import * as Categories from './Categories';

export default function configureStore(history, initialState) {
  const middleware = [
    thunk,
    routerMiddleware(history)
  ];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
  }

  initialState = initialState || { };
  function rootReducer(state, action) {
    return {
      account: Account.reducer(state.account, action),
      categories: Categories.reducer(state.categories, {...action, accounts: state.account ? state.account.accounts : null}),
      router: routerReducer(state.router, action),
      notifications: notifications(state.notifications, action)
    }
  }

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
