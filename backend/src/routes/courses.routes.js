const { Router } = require('express');
const ctrl = require('../controllers/courses.controller');
const router = Router();

router.get('/', ctrl.list);
router.get('/:courseId/tutors', ctrl.tutorsForCourse);
router.get('/tutor/:tutorId', ctrl.coursesForTutor);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.post('/tutor/:tutorId/course/:courseId', ctrl.assignTutor);
router.delete('/tutor/:tutorId/course/:courseId', ctrl.removeTutor);

module.exports = router;
