import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app/root/App';

console.dir(`Running version: ${process.env.REACT_APP_VERSION}`)

ReactDOM.render(<App />, document.getElementById('root'));
