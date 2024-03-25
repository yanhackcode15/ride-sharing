const mongoose = require('mongoose');
const Ride = require('../models/ride.model');
const axios = require('axios');

async function createRide(rideData) {
  try {
    const ride = new Ride(rideData);
    const savedRide = await ride.save();
    return savedRide;
  } catch (error) {
    throw new Error(`Failed to create ride: ${error.message}`);
  }
}

async function matchDriverToRide(rideId) {
  try {
    // Find an available driver
    const response = await axios.get('http://user-service/users/drivers/available');
    const {availableDriver} = response.json()
    // If a driver is found, assign the ride to the driver
    if (availableDriver) {
      const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        { driver: driver._id },
        { new: true }
      );

      if (!updatedRide) {
        throw new Error('Ride not found');
      }

      return updatedRide;
    } else {
      throw new Error('No available drivers found');
    }
  } catch (error) {
    throw new Error(`Failed to match driver to ride: ${error.message}`);
  }
}

async function startRide(rideId) {
  try {
    const updatedRide = await Ride.findByIdAndUpdate(rideId, { status: 'in_progress' }, { new: true });
    if (!updatedRide) {
      throw new Error('Ride not found');
    }
    return updatedRide;
  } catch (error) {
    throw new Error(`Failed to start ride: ${error.message}`);
  }
}

async function completeRide(rideId) {
  try {
    const updatedRide = await Ride.findByIdAndUpdate(rideId, { status: 'completed' }, { new: true });
    if (!updatedRide) {
      throw new Error('Ride not found');
    }
    return updatedRide;
  } catch (error) {
    throw new Error(`Failed to complete ride: ${error.message}`);
  }
}

async function rateRide(rideId, rating) {
  try {
    const ratedRide = await Ride.findByIdAndUpdate(rideId, { rating }, { new: true });
    if (!ratedRide) {
      throw new Error('Ride not found');
    }
    return ratedRide;
  } catch (error) {
    throw new Error(`Failed to rate ride: ${error.message}`);
  }
}

module.exports = {
  createRide,
  matchDriverToRide,
  startRide,
  completeRide,
  rateRide,
};
