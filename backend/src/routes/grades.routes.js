const { Router } = require('express');
const ctrl = require('../controllers/grades.controller');
const router = Router();

router.get('/', ctrl.list);
router.get('/student/:studentId', ctrl.byStudent);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
