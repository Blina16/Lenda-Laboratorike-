const db = require('../db');

async function getStudentBookings(studentId) {
  const sql = `
    SELECT b.*, t.first_name AS tutor_name, t.last_name AS tutor_surname, t.rate 
    FROM bookings b 
    JOIN tutors t ON b.tutor_id = t.id 
    WHERE b.student_id = ? 
    ORDER BY b.lesson_date DESC, b.lesson_time DESC
  `;
  return db.query(sql, [studentId]);
}

async function getTutorBookings(tutorId) {
  const sql = `
    SELECT b.*, b.student_id 
    FROM bookings b 
    WHERE b.tutor_id = ? 
    ORDER BY b.lesson_date DESC, b.lesson_time DESC
  `;
  return db.query(sql, [tutorId]);
}

async function getExistingBooking(tutorId, lessonDate, lessonTime) {
  const sql = `
    SELECT id FROM bookings 
    WHERE tutor_id = ? AND lesson_date = ? AND lesson_time = ? AND status != 'cancelled'
  `;
  return db.query(sql, [tutorId, lessonDate, lessonTime]);
}

async function createBooking({ studentId, tutorId, lessonDate, lessonTime, duration, notes }) {
  const sql = `
    INSERT INTO bookings (student_id, tutor_id, lesson_date, lesson_time, duration, notes, status) 
    VALUES (?, ?, ?, ?, ?, ?, 'confirmed')
  `;
  return db.query(sql, [studentId, tutorId, lessonDate, lessonTime, duration || 60, notes || '']);
}

async function getBookingWithTutorById(id) {
  const sql = `
    SELECT b.*, t.first_name AS tutor_name, t.last_name AS tutor_surname, t.rate 
    FROM bookings b 
    JOIN tutors t ON b.tutor_id = t.id 
    WHERE b.id = ?
  `;
  const rows = await db.query(sql, [id]);
  return rows[0];
}

async function updateBookingStatus(id, status) {
  const sql = 'UPDATE bookings SET status = ? WHERE id = ?';
  return db.query(sql, [status, id]);
}

async function deleteBooking(id) {
  const sql = 'DELETE FROM bookings WHERE id = ?';
  return db.query(sql, [id]);
}

async function getBookingsForDate(tutorId, date) {
  const bookingsSql = `
    SELECT lesson_time, duration 
    FROM bookings 
    WHERE tutor_id = ? AND lesson_date = ? AND status != 'cancelled'
  `;
  return db.query(bookingsSql, [tutorId, date]);
}

async function getTutorAvailability(tutorId, dayOfWeek) {
  const availabilitySql = `
    SELECT start_time, end_time 
    FROM tutor_availability 
    WHERE tutor_id = ? AND day_of_week = ?
  `;
  return db.query(availabilitySql, [tutorId, dayOfWeek]);
}

module.exports = {
  getStudentBookings,
  getTutorBookings,
  getExistingBooking,
  createBooking,
  getBookingWithTutorById,
  updateBookingStatus,
  deleteBooking,
  getBookingsForDate,
  getTutorAvailability,
};
