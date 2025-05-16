const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
  session_id: {
    type: String,
    required: true,
    unique: true
  },
  class_id: {
    type: String,
    required: true
  },
  attendance_date: {
    type: Date,
    required: true,
    default: Date.now
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
  students: [
    {
      student_id: {
        type: String,
        required: true
      },
      student_name: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);