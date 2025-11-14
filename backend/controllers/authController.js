const { signToken, verifyToken } = require('../middleware/auth');
const crypto = require('crypto');

// Temporary in-memory user store (replace with real DB model when ready)
const users = new Map(); // email -> { email, passwordHash, role, name }

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

async function signup(req, res) {
  const { email, password, role = 'student', name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'email and password required' });
  if (!['student', 'admin', 'tutor'].includes(role)) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'invalid role' });
  const key = String(email).toLowerCase();
  if (users.has(key)) return res.status(400).json({ error: 'DUPLICATE', message: 'User already exists' });
  users.set(key, { email: key, passwordHash: hashPassword(password), role, name: name || key.split('@')[0] });
  const accessToken = signToken({ sub: key, email: key, role }, 15 * 60);
  const refreshToken = signToken({ sub: key, email: key, role, type: 'refresh' }, 7 * 24 * 60 * 60);
  res.status(201).json({ message: 'User registered!', user: { email: key, role }, accessToken, refreshToken });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'email and password required' });
  const key = String(email).toLowerCase();
  const u = users.get(key);
  if (!u || u.passwordHash !== hashPassword(password)) return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
  const accessToken = signToken({ sub: key, email: key, role: u.role }, 15 * 60);
  const refreshToken = signToken({ sub: key, email: key, role: u.role, type: 'refresh' }, 7 * 24 * 60 * 60);
  res.json({ message: 'Login successful!', user: { email: key, role: u.role }, accessToken, refreshToken });
}

async function refresh(req, res) {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'refreshToken required' });
  const payload = verifyToken(refreshToken);
  if (!payload || payload.type !== 'refresh') return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Invalid refresh token' });
  const { sub, email, role } = payload;
  const accessToken = signToken({ sub, email, role }, 15 * 60);
  res.json({ accessToken });
}

async function me(req, res) {
  res.json({ user: { email: req.user.email, role: req.user.role } });
}

module.exports = { signup, login, refresh, me };
