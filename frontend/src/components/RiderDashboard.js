// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import RideRequestForm from './RideRequestForm';
import CurrentRideStatus from './CurrentRideStatus';
import axios from 'axios';

function RiderDashboard() {
  const [rideCompleted, setRideCompleted] = useState(false);
  const [completedRides, setCompletedRides] = useState([]); // State to store completed rides
  const [rideId, setRideId] = useState(localStorage.getItem('latestRideId'));

  useEffect( () => {
    if (rideId) {
      const fetchRideStatus = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/${rideId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
           });
           if (response.data.status === 'completed') {
            localStorage.removeItem('latestRideId');
            setRideId(null);
            setRideCompleted(true);
           }
        } catch (error) {
          console.error('Failed to fetch ride status:', error);
        }
      };
      fetchRideStatus();
    }

    const fetchCompletedRides = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
          console.log('User is not authenticated');
          return;
      }
      try {
          const response = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/completedForRider`, {
              headers: { Authorization: `Bearer ${token}` },
          });
          setCompletedRides(response.data); // Assuming the endpoint returns an array of completed rides
      } catch (error) {
          console.error('Failed to fetch completed rides:', error);
      }
    };

    fetchCompletedRides();

  }, [rideId, rideCompleted])
  return (
    <div>
      {!rideId || rideCompleted ? <RideRequestForm setRideId={setRideId} /> : (<CurrentRideStatus rideId={rideId} setRideCompleted={setRideCompleted}/>)}
      <div>
          <h3>Completed Rides</h3>
          {completedRides.length > 0 ? (
              <ul>
                  {completedRides.map((ride) => (
                      <li key={ride._id}>
                          <p>Pickup: {ride.pickupLocation} - Destination: {ride.destination}</p>
                          <p>Date: {new Date(ride.createdAt).toLocaleDateString()} - Price: ${ride.fare}</p>
                          <p>Status: {ride.status}</p>
                      </li>
                  ))}
              </ul>
          ) : (
              <p>You have no completed rides.</p>
          )}
      </div>
    </div>
  );
}

export default RiderDashboard;
