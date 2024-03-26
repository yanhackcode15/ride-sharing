const express = require('express');
const router = express.Router();
const {
  createRide,
  matchDriverToRide,
  startRide,
  completeRide,
  rateRide,
} = require('../controllers/ride.controller');


// Route to create a new ride
router.post('/', createRide);

// Route to match a driver to a ride
router.post('/:rideId/match', matchDriverToRide);

// Route to start a ride
router.patch('/:rideId/start', startRide);

// Route to complete a ride
router.patch('/:rideId/complete', completeRide);

// Route to rate a ride
router.post('/:rideId/rate', rateRide);

module.exports = router;
