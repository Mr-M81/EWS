const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('EWS Backend running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
