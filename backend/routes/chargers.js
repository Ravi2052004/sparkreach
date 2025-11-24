const express = require('express');
const db = require('../db');

const router = express.Router();

// -----------------------------------------------------
// 1) GET ALL Verified Chargers
// -----------------------------------------------------
router.get('/', (req, res) => {
  const sql = `
    SELECT c.*, u.full_name AS host_name, u.phone AS host_phone, u.city AS host_city
    FROM chargers c
    JOIN users u ON c.host_id = u.id
    WHERE c.is_verified = 1
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});

// -----------------------------------------------------
// 2) SEARCH Chargers  <── ADD THIS HERE
// -----------------------------------------------------
router.get('/search', (req, res) => {
  const q = `%${req.query.q || ''}%`;
  const sql = `
    SELECT *
    FROM chargers
    WHERE location_name LIKE ? OR area LIKE ? OR full_address LIKE ?
  `;
  db.query(sql, [q, q, q], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});

// -----------------------------------------------------
// 3) GET Charger by ID
// -----------------------------------------------------
router.get('/:id', (req, res) => {
  const sql = `
    SELECT c.*, u.full_name AS host_name, u.phone AS host_phone, u.city AS host_city
    FROM chargers c
    JOIN users u ON c.host_id = u.id
    WHERE c.id = ?
  `;
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!rows.length) return res.status(404).json({ message: 'Charger not found' });
    res.json(rows[0]);
  });
});

module.exports = router;
