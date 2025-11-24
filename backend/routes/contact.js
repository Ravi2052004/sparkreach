const express = require('express');
const db = require('../db');

const router = express.Router();

// POST /api/contact
router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  const sql = `
    INSERT INTO contact_messages (name, email, message)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [name, email, message], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Message received' });
  });
});

module.exports = router;
