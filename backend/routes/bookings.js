const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/bookings/create
router.post('/create', auth, (req, res) => {
  const { charger_id, start_time, end_time, amount } = req.body;
  const user_id = req.user.id;

  const sql = `
    INSERT INTO bookings (user_id, charger_id, start_time, end_time, amount, status)
    VALUES (?, ?, ?, ?, ?, 'PENDING')
  `;

  db.query(sql, [user_id, charger_id, start_time, end_time, amount], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Booking created', booking_id: result.insertId });
  });
});

// POST /api/bookings/verify-payment (mock)
router.post('/verify-payment', auth, (req, res) => {
  const { booking_id, payment_status } = req.body;
  const newStatus = payment_status === 'SUCCESS' ? 'CONFIRMED' : 'FAILED';

  db.query(
    'UPDATE bookings SET status = ? WHERE id = ?',
    [newStatus, booking_id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Booking status updated', status: newStatus });
    }
  );
});

// GET /api/bookings/my-bookings
router.get('/my-bookings', auth, (req, res) => {
  const sql = `
    SELECT b.*, c.location_name, c.area, c.charger_type
    FROM bookings b
    JOIN chargers c ON b.charger_id = c.id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `;
  db.query(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});

// GET /api/bookings/:id
router.get('/:id', auth, (req, res) => {
  const sql = `
    SELECT b.*, c.location_name, c.area, c.charger_type
    FROM bookings b
    JOIN chargers c ON b.charger_id = c.id
    WHERE b.id = ?
  `;
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!rows.length) return res.status(404).json({ message: 'Booking not found' });
    res.json(rows[0]);
  });
});

module.exports = router;
