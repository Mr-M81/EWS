import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './incident.css';


export default function IncidentReportingPage() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ category: '', description: '', severity: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8081/attendance/students', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setStudents(res.data.students);
    })
    .catch(err => console.error('Error fetching students:', err));
  }, []);

  const openModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setFormData({ category: '', description: '', severity: '' });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8081/incident/report', {
        student_id: selectedStudent.student_id,
        student_name: selectedStudent.student_name,
        ...formData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Incident reported successfully!');
      closeModal();
    } catch (err) {
      console.error('❌ Error submitting incident:', err);
      alert('Failed to report incident.');
    }
  };

  return (
  <div className="incident-page">
    <Sidebar />
    <main className="incident-main">
      <h1 className="incident-title">Incident Reporting</h1>
      <div className="incident-grid">
        {students.map((student, idx) => (
          <div key={idx} className="incident-student-card">
            <h3>{student.student_name}</h3>
            <p>ID: {student.student_id}</p>
            <button className="report-btn" onClick={() => openModal(student)}>Report</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Report Incident: {selectedStudent.student_name}</h2>
            <form>
              <label>Category:</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Disruption">Disruption</option>
                <option value="Violence">Violence</option>
                <option value="Absenteeism">Absenteeism</option>
                <option value="Late submission">Late submission</option>
                <option value="Other">Other</option>
              </select>
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <label>Severity:</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              >
                <option value="">Select Severity</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="button" className="submit-btn" onClick={handleSubmit}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  </div>
);
}