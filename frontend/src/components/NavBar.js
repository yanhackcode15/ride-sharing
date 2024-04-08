// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/images/logo_light.png'

function NavBar({isAuthenticated, logout}) {
    
  return (
    <header className="app-header">
      <nav className="navbar">
        <Link className="brand" to="/"><img src={logo} alt="Logo" className="brand-logo"/>Ridely</Link>
        {isAuthenticated ? (
            <div className='nav-links'>
              <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><button className="button-secondary" onClick={() => logout()}>Logout</button></li>
              </ul>
            </div>
            ) : (
            <div className='nav-links'>
            </div>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
