const db = require('../config/db');

exports.list = async (req, res) => {
  try {
    const sql = 'SELECT id, first_name AS name, last_name AS surname, description AS bio, rate FROM tutors ORDER BY id DESC';
    const results = await db.query(sql);
    res.json(results);
  } catch (err) {
    const errorMessage = err.message || 'Unknown database error';
    const isConnectionError = errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ER_ACCESS_DENIED') || errorMessage.includes('connect');
    res.status(500).json({ 
      error: 'DB_ERROR', 
      message: isConnectionError ? 'Cannot connect to MySQL database. Please make sure MySQL server is running.' : errorMessage,
      details: err.message 
    });
  }
};

exports.create = async (req, res) => {
  const { name, surname, bio, rate } = req.body || {};
  if (!name || !surname) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'name and surname are required' });
  }
  const sql = 'INSERT INTO tutors (first_name, last_name, description, rate) VALUES (?, ?, ?, ?)';
  const values = [name, surname, bio || '', Number(rate) || 0];
  try {
    const result = await db.query(sql, values);
    res.status(201).json({ id: result.insertId, name, surname, bio: bio || '', rate: Number(rate) || 0 });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message, details: err });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, surname, bio, rate } = req.body || {};
  const sql = 'UPDATE tutors SET first_name = ?, last_name = ?, description = ?, rate = ? WHERE id = ?';
  try {
    await db.query(sql, [name || '', surname || '', bio || '', Number(rate) || 0, id]);
    res.json({ id, name: name || '', surname: surname || '', bio: bio || '', rate: Number(rate) || 0 });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tutors WHERE id = ?';
  try {
    await db.query(sql, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
};
