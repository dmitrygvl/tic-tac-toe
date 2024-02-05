import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

const rootEl = document.getElementById('root') as HTMLElement;
const app = createRoot(rootEl);
app.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
