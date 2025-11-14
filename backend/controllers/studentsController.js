const studentsModel = require('../models/studentsModel');

async function listStudents(req, res) {
  try {
    const results = await studentsModel.listStudents();
    res.json(results);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function getStudent(req, res) {
  const { id } = req.params;
  try {
    const student = await studentsModel.getStudentById(id);
    if (!student) return res.status(404).json({ error: 'NOT_FOUND', message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function createStudent(req, res) {
  const { first_name, last_name, email } = req.body || {};
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'first_name, last_name and email are required' });
  }
  try {
    const result = await studentsModel.createStudent({ first_name: first_name.trim(), last_name: last_name.trim(), email: email.trim() });
    res.status(201).json({ id: result.insertId, first_name: first_name.trim(), last_name: last_name.trim(), email: email.trim() });
  } catch (err) {
    console.error('Error creating student:', err);
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ error: 'DB_ERROR', message: 'students table does not exist. Please create it in the SQL schema.' });
    }
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'DUPLICATE_ERROR', message: 'Email already exists' });
    }
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function updateStudent(req, res) {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body || {};
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'first_name, last_name and email are required' });
  }
  try {
    await studentsModel.updateStudent(id, { first_name: first_name.trim(), last_name: last_name.trim(), email: email.trim() });
    const fetch = await studentsModel.getStudentById(id);
    if (!fetch) return res.status(404).json({ error: 'NOT_FOUND', message: 'Student not found' });
    res.json(fetch);
  } catch (err) {
    console.error('Error updating student:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'DUPLICATE_ERROR', message: 'Email already exists' });
    }
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function deleteStudent(req, res) {
  const { id } = req.params;
  try {
    const exists = await studentsModel.studentExists(id);
    if (!exists) return res.status(404).json({ error: 'NOT_FOUND', message: 'Student not found' });
    await studentsModel.deleteStudent(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

module.exports = {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
