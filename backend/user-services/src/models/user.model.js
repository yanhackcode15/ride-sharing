const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['rider', 'driver'], required: true},
  // Driver-specific information
  driverAvailability: {type: Boolean, default: false},
  vehicleInfo: {
    make: String, 
    model: String, 
    year: Number,
    licensePlate: String,
  },
  driverLicense: {
    licenseNumber: String, 
    validUntil: Date,
  },
  // Other driver-specific fields as necessary
}, { minimize: false });

module.exports = mongoose.model('User', userSchema);
