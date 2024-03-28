// src/components/Dashboard.js
import React from 'react';
import RideRequestForm from './RideRequestForm';
import CurrentRideStatus from './CurrentRideStatus';
// Import RideHistory component

function Dashboard() {
  return (
    <div>
      <h2>Welcome, [User's Name]</h2>
      <RideRequestForm />
      <CurrentRideStatus />
      {/* Include RideHistory component */}
    </div>
  );
}

export default Dashboard;
