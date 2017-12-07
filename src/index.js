import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Simulation from './Citygen1';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Simulation />, document.getElementById('root'));
registerServiceWorker();
