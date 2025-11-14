const db = require('../config/db');

exports.list = async (req, res) => {
  try {
    const results = await db.query(`SELECT g.id, g.student_id, s.first_name AS student_first_name, s.last_name AS student_last_name, g.course_id, c.name AS course_name, g.grade_value, g.comments, g.created_at FROM grades g LEFT JOIN students s ON g.student_id = s.id LEFT JOIN courses c ON g.course_id = c.id ORDER BY g.created_at DESC, g.id DESC`);
    res.json(results);
  } catch (err) { res.status(500).json({ error: 'DB_ERROR', message: err.message }); }
};

exports.byStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const results = await db.query(`SELECT g.id, g.student_id, g.course_id, g.grade_value, g.comments, g.created_at, c.name AS course_name FROM grades g LEFT JOIN courses c ON g.course_id = c.id WHERE g.student_id = ? ORDER BY g.created_at DESC`, [studentId]);
    res.json(results);
  } catch (err) { res.status(500).json({ error: 'DB_ERROR', message: err.message }); }
};

exports.getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await db.query('SELECT id, student_id, course_id, grade_value, comments, created_at FROM grades WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ error: 'NOT_FOUND', message: 'Grade not found' });
    res.json(results[0]);
  } catch (err) { res.status(500).json({ error: 'DB_ERROR', message: err.message }); }
};

exports.create = async (req, res) => {
  const { student_id, course_id, grade_value, comments } = req.body || {};
  if (!student_id || !grade_value) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'student_id and grade_value are required' });
  try {
    const result = await db.query('INSERT INTO grades (student_id, course_id, grade_value, comments) VALUES (?, ?, ?, ?)', [student_id, course_id || null, String(grade_value), comments || '']);
    const fetch = await db.query('SELECT id, student_id, course_id, grade_value, comments, created_at FROM grades WHERE id = ?', [result.insertId]);
    res.status(201).json(fetch[0]);
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return res.status(500).json({ error: 'DB_ERROR', message: 'grades table does not exist. Please create it in the SQL schema.' });
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params; const { student_id, course_id, grade_value, comments } = req.body || {};
  if (!student_id || !grade_value) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'student_id and grade_value are required' });
  try {
    await db.query('UPDATE grades SET student_id = ?, course_id = ?, grade_value = ?, comments = ? WHERE id = ?', [student_id, course_id || null, String(grade_value), comments || '', id]);
    const fetch = await db.query('SELECT id, student_id, course_id, grade_value, comments, created_at FROM grades WHERE id = ?', [id]);
    if (fetch.length === 0) return res.status(404).json({ error: 'NOT_FOUND', message: 'Grade not found' });
    res.json(fetch[0]);
  } catch (err) { res.status(500).json({ error: 'DB_ERROR', message: err.message }); }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const exists = await db.query('SELECT id FROM grades WHERE id = ?', [id]);
    if (exists.length === 0) return res.status(404).json({ error: 'NOT_FOUND', message: 'Grade not found' });
    await db.query('DELETE FROM grades WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'DB_ERROR', message: err.message }); }
};
