import React from 'react';
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

const Sidebar = () => (
  <aside className="sidebar">
    <div>
      <div className="logo">  
        <FaChalkboardTeacher size={28} />
        <span>EWS</span>
      </div>
      <nav className="nav">
        <button className="nav-item active"><FaHome /> Home</button>
        <button className="nav-item"><FaChalkboardTeacher /> Take Attendance</button>
        <button className="nav-item"><FaUsers /> Students</button>
        <button className="nav-item"><FaExclamationTriangle /> At-Risk Students</button>
        <button className="nav-item"><FaCog /> Settings</button>
      </nav>
    </div>
    <button className="nav-item signout"><FaSignOutAlt /> Sign Out</button>
  </aside>
);

const Topbar = () => (
  <header className="topbar">
    <div className="theme-toggle">
      <FaSun />
      <label className="switch">
        <input type="checkbox" />
        <span className="slider" />
      </label>
      <FaMoon />
    </div>
    <button className="icon-btn">
      <FaBell />
      <span className="badge">3</span>
    </button>
    <button className="icon-btn"><FaCog /></button>
    <img className="avatar" src="/assets/avatar.jpg" alt="Teacher avatar" />
  </header>
);

const Banner = () => (
  <section className="banner">
    <h1>Welcome back, Teacher101!</h1>
    <img src="/assets/undraw_class.svg" alt="Teacher and students" />
  </section>
);

const ChartPlaceholder = ({ label }) => (
  <div className="chart-placeholder">{label} Chart</div>
);

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

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <Banner />

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