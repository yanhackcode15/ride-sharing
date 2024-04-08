// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import parseJwt from '../utilities/ParseJWT';
import { useUser } from '../contexts/userContext';
import './Login.css';

function Login({updateAuthStatus}) {
    const navigate = useNavigate();
    const { setRole } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${process.env.REACT_APP_USER_SERVICE_URL}/users/login`, {
            email,
            password,
        });
        const { token } = response.data;
        // Store the token in localStorage
        const decodedToken = parseJwt(token)
        const role = decodedToken.role;
        setRole(role);
        localStorage.setItem('authToken', token);
        updateAuthStatus(true)

        // Redirect the user or update the UI as needed
        console.log('Login successful');
        navigate('/dashboard'); // Redirect to the dashboard or another protected route

    } catch (error) {
        alert('Login failed: ' + error.response.data.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2 className="login-title">Login</h2>
      <div className="login-input-container">
        <input
          className="login-input"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="login-submit button-primary" type="submit">Login</button>
    </form>
  );
}

export default Login;
