import React from 'react';
import ReactDOM from 'react-dom';
import App from './renderer/App';
import * as serviceWorker from './renderer/serviceWorker';
import { AppProvider } from './renderer/providers/AppProvider';
import { ColorModeScript } from '@chakra-ui/react';
import './index.css';
import './fonts/slkscr.ttf';
import './fonts/slkscrb.ttf';

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="system" />
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
