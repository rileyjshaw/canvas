import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Simulation from './Merry_Christmas';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Simulation />, document.getElementById('root'));
registerServiceWorker();
