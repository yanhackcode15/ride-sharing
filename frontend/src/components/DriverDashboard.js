import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DriverDashboard() {
    const [availableRides, setAvailableRides] = useState([]);

    useEffect(() => {
        const fetchAvailableRides = async () => {
        try {
            // Replace 'authToken' and URL as needed
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/available`, {
            headers: { Authorization: `Bearer ${token}` },
            });
            setAvailableRides(response.data);
        } catch (error) {
            console.error('Error fetching available rides:', error);
        }
        };

        fetchAvailableRides();
    }, []);

    // Function to accept a ride
    const acceptRide = async (rideId) => {
        try {
        const token = localStorage.getItem('authToken');
        await axios.post(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/${rideId}/match`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // Filter out the accepted ride from the list
        setAvailableRides(currentRides => currentRides.filter(ride => ride.id !== rideId));
        } catch (error) {
        console.error('Error accepting the ride:', error);
        }
    };

    return (
        <div>
        <h2>Available Rides</h2>
        {availableRides.length ? (
            <ul>
            {availableRides.map((ride) => (
                <li key={ride._id}>
                {`Pickup: ${ride.pickupLocation}, Destination: ${ride.destination}`}
                <button onClick={() => acceptRide(ride.id)}>Accept</button>
                </li>
            ))}
            </ul>
        ) : (
            <p>No available rides at the moment.</p>
        )}
        </div>
    );
}

export default DriverDashboard;
