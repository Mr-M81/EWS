const express = require('express');
const router = express.Router();
const teacherService = require('../service/teacherService');

// Register route for adding new teacher
router.post('/registration', async (req, res) => {
    try {
        const { full_name, identification_number, email, password, class_assigned } = req.body;
        const teacher = await teacherService.registerSchoolTeacher(full_name, identification_number, email, password, class_assigned);
        res.status(201).json(teacher);  // Return the newly created teacher
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login route for teacher authentication
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { token, teacher } = await teacherService.loginSchoolTeacher(email, password);  // Get the token and teacher details

        // If credentials are wrong or teacher not found
        if (!teacher) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Successful login, return the token and teacher details
        res.status(200).json({
            token,  // The JWT token generated
            teacher: {
                id: teacher._id, 
                name: teacher.full_name,
                email: teacher.email,
                classAssigned: teacher.classAssigned  // You can return any other teacher-related information
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;