const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const attendanceRoutes = require('../controllers/attendanceController');
const schoolTeacher = require('../model/teacherModel');

const app = express();
app.use(express.json());
app.use('/attendance', attendanceRoutes);

let token;
let testTeacher;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/EWS_Test', { dbName: 'EWS_Test' });
  await schoolTeacher.deleteMany({});
  testTeacher = await schoolTeacher.create({
    full_name: 'Attendance Tester',
    identification_number: 'att-123456',
    email: 'att@teacher.com',
    password: 'hashedPassword',
    classAssigned: 'Class A'
  });

  token = jwt.sign({ teacher_id: testTeacher._id, teacher_name: testTeacher.full_name }, 'myjsonsecretkey101');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Attendance API', () => {
  it('should return students for the assigned class', async () => {
    const res = await request(app)
      .get('/attendance/students')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
  });

  it('should submit attendance successfully', async () => {
    const res = await request(app)
      .post('/attendance/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        students: [
          {
            student_id: '123456789',
            student_name: 'Test Student A',
            status: 'Present'
          },
          {
            student_id: '987654321',
            student_name: 'Test Student B',
            status: 'Absent'
          }
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', '✅ Attendance submitted successfully');
  });
});
