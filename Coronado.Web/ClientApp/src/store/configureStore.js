import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import {reducer as notifications} from 'react-notification-system-redux';
import * as Account from './Account';
import * as Categories from './Categories';
import CategoryForm from '../components/CategoryForm';

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
  const combinedReducer = combineReducers({
    ...reducers,
    routing: routerReducer,
    notifications
  });

  function crossSlideReducer(state, action) {
    switch (action.type) {
      case 'SOME_SPECIAL_ACTION': {
         
        return {
          ...state,
          account: Account.reducer(state.account, action),
          categories: Categories.specialReducer(state.categories, action, state.account)
        }
      }
      default:
        return state
    }
  }

  function rootReducer(state, action) {
    const intermediateState = combinedReducer(state, action);
    const finalState = crossSlideReducer(intermediateState, action);
    return finalState;
  }

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
