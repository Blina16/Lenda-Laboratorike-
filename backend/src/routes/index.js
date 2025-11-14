const { Router } = require('express');
const router = Router();

router.use('/auth', require('./auth.routes'));
router.use('/students', require('./students.routes'));
router.use('/tutors', require('./tutors.routes'));
router.use('/courses', require('./courses.routes'));
router.use('/bookings', require('./bookings.routes'));
router.use('/payments', require('./payments.routes'));
router.use('/reviews', require('./reviews.routes'));
router.use('/grades', require('./grades.routes'));

module.exports = router;
