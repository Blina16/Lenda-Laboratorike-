const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

// Get all payments (admin use)
router.get('/', paymentsController.listPayments);

// Get payments by student
router.get('/student/:studentId', paymentsController.listPaymentsByStudent);

// Create payment
router.post('/', paymentsController.createPayment);

// Update payment
router.put('/:id', paymentsController.updatePayment);

// Delete payment
router.delete('/:id', paymentsController.deletePayment);

module.exports = router;
