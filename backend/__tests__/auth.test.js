// backend/__tests__/auth.test.js
const request = require('supertest');
const { app, server } = require('../index'); // Import app and server
const mongoose = require('mongoose');
const User = require('../models/User'); // Import User model

// Use a test database or clear the main one
beforeAll(async () => {
  await User.deleteMany({});
});

// Close the server and DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

// Test suite
describe('Auth Endpoints', () => {
  // Test for POST /api/auth/register
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      });

    expect(res.statusCode).toEqual(201); // 201 Created
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  // Test for POST /api/auth/login
  it('should log in an existing user successfully', async () => {
    await User.create({
      email: 'login@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  // Test for failed login
  it('should fail to log in with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
  });

  // Test for accessing protected route with valid token
  it('should access a protected route with a valid token', async () => {
    // First, register and get a token
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'protected@example.com',
        password: 'password123',
      });

    const token = registerRes.body.token;

    // Now, try to access the protected route
    const res = await request(app)
      .get('/api/auth/protected') // This route will be created later
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('email', 'protected@example.com');
  });

  // Test for failing to access protected route without token
  it('should fail to access protected route without a token', async () => {
    const res = await request(app).get('/api/auth/protected');
    expect(res.statusCode).toEqual(401);
  });
});
