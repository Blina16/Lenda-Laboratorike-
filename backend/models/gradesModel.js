const db = require('../db');

async function listGrades() {
  const sql = `
    SELECT g.id, g.student_id, s.first_name AS student_first_name, s.last_name AS student_last_name,
           g.course_id, c.name AS course_name, g.grade_value, g.comments, g.created_at
    FROM grades g
    LEFT JOIN students s ON g.student_id = s.id
    LEFT JOIN courses c ON g.course_id = c.id
    ORDER BY g.created_at DESC, g.id DESC`;
  return db.query(sql);
}

async function listGradesByStudent(studentId) {
  const sql = `
    SELECT g.id, g.student_id, g.course_id, g.grade_value, g.comments, g.created_at,
           c.name AS course_name
    FROM grades g
    LEFT JOIN courses c ON g.course_id = c.id
    WHERE g.student_id = ?
    ORDER BY g.created_at DESC`;
  return db.query(sql, [studentId]);
}

async function getGradeById(id) {
  const sql = 'SELECT id, student_id, course_id, grade_value, comments, created_at FROM grades WHERE id = ?';
  const rows = await db.query(sql, [id]);
  return rows[0];
}

async function createGrade({ student_id, course_id, grade_value, comments }) {
  const sql = 'INSERT INTO grades (student_id, course_id, grade_value, comments) VALUES (?, ?, ?, ?)';
  return db.query(sql, [student_id, course_id || null, String(grade_value), comments || '']);
}

async function updateGrade(id, { student_id, course_id, grade_value, comments }) {
  const sql = 'UPDATE grades SET student_id = ?, course_id = ?, grade_value = ?, comments = ? WHERE id = ?';
  return db.query(sql, [student_id, course_id || null, String(grade_value), comments || '', id]);
}

async function deleteGrade(id) {
  const sql = 'DELETE FROM grades WHERE id = ?';
  return db.query(sql, [id]);
}

async function gradeExists(id) {
  const rows = await db.query('SELECT id FROM grades WHERE id = ?', [id]);
  return rows.length > 0;
}

module.exports = {
  listGrades,
  listGradesByStudent,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
  gradeExists,
};
