// Service layer: wraps API calls and centralizes cross-cutting concerns later (caching, retries, etc.)
export { 
  getStudentBookings,
  getTutorBookings,
  checkAvailability,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  generateGoogleCalendarUrl,
} from './bookings';
