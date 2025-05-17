import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaChalkboardTeacher,
  FaUsers,
  FaExclamationTriangle,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import './Dashboard.css';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div>
        <div className="logo">
          <FaChalkboardTeacher size={28} />
          <span>EWS</span>
        </div>
        <nav className="nav">
          <button className="nav-item" onClick={() => navigate('/dashboard')}><FaHome /> Home</button>
          <button className="nav-item active" onClick={() => navigate('/attendance')}><FaChalkboardTeacher /> Take Attendance</button>
          <button className="nav-item" onClick={() => navigate('/incident')}><FaExclamationTriangle /> Report Incident</button>
          <button className="nav-item"><FaUsers /> Students</button>
          <button className="nav-item"><FaCog /> Settings</button>
        </nav>
      </div>
      <button className="nav-item signout" onClick={() => navigate('/')}> <FaSignOutAlt /> Sign Out </button>
    </aside>
  );
};

export default Sidebar;
