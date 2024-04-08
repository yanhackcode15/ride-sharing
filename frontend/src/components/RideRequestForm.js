// src/components/RideRequestForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import parseJwt from '../utilities/ParseJWT';

function RideRequestForm({setRideId}) {
    const [pickupLocation, setPickupLocation] = useState('');
    const [destination, setDestination] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            if(!token){
                throw new Error('Failed to get token')
            }
            const decodedToken = parseJwt(token);
            const rider = decodedToken.userId;
            // const role = decodedToken.role;
            const pickupCoordinates = {lat: 102, lng: 293};
            const destinationCoordinates = {lat: 102, lng: 293};
            const fare = 32; 
            const response = await axios.post(`${process.env.REACT_APP_TRIP_SERVICE_URL}/rides/`, {
                rider,
                pickupLocation,
                pickupCoordinates,
                destination,
                destinationCoordinates,
                fare
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const rideId = response.data._id; 
            alert('Ride requested successfully!');
            localStorage.setItem('latestRideId', rideId)
            setRideId(rideId)
            // navigate('/dashboard');

        } catch (error) {
        console.error('Failed to request ride:', error.response.data.message);
        alert(`Failed to request ride: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Pickup Location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
        />
        <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
        />
        <button className="request-ride-button button-primary" type="submit">Request Ride</button>
        </form>
    );
}

export default RideRequestForm;
