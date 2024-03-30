import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DriverDashboard() {
    const [availableRides, setAvailableRides] = useState([]);
    const [acceptedRide, setAcceptedRide] = useState(null);
    useEffect(() => {
        const fetchRides = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const availableRidesResponse = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/available`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAvailableRides(availableRidesResponse.data);
                const acceptedRidesResponse = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/acceptedByDriver`, {
                    headers: { Authorization: `Bearer ${token}`}
                })
                console.log('accepted ride from this driver', acceptedRidesResponse.data)
                setAcceptedRide(acceptedRidesResponse.data);
            } catch (error) {
                console.error('Error fetching rides:', error);
            }
        };
        fetchRides();
    }, []);

    const acceptRide = async (rideId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/${rideId}/match`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Assuming the backend returns the updated ride details upon acceptance
            setAcceptedRide(response.data);
            setAvailableRides(currentRides => currentRides.filter(ride => ride._id !== rideId));
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : "An unknown error occurred";
            console.error('Error accepting the ride:', errorMessage);
            alert(`Error accepting the ride: ${errorMessage}`);
        }
    };

    const startRide = async (rideId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.patch(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/${rideId}/start`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Update the local state to reflect the ride has started
            if (acceptedRide && acceptedRide._id === rideId) {
                setAcceptedRide({ ...acceptedRide, status: 'in progress' });
            }
        } catch (error) {
            console.error('Error starting the ride:', error);
            alert('Failed to start the ride.');
        }
    };

    return (
        <div>
            <h3>Accepted Ride Info</h3>
            {acceptedRide && (
                <div>
                    <h3>Accepted Ride</h3>
                    <p>Pickup Location: {acceptedRide.pickupLocation}</p>
                    <p>Destination: {acceptedRide.destination}</p>
                    <p>Status: {acceptedRide.status}</p>
                    {acceptedRide.status === 'accepted' && <button onClick={() => startRide(acceptedRide._id)}>Start Ride</button>}
                </div>
            )}

            <h2>Available Rides</h2>
            {availableRides.length ? (
                <ul>
                    {availableRides.map((ride) => (
                        <li key={ride._id}>
                            {`Pickup: ${ride.pickupLocation}, Destination: ${ride.destination}`}
                            <button onClick={() => acceptRide(ride._id)} disabled={!!acceptedRide}>Accept</button>
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
