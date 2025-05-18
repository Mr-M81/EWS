const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const incidentRoutes = require('../controllers/incidentController');
const schoolTeacher = require('../model/teacherModel');

const app = express();
app.use(express.json());
app.use('/incidents', incidentRoutes);

let token;
let testTeacher;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/EWS_Test', { dbName: 'EWS_Test' });
  await schoolTeacher.deleteMany({});
  testTeacher = await schoolTeacher.create({
    full_name: 'Incident Tester',
    identification_number: 'inc-123456',
    email: 'inc@teacher.com',
    password: 'hashedPassword',
    classAssigned: 'Class A'
  });

  token = jwt.sign({ teacher_id: testTeacher._id, teacher_name: testTeacher.full_name }, 'myjsonsecretkey101');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Incident API', () => {
  it('should report an incident successfully', async () => {
    const res = await request(app)
      .post('/incidents/report')
      .set('Authorization', `Bearer ${token}`)
      .send({
        student_id: '56789',
        student_name: 'Test Incident Student',
        category: 'Disruption',
        description: 'Talking loudly during class',
        severity: 'High'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Incident reported successfully');
    expect(res.body.incident).toHaveProperty('student_name', 'Test Incident Student');
  });
});
