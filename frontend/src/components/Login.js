// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_USER_SERVICE_URL}/users/login`, {
        email,
        password,
      });
      alert('Login successful!');
      console.log('Token:', response.data.token); // Assuming the response includes a token
      // Handle successful login here (e.g., redirect to dashboard, store the token)
    } catch (error) {
      alert('Login failed: ' + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
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
