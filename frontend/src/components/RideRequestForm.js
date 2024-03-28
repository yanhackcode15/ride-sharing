// src/components/RideRequestForm.js
import React, { useState } from 'react';
import axios from 'axios';
import parseJwt from '../utilities/ParseJWT';

function RideRequestForm() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('authToken');
        if(!token){
            throw('Failed to get token')
        }
        const decodedToken = parseJwt(token);
        const rider = decodedToken.userId;
        const role = decodedToken.role;
        const pickupCoordinates = {lat: 102, lng: 293};
        const destinationCoordinates = {lat: 102, lng: 293};
        const fare = 32; 
        await axios.post(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/`, {
            rider,
            pickupLocation,
            pickupCoordinates,
            destination,
            destinationCoordinates,
            fare
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
      alert('Ride requested successfully!');
      // Optionally reset form or navigate the user to another page
    } catch (error) {
      console.error('Failed to request ride:', error.response.data.message);
      alert(`Failed to request ride: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Pickup Location"
        value={pickupLocation}
        onChange={(e) => setPickupLocation(e.target.value)}
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
