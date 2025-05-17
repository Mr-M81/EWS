const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/authMiddleware');
const incidentService = require('../service/incidentService');

// POST /incident/report
router.post('/report', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.teacher.teacher_id;
    const incidentData = req.body;

    // Validate input
    if (!incidentData.student_id || !incidentData.student_name || !incidentData.description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Submit to DB
    const incident = await incidentService.reportIncident(teacherId, incidentData);
    res.status(201).json({ message: 'Incident reported successfully', incident });
  } catch (err) {
    console.error('❌ Error reporting incident:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;