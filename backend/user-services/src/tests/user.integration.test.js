const request = require('supertest');
const app = require('../../server'); // Adjust the path as needed
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });

describe('User Service Integration Tests', () => {
  it('should register a new user', async () => {
    const newUser = {
      email: 'test@example.com',
      password: 'testPassword',
      role: 'rider',
    };

    const response = await request(app)
      .post('/users/register') // Adjust the endpoint as needed
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('role');
    expect(response.body.email).toBe(newUser.email);
    // Further assertions as needed
  });

  describe('User Login', () => {
    
    it('should allow the user to login successfully with correct credentials', async () => {
        const testUser = {
            email: 'testuser@example.com',
            password: 'testPassword123',
            role: 'rider', // Include any other necessary fields based on your schema
        };
          
        await request(app)
            .post('/users/register') // Adjust this endpoint based on your API's routes
            .send(testUser)
            .expect(201); // Expect a 201 Created status code if successful
            
        const response = await request(app)
          .post('/users/login') // Adjust this endpoint based on your API's routes
          .send({
            email: testUser.email,
            password: testUser.password,
          });
      
        expect(response.statusCode).toBe(200); // Assuming 200 OK is returned for a successful login
        expect(response.body).toHaveProperty('token'); // Check for the presence of a token in the response
      });
  });
});
