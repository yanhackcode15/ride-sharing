// src/components/RideRequestForm.js
import React, { useState } from 'react';
import axios from 'axios';

function RideRequestForm() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/request`, {
        pickup,
        destination,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Ride requested successfully!');
      // Optionally reset form or navigate the user to another page
    } catch (error) {
      console.error('Failed to request ride:', error.response.data.message);
      alert('Failed to request ride.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Pickup Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      />
      <button type="submit">Request Ride</button>
    </form>
  );
}

export default RideRequestForm;
