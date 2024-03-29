import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import {UserProvider} from './contexts/userContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(()=>{
    setIsAuthenticated(Boolean(localStorage.getItem('authToken')))
  },[])
  const handleAuthChange = (authStatus) => {
    setIsAuthenticated(authStatus);
    if (!authStatus) {
      localStorage.removeItem('authToken');
      window.location.href = '/login'; // Redirect to login without forcing a reload
    }
  };

  return (
    <UserProvider>
      <Router>
        <NavBar isAuthenticated={isAuthenticated} logout={()=>handleAuthChange(false)} />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login updateAuthStatus={handleAuthChange}/>} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate replace to="/login" />} 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
