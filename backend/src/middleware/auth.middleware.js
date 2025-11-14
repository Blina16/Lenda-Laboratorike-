const { verify } = require('../utils/token');

function authRequired(roles = []) {
  return (req, res, next) => {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing token' });
    const payload = verify(token);
    if (!payload) return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or expired token' });
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Insufficient role' });
    }
    req.user = payload;
    next();
  };
}

module.exports = { authRequired };
