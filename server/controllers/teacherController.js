const express = require('express');
const router = express.Router();
const teacherService = require('../service/teacherService');

// Register
router.post('/registration', async (req, res) => {
    try {
        const { full_name, identification_number, email, password, class_assigned } = req.body;
        const teacher = await teacherService.registerSchoolTeacher(full_name, identification_number, email, password, class_assigned);
        res.status(201).json(teacher);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const teacher = await teacherService.loginSchoolTeacher(email, password);

        if (!teacher) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
