import React from 'react';
import { Provider } from 'react-redux';
import CoronadoApp from './CoronadoApp';
import configureStore from './store/configureStore';

const store = configureStore();

export default function App() {

  return (
    <Provider store={store}>
      <CoronadoApp />
    </Provider>
  );
}

