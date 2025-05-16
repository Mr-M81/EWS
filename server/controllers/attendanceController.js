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

router.get('/students', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.teacher.teacher_id;
    const { students } = await attendanceService.getStudentsForTeacher(teacherId);
    res.status(200).json({ students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

