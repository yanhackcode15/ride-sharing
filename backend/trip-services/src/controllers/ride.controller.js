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
  const driverId = req.user.userId;

  try {
    const rideId = req.params.rideId;
    const updatedRide = await rideService.matchDriverToRide(rideId, driverId);
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
    res.status(404).json({ message: error.message });
  }
};

async function getAcceptedRideByDriver(req, res) {
  try {
    const driverId = req.user.userId;
    console.log('controller driverID', driverId)

    const acceptedRide = await rideService.getAcceptedRideByDriver(driverId)
    if(acceptedRide==null){
      return res.status(200).json(null)
    }
    if (!acceptedRide) {
      return res.status(404).json({ message: 'No accepted ride found for this driver.' });
    }

    res.json(acceptedRide);
  } catch (error) {
    console.error('Failed to fetch the accepted ride:', error);
    res.status(500).json({ message: error.message});
  }
}

async function getStartedRideByDriver(req, res) {
  try {
    const driverId = req.user.userId;

    const startedRide = await rideService.getStartedRideByDriver(driverId)
    if(startedRide==null){
      return res.status(200).json(null)
    }
    if (!startedRide) {
      return res.status(404).json({ message: 'No started ride found for this driver.' });
    }

    res.json(startedRide);
  } catch (error) {
    console.log('Failed to fetch started ride:', error)
    res.status(500).json({ message: error.message })
  }
}

async function getCurrentForDriver(req, res) {
  try {
    const driverId = req.user.userId;

    const currentRide = await rideService.getCurrentForDriver(driverId)
    if(currentRide==null){
      return res.status(200).json(null)
    }
    if (!currentRide) {
      return res.status(404).json({ message: 'No started or accepted ride found for this driver.' });
    }

    res.json(currentRide);
  } catch (error) {
    console.log('Failed to fetch accepted or started ride:', error)
    res.status(500).json({ message: error.message })
  }
}
async function getCompletedRidesByDriver(req, res) {
  try {
    const driverId = req.user.userId;

    const completedRides = await rideService.getCompletedRidesByDriver(driverId)
    if(completedRides.length==0){
      return res.status(200).json(null)
    }
    if (!completedRides.length) {
      return res.status(404).json({ message: 'No completed rides found for this driver.' });
    }

    res.json(completedRides);
  } catch (error) {
    console.log('Failed to fetch completed rides:', error)
    res.status(500).json({ message: error.message })
  }
}

async function getCompletedRidesForRider(req, res) {
  try {
    const riderId = req.user.userId;

    const completedRides = await rideService.getCompletedRidesForRider(riderId)
    if(completedRides.length==0){
      return res.status(200).json(null)
    }
    if (!completedRides.length) {
      return res.status(404).json({ message: 'No completed rides found for this rider.' });
    }

    res.json(completedRides);
  } catch (error) {
    console.log('Failed to fetch completed rides:', error)
    res.status(500).json({ message: error.message })
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
  getCurrentForDriver,
  getCompletedRidesByDriver,
  getCompletedRidesForRider,
  getAcceptedRideByDriver,
  getStartedRideByDriver,
};
