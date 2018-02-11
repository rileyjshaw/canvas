import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Simulation from './filler.js';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Simulation />, document.getElementById('root'));
registerServiceWorker();
