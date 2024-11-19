const express = require('express');
const { processPayment, KhaltiResponse, getPaymentStatus } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

router.route('/payment/process').post(processPayment);

router.route("/payment/complete").get(KhaltiResponse);

router.route('/payment/status/:id').get(isAuthenticatedUser, getPaymentStatus);

module.exports = router;
