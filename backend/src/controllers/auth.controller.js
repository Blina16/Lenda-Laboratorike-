const { sign, verify } = require('../utils/token');
const crypto = require('crypto');

const users = new Map();
function hashPassword(pw) { return crypto.createHash('sha256').update(pw).digest('hex'); }

exports.signup = (req, res) => {
  const { email, password, role = 'student', name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'email and password required' });
  if (!['student','admin','tutor'].includes(role)) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'invalid role' });
  const key = email.toLowerCase();
  if (users.has(key)) return res.status(400).json({ error: 'DUPLICATE', message: 'User already exists' });
  users.set(key, { email: key, passwordHash: hashPassword(password), role, name: name || key.split('@')[0] });
  const token = sign({ sub: key, email: key, role }, 15 * 60);
  const refresh = sign({ sub: key, email: key, role, type: 'refresh' }, 7 * 24 * 60 * 60);
  res.status(201).json({ message: 'User registered!', user: { email: key, role }, accessToken: token, refreshToken: refresh });
};

exports.login = (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'email and password required' });
  const key = email.toLowerCase(); const u = users.get(key);
  if (!u || u.passwordHash !== hashPassword(password)) return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
  const token = sign({ sub: key, email: key, role: u.role }, 15 * 60);
  const refresh = sign({ sub: key, email: key, role: u.role, type: 'refresh' }, 7 * 24 * 60 * 60);
  res.json({ message: 'Login successful!', user: { email: key, role: u.role }, accessToken: token, refreshToken: refresh });
};

exports.refresh = (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'refreshToken required' });
  const payload = verify(refreshToken);
  if (!payload || payload.type !== 'refresh') return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Invalid refresh token' });
  const { sub, email, role } = payload;
  const token = sign({ sub, email, role }, 15 * 60);
  res.json({ accessToken: token });
};

exports.me = (req, res) => {
  res.json({ user: { email: req.user.email, role: req.user.role } });
};
