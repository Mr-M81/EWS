Early Warning System (EWS) – Iteration 1

The Early Warning System (EWS) is a full-stack school-focused web application built using React (client) and Node.js + Express (server). It helps teachers track and manage student attendance and incident reports within their assigned class.

Project Structure:
------------------
EWS/
│
├── client/         # Frontend React application (port: 5173)
├── server/         # Backend Node.js + Express API (port: 8081)
└── README.txt

Requirements:
-------------
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB running locally on mongodb://127.0.0.1:27017

Running the Application:
------------------------
1. Clone the Project
   git clone https://github.com/your-username/early-warning-system.git
   cd early-warning-system

2. Start the Backend Server
   cd server
   npm install
   npm run dev
   (Runs on http://localhost:8081)

3. Start the Frontend Client
   cd ../client
   npm install
   npm run dev
   (Runs on http://localhost:5173)

Authentication:
---------------
- JWT-based login for teachers
- Email validation via UserCheck API
- Passwords are hashed with bcrypt
- JWTs are stored in localStorage for session management

Features:
---------
Teacher Registration & Login (JWT + bcrypt + Email validation)
Attendance Tracking (Dynamic class-specific collections, toggle present/absent)
PDF Download of attendance report
Incident Reporting (Form with category, description, severity)

Testing:
--------
To run backend tests:
   cd server
   npm test
(Uses Jest + Supertest)

Other Notes:
------------
- Frontend: React 19 + React Router
- Backend: Express.js + MongoDB
- Spinner: Custom FancySpinner Component
- Notifications: react-toastify

Authors:
--------
- Kabelo Masola (UCT, INF4027W)

License:
--------
This project is for educational use and academic submission only.
