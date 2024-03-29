// src/components/CurrentRideStatus.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CurrentRideStatus({rideId}) {
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const fetchCurrentRide = async () => {
      const token = localStorage.getItem('authToken');
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/${rideId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRide(response.data);
      } catch (error) {
        console.error('Failed to fetch current ride:', error);
      }
    };

    fetchCurrentRide();
  }, []);
  if (!ride) {
    return <div>No current ride.</div>;
  }

  return (
    <div>
      <h3>Current Ride</h3>
      <p>Pickup: {ride.pickupLocation}</p>
      <p>Destination: {ride.destination}</p>
      <p>Status: {ride.status}</p>
      <p>Price: {ride.fare}</p>
    </div>
  );
}

export default CurrentRideStatus;
