const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const { authRequired } = require('../middleware/auth.middleware');
const router = Router();

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);
router.get('/me', authRequired(), ctrl.me);

module.exports = router;
