const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  let userInfo = {
    email: userData.email, // Using email as the main identifier
    password: hashedPassword,
    role: userData.role,
  };

  if (userData.role === 'driver') {
    if (!userData.vehicleInfo || !userData.driverLicense) {
      throw new Error('Missing vehicle information or driver license information for driver.');
    }

    userInfo = {
      ...userInfo,
      vehicleInfo: userData.vehicleInfo,
      driverLicense: userData.driverLicense,
    };
  }

  const newUser = new User(userInfo);
  await newUser.save();
  return newUser;
};

const loginUser = async (email, password) => { // Changed from username to email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, role: user.role };
};

const updateDriverAvailability = async (userId, availability) => {
  const updatedUser = await User.findByIdAndUpdate(userId, { driverAvailability: availability }, { new: true });
  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
};

const findAvailableDriver = async () => {
  const availableDriver = await User.findOne({ driverAvailability: true });
  return availableDriver;
};

module.exports = { registerUser, loginUser, updateDriverAvailability, findAvailableDriver };
