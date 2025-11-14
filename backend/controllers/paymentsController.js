const paymentsModel = require('../models/paymentsModel');

async function listPayments(req, res) {
  try {
    const rows = await paymentsModel.listPayments();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function listPaymentsByStudent(req, res) {
  const { studentId } = req.params;
  try {
    const rows = await paymentsModel.listPaymentsByStudent(studentId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function createPayment(req, res) {
  const { student_id, amount, currency, method, status, reference } = req.body || {};
  if (!student_id || amount == null) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'student_id and amount are required' });
  }
  try {
    const result = await paymentsModel.createPayment({ student_id, amount, currency, method, status, reference });
    const rows = await paymentsModel.listPaymentsByStudent(student_id);
    const created = rows.find(r => r.id === result.insertId) || { id: result.insertId, student_id, amount, currency, method, status, reference };
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ error: 'DB_ERROR', message: 'payments table does not exist. Please create it in the SQL schema.' });
    }
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function updatePayment(req, res) {
  const { id } = req.params;
  const { student_id, amount, currency, method, status, reference } = req.body || {};
  if (!student_id || amount == null) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'student_id and amount are required' });
  }
  try {
    await paymentsModel.updatePayment(id, { student_id, amount, currency, method, status, reference });
    const rows = await paymentsModel.listPaymentsByStudent(student_id);
    const updated = rows.find(r => String(r.id) === String(id));
    if (!updated) return res.status(404).json({ error: 'NOT_FOUND', message: 'Payment not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function deletePayment(req, res) {
  const { id } = req.params;
  try {
    const exists = await paymentsModel.paymentExists(id);
    if (!exists) return res.status(404).json({ error: 'NOT_FOUND', message: 'Payment not found' });
    await paymentsModel.deletePayment(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

module.exports = {
  listPayments,
  listPaymentsByStudent,
  createPayment,
  updatePayment,
  deletePayment,
};
