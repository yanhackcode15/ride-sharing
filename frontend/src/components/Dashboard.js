// src/components/Dashboard.js
import React from 'react';
import RideRequestForm from './RideRequestForm';
import CurrentRideStatus from './CurrentRideStatus';
import axios from 'axios';
import {useUser} from '../contexts/userContext';
import RiderDashboard from './RiderDashboard'
import DriverDashboard from './DriverDashboard'

function Dashboard() {
    // const rideId = localStorage.getItem('latestRideId');
    const { role } = useUser();
    return (
    <div>
      <h2>Welcome, {role} </h2>
      { role==='rider' ? <RiderDashboard/> : <DriverDashboard/>}
    </div>
  );
}

export default Dashboard;
