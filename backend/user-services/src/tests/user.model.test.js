const mongoose = require('mongoose');
const User = require('../models/user.model'); 

describe('User Model Test', () => {
  // Test for user creation with valid details
  it('create & save rider successfully', async () => {
    const userData = {
      email: 'testRider@example.com',
      password: '123456',
      role: 'rider'
    };

    const validUser = new User(userData);
    const savedUser = await validUser.save();

    // Validate the saved user
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.role).toBe(userData.role);
  });

  it('create & save driver successfully', async () => {
    const userData = {
      email: 'testdriver@example.com',
      password: '123456',
      role: 'driver',
      vehicleInfo: {
        make: 'Toyota',
        model: 'Prius',
        year: 2020,
        licensePlate: 'ABC123',
      },
      driverLicense: {
        licenseNumber: 'D1234567',
        validUntil: new Date('2025-12-31'),
      },
    };

    const validUser = new User(userData);
    const savedUser = await validUser.save();

    // Validate the saved user
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.role).toBe(userData.role);
    expect(savedUser.vehicleInfo.make).toBe(userData.vehicleInfo.make);
  });

  // Test for user creation failure with missing required field
  it('fails to create user - rider without required field', async () => {
    const userDataWithoutRequiredField = {
      password: '123456',
      role: 'rider',
    };
    let err;
    try {
      const invalidUser = new User(userDataWithoutRequiredField);
      await invalidUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

 
});
