// backend/__tests__/sweets.test.js
const request = require('supertest');
const { app, server } = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const Sweet = require('../models/sweet');

let userToken;
let adminToken;
let adminUserId;

// Setup: Create a user and an admin, get their tokens
beforeAll(async () => {
  // Clear test database
  await User.deleteMany({});
  await Sweet.deleteMany({});
  
  // Create standard user (register then login to reliably get a token)
  const regUserRes = await request(app).post('/api/auth/register').send({
    email: 'user@example.com',
    password: 'password123',
  });
  expect([200, 201]).toContain(regUserRes.status); // surface register problems early

  const userRes = await request(app).post('/api/auth/login').send({
    email: 'user@example.com',
    password: 'password123',
  });
  expect(userRes.status).toBe(200);
  userToken = userRes.body.token;
  if (!userToken) throw new Error('User token not returned from login during test setup');

  // Create admin user (register then login)
  const regAdminRes = await request(app).post('/api/auth/register').send({
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  });
  expect([200, 201]).toContain(regAdminRes.status);

  const adminLoginRes = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'password123',
  });
  expect(adminLoginRes.status).toBe(200);
  adminToken = adminLoginRes.body.token;
  adminUserId = adminLoginRes.body.user ? adminLoginRes.body.user._id : null;
  if (!adminToken) throw new Error('Admin token not returned from login during test setup');
});

// Teardown
afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

// Test Suite for Sweets
describe('Sweets API', () => {
  beforeEach(async () => {
    await Sweet.deleteMany({});

    await Sweet.insertMany([
      { name: 'Chocolate Bar', category: 'Chocolate', price: 3, quantity: 10 },
      { name: 'Gummy Bears', category: 'Candy', price: 2, quantity: 10 },
      { name: 'Deluxe Chocolate Box', category: 'Chocolate', price: 15, quantity: 10 },
      { name: 'Caramel Chew', category: 'Candy', price: 8, quantity: 10 },
    ]);
  });

  it('should search by category', async () => {
    const res = await request(app)
      .get('/api/sweets/search?category=Candy')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].category).toBe('Candy');
  });

  it('should search by price range', async () => {
    const res = await request(app)
      .get('/api/sweets/search?minPrice=5&maxPrice=20')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(2);
  });

  it('should create a new sweet as a logged-in user', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Lollipop',
        category: 'Candy',
        price: 1.99,
        quantity: 100,
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('name', 'Lollipop');
  });

  it('should fail to create a sweet if not logged in', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .send({
        name: 'No-Auth Choco',
        category: 'Candy',
        price: 5.99,
        quantity: 50,
      });

    expect(res.statusCode).toEqual(401);
  });

  it('should get all available sweets', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should FAIL to delete a sweet as a regular user', async () => {
    const sweet = await Sweet.create({ name: 'Deletable', category: 'Test', price: 1, quantity: 1 });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(403);
  });

  it('should delete a sweet as an admin user', async () => {
    const sweet = await Sweet.create({ name: 'Admin Deletable', category: 'Test', price: 1, quantity: 1 });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('should allow a user to purchase a sweet, decreasing quantity', async () => {
    const sweet = await Sweet.create({ name: 'Purchasable', category: 'Test', price: 5, quantity: 10 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.quantity).toBe(9);
  });

  it('should fail to purchase a sweet that is out of stock', async () => {
    const sweet = await Sweet.create({ name: 'Sold Out', category: 'Test', price: 5, quantity: 0 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
  
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Sweet is out of stock');
  });

  it('should allow an admin to restock a sweet, increasing quantity', async () => {
    const sweet = await Sweet.create({ name: 'Restockable', category: 'Test', price: 5, quantity: 10 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 50 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.quantity).toBe(60);
  });

  it('should FAIL to restock as a regular user', async () => {
    const sweet = await Sweet.create({ name: 'User Restock', category: 'Test', price: 5, quantity: 10 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 50 });
  
    expect(res.statusCode).toEqual(403);
  });

  it('should allow an admin to update a sweet', async () => {
    const sweet = await Sweet.create({ name: 'Old Name', category: 'Test', price: 1, quantity: 1 });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New Updated Name',
        price: 9.99,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.name).toBe('New Updated Name');
    expect(res.body.data.price).toBe(9.99);
  });

  it('should FAIL to update a sweet as a regular user', async () => {
    const sweet = await Sweet.create({ name: 'Cant Update', category: 'Test', price: 1, quantity: 1 });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Attempted New Name' });

    expect(res.statusCode).toEqual(403);
  });

  it('should search by name (case-insensitive)', async () => {
    const res = await request(app)
      .get('/api/sweets/search?name=chocolate')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].name).toContain('Chocolate');
  });

  it('should search by category', async () => {
    const res = await request(app)
      .get('/api/sweets/search?category=Candy')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].category).toBe('Candy');
  });

  it('should search by price range', async () => {
    const res = await request(app)
      .get('/api/sweets/search?minPrice=5&maxPrice=20')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(2);
  });

  it('should combine search queries (category and minPrice)', async () => {
    const res = await request(app)
      .get('/api/sweets/search?category=Chocolate&minPrice=10')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Deluxe Chocolate Box');
  });
});
