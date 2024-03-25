const mongoose = require('mongoose');
const Ride = require('../models/ride.model');

describe('Ride Model', () => {
  // Test case: Ensure the Ride model can be instantiated correctly
  it('should create a new ride', async () => {
    // Mock ride data
    const mockRideData = {
      rider: new mongoose.Types.ObjectId(),
      driver: new mongoose.Types.ObjectId(),
      pickupLocation: 'Pickup Location',
      pickupCoordinates: { lat: 40.7128, lng: -74.0060 },
      destination: 'Destination',
      destinationCoordinates: { lat: 37.7749, lng: -122.4194 },
      fare: 10.50
    };

    // Create a new ride using the mock data
    const validRide = new Ride(mockRideData);
    const savedRide = await validRide.save();

    // Verify that the ride object is created successfully
    expect(savedRide).toBeDefined();
    expect(savedRide.rider).toEqual(mockRideData.rider);
    expect(savedRide.driver).toEqual(mockRideData.driver);
    expect(savedRide.pickupLocation).toBe(mockRideData.pickupLocation);
    expect(savedRide.destination).toBe(mockRideData.destination);
    expect(savedRide.pickupCoordinates.lat).toBe(mockRideData.pickupCoordinates.lat);
    expect(savedRide.pickupCoordinates.lng).toBe(mockRideData.pickupCoordinates.lng);
    expect(savedRide.destinationCoordinates.lat).toBe(mockRideData.destinationCoordinates.lat);
    expect(savedRide.destinationCoordinates.lng).toBe(mockRideData.destinationCoordinates.lng);

    expect(savedRide.fare).toBe(mockRideData.fare);
    expect(savedRide.status).toBe('requested'); // Default status
  });

  // Test case: Ensure required fields are properly enforced
  it('should require all required fields', async () => {
    // Create a ride without providing required fields
    const rideWithoutRequiredFields = new Ride({});

    // Validate that the ride without required fields fails validation
    await expect(rideWithoutRequiredFields.validate()).rejects.toThrow();
  });

  // Add more test cases for other scenarios such as default values, enum enforcement, etc.
});
