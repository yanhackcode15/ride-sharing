import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
