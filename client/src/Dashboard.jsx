import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import {
  FaHome,
  FaChalkboardTeacher,
  FaUsers,
  FaExclamationTriangle,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import './Dashboard.css';
import Sidebar from './Sidebar.jsx';



// Welcome banner with teacher name
const Banner = ({ teacherName }) => (
  <section className="banner">
    <div className="banner-text">
      <h1>Welcome to Early Warning, {teacherName}!</h1>
    </div>
    <img className="banner-img" src="/newimage.png" alt="Smiling student" />
  </section>
);

// Dummy chart section
const ChartPlaceholder = ({ label }) => (
  <div className="chart-placeholder">{label} Chart</div>
);

// Static at-risk student list
const AtRiskList = () => {
  const data = [
    { cls: 'Class A', note: 'Simon was asked to leave for fighting', time: '01 Aug, 12:20PM' },
    { cls: 'Class C', note: 'Bianca absent without notice', time: '01 Aug, 04:20PM' },
    { cls: 'Class E', note: 'Late submission of assignment', time: '01 Oct, 08:20AM' },
  ];
  return (
    <div className="at-risk-list">
      <div className="list-header">
        <h3>At-Risk Students</h3>
        <a href="#">See all</a>
      </div>
      {data.map((item, i) => (
        <div className="list-item" key={i}>
          <div className="icon-box"><FaExclamationTriangle /></div>
          <div>
            <strong>{item.cls}</strong>
            <p>{item.note}</p>
            <small>{item.time}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Dashboard
export default function Dashboard() {
  const [teacherName, setTeacherName] = useState('Teacher');
  // Move the useNavigate hook inside the component
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTeacherName(decoded.teacher_name || 'Teacher');
      } catch (err) {
        console.error('Error decoding token:', err);
        setTeacherName('Teacher');
      }
    }
  }, []);

  return (
    <div className="dashboard-container">
      {/* Pass navigate to Sidebar */}
      <Sidebar />
      <main className="main-content">
        <Banner teacherName={teacherName} />

        <div className="cards-row">
          <div className="card">
            <h2>Attendance</h2>
            <ChartPlaceholder label="Attendance" />
          </div>
          <div className="card">
            <h2>Test Averages</h2>
            <ChartPlaceholder label="Test Averages" />
          </div>
        </div>

        <div className="cards-row">
          <div className="card">
            <h2>Statistics</h2>
            <ChartPlaceholder label="Statistics" />
          </div>
          <div className="card">
            <AtRiskList />
          </div>
        </div>
      </main>
    </div>
  );
}