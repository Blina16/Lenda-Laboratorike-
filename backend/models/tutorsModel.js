const db = require('../db');

async function listTutors() {
  const sql = 'SELECT id, first_name AS name, last_name AS surname, description AS bio, rate FROM tutors ORDER BY id DESC';
  return db.query(sql);
}

async function createTutor({ name, surname, bio = '', rate = 0 }) {
  const sql = 'INSERT INTO tutors (first_name, last_name, description, rate) VALUES (?, ?, ?, ?)';
  return db.query(sql, [name, surname, bio, Number(rate) || 0]);
}

async function updateTutor(id, { name = '', surname = '', bio = '', rate = 0 }) {
  const sql = 'UPDATE tutors SET first_name = ?, last_name = ?, description = ?, rate = ? WHERE id = ?';
  return db.query(sql, [name, surname, bio, Number(rate) || 0, id]);
}

async function deleteTutor(id) {
  const sql = 'DELETE FROM tutors WHERE id = ?';
  return db.query(sql, [id]);
}

module.exports = {
  listTutors,
  createTutor,
  updateTutor,
  deleteTutor,
};
