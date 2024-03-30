const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
  //userdata should contain {user, password, role}, role shuld be string and either 'driver' or 'rider'
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
      driverAvailability: userData.driverAvailability
    };

    console.log('userinfo service', userInfo)
  }
  const newUser = new User(userInfo);
  await newUser.save();
  console.log('new user', newUser)
  return newUser;
};

const loginUser = async (email, password) => { 
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
  //it'll return null when no driver is found
  try {  
    const availableDriver = await User.findOne({ driverAvailability: true });
    console.log('available driver returned', availableDriver)
    if(!availableDriver) {
      throw new Error ('Driver not found')
    }
    return availableDriver;
  } catch(error) {
    throw new Error(`Failed to find available drivers: ${error.message}`);
  }
}

module.exports = { registerUser, loginUser, updateDriverAvailability, findAvailableDriver };
