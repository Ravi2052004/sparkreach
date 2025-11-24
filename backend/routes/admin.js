const express = require('express');
const db = require('../db');

const router = express.Router();

// POST /api/admin/login  (very simple demo version)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM admin_users WHERE email = ? LIMIT 1';
  db.query(sql, [email], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const admin = rows[0];

    if (password !== 'admin123') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Admin login successful',
      token: 'dummy-admin-token',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      }
    });
  });
});

// GET /api/admin/pending-hosts
router.get('/pending-hosts', (req, res) => {
  const sql = `
    SELECT 
      h.id AS id,
      u.full_name AS hostName,
      h.location_name AS location,
      h.area AS area,
      h.type AS type,
      h.power AS power,
      h.price_per_hour AS price,
      h.submitted_at AS submittedDate
    FROM chargers h
    JOIN users u ON h.host_id = u.id
    WHERE h.is_verified = 0
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});


// POST /api/admin/approve-host/:id
router.post('/approve-host/:id', (req, res) => {
  const hostId = req.params.id;

  const sql = "UPDATE hosts SET verification_status = 'APPROVED' WHERE id = ?";
  db.query(sql, [hostId], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    // also verify their chargers
    db.query(
      'UPDATE chargers SET is_verified = 1 WHERE host_id = (SELECT user_id FROM hosts WHERE id = ?)',
      [hostId]
    );

    res.json({ message: 'Host approved' });
  });
});

// POST /api/admin/reject-host/:id
router.post('/reject-host/:id', (req, res) => {
  const hostId = req.params.id;
  const { reason } = req.body;

  const sql = "UPDATE hosts SET verification_status = 'REJECTED' WHERE id = ?";
  db.query(sql, [hostId], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Host rejected', reason });
  });
});

// GET /api/admin/bookings
router.get('/bookings', (req, res) => {
  const sql = `
    SELECT b.*, u.full_name AS user_name, c.location_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN chargers c ON b.charger_id = c.id
    ORDER BY b.created_at DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});

// GET /api/admin/statistics
router.get('/statistics', (req, res) => {
  const stats = {
    totalUsers: 0,
    newUsersThisMonth: 8,        // demo default
    activeChargers: 0,
    pendingApprovals: 0,
    totalBookings: 0,
    bookingsThisMonth: 4,        // demo default
    totalRevenue: 0,
    revenueThisMonth: 1200       // demo default
  };

  db.query('SELECT COUNT(*) AS total_users FROM users', (err, rows1) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    stats.totalUsers = rows1[0].total_users;

    db.query(
      'SELECT COUNT(*) AS active_chargers FROM chargers WHERE is_verified = 1',
      (err2, rows2) => {
        if (err2) return res.status(500).json({ message: 'Database error' });
        stats.activeChargers = rows2[0].active_chargers;

        db.query(
          'SELECT COUNT(*) AS pending FROM hosts WHERE verification_status="PENDING"',
          (err3, rows3) => {
            if (err3) return res.status(500).json({ message: 'Database error' });
            stats.pendingApprovals = rows3[0].pending;

            db.query('SELECT COUNT(*) AS total_bookings FROM bookings', (err4, rows4) => {
              if (err4) return res.status(500).json({ message: 'Database error' });
              stats.totalBookings = rows4[0].total_bookings;

              db.query(
                'SELECT COALESCE(SUM(amount),0) AS revenue FROM bookings WHERE status="COMPLETED"',
                (err5, rows5) => {
                  if (err5) return res.status(500).json({ message: 'Database error' });
                  stats.totalRevenue = rows5[0].revenue;

                  res.json(stats);
                }
              );
            });
          }
        );
      }
    );
  });
});

module.exports = router;
