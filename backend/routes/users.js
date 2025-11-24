const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const {
      full_name,
      phone,
      email,
      password,
      city,
      ev_make,
      ev_model,
      ev_year,
      battery_capacity,
      compatible_charger_types
    } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (
        full_name, phone, email, password_hash, city,
        ev_make, ev_model, ev_year, battery_capacity,
        compatible_charger_types, is_host
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    db.query(
      sql,
      [
        full_name,
        phone,
        email,
        hashed,
        city || null,
        ev_make || null,
        ev_model || null,
        ev_year || null,
        battery_capacity || null,
        compatible_charger_types
          ? JSON.stringify(compatible_charger_types)
          : JSON.stringify([])
      ],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already registered' });
          }
          console.error(err);
          return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'User registered successfully' });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';

  db.query(sql, [email], async (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!rows.length) return res.status(400).json({ message: 'Invalid email or password' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, is_host: user.is_host },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        is_host: user.is_host
      }
    });
  });
});

// GET /api/users/profile
router.get('/profile', auth, (req, res) => {
  const sql = 'SELECT id, full_name, email, phone, city, is_host FROM users WHERE id = ?';
  db.query(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  });
});

module.exports = router;
