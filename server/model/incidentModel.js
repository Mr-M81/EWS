const mongoose = require('mongoose');
const { Schema } = mongoose;

const incidentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true
  },
  student_name: {
    type: String,
    required: true
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'schoolTeacher',
    required: true
  },
  teacher_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Disruption', 'Violence', 'Absenteeism', 'Late submission', 'Other'],
    default: 'Other'
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  reported_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);