const axios = require('axios');
const rideService = require('../services/ride.service');
const Ride = require('../models/ride.model');

jest.mock('axios');
jest.mock('../models/ride.model');

describe('ride.service.js', () => {
    describe('createRide', () => {
        it('should create a new ride', async () => {
        // Mock data
        const rideData = { rider: 'riderId', pickupLocation: 'Location', destination: 'Destination', fare: 10.50 };
        const savedRide = { _id: 'rideId', ...rideData };

        // Mock Ride model save method
        Ride.prototype.save.mockResolvedValue(savedRide);

        // Call createRide function
        const result = await rideService.createRide(rideData);

        // Assertions
        expect(Ride.prototype.save).toHaveBeenCalledWith();
        expect(result).toEqual(savedRide);
        });

        it('should throw an error if ride creation fails', async () => {
        // Mock data
        const rideData = { rider: 'riderId', pickupLocation: 'Location', destination: 'Destination', fare: 10.50 };

        // Mock Ride model save method to throw an error
        Ride.prototype.save.mockRejectedValue(new Error('Failed to save ride'));

        // Assertions
        await expect(rideService.createRide(rideData)).rejects.toThrow('Failed to create ride: Failed to save ride');
        });
    });

    describe('matchDriverToRide', () => {
        it('should match a driver to a ride and update ride status to in_progress', async () => {
        // Mock data
        const rideId = 'rideId';
        const availableDriver = { _id: 'driverId' };
        const updatedRide = { _id: rideId, driver: availableDriver._id, status: 'in_progress' };

        // Mock axios get request to return available driver
        axios.get.mockResolvedValue({ data: availableDriver });

        // Mock Ride model findByIdAndUpdate method
        Ride.findByIdAndUpdate.mockResolvedValue(updatedRide);

        // Call matchDriverToRide function
        const result = await rideService.matchDriverToRide(rideId);

        // Assertions
        expect(axios.get).toHaveBeenCalledWith('http://user-service/users/drivers/available');
        expect(Ride.findByIdAndUpdate).toHaveBeenCalledWith(rideId, { driver: availableDriver._id }, { new: true });
        expect(result).toEqual(updatedRide);
        });

        it('should throw an error if no available drivers found', async () => {
        // Mock data
        const rideId = 'rideId';

        // Mock axios get request to return no available drivers
        axios.get.mockResolvedValue({ data: null });

        // Assertions
        await expect(rideService.matchDriverToRide(rideId)).rejects.toThrow('Failed to match driver to ride: No available drivers found');
        });

        it('should throw an error if driver matching fails', async () => {
        // Mock data
        const rideId = 'rideId';

        // Mock axios get request to throw an error
        axios.get.mockRejectedValue(new Error('Failed to match driver to ride: Failed to fetch available drivers'));

        // Assertions
        await expect(rideService.matchDriverToRide(rideId)).rejects.toThrow('Failed to match driver to ride: Failed to fetch available drivers');
        });
    });

    describe('startRide', () => {
        it('should start a ride and update ride status to in_progress', async () => {
        // Mock data
        const rideId = 'rideId';
        const updatedRide = { _id: rideId, status: 'in_progress' };

        // Mock Ride model findByIdAndUpdate method
        Ride.findByIdAndUpdate.mockResolvedValue(updatedRide);

        // Call startRide function
        const result = await rideService.startRide(rideId);

        // Assertions
        expect(Ride.findByIdAndUpdate).toHaveBeenCalledWith(rideId, { status: 'in_progress' }, { new: true });
        expect(result).toEqual(updatedRide);
        });

        it('should throw an error if ride not found', async () => {
        // Mock data
        const rideId = 'rideId';

        // Mock Ride model findByIdAndUpdate method to return null
        Ride.findByIdAndUpdate.mockResolvedValue(null);

        // Assertions
        await expect(rideService.startRide(rideId)).rejects.toThrow('Failed to start ride: Ride not found');
        });
    });

    describe('completeRide', () => {
        it('should complete a ride and update ride status to completed', async () => {
        // Mock data
        const rideId = 'rideId';
        const updatedRide = { _id: rideId, status: 'completed' };
    
        // Mock Ride model findByIdAndUpdate method
        Ride.findByIdAndUpdate.mockResolvedValue(updatedRide);
    
        // Call completeRide function
        const result = await rideService.completeRide(rideId);
    
        // Assertions
        expect(Ride.findByIdAndUpdate).toHaveBeenCalledWith(rideId, { status: 'completed' }, { new: true });
        expect(result).toEqual(updatedRide);
        });
    
        it('should throw an error if ride not found', async () => {
        // Mock data
        const rideId = 'rideId';
    
        // Mock Ride model findByIdAndUpdate method to return null
        Ride.findByIdAndUpdate.mockResolvedValue(null);
    
        // Assertions
        await expect(rideService.completeRide(rideId)).rejects.toThrow('Ride not found');
        });
    });
  
    describe('rateRide', () => {
        it('should rate a ride and update the ride rating', async () => {
          // Mock data
          const rideId = 'rideId';
          const rating = 5; // Assuming a valid rating scale is 1-5
          const ratedRide = { _id: rideId, rating: rating };
      
          // Mock Ride model findByIdAndUpdate method
          Ride.findByIdAndUpdate.mockResolvedValue(ratedRide);
      
          // Call rateRide function
          const result = await rideService.rateRide(rideId, rating);
      
          // Assertions
          expect(Ride.findByIdAndUpdate).toHaveBeenCalledWith(rideId, { rating: rating }, { new: true });
          expect(result).toEqual(ratedRide);
        });
      
        it('should throw an error if ride not found', async () => {
          // Mock data
          const rideId = 'rideId';
          const rating = 5;
      
          // Mock Ride model findByIdAndUpdate method to return null
          Ride.findByIdAndUpdate.mockResolvedValue(null);
      
          // Assertions
          await expect(rideService.rateRide(rideId, rating)).rejects.toThrow('Ride not found');
        });
      
        // Optional: Add additional test cases for invalid rating values if your function includes validation
    });
      
});
