const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/gradesController');

// List all grades
//CRUD
router.get('/', gradesController.listGrades);

// Get grades by student
router.get('/student/:studentId', gradesController.listGradesByStudent);

// Get single grade
router.get('/:id', gradesController.getGrade);

// Create grade
router.post('/', gradesController.createGrade);

// Update grade
router.put('/:id', gradesController.updateGrade);

// Delete grade
router.delete('/:id', gradesController.deleteGrade);

module.exports = router;
