import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import {reducer as notifications} from 'react-notification-system-redux';
import * as Account from './Account';
import * as Categories from './Categories';

export default function configureStore(history, initialState) {
  const reducers = {
    account: Account.reducer,
    categories: Categories.reducer
  };

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
  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer,
    notifications
  });

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
