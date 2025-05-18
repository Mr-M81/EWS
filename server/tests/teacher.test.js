// tests/teacher.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const teacherRoutes = require('../controllers/teacherController');
const schoolTeacher = require('../model/teacherModel');

jest.mock('../utils/emailValidation', () => ({
  isEmailValid: jest.fn(() => Promise.resolve(true))
}));

const app = express();
app.use(express.json());
app.use('/teachers', teacherRoutes);

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/EWS_Test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterEach(async () => {
  await schoolTeacher.deleteMany({}); // Clear test DB
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Teacher API Endpoints', () => {
  describe('POST /teachers/registration', () => {
    it('should register a teacher with valid data', async () => {
      const res = await request(app).post('/teachers/registration').send({
        full_name: 'Test Teacher',
        identification_number: '1234567890',
        email: `teacher_${Date.now()}@example.com`,
        password: 'password123',
        classAssigned: 'Class A'
      });
      console.log('Registration response:', res.body);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('full_name', 'Test Teacher');
    });
  });

  describe('POST /teachers/login', () => {
    it('should fail login with wrong credentials', async () => {
      const res = await request(app).post('/teachers/login').send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should login successfully with correct credentials', async () => {
      const teacherData = {
        full_name: 'Login Test',
        identification_number: '9876543210',
        email: 'login@example.com',
        password: 'securepass',
        classAssigned: 'Class B'
      };

      await request(app).post('/teachers/registration').send(teacherData);

      const res = await request(app).post('/teachers/login').send({
        email: 'login@example.com',
        password: 'securepass'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.teacher).toHaveProperty('email', 'login@example.com');
      console.log('Login error:', res.body);
    });
  });
});