import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Simulation from './orbitz.js';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Simulation />, document.getElementById('root'));
registerServiceWorker();
