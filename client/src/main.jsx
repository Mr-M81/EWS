import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './Dashboard.css'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './LoginPage.jsx';
import Dashboard from './Dashboard.jsx';
import AttendancePage from './attendance.jsx';
import IncidentReporting from './incident.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* Wrap your app with BrowserRouter */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/incident" element={<IncidentReporting/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

