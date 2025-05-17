const mongoose = require('mongoose');
const schoolTeacher = require('../model/teacherModel');
const IncidentModel = require('../model/incidentModel').schema; // Only the schema

//Convert "Class A" → "classa_incidents"
function mapClassToIncidentCollection(classAssigned) {
  return `${classAssigned.trim().replace(/\s+/g, '').toLowerCase()}_incidents`;
}

async function reportIncident(teacherId, incidentData) {
  // Step 1: Get teacher info from DB
  const teacher = await schoolTeacher.findById(teacherId);
  if (!teacher) throw new Error('Teacher not found');

  const collectionName = mapClassToIncidentCollection(teacher.classAssigned);

  // Step 2: Use dynamic collection (e.g., classa_incidents)
  const DynamicIncidentModel = mongoose.model(collectionName, IncidentModel, collectionName);

  // Step 3: Auto-fill fields from teacher + save student data
  const newIncident = new DynamicIncidentModel({
    student_id: incidentData.student_id,
    student_name: incidentData.student_name,
    //class_assigned: teacher.classAssigned,
    teacher_id: teacher._id,
    teacher_name: teacher.full_name,
    description: incidentData.description,
    category: incidentData.category || 'Other',
    severity: incidentData.severity || 'Low'
  });

  await newIncident.save();
  return newIncident;
}

module.exports = {
  reportIncident
};