const { Router } = require('express');
const ctrl = require('../controllers/bookings.controller');
const router = Router();

router.get('/student/:studentId', ctrl.byStudent);
router.get('/tutor/:tutorId', ctrl.byTutor);
router.get('/availability/:tutorId/:date', ctrl.availability);
router.post('/', ctrl.create);
router.put('/:id/status', ctrl.updateStatus);
router.delete('/:id', ctrl.remove);

module.exports = router;
