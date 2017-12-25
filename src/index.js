import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Simulation from './Bend_text';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Simulation />, document.getElementById('root'));
registerServiceWorker();
