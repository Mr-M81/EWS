import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaChalkboardTeacher,
  FaUsers,
  FaExclamationTriangle,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-item active' : 'nav-item';

  return (
    <aside className="sidebar">
      <div>
        <div className="logo">
          <FaChalkboardTeacher size={28} />
          <span>EWS</span>
        </div>
        <nav className="nav">
          <button className={isActive('/dashboard')} onClick={() => navigate('/dashboard')}>
            <FaHome /> Home
          </button>
          <button className={isActive('/attendance')} onClick={() => navigate('/attendance')}>
            <FaChalkboardTeacher /> Take Attendance
          </button>
          <button className={isActive('/incident')} onClick={() => navigate('/incident')}>
            <FaExclamationTriangle /> Report Incident
          </button>
          <button className={isActive('/students')} onClick={() => navigate('/students')}>
            <FaUsers /> Students
          </button>
          <button className={isActive('/settings')} onClick={() => navigate('/settings')}>
            <FaCog /> Settings
          </button>
        </nav>
      </div>
      <button className="nav-item signout" onClick={() => navigate('/')}>
        <FaSignOutAlt /> Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;