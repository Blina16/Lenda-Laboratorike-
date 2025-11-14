const db = require('../db');

async function listPayments() {
  const sql = `
    SELECT p.id, p.student_id, s.first_name, s.last_name, p.amount, p.currency, p.method, p.status, p.reference, p.created_at
    FROM payments p
    LEFT JOIN students s ON s.id = p.student_id
    ORDER BY p.created_at DESC, p.id DESC`;
  return db.query(sql);
}

async function listPaymentsByStudent(studentId) {
  const sql = `SELECT id, student_id, amount, currency, method, status, reference, created_at FROM payments WHERE student_id = ? ORDER BY created_at DESC`;
  return db.query(sql, [studentId]);
}

async function createPayment({ student_id, amount, currency, method, status, reference }) {
  const sql = `INSERT INTO payments (student_id, amount, currency, method, status, reference) VALUES (?,?,?,?,?,?)`;
  return db.query(sql, [student_id, Number(amount), currency || 'USD', method || 'manual', status || 'paid', reference || '']);
}

async function updatePayment(id, { student_id, amount, currency, method, status, reference }) {
  const sql = `UPDATE payments SET student_id=?, amount=?, currency=?, method=?, status=?, reference=? WHERE id=?`;
  return db.query(sql, [student_id, Number(amount), currency || 'USD', method || 'manual', status || 'paid', reference || '', id]);
}

async function deletePayment(id) {
  const sql = 'DELETE FROM payments WHERE id = ?';
  return db.query(sql, [id]);
}

async function paymentExists(id) {
  const rows = await db.query('SELECT id FROM payments WHERE id = ?', [id]);
  return rows.length > 0;
}

module.exports = {
  listPayments,
  listPaymentsByStudent,
  createPayment,
  updatePayment,
  deletePayment,
  paymentExists,
};
