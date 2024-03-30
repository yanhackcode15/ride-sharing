import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RideInfo = ({ rideId }) => {
  const [rideDetails, setRideDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRideInfo = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setRideDetails(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch ride details');
        setIsLoading(false);
      }
    };

    if (rideId) {
      fetchRideInfo();
    }
  }, [rideId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {rideDetails ? (
        <div>
          <h2>Ride Details</h2>
          <p>Pickup Location: {rideDetails.pickupLocation}</p>
          <p>Destination: {rideDetails.destination}</p>
          <p>Status: {rideDetails.status}</p>
          {/* Display other ride details as needed */}
        </div>
      ) : (
        <p>No ride details available.</p>
      )}
    </div>
  );
};

export default RideInfo;
