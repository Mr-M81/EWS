//const Attendance = require('../model/attendanceModel');

// // MArking the register
// async function markAttendance(teacher_id, date, attendanceList) {
//     const records = [];

//     for (const entry of attendanceList) {
//         const attendance = new Attendance({
//             student_id: entry.student_id,
//             teacher_id: teacher_id,
//             date: date,
//             status: entry.status
//         });

//         await attendance.save();
//         records.push(attendance);
//     }
//     return records;
// }

// //viewing the attendance on Postman
// async function getAttendanceByDate(date) {
//     return Attendance.find({ date: new Date(date) })
//         .populate('student_id')
//         .populate('teacher_id')
//         .exec();
// }

const schoolTeacher = require('../model/teacherModel');
const mongoose = require('mongoose');
const Attendance = require('../model/attendanceModel'); // full model
const attendanceSchema = Attendance.schema; // ✅ get schema from model
const { v4: uuidv4 } = require('uuid');

// 🔁 Helper: Convert "Class A" → "learners_classa"
function mapClassToCollectionName(classAssigned) {
  const suffix = classAssigned.trim().replace(/\s+/g, '').toLowerCase(); 
  return `learners_${suffix}`;
}

// 🔁 Helper: Convert "Class A" → "classa_attendance"
function mapClassToCollectionNameforAttendance(classAssigned) {
  const suffix = classAssigned.trim().replace(/\s+/g, '').toLowerCase();
  return `${suffix}_attendance`;
}

// ✅ Get students for the teacher's assigned class
async function getStudentsForTeacher(teacherId) {
  const teacher = await schoolTeacher.findById(teacherId);
  if (!teacher) {
    throw new Error('Teacher not found');
  }

  const classAssigned = teacher.classAssigned;
  if (!classAssigned) {
    throw new Error('classAssigned is missing from teacher document');
  }

  const collectionName = mapClassToCollectionName(classAssigned);
  const classCollection = mongoose.connection.collection(collectionName);
  const students = await classCollection.find({}).toArray();

  return { students, classAssigned, teacher };
}

// ✅ Save attendance into dynamic class-specific collection
async function submitAttendance(teacherId, studentList) {
  const teacher = await schoolTeacher.findById(teacherId);
  if (!teacher) throw new Error('Teacher not found');

  const classAssigned = teacher.classAssigned;
  const collectionName = mapClassToCollectionNameforAttendance(classAssigned);

  const DynamicAttendanceModel = mongoose.model(
    collectionName,
    attendanceSchema,
    collectionName
  );

  // 🔍 Check for existing attendance record for today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to start of the day

  const existing = await DynamicAttendanceModel.findOne({
    teacher_id: teacher._id,
    class_id: classAssigned,
    attendance_date: { $gte: today }
  });

  if (existing) { // checks if attendance for the day has been done or not
    throw new Error('Attendance for this class has already been recorded today.');
  }

  // ✅ Create new attendance record
  const sessionId = `session_${Date.now()}_${uuidv4()}`;

  const attendanceRecord = new DynamicAttendanceModel({
    session_id: sessionId,
    class_id: classAssigned,
    teacher_id: teacher._id,
    teacher_name: teacher.full_name,
    students: studentList
  });

  await attendanceRecord.save();
  return attendanceRecord;
}

module.exports = {
  getStudentsForTeacher,
  submitAttendance
};

// module.exports = {
//     markAttendance,
//     getAttendanceByDate
// };
