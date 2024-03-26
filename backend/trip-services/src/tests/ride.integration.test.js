const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); 
const Ride = require('../models/ride.model')
const axios = require('axios');

jest.mock('axios')
describe('Trip Service Integration Tests', () => {
    describe('POST /rides', () => {
        it('should create a new ride and return 201 status', async () => {
          const riderId = new mongoose.Types.ObjectId();
          const driverId = new mongoose.Types.ObjectId(); // Assuming this is optional at ride creation
      
          const rideData = {
            rider: riderId,
            pickupLocation: '123 Main St',
            pickupCoordinates: { lat: 40.7128, lng: -74.0060 },
            destination: '456 Elm St',
            destinationCoordinates: { lat: 40.7138, lng: -74.0050 },
            fare: 25,
          };
      
          const response = await request(app)
            .post('/rides')
            .send(rideData)
            .expect(201);
      
          // Validate response data
          expect(response.body).toHaveProperty('_id');
          expect(response.body.rider).toEqual(rideData.rider.toString());
          expect(response.body.pickupLocation).toEqual(rideData.pickupLocation);
          expect(response.body.destination).toEqual(rideData.destination);
          expect(response.body.fare).toEqual(rideData.fare);
      
          // Verify that the ride was saved in the database
          const savedRide = await Ride.findById(response.body._id);
          expect(savedRide).toBeTruthy();
          expect(savedRide.status).toEqual('requested');
        });
    });
    describe('POST /rides/:rideId/match', () => {
        it('successfully matches a driver to a ride', async () => {
          // Create a test ride to match a driver to
          const testRide = new Ride({
            rider: new mongoose.Types.ObjectId(),
            pickupLocation: '123 Main St',
            pickupCoordinates: { lat: 40.7128, lng: -74.0060 },
            destination: '456 Elm St',
            destinationCoordinates: { lat: 40.7138, lng: -74.0050 },
            fare: 20,
          });
          await testRide.save();
      
          // Mock axios to simulate finding an available driver
          const mockDriver = { _id: new mongoose.Types.ObjectId() };
          axios.get.mockResolvedValue({ data: mockDriver});
      
          // Attempt to match the driver to the created ride
          const response = await request(app)
            .post(`/rides/${testRide._id}/match`)
            .expect(200);
      
          // Assertions to verify the ride was updated correctly
          expect(response.body.driver).toEqual(mockDriver._id.toString());
      
          // Verify the ride was updated in the database
          const updatedRide = await Ride.findById(testRide._id);
          expect(updatedRide.driver.toString()).toEqual(mockDriver._id.toString());
        });
      
        it('returns an error when no drivers are available', async () => {
            // Create a test ride to attempt matching with a driver
            const testRide = new Ride({
              rider: new mongoose.Types.ObjectId(),
              pickupLocation: '789 West St',
              pickupCoordinates: { lat: 40.7148, lng: -74.0070 },
              destination: '1010 East St',
              destinationCoordinates: { lat: 40.7158, lng: -74.0080 },
              fare: 30,
            });
            await testRide.save();
        
            // Mock axios to simulate no available drivers
            axios.get.mockResolvedValue({ data: null }); // Assuming this is how your service denotes no available drivers
        
            // Attempt to match a driver to the created ride
            const response = await request(app)
              .post(`/rides/${testRide._id}/match`)
              .expect(404); // Expecting a 404 response indicating no drivers available
        
            // Assertions to verify the correct error message is returned
            expect(response.body.message).toEqual('Failed to match driver to ride: No available drivers found');
        
            // Optionally, verify the ride was not updated in the database with a driver
            const unchangedRide = await Ride.findById(testRide._id);
            expect(unchangedRide.driver).toBeNull(); // Assuming driver is null by default when no match is found
        });
    });

    describe('Ride Execution with Safety and Communication Features', () => {
        // Tests for in-app navigation, communication features, and safety checks can go here
        // This may involve more complex setup or mocking external services
    });

    // describe('Post-Ride Rating and Feedback', () => {
    //     it('should allow both rider and driver to rate the experience', async () => {
    //     // Assuming rideId and driverId are known (possibly from previous test steps)
    //         const rideId = 'someRideId';

    //         // Simulate a rider rating the ride
    //         await request(app)
    //             .post(`/rides/${rideId}/rate`)
    //             .send({ rating: 4 })
    //             .expect(200);

    //     // Further tests can simulate the driver rating the ride, and checking that feedback is stored/reviewed appropriately
    //     });
    // });
});
