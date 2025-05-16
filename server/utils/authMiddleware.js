// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'myjsonsecretkey101'; // use your actual key

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token invalid' });
    req.teacher = decoded;
    next();
  });
};

module.exports = { authenticateToken };