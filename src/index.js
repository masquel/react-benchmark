import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
const now = performance.now()

ReactDOM.render(<App />, document.getElementById('root'), () => {
  console.log(performance.now() - now);
});
