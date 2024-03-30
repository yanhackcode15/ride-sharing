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

async function matchDriverToRide(rideId, driverId) {
  console.log('matchdriver service')
  console.log('rideId', rideId)
  try {
    // Find an available driver, the api returns a json string of a driver document
    const response = await axios.get(`${process.env.USER_SERVICE_URL}/users/${driverId}/isAvailable`);
    console.log('response.data', response.data)
    if(!response ||!response.data){
      throw new Error('Cannnot find this driver')
    }
    const availableDriver = response.data
    const availableDriverMongoDbObjectId = new mongoose.Types.ObjectId(availableDriver._id)
    console.log('availableDriver', availableDriver)
    // If a driver is found, assign the ride to the driver
    if (availableDriver) {
      const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        { driver: availableDriverMongoDbObjectId, status: 'accepted' },
        { new: true }
      );
      
      console.log('updated Ride********', updatedRide)
      if (!updatedRide) {
        throw new Error('Ride not found');
      }

      return updatedRide;
    } else {
      throw new Error('Failed to match driver to ride: No available drivers found');
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

async function getRideInfo(rideId) {
  try {
    const currentRide = await Ride.findById(rideId); 
    if (!currentRide) {
      throw new Error('Ride not found');
    }
    return currentRide;
  } catch (error) {
    throw new Error(`Failed to get ride info: ${error.message}`);
  }
}
async function findAvailableRides() {
  try {
    // 'available' is the status for rides that haven't been accepted by a driver yet
    const availableRides = await Ride.find({ status: 'requested' });
    return availableRides;
  } catch (error) {
    throw new Error('Failed to fetch available rides');
  }
};

async function getAcceptedRideByDriver(driverId) {
  console.log('get taccepted rides service')
  const driverObjectId = new mongoose.Types.ObjectId(driverId);
  console.log('driverId', driverId)
  console.log('driverObjId', driverObjectId)

  try {
    const acceptedRide = await Ride.findOne({
      driver: driverObjectId,
      status: 'accepted' // Ensure this matches the exact string used in your database
    });
    return acceptedRide;
  } catch(error) {
    throw new Error('Error fetching accepted ride')
  }
}
module.exports = {
  createRide,
  matchDriverToRide,
  startRide,
  completeRide,
  rateRide,
  getRideInfo,
  findAvailableRides,
  getAcceptedRideByDriver,
};

