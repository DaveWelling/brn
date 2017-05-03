import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import '../../node_modules/material-design-lite/material';
import App from './components/App';
import '../../node_modules/material-design-lite/dist/material.grey-indigo.min.css';
import '../../node_modules/md-date-time-picker/dist/css/mdDateTimePicker.min.css';
import './styles/styles.css';
import './styles/button.css';
import './SstPolyfills';
import getStore from './store';
import {configureStore} from  './store';
import './overridesForMdl';

configureStore();
ReactDOM.render(
    <Provider store={getStore()}>
        <App appName="BRN"/>
    </Provider>,
    document.getElementById('root')
);
