const db = require('../config/db');

exports.byStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const sql = `SELECT b.*, t.first_name AS tutor_name, t.last_name AS tutor_surname, t.rate 
                 FROM bookings b JOIN tutors t ON b.tutor_id = t.id 
                 WHERE b.student_id = ? ORDER BY b.lesson_date DESC, b.lesson_time DESC`;
    const results = await db.query(sql, [studentId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
};

exports.byTutor = async (req, res) => {
  const { tutorId } = req.params;
  try {
    const sql = `SELECT b.*, b.student_id FROM bookings b WHERE b.tutor_id = ? 
                 ORDER BY b.lesson_date DESC, b.lesson_time DESC`;
    const results = await db.query(sql, [tutorId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
};

exports.availability = async (req, res) => {
  const { tutorId, date } = req.params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'INVALID_DATE', message: 'Date must be in YYYY-MM-DD format' });
  try {
    const bookings = await db.query('SELECT lesson_time, duration FROM bookings WHERE tutor_id = ? AND lesson_date = ? AND status != "cancelled"', [tutorId, date]);
    const dayOfWeek = new Date(date).getDay();
    const availability = await db.query('SELECT start_time, end_time FROM tutor_availability WHERE tutor_id = ? AND day_of_week = ?', [tutorId, dayOfWeek]);
    res.json({ bookings, availability });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message, details: err });
  }
};

exports.create = async (req, res) => {
  const { studentId, tutorId, lessonDate, lessonTime, duration, notes } = req.body;
  if (!studentId || !tutorId || !lessonDate || !lessonTime) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Missing required fields' });
  try {
    const existing = await db.query('SELECT id FROM bookings WHERE tutor_id = ? AND lesson_date = ? AND lesson_time = ? AND status != "cancelled"', [tutorId, lessonDate, lessonTime]);
    if (existing.length > 0) return res.status(400).json({ error: 'SLOT_BOOKED', message: 'This time slot is already booked' });
    const result = await db.query('INSERT INTO bookings (student_id, tutor_id, lesson_date, lesson_time, duration, notes, status) VALUES (?,?,?,?,?,? ,"confirmed")', [studentId, tutorId, lessonDate, lessonTime, duration || 60, notes || '']);
    const booking = await db.query('SELECT b.*, t.first_name AS tutor_name, t.last_name AS tutor_surname, t.rate FROM bookings b JOIN tutors t ON b.tutor_id = t.id WHERE b.id = ?', [result.insertId]);
    res.status(201).json(booking[0]);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params; const { status } = req.body;
  if (!['pending','confirmed','cancelled','completed'].includes(status)) return res.status(400).json({ error: 'INVALID_STATUS', message: 'Invalid status' });
  try {
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Booking status updated' });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM bookings WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
};
