const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser, updateDriverAvailability, findAvailableDriver } = require('../services/user.service');
const User = require('../models/user.model')
// Correctly mock the dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Updated mock for User model to support both new instances and static methods
jest.mock('../models/user.model', () => {
  const mockSave = jest.fn().mockImplementation(function () {
    return Promise.resolve(this); // Ensure 'this' refers to the instance with its properties
  });

  // Simulate the constructor function for creating instances
  const mockUserModel = function(data) {
    return { ...data, save: mockSave };
  };

  // Attach findOne static method mock directly to the constructor function
  mockUserModel.findOne = jest.fn();
  mockUserModel.findByIdAndUpdate = jest.fn();
  return mockUserModel; // Return the mock constructor function
});

// Setup JWT mock to return a specific token
jwt.sign.mockReturnValue('testToken');

describe('UserService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    bcrypt.hash.mockResolvedValue('hashedPassword'); // Mock bcrypt.hash
    bcrypt.compare.mockResolvedValue(true); // Assume password comparison is always successful in these tests
  });

  describe('registerUser', () => {
    it('should create and save a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123',
        role: 'rider',
      };

      const newUser = await registerUser(userData);

      expect(newUser).toHaveProperty('email', userData.email);
      expect(newUser).toHaveProperty('role', userData.role);
      expect(newUser.save).toHaveBeenCalled(); // Verify that save was called on the instance
    });
  });

  describe('loginUser', () => {
    it('should successfully log in with correct credentials', async () => {
      // Define the mock user within the test to ensure scoping is correct
      const mockUser = {
        _id: 'user123',
        email: 'testUser@gmail.com',
        password: await bcrypt.hash('Password123', 10),
        role: 'rider',
      };

      // Properly mock User.findOne here, ensuring User is recognized
      User.findOne.mockResolvedValue(mockUser);

      const result = await loginUser('testUser@gmail.com', 'Password123');

      // Assertions as before...
      expect(result).toHaveProperty('token', 'testToken');
    });

    it('should fail to log in with incorrect password', async () => {
      // Setup User.findOne to simulate finding a user, as before...
      User.findOne.mockResolvedValue({
        _id: 'user123',
        email: 'testUser@gmail.com',
        password: await bcrypt.hash('correctPassword', 10),
        role: 'rider',
      });

      // Ensure bcrypt.compare returns false for this test case
      bcrypt.compare.mockResolvedValue(false);

      // Expect the loginUser to reject with the specific error
      await expect(loginUser('testUser@gmail.com', 'wrongPassword')).rejects.toThrow('Invalid password');
    });
  });

  describe('updateDriverAvailability', () => {
    it('should update driver availability', async () => {
      const userId = 'someUserId';
      const availability = true;
      User.findByIdAndUpdate.mockResolvedValue({
        _id: userId,
        driverAvailability: availability,
      });
  
      const result = await updateDriverAvailability(userId, availability);
  
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, { driverAvailability: availability }, { new: true });
      expect(result).toHaveProperty('driverAvailability', availability);
    });
  
    it('should throw an error if user not found', async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
  
      await expect(updateDriverAvailability('nonexistentUserId', true)).rejects.toThrow('User not found');
    });
  });

  describe('findAvailableDriver', () => {
    it('should return an available driver', async () => {
      // Mock the Driver model's findOne method
      User.findOne.mockResolvedValue({
        _id: 'driverId123',
        driverAvailability: true,
        // Add other necessary driver fields
      });

      const availableDriver = await findAvailableDriver();

      expect(availableDriver).toBeDefined();
      expect(availableDriver.driverAvailability).toBe(true);
      // Verify that findOne was called with the correct query
      expect(User.findOne).toHaveBeenCalledWith({ driverAvailability: true });
    });

    it('should return null if no drivers are available', async () => {
      // Return null to simulate no available drivers found
      User.findOne.mockResolvedValue(null);

      const availableDriver = await findAvailableDriver();

      expect(availableDriver).toBeNull();
      expect(User.findOne).toHaveBeenCalledWith({ driverAvailability: true });
    });
  });
});
