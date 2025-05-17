import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from './Sidebar.jsx';
import './attendance.css';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';


export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [showChart, setShowChart] = useState(false);
  const [latestData, setLatestData] = useState(null);
  const navigate = useNavigate();

  // Fetch students from backend using token
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:8081/attendance/students', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const initialStatus = res.data.students.map(s => ({
          student_id: s.student_id,
          student_name: s.student_name,
          status: null
        }));
        setStudents(initialStatus);
      })
      .catch(err => {
        console.error(err);
        alert('Session expired or unauthorized');
        navigate('/');
      });
  }, []);

  // Toggle Present → Absent → null → Present
  const toggleStatus = (index) => {
    setStudents(prev => {
      const updated = [...prev];
      const current = updated[index].status;

      if (current === null) {
        updated[index].status = 'Present';
      } else if (current === 'Present') {
        updated[index].status = 'Absent';
      } else if (current === 'Absent') {
        updated[index].status = null;
      }

      return updated;
    });
  };

  // Save attendance
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const markedStudents = students.filter(s => s.status !== null);
      await axios.post(
        'http://localhost:8081/attendance/submit',
        { students: markedStudents },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('✅ Attendance recorded successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save attendance');
    }
  };
  const fetchLatestAttendance = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:8081/attendance/latest', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLatestData(response.data);
    setShowChart(true);
  } catch (err) {
    console.error(err);
    alert('❌ Failed to load latest attendance');
  }
};


const downloadAttendancePDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Attendance Summary', 70, 10);

  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 10, 20);
  doc.text(`Teacher: ${teacherName}`, 10, 30); 

  let y = 50;
  doc.text('Student Name', 10, y);
  doc.text('Status', 150, y);
  y += 10;

  students.forEach((student, index) => {
    doc.text(student.student_name, 10, y);
    doc.text(student.status || 'N/A', 150, y);
    y += 10;
  });

  doc.save(`attendance-${date}.pdf`);
};

  // Count summary
  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;

  return (
    <div className="attendance-page">
      <Sidebar />
      <main className="attendance-main">
        <div className="attendance-wrapper">
          <h1 className="attendance-title">Attendance Register</h1>
          <p className="attendance-date">{date}</p>

          <div className="attendance-list">
            {students.map((student, index) => (
              <div
                key={index}
                onClick={() => toggleStatus(index)}
                className={`attendance-item ${
                  student.status === 'Present'
                    ? 'present'
                    : student.status === 'Absent'
                    ? 'absent'
                    : 'neutral'
                }`}
              >
                <span className="attendance-index">{index + 1}</span>
                <span className="attendance-name">{student.student_name}</span>
                <span className="attendance-status">
                  {student.status === 'Present'
                    ? 'P'
                    : student.status === 'Absent'
                    ? 'A'
                    : ''}
                </span>
              </div>
            ))}
          </div>

          {/* 📊 Summary display */}
          <div className="attendance-summary">
            <p><strong>Present:</strong> {presentCount} &nbsp;|&nbsp; <strong>Absent:</strong> {absentCount}</p>
          </div>

          <div className="attendance-action">
            <button onClick={handleSave} className="attendance-save-btn">
              Save Attendance
            </button>
          </div>
        </div>
        {!showChart && (
  <div className="attendance-action">
    <button onClick={fetchLatestAttendance} className="attendance-save-btn">
      View Attendance Summary
    </button>
  </div>
)}

    {showChart && latestData && (
    <div className="attendance-chart">
        <h2>Summary for {new Date(latestData.attendance_date).toLocaleDateString()}</h2>
        <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
            data={[
                { name: 'Present', value: latestData.students.filter(s => s.status === 'Present').length },
                { name: 'Absent', value: latestData.students.filter(s => s.status === 'Absent').length }
            ]}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            fill="#8884d8"
            label
            >
            <Cell fill="#00C49F" />
            <Cell fill="#FF6B6B" />
            </Pie>
            <Tooltip />
        </PieChart>
        </ResponsiveContainer>

        {/* Download pdf */}
        <button onClick={downloadAttendancePDF} className="attendance-save-btn">
            Download PDF
        </button>
    </div>
    )}
      </main>
    </div>
  );
}