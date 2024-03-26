const request = require('supertest');
const express = require('express');
const rideRoutes = require('../routes/ride.routes');
const rideController = require('../controllers/ride.controller');

jest.mock('../controllers/ride.controller');

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/rides', rideRoutes); // Use your routes

describe('Ride Routes', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('POST /rides', () => {
        it('should create a new ride', async () => {
        // Mock the controller's response
        const mockRideData = { rider: 'riderId', destination: 'Destination', pickupLocation: 'Location', fare: 10.50 };
        rideController.createRide.mockImplementation((req, res) => res.status(201).json(mockRideData));

        const response = await request(app)
            .post('/rides')
            .send(mockRideData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(mockRideData);
        expect(rideController.createRide).toHaveBeenCalledTimes(1);
        // You can add more detailed checks to ensure the correct function parameters were used
        });
    });

    describe('POST /rides/:rideId/match', () => {
        it('should match a driver to a ride', async () => {
            const mockRideId = '123';
            const mockDriver = { _id: 'driverId' };
            let capturedReq;
            rideController.matchDriverToRide.mockImplementation((req, res) => {
                capturedReq = req; 
                res.status(200).send({ driver: mockDriver._id })
            });
        
            const response = await request(app)
                .post(`/rides/${mockRideId}/match`);
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ driver: mockDriver._id });
            expect(capturedReq.params.rideId).toBe('123');
            expect(rideController.matchDriverToRide).toHaveBeenCalled();
        });
    });
    describe('POST /rides/:rideId/start', () => {
        it('should start the ride and return 200 status', async () => {
          const mockRideId = '123';
          rideController.startRide.mockImplementation((req, res) => res.status(200).send({ status: 'in_progress' }));
      
          const response = await request(app)
            .patch(`/rides/${mockRideId}/start`);
      
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({ status: 'in_progress' });
          expect(rideController.startRide).toHaveBeenCalled();
        });
      
        it('should return 404 status if the ride is not found', async () => {
          rideController.startRide.mockImplementation((req, res) => res.status(404).send({ message: 'Ride not found' }));
      
          const response = await request(app)
            .patch(`/rides/nonexistentRide/start`);
      
          expect(response.statusCode).toBe(404);
          expect(response.body).toEqual({ message: 'Ride not found' });
          expect(rideController.startRide).toHaveBeenCalled();
        });
    });

    describe('PATCH /rides/:rideId/complete', () => {
        it('should complete the ride and return 200 status', async () => {
          const mockRideId = '123';
          // Mock the controller to simulate completing the ride
          rideController.completeRide.mockImplementation((req, res) => res.status(200).send({ status: 'completed' }));
      
          const response = await request(app)
            .patch(`/rides/${mockRideId}/complete`);
      
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({ status: 'completed' });
          expect(rideController.completeRide).toHaveBeenCalled();
        });
      
        it('should return 404 status if the ride is not found', async () => {
          // Mock the controller to simulate a ride not found scenario
          rideController.completeRide.mockImplementation((req, res) => res.status(404).send({ message: 'Ride not found' }));
      
          const response = await request(app)
            .patch(`/rides/nonexistentRide/complete`);
      
          expect(response.statusCode).toBe(404);
          expect(response.body).toEqual({ message: 'Ride not found' });
          expect(rideController.completeRide).toHaveBeenCalled();
        });
    });
    describe('POST /rides/:rideId/rate', () => {
        it('should allow a user to rate a ride and return 200 status', async () => {
          const mockRideId = '123';
          const rating = { rating: 5 };
          // Mock the controller to simulate rating the ride
          rideController.rateRide.mockImplementation((req, res) => res.status(200).send({ ...rating, message: 'Rating submitted' }));
      
          const response = await request(app)
            .post(`/rides/${mockRideId}/rate`)
            .send(rating);
      
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({ ...rating, message: 'Rating submitted' });
          expect(rideController.rateRide).toHaveBeenCalled();
        });
      
        it('should return 400 status if rating is out of range', async () => {
          const mockRideId = '123';
          const invalidRating = { rating: 6 }; // Assuming the valid range is 1-5
          // Mock the controller to simulate an invalid rating submission
          rideController.rateRide.mockImplementation((req, res) => res.status(400).send({ message: 'Invalid rating' }));
      
          const response = await request(app)
            .post(`/rides/${mockRideId}/rate`)
            .send(invalidRating);
      
          expect(response.statusCode).toBe(400);
          expect(response.body).toEqual({ message: 'Invalid rating' });
          expect(rideController.rateRide).toHaveBeenCalled();
        });
      
        it('should return 404 status if the ride is not found', async () => {
          // Mock the controller to simulate a ride not found scenario
          rideController.rateRide.mockImplementation((req, res) => res.status(404).send({ message: 'Ride not found' }));
      
          const response = await request(app)
            .post(`/rides/nonexistentRide/rate`)
            .send({ rating: 4 });
      
          expect(response.statusCode).toBe(404);
          expect(response.body).toEqual({ message: 'Ride not found' });
          expect(rideController.rateRide).toHaveBeenCalled();
        });
    });
            
      



});
