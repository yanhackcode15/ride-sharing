// src/components/Dashboard.js
import React from 'react';
import RideRequestForm from './RideRequestForm';
import CurrentRideStatus from './CurrentRideStatus';
import axios from 'axios';

function RiderDashboard() {
    const rideId = localStorage.getItem('latestRideId');
    return (
    <div>
      {!rideId? <RideRequestForm /> : <CurrentRideStatus rideId={rideId} />}
    </div>
  );
}

export default RiderDashboard;
