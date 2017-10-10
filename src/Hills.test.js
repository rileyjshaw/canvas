import React from 'react';
import ReactDOM from 'react-dom';
import Hills from './Hills';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Hills />, div);
});
