const express = require('express');
const router = express.Router();
const tutorsController = require('../controllers/tutorsController');

// List tutors (normalized to API shape)
router.get('/', tutorsController.listTutors);

// Create tutor (expects { name, surname, bio, rate })
router.post('/', tutorsController.createTutor);

// Update tutor by id
router.put('/:id', tutorsController.updateTutor);

// Delete tutor by id
router.delete('/:id', tutorsController.deleteTutor);

module.exports = router;
