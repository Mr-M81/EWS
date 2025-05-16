const express = require('express');
const connectDB = require('./config/mongoDBconfig');
const cors = require('cors')
const teacherController = require('./controllers/teacherController'); 
const attendance = require('./controllers/attendanceController');
const app = express();
const PORT = 8081;

//MongoDB connection
connectDB();

app.use(express.json());
app.use(cors()); 

// route
app.use('/teachers', teacherController);
app.use('/attendance', attendance);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
