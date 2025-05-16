const mongoose = require('mongoose');

const schoolTeacherSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true
  },
  identification_number: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  classAssigned: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('schoolTeacher', schoolTeacherSchema);
