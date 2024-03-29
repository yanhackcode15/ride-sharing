const rideService = require('../services/ride.service');

// Create a new ride
async function createRide(req, res) {
  try {
    const rideData = req.body;
    const newRide = await rideService.createRide(rideData);
    res.status(201).json(newRide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Match a driver to a ride
async function matchDriverToRide(req, res) {
  try {
    const rideId = req.params.rideId;
    const updatedRide = await rideService.matchDriverToRide(rideId);
    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// Start a ride
async function startRide(req, res) {
  try {
    const rideId = req.params.rideId;
    const updatedRide = await rideService.startRide(rideId);
    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// Complete a ride
async function completeRide(req, res) {
  try {
    const rideId = req.params.rideId;
    const updatedRide = await rideService.completeRide(rideId);
    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// Rate a ride
async function rateRide(req, res) {
  try {
    const { rideId } = req.params;
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }
    const ratedRide = await rideService.rateRide(rideId, rating);
    res.status(200).json(ratedRide);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function getRideInfo(req, res) {
  try {
    const { rideId } = req.params;
    const currentRide = await rideService.getRideInfo(rideId)
    res.status(200).json(currentRide)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

async function findAvailableRides(req, res) {
  try {
    const availableRides = await rideService.findAvailableRides();
    res.status(200).json(availableRides);
  } catch (error) {
    console.error('Failed to list available rides:', error);
    res.status(404).json({ message: 'Error fetching available rides' });
  }
};

module.exports = {
  createRide,
  matchDriverToRide,
  startRide,
  completeRide,
  rateRide,
  getRideInfo,
  findAvailableRides,
};
