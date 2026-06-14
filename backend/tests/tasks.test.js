// backend/tests/tasks.test.js
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Build the app without starting the server (no connectDB)
import authRoutes from '../routes/authRoutes.js';
import todoRoutes from '../routes/todoRoutes.js';
import { errorHandler } from '../middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

let token = '';

describe('Auth routes', () => {
  it('POST /api/auth/register - creates a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('POST /api/auth/login - rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('Todo routes (protected)', () => {
  it('GET /api/todos - returns 401 without token', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/todos - returns 200 with valid token', async () => {
    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('todos');
  });

  it('POST /api/todos - creates a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test todo', priority: 'medium' });
    expect(res.statusCode).toBe(201);
    expect(res.body.todo).toHaveProperty('title', 'Test todo');
  });

  it('GET /api/health - public health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
  });
});