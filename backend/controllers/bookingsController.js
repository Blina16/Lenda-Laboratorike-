const bookingModel = require('../models/bookingModel');

async function getStudentBookings(req, res) {
  const { studentId } = req.params;
  try {
    const results = await bookingModel.getStudentBookings(studentId);
    res.json(results);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
}

async function getTutorBookings(req, res) {
  const { tutorId } = req.params;
  try {
    const results = await bookingModel.getTutorBookings(tutorId);
    res.json(results);
  } catch (err) {
    console.error('Error fetching tutor bookings:', err);
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
}

async function checkAvailability(req, res) {
  const { tutorId, date } = req.params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'INVALID_DATE', message: 'Date must be in YYYY-MM-DD format' });
  }
  try {
    const bookings = await bookingModel.getBookingsForDate(tutorId, date);
    const dayOfWeek = new Date(date).getDay();
    const availability = await bookingModel.getTutorAvailability(tutorId, dayOfWeek);
    res.json({ bookings, availability });
  } catch (err) {
    console.error('Error checking availability:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message, details: err });
  }
}

async function createBooking(req, res) {
  const { studentId, tutorId, lessonDate, lessonTime, duration, notes } = req.body;
  if (!studentId || !tutorId || !lessonDate || !lessonTime) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Missing required fields' });
  }
  try {
    const existing = await bookingModel.getExistingBooking(tutorId, lessonDate, lessonTime);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'SLOT_BOOKED', message: 'This time slot is already booked' });
    }
    const result = await bookingModel.createBooking({ studentId, tutorId, lessonDate, lessonTime, duration, notes });
    const booking = await bookingModel.getBookingWithTutorById(result.insertId);
    res.status(201).json(booking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
}

async function updateBookingStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'INVALID_STATUS', message: 'Invalid status' });
  }
  try {
    await bookingModel.updateBookingStatus(id, status);
    res.json({ success: true, message: 'Booking status updated' });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
}

async function deleteBooking(req, res) {
  const { id } = req.params;
  try {
    await bookingModel.deleteBooking(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
}

module.exports = {
  getStudentBookings,
  getTutorBookings,
  checkAvailability,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
