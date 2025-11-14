const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');

// Get all bookings for a student
router.get('/student/:studentId', bookingsController.getStudentBookings);

// Get all bookings for a tutor
router.get('/tutor/:tutorId', bookingsController.getTutorBookings);

// Check availability for a tutor on a specific date
router.get('/availability/:tutorId/:date', bookingsController.checkAvailability);

// Create a new booking
router.post('/', bookingsController.createBooking);

// Update booking status
router.put('/:id/status', bookingsController.updateBookingStatus);

// Delete booking
router.delete('/:id', bookingsController.deleteBooking);

module.exports = router;

