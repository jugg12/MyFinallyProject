import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { legacy_createStore as createStore,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { BrowserRouter as Router} from "react-router-dom";
import { Provider } from 'react-redux';
import store from "./store/index"



const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
      <Router>
        <Provider store={store}>
         <App />
        </Provider>
      </Router>
);



