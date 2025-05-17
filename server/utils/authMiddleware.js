// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'myjsonsecretkey101'; // use your actual key

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log("💡 Raw Authorization Header:", authHeader);
  console.log("🔑 Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ JWT verification error:", err.message);
      
      return res.status(403).json({ error: 'Token invalid' });
      
    }

    req.teacher = decoded;
    
    next();
  });
};

module.exports = { authenticateToken };