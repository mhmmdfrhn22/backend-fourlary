const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'rahasia';

function verifyToken(req, res, next) {
  const bearer = req.headers['authorization'];
  if (!bearer) return res.status(403).json({ error: 'No token provided' });

  const token = bearer.replace('Bearer ', '');
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    // Simpan user info dari token
    req.user = decoded;
    req.user_id = decoded.user_id || null;
    req.role_id = decoded.role_id || null;

    // Debug log
    // console.log("Decoded Token:", decoded);

    next();
  });
}

module.exports = verifyToken;
