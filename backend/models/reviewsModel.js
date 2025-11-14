const db = require('../db');

async function listReviews(filters = {}) {
  const { from_role, from_id, to_role, to_id, tutor_id, student_id } = filters;
  const clauses = [];
  const values = [];
  if (from_role) { clauses.push('from_role = ?'); values.push(from_role); }
  if (from_id) { clauses.push('from_id = ?'); values.push(Number(from_id)); }
  if (to_role) { clauses.push('to_role = ?'); values.push(to_role); }
  if (to_id) { clauses.push('to_id = ?'); values.push(Number(to_id)); }
  if (tutor_id) { clauses.push('( (from_role = "tutor" AND from_id = ?) OR (to_role = "tutor" AND to_id = ?) )'); values.push(Number(tutor_id), Number(tutor_id)); }
  if (student_id) { clauses.push('( (from_role = "student" AND from_id = ?) OR (to_role = "student" AND to_id = ?) )'); values.push(Number(student_id), Number(student_id)); }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const sql = `SELECT id, from_role, from_id, to_role, to_id, rating, comment, created_at FROM reviews ${where} ORDER BY id DESC`;
  return db.query(sql, values);
}

async function createReview({ from_role, from_id, to_role, to_id, rating, comment }) {
  const sql = 'INSERT INTO reviews (from_role, from_id, to_role, to_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [String(from_role), Number(from_id), String(to_role), Number(to_id), Number(rating), comment || ''];
  return db.query(sql, values);
}

async function updateReview(id, { rating, comment }) {
  const sql = 'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?';
  return db.query(sql, [Number(rating), comment || '', Number(id)]);
}

async function deleteReview(id) {
  const sql = 'DELETE FROM reviews WHERE id = ?';
  return db.query(sql, [Number(id)]);
}

module.exports = {
  listReviews,
  createReview,
  updateReview,
  deleteReview,
};
