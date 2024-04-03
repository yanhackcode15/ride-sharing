// src/components/CurrentRideStatus.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CurrentRideStatus({rideId, setRideCompleted}) {
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const fetchLatestRide = async () => {
      const token = localStorage.getItem('authToken');
      const latestRideId = localStorage.getItem('latestRideId')
      if(!latestRideId || !token) {
        console.log('No ride ID found or user is not authenticated');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/${latestRideId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRide(response.data);
        if(response.data.status=='completed'){
          setRideCompleted(true)
        }
      } catch (error) {
        console.error('Failed to fetch current ride:', error.message);
      }
    };

    fetchLatestRide();
    
    // Set up polling to call the function every 10 seconds
    const intervalId = setInterval(fetchLatestRide, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
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
