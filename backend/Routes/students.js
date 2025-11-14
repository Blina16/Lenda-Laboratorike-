const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');

// List students
router.get('/', studentsController.listStudents);

// Get single student
router.get('/:id', studentsController.getStudent);

// Create student
router.post('/', studentsController.createStudent);

// Update student
router.put('/:id', studentsController.updateStudent);

// Delete student
router.delete('/:id', studentsController.deleteStudent);

module.exports = router;
