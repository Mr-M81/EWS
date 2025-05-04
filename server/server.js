const express = require('express');
const connectDB = require('./config/config');
const teacherController = require('./controllers/teacherController'); 

const app = express();
const PORT = 8081;

//MongoDB connection
connectDB();

app.use(express.json());

// route
app.use('/teachers', teacherController);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
