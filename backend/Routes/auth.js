const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.get('/me', authRequired(), authController.me);

module.exports = router;
