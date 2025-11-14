const db = require('../config/db');

exports.list = async (req, res) => {
  try {
    const sql = 'SELECT id, name, description, category, created_at, updated_at FROM courses ORDER BY name ASC';
    const results = await db.query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message, details: err });
  }
};

exports.tutorsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const sql = `SELECT t.id, t.first_name AS name, t.last_name AS surname, t.description AS bio, t.rate
                 FROM tutors t INNER JOIN tutor_courses tc ON t.id = tc.tutor_id WHERE tc.course_id = ?
                 ORDER BY t.first_name, t.last_name`;
    const results = await db.query(sql, [courseId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
};

exports.coursesForTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const sql = `SELECT c.id, c.name, c.description, c.category FROM courses c
                 INNER JOIN tutor_courses tc ON c.id = tc.course_id WHERE tc.tutor_id = ?
                 ORDER BY c.name ASC`;
    const results = await db.query(sql, [tutorId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'tutor') return res.status(404).json({ error: 'NOT_FOUND', message: 'Course not found' });
    const sql = 'SELECT id, name, description, category, created_at, updated_at FROM courses WHERE id = ?';
    const results = await db.query(sql, [id]);
    if (results.length === 0) return res.status(404).json({ error: 'NOT_FOUND', message: 'Course not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
};

exports.create = async (req, res) => {
  const { name, description, category } = req.body;
  if (!name || name.trim() === '') return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Course name is required' });
  try {
    const sql = 'INSERT INTO courses (name, description, category) VALUES (?, ?, ?)';
    const result = await db.query(sql, [name.trim(), description || '', category || '']);
    res.status(201).json({ id: result.insertId, name: name.trim(), description: description || '', category: category || '', created_at: new Date(), updated_at: new Date() });
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE' || /doesn\'t exist|Table/.test(err.message)) {
      return res.status(500).json({ error: 'DB_ERROR', message: 'Courses table does not exist. Please create it using the SQL schema.' });
    }
    if (err.code === 'ER_DUP_ENTRY' || (err.message || '').includes('unique_course_name')) {
      return res.status(400).json({ error: 'DUPLICATE_ERROR', message: 'A course with this name already exists' });
    }
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params; const { name, description, category } = req.body;
  if (!name || name.trim() === '') return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Course name is required' });
  try {
    const sql = 'UPDATE courses SET name = ?, description = ?, category = ? WHERE id = ?';
    await db.query(sql, [name.trim(), description || '', category || '', id]);
    const updated = await db.query('SELECT id, name, description, category, created_at, updated_at FROM courses WHERE id = ?', [id]);
    if (updated.length === 0) return res.status(404).json({ error: 'NOT_FOUND', message: 'Course not found' });
    res.json(updated[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' || (err.message || '').includes('unique_course_name')) {
      return res.status(400).json({ error: 'DUPLICATE_ERROR', message: 'A course with this name already exists' });
    }
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
};

exports.assignTutor = async (req, res) => {
  try {
    const { tutorId, courseId } = req.params;
    await db.query('INSERT INTO tutor_courses (tutor_id, course_id) VALUES (?, ?)', [tutorId, courseId]);
    res.status(201).json({ success: true, message: 'Course assigned to tutor' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'DUPLICATE_ERROR', message: 'Course already assigned to this tutor' });
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
};

exports.removeTutor = async (req, res) => {
  try {
    const { tutorId, courseId } = req.params;
    await db.query('DELETE FROM tutor_courses WHERE tutor_id = ? AND course_id = ?', [tutorId, courseId]);
    res.json({ success: true, message: 'Course removed from tutor' });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
};
