// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function Login({updateAuthStatus}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${process.env.REACT_APP_USER_SERVICE_URL}/users/login`, {
            email,
            password,
        });
        // alert('Login successful!');
        console.log('Token:', response.data.token);
        const { token } = response.data;
        // Store the token in localStorage
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
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <div>
        <input
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
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
