const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'rahasia';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // ambil setelah "Bearer"

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();pri
  });
}

module.exports = authMiddleware;
