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

// Convert "Class A" → "learners_classa"
function mapClassToCollectionName(classAssigned) {
  console.log("Mapping classAssigned:", classAssigned);
  const suffix = classAssigned.trim().replace(/\s+/g, '').toLowerCase(); 
  return `learners_${suffix}`;
}

async function getStudentsForTeacher(teacherId) {
  // Step 1: Find teacher
  const teacher = await schoolTeacher.findById(teacherId);
  if (!teacher) {
    throw new Error('Teacher not found');
  }

  const classAssigned = teacher.classAssigned;
  if (!classAssigned) {
    throw new Error('classAssigned is missing from teacher document');
  }

  // Step 2: Determine collection name
  const collectionName = mapClassToCollectionName(classAssigned);

  // Step 3: Dynamically get the collection
  const classCollection = mongoose.connection.collection(collectionName);

  // Step 4: Get all students from that class
  const students = await classCollection.find({}).toArray();

  return { students, classAssigned, teacher };
}

module.exports = {
  getStudentsForTeacher
};

// module.exports = {
//     markAttendance,
//     getAttendanceByDate
// };
