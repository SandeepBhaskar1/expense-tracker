import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Transaction from './Transaction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Transaction />} />
      </Routes>
    </Router>
  );
}

export default App;
