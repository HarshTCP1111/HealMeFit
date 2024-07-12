// src/App.js
import React from 'react';
import Slider from './Slider';
import Login from './Login';
import '../App.css'; // Adjust the path if necessary

const App = () => {
  return (
    <div className="container">
      <Slider />
      <Login />
    </div>
  );
};

export default App;
