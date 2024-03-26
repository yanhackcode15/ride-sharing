const { createRide, matchDriverToRide, startRide, completeRide, rateRide } = require('../controllers/ride.controller');
const rideService = require('../services/ride.service');
const httpMocks = require('node-mocks-http'); // For mocking Express req and res objects

// Mock rideService.createRide
jest.mock('../services/ride.service');
describe('ride.controller.js', () => {

    describe('createRide Controller', () => {
    // Setup for request and response
        let req, res;

        beforeEach(() => {
            req = httpMocks.createRequest();
            res = httpMocks.createResponse();
        });

        it('should add a new ride and return 201 status', async () => {
            // Setup
            req.body = { rider: 'riderId', pickupLocation: 'Location', pickupCoordinates: {lat: 111, lng: 111},destination: 'Destination', fare: 10.50 };
            const savedRide = { ...req.body, _id: 'rideId' };
            rideService.createRide.mockResolvedValue(savedRide);

            // Act
            await createRide(req, res);

            // Assert
            expect(rideService.createRide).toHaveBeenCalledWith(req.body);
            expect(res.statusCode).toBe(201);
            expect(JSON.parse(res._getData())).toEqual(savedRide);
        });

        it('should handle errors and return 400 status', async () => {
            // Setup
            req.body = { rider: 'riderId', pickupLocation: 'Location', destination: 'Destination', fare: 10.50 };
            rideService.createRide.mockRejectedValue(new Error('Failed to create ride'));

            // Act
            await createRide(req, res);

            // Assert
            expect(rideService.createRide).toHaveBeenCalledWith(req.body);
            expect(res.statusCode).toBe(400);
            expect(JSON.parse(res._getData())).toEqual(expect.objectContaining({ message: 'Failed to create ride' }));
        });
    });

    describe('matchDriverToRide Controller', () => {
        let req, res;
      
        beforeEach(() => {
          req = httpMocks.createRequest({
            params: { rideId: 'rideId' }
          });
          res = httpMocks.createResponse();
        });
      
        it('should match a driver to a ride and return 200 status', async () => {
          // Setup
          const updatedRide = {
            _id: 'rideId',
            driver: 'driverId',
            status: 'in_progress'
          };
          rideService.matchDriverToRide.mockResolvedValue(updatedRide);
      
          // Act
          await matchDriverToRide(req, res);
      
          // Assert
          expect(rideService.matchDriverToRide).toHaveBeenCalledWith('rideId');
          expect(res.statusCode).toBe(200);
          expect(JSON.parse(res._getData())).toEqual(updatedRide);
        });
      
        it('should return 404 status if no available drivers found', async () => {
          // Setup
          rideService.matchDriverToRide.mockRejectedValue(new Error('Failed to match driver to ride: No available drivers found'));
      
          // Act
          await matchDriverToRide(req, res);
      
          // Assert
          expect(rideService.matchDriverToRide).toHaveBeenCalledWith('rideId');
          expect(res.statusCode).toBe(404);
          expect(JSON.parse(res._getData())).toEqual({ message: 'Failed to match driver to ride: No available drivers found' });
        });
    });
    describe('startRide Controller', () => {
        let req, res;
      
        beforeEach(() => {
          req = httpMocks.createRequest({
            params: { rideId: 'rideId' }
          });
          res = httpMocks.createResponse();
        });
      
        it('should start a ride and return 200 status', async () => {
          // Setup
          const startedRide = {
            _id: 'rideId',
            status: 'in_progress'
          };
          rideService.startRide.mockResolvedValue(startedRide);
      
          // Act
          await startRide(req, res);
      
          // Assert
          expect(rideService.startRide).toHaveBeenCalledWith('rideId');
          expect(res.statusCode).toBe(200);
          expect(JSON.parse(res._getData())).toEqual(startedRide);
        });
      
        it('should return 404 status if the ride is not found', async () => {
          // Setup
          rideService.startRide.mockRejectedValue(new Error('Ride not found'));
      
          // Act
          await startRide(req, res);
      
          // Assert
          expect(rideService.startRide).toHaveBeenCalledWith('rideId');
          expect(res.statusCode).toBe(404);
          expect(JSON.parse(res._getData())).toEqual({ message: 'Ride not found' });
        });
    });
      
    describe('completeRide Controller', () => {
        let req, res;
      
        beforeEach(() => {
          req = httpMocks.createRequest({
            params: { rideId: 'rideId' }
          });
          res = httpMocks.createResponse();
        });
      
        it('should complete a ride and return 200 status', async () => {
          // Setup
          const completedRide = {
            _id: 'rideId',
            status: 'completed'
          };
          rideService.completeRide.mockResolvedValue(completedRide);
      
          // Act
          await completeRide(req, res);
      
          // Assert
          expect(rideService.completeRide).toHaveBeenCalledWith('rideId');
          expect(res.statusCode).toBe(200);
          expect(JSON.parse(res._getData())).toEqual(completedRide);
        });
      
        it('should return 404 status if the ride is not found', async () => {
          // Setup
          rideService.completeRide.mockRejectedValue(new Error('Ride not found'));
      
          // Act
          await completeRide(req, res);
      
          // Assert
          expect(rideService.completeRide).toHaveBeenCalledWith('rideId');
          expect(res.statusCode).toBe(404);
          expect(JSON.parse(res._getData())).toEqual({ message: 'Ride not found' });
        });
    });

    describe('rateRide Controller', () => {
        let req, res;
      
        beforeEach(() => {
          req = httpMocks.createRequest({
            params: { rideId: 'rideId' },
            body: { rating: 5 }
          });
          res = httpMocks.createResponse();
        });
      
        it('should rate a ride and return 200 status', async () => {
          // Setup
          const ratedRide = {
            _id: 'rideId',
            rating: 5
          };
          rideService.rateRide.mockResolvedValue(ratedRide);
      
          // Act
          await rateRide(req, res);
      
          // Assert
          expect(rideService.rateRide).toHaveBeenCalledWith('rideId', 5);
          expect(res.statusCode).toBe(200);
          expect(JSON.parse(res._getData())).toEqual(ratedRide);
        });
      
        it('should return 404 status if the ride is not found', async () => {
          // Setup
          rideService.rateRide.mockRejectedValue(new Error('Ride not found'));
      
          // Act
          await rateRide(req, res);
      
          // Assert
          expect(rideService.rateRide).toHaveBeenCalledWith('rideId', 5);
          expect(res.statusCode).toBe(404);
          expect(JSON.parse(res._getData())).toEqual({ message: 'Ride not found' });
        });
    });
      
      


})
