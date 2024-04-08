import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DriverDashboard() {
    const [availableRides, setAvailableRides] = useState([]);
    const [currentRide, setCurrentRide] = useState(null);
    const [completedRides, setCompletedRides] = useState([]);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const availableRidesResponse = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/available`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAvailableRides(availableRidesResponse.data);
                const currentRideResponse = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/currentForDriver`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrentRide(currentRideResponse.data); // Set the current ride with its statusv
                // Fetch completed rides for the driver
                const completedResponse = await axios.get(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/completedByDriver`, {
                    headers: { Authorization: `Bearer ${token}`}
                });

                setCompletedRides(completedResponse.data || []);

            } catch (error) {
                console.error('Error fetching rides:', error);
            }
        };
        fetchRides();
    }, [completedRides.length]);

    const acceptRide = async (rideId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/${rideId}/match`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Assuming the backend returns the updated ride details upon acceptance
            setCurrentRide(response.data);
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
            if (currentRide && currentRide._id === rideId) {
                setCurrentRide({ ...currentRide, status: 'in_progress' });
            }
        } catch (error) {
            console.error('Error starting the ride:', error);
            alert('Failed to start the ride.');
        }
    };
    const completeRide = async (rideId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.patch(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/${rideId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Update the local state to reflect the ride has completed
            if (currentRide && currentRide._id === rideId) {
                setCurrentRide(null);
            }
            
        } catch (error) {
            console.error('Error completing the ride:', error);
            alert('Failed to complete the ride.');
        }
    };

    return (
        <div>
            {currentRide && (
                <div>
                    <h3>Ride Status</h3> 
                    <div className="driver-ride-status-card">
                        <p>Pickup Location: {currentRide.pickupLocation}</p>
                        <p>Destination: {currentRide.destination}</p>
                        <p>Status: {currentRide.status}</p>
                        {currentRide.status === 'accepted' && <button className="start-complete-ride-button button-primary" onClick={() => startRide(currentRide._id)}>Start Ride</button>}
                        {currentRide.status === 'in_progress' && <button 
                            className="start-complete-ride-button button-primary"
                            onClick={() => completeRide(currentRide._id)}>
                                Complete Ride
                        </button>}
                    </div>
                </div>
            )}

            <h2>Available Rides</h2>
            {(availableRides.length) ? (
                <ul>
                    {availableRides.map((ride) => (
                        <li className="available-ride-card" key={ride._id}>
                            {`Pickup: ${ride.pickupLocation}, Destination: ${ride.destination}`}
                            <button 
                                className="accept-ride-button button-primary"
                                onClick={() => acceptRide(ride._id)} 
                                disabled={!!currentRide}>
                                    Accept
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="default-no-ride-text"><p>No available rides at the moment.</p></div>
            )}

            <div>
                <h3>Completed Rides</h3>
                {(completedRides.length) > 0 ? (
                    completedRides.map((ride) => (
                        <div className="completed-ride-card" key={ride._id}>
                            <p>Pickup Location: {ride.pickupLocation}</p>
                            <p>Destination: {ride.destination}</p>
                            <p>Status: {ride.status}</p>
                        </div>
                    ))
                ) : (
                    <div className="default-no-ride-text"><p>No completed rides.</p></div>
                )}
            </div>
        </div>
    );
}

export default DriverDashboard;
