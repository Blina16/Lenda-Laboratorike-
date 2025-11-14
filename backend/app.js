const express = require('express');
const cors = require('cors');

const authRoutes = require('./Routes/auth');
const bookingsRoutes = require('./Routes/bookings');
const coursesRoutes = require('./Routes/courses');
const gradesRoutes = require('./Routes/grades');
const paymentsRoutes = require('./Routes/payments');
const studentsRoutes = require('./Routes/students');
const tutorsRoutes = require('./Routes/tutors');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes (MVC: routes layer)
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/tutors', tutorsRoutes);

module.exports = app;
