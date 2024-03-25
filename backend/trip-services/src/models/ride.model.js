const mongoose = require('mongoose')
const rideSchema = new mongoose.Schema({
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    pickupLocation: {
      type: String,
      required: true
    },
    pickupCoordinates: {
      type: { lat: Number, lng: Number },
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    destinationCoordinates: {
      type: { lat: Number, lng: Number },
      required: true
    },
    fare: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'in_progress', 'completed'],
      default: 'requested'
    }
  }, { timestamps: true });
  module.exports = mongoose.model('Ride', rideSchema);
