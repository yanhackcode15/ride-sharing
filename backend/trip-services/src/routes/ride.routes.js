const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth')
const {
  createRide,
  matchDriverToRide,
  startRide,
  completeRide,
  rateRide,
  getRideInfo,
  findAvailableRides,
  getCurrentForDriver,
  getCompletedRidesByDriver,
  getCompletedRidesForRider,
  getAcceptedRideByDriver,
  getStartedRideByDriver
} = require('../controllers/ride.controller');

// Route to show available rides with status requested. Driver will be able to pick rides to accept
router.get('/available', findAvailableRides);


router.get('/currentForDriver', requireAuth, getCurrentForDriver); // `requireAuth` is middleware to ensure the driver is logged in, this will get ride that eitherr accepted or in_progress
router.get('/completedForRider', requireAuth, getCompletedRidesForRider);

router.get('/completedByDriver', requireAuth, getCompletedRidesByDriver); // `requireAuth` is middleware to ensure the driver is logged in
router.get('/acceptedByDriver', requireAuth, getAcceptedRideByDriver); // `requireAuth` is middleware to ensure the driver is logged in

router.get('/startedByDriver', requireAuth, getStartedRideByDriver)
// Route to match a driver to a ride
router.post('/:rideId/match', requireAuth, matchDriverToRide);

// Route to start a ride
router.patch('/:rideId/start', startRide);

// Route to complete a ride
router.patch('/:rideId/complete', completeRide);


// Route to rate a ride
router.post('/:rideId/rate', rateRide);
//get ride status - new
router.get('/:rideId', getRideInfo)
// Route to create a new ride
router.post('/', createRide);

module.exports = router;
