const { Router } = require('express');
const router = Router();

router.use('/tutors', require('./tutors.routes'));

module.exports = router;
