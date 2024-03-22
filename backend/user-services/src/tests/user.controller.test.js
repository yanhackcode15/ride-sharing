// jest.mock('../services/user.service');

const request = require('supertest');
const app = require('../../server'); 
jest.mock('../services/user.service', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  updateDriverAvailability: jest.fn(),
  findAvailableDriver: jest.fn(),
}));

const userService = require('../services/user.service');
describe('POST users/register - Rider Registration', () => {
  it('should successfully register a rider', async () => {
    // Setup mock to simulate successful registration
    userService.registerUser.mockResolvedValue({
      _id: '123',
      email: 'rider@test.com',
      role: 'rider'
    });

    const response = await request(app)
      .post('/users/register')
      .send({
        email: 'rider@test.com',
        password: 'password',
        role: 'rider'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('role');
    expect(userService.registerUser).toHaveBeenCalled();
  });
});
describe('POST users/login - Rider Login', () => {
  it('should authenticate a rider', async () => {
    // Setup mock to simulate successful login
    userService.loginUser.mockResolvedValue({
      token: 'fakeToken',
      role: 'rider'
    });

    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'riderTest@test.com',
        password: 'password'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(userService.loginUser).toHaveBeenCalled();
  });
});
describe('POST users/register - Driver Registration', () => {
  it('should successfully register a driver', async () => {
    // Setup mock for driver registration
    userService.registerUser.mockResolvedValue({
      _id: '123',
      email: 'driver@test.com',
      role: 'driver',
      vehicleInfo: {
        // 
        licensePlate: 'test123'
      },
      driverLicense: {
        licenseNumber: 'test1234',
        validUntil: '05/23/2025'
      }
    });

    const response = await request(app)
      .post('/users/register')
      .send({
        email: 'driver@test.com',
        password: 'securePass123',
        role: 'driver',
        vehicleInfo: {
          model: 'test',
          make: 'test',
          year: 2023,
          licensePlate: 'test123'
        },
        driverLicense: {
          licenseNumber: 'test1234',
          validUntil: '05/23/2025'
        }
      });
    if(response.statusCode!==201) {
      console.error((response.body.message))
    }
    // expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('role');
    expect(userService.registerUser).toHaveBeenCalled();
  });
});
describe('POST users/login - Driver Login', () => {
  it('should authenticate a driver', async () => {
    // Setup mock to simulate successful login
    userService.loginUser.mockResolvedValue({
      token: 'fakeTokenForDriver',
      role: 'driver'
    });

    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'driverTest@test.com',
        password: 'securePass123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(userService.loginUser).toHaveBeenCalled();
  });
});

describe('PATCH /users/:id/availability - Update driver availability', () => {
  it('should update driver availability successfully', async () => {
    const userId = 'validUserId';
    const availability = true;
    userService.updateDriverAvailability.mockResolvedValue({
      _id: userId,
      driverAvailability: availability,
    });

    const response = await request(app)
      .patch(`/users/${userId}/availability`)
      .send({ availability });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('driverAvailability', availability);
    expect(userService.updateDriverAvailability).toHaveBeenCalledWith(userId, availability);
  });

  it('should return 404 if user not found', async () => {
    userService.updateDriverAvailability.mockRejectedValue(new Error('User not found'));

    const response = await request(app)
      .patch('/users/nonexistentUserId/availability')
      .send({ availability: true });

    expect(response.statusCode).toBe(404);
  });
});

describe('GET users/drivers/available - Get available driver', () => {
  it('should return 200 and an available driver', async () => {
    // Mock the service layer response
    userService.findAvailableDriver.mockResolvedValue({
      _id: 'driverId123',
      driverAvailability: true,
      // Add other necessary driver fields
    });

    const response = await request(app).get('/users/drivers/available');

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.driverAvailability).toBe(true);
    // Ensure the service method was called
    expect(userService.findAvailableDriver).toHaveBeenCalled();
  });

  it('should return 404 when no available drivers are found', async () => {
    // Mock the service layer to return null
    userService.findAvailableDriver.mockResolvedValue(null);

    const response = await request(app).get('/users/drivers/available');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('No available drivers found');
    // Ensure the service method was called
    expect(userService.findAvailableDriver).toHaveBeenCalled();
  });
});
