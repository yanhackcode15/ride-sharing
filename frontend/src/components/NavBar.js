// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';


function NavBar({isAuthenticated, logout}) {
    
  return (
    <nav>
      <ul>
        {isAuthenticated ? (
            <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><button onClick={() => logout()}>Logout</button></li>
            </>
            ) : (
            <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
