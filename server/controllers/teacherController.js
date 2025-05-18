const express = require('express');
const router = express.Router();
const teacherService = require('../service/teacherService');

// Register route for adding new teacher
router.post('/registration', async (req, res) => {
    try {
        const { full_name, identification_number, email, password, classAssigned } = req.body;
        const teacher = await teacherService.registerSchoolTeacher(full_name, identification_number, email, password, classAssigned);
        res.status(201).json(teacher);  // Return the newly created teacher
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login route for teacher authentication
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, teacher } = await teacherService.loginSchoolTeacher(email, password);

    if (!teacher) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      token,
      teacher: {
        id: teacher._id,
        name: teacher.full_name,
        email: teacher.email,
        classAssigned: teacher.classAssigned
      }
    });
  } catch (err) {
    // ✅ Customize error handling
    const isAuthError =
      err.message === "Teacher not found" || err.message === "Invalid credentials";

    res.status(isAuthError ? 401 : 500).json({ error: err.message });
  }
});

module.exports = router;