// src/components/Dashboard.js
import React from 'react';
import {useUser} from '../contexts/userContext';
import RiderDashboard from './RiderDashboard'
import DriverDashboard from './DriverDashboard'
import './Dashboard.css'

function Dashboard() {
    const { role } = useUser();
    return (
    <div className="container">
      <h2>Welcome, {role} </h2>
      { role==='rider' ? <RiderDashboard/> : <DriverDashboard/>}
    </div>
  );
}

export default Dashboard;
