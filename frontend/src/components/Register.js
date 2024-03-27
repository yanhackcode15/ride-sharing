// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('rider'); // Assuming 'rider' and 'driver' are the roles

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_USER_SERVICE_URL}/users/register`, {
        email,
        password,
        role,
      });
      alert('Registration successful!');
      // Redirect to login page or dashboard as appropriate
    } catch (error) {
      alert('Registration failed: ' + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
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
      <div>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="rider">Rider</option>
          <option value="driver">Driver</option>
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
