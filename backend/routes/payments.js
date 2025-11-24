const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /api/payment/create-order
router.post('/create-order', (req, res) => {
  const { amount, bookingDetails } = req.body;

  const fakeOrderId = 'ORDER_' + Date.now();
  res.json({
    orderId: fakeOrderId,
    amount,
    bookingDetails,
    status: 'CREATED'
  });
});

module.exports = router;
