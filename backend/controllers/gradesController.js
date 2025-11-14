const gradesModel = require('../models/gradesModel');

async function listGrades(req, res) {
  try {
    const rows = await gradesModel.listGrades();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching grades:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function listGradesByStudent(req, res) {
  const { studentId } = req.params;
  try {
    const rows = await gradesModel.listGradesByStudent(studentId);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching student grades:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function getGrade(req, res) {
  const { id } = req.params;
  try {
    const grade = await gradesModel.getGradeById(id);
    if (!grade) return res.status(404).json({ error: 'NOT_FOUND', message: 'Grade not found' });
    res.json(grade);
  } catch (err) {
    console.error('Error fetching grade:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function createGrade(req, res) {
  const { student_id, course_id, grade_value, comments } = req.body || {};
  if (!student_id || !grade_value) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'student_id and grade_value are required' });
  }
  try {
    const result = await gradesModel.createGrade({ student_id, course_id, grade_value, comments });
    const fetch = await gradesModel.getGradeById(result.insertId);
    res.status(201).json(fetch);
  } catch (err) {
    console.error('Error creating grade:', err);
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ error: 'DB_ERROR', message: 'grades table does not exist. Please create it in the SQL schema.' });
    }
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function updateGrade(req, res) {
  const { id } = req.params;
  const { student_id, course_id, grade_value, comments } = req.body || {};
  if (!student_id || !grade_value) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'student_id and grade_value are required' });
  }
  try {
    await gradesModel.updateGrade(id, { student_id, course_id, grade_value, comments });
    const fetch = await gradesModel.getGradeById(id);
    if (!fetch) return res.status(404).json({ error: 'NOT_FOUND', message: 'Grade not found' });
    res.json(fetch);
  } catch (err) {
    console.error('Error updating grade:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function deleteGrade(req, res) {
  const { id } = req.params;
  try {
    const exists = await gradesModel.gradeExists(id);
    if (!exists) return res.status(404).json({ error: 'NOT_FOUND', message: 'Grade not found' });
    await gradesModel.deleteGrade(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting grade:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

module.exports = {
  listGrades,
  listGradesByStudent,
  getGrade,
  createGrade,
  updateGrade,
  deleteGrade,
};
