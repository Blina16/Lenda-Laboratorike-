const db = require('../db');

async function listStudents() {
  const sql = 'SELECT id, first_name, last_name, email FROM students ORDER BY id DESC';
  return db.query(sql);
}

async function getStudentById(id) {
  const sql = 'SELECT id, first_name, last_name, email FROM students WHERE id = ?';
  const rows = await db.query(sql, [id]);
  return rows[0];
}

async function createStudent({ first_name, last_name, email }) {
  const sql = 'INSERT INTO students (first_name, last_name, email) VALUES (?, ?, ?)';
  return db.query(sql, [first_name, last_name, email]);
}

async function updateStudent(id, { first_name, last_name, email }) {
  const sql = 'UPDATE students SET first_name = ?, last_name = ?, email = ? WHERE id = ?';
  return db.query(sql, [first_name, last_name, email, id]);
}

async function deleteStudent(id) {
  const sql = 'DELETE FROM students WHERE id = ?';
  return db.query(sql, [id]);
}

async function studentExists(id) {
  const rows = await db.query('SELECT id FROM students WHERE id = ?', [id]);
  return rows.length > 0;
}

module.exports = {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  studentExists,
};
