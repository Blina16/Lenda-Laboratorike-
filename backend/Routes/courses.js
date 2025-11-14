const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');

// Get all courses
//CRUD
router.get('/', coursesController.getAllCourses);

// Get tutors who teach a specific course
router.get('/:courseId/tutors', coursesController.getTutorsForCourse);

// Get courses for a specific tutor (must be before /:id route)
router.get('/tutor/:tutorId', coursesController.getCoursesForTutor);

// Get single course by id (must be after /tutor/:tutorId)
router.get('/:id', coursesController.getCourseById);

// Create a new course
router.post('/', coursesController.createCourse);

// Update course by id
router.put('/:id', coursesController.updateCourse);

// Delete course by id
router.delete('/:id', coursesController.deleteCourse);

// Assign course to tutor
router.post('/tutor/:tutorId/course/:courseId', coursesController.assignCourseToTutor);

// Remove course from tutor
router.delete('/tutor/:tutorId/course/:courseId', coursesController.removeCourseFromTutor);

module.exports = router;

