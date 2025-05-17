// // attendanceController.js
// const express = require('express');
// const router = express.Router();
// const { authenticateToken } = require('../utils/authMiddleware'); // Import the middleware
// const attendanceService = require('../service/attendanceService');

// // POST route to submit attendance (protected route)
// router.post('/attendance', authenticateToken, async (req, res) => {
//     const { class_id, students, date } = req.body;
//     const teacher_id = req.teacher.teacher_id;  // Get the teacher's ID from the decoded JWT token

//     try {
//         const attendance = await attendanceService.submitAttendance(teacher_id, class_id, students, date);
//         res.status(200).json({ message: 'Attendance successfully recorded', attendance });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/authMiddleware');
const attendanceService = require('../service/attendanceService');
const schoolTeacher = require('../model/teacherModel');
const mongoose = require('mongoose');

router.get('/students', authenticateToken, async (req, res) => {
  console.log("🧪 Checking token in /students route:");
  console.log("🔐 Decoded token:", req.teacher);

  try {
    const teacherId = req.teacher.teacher_id;
    console.log("🎯 teacherId from token:", teacherId);

    const { students } = await attendanceService.getStudentsForTeacher(teacherId);

    console.log("✅ Students fetched:", students.length);
    res.status(200).json({ students });
  } catch (err) {
    console.error("❌ Error in /students:", err.message); // Log the real error
    res.status(500).json({ error: err.message }); // Show the real issue
  }
});

//verifies that the token actually works on Postman
router.get('/check-token', authenticateToken, (req, res) => {
  try {
    const decodedTeacher = req.teacher;

    res.status(200).json({
      message: "✅ Token is valid",
      teacher: decodedTeacher
    });
  } catch (err) {
    res.status(500).json({ error: '❌ Token validation failed' });
  }
});

//Save student route
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.teacher.teacher_id;
    const studentList = req.body.students;

    if (!Array.isArray(studentList) || studentList.length === 0) {
      return res.status(400).json({ error: 'No student attendance data provided' });
    }

    const attendance = await attendanceService.submitAttendance(teacherId, studentList);

    res.status(201).json({
      message: '✅ Attendance submitted successfully',
      attendance
    });
  } catch (err) {
    console.error("❌ Error in /attendance/submit:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/latest', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.teacher.teacher_id;

    // Get teacher and collection
    const teacher = await schoolTeacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const classAssigned = teacher.classAssigned;
    const collectionName = `${classAssigned.trim().replace(/\s+/g, '').toLowerCase()}_attendance`;
    const AttendanceModel = mongoose.connection.collection(collectionName);

    // Get latest attendance session
    const latestSession = await AttendanceModel
      .find({ teacher_id: teacher._id })
      .sort({ attendance_date: -1 })
      .limit(1)
      .toArray();

    if (!latestSession || latestSession.length === 0) {
      return res.status(404).json({ error: 'No attendance record found' });
    }

    res.json(latestSession[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch latest attendance' });
  }
});

module.exports = router;

