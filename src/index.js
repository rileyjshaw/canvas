import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Simulation from './vectorfield2_pen';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Simulation />, document.getElementById('root'));
registerServiceWorker();
