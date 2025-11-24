const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// ensure uploads dir exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST /api/hosts/register
// Expect: user already logged in as normal user -> becomes host + creates charger
router.post('/register', auth, (req, res) => {
  const {
    aadhaar_number,
    location_name,
    area,
    charger_type,
    full_address,
    latitude,
    longitude,
    power_output,
    price_per_hour,
    description,
    amenities,
    available_time_slots
  } = req.body;

  const userId = req.user.id;

  // create or update host row
  const hostSql = `
    INSERT INTO hosts (user_id, aadhaar_number, verification_status)
    VALUES (?, ?, 'PENDING')
    ON DUPLICATE KEY UPDATE aadhaar_number = VALUES(aadhaar_number)
  `;
  db.query(hostSql, [userId, aadhaar_number || null], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error creating host record' });
    }

    // mark user as host
    db.query('UPDATE users SET is_host = 1 WHERE id = ?', [userId]);

    // create charger listing
    const chargerSql = `
      INSERT INTO chargers (
        host_id, location_name, area, charger_type, full_address,
        latitude, longitude, power_output, price_per_hour,
        description, amenities, available_time_slots, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    db.query(
      chargerSql,
      [
        userId,
        location_name,
        area,
        charger_type,
        full_address,
        latitude || null,
        longitude || null,
        power_output,
        price_per_hour,
        description || null,
        amenities ? JSON.stringify(amenities) : JSON.stringify([]),
        available_time_slots ? JSON.stringify(available_time_slots) : JSON.stringify([])
      ],
      (err2, result) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ message: 'Error creating charger listing' });
        }
        res.json({ message: 'Host & charger registered, pending approval', charger_id: result.insertId });
      }
    );
  });
});

// POST /api/hosts/upload-photo
router.post('/upload-photo', auth, upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ message: 'Photo uploaded', file: `/uploads/${req.file.filename}` });
});

// POST /api/hosts/upload-video
router.post('/upload-video', auth, upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ message: 'Video uploaded', file: `/uploads/${req.file.filename}` });
});

// GET /api/hosts/my-listings
router.get('/my-listings', auth, (req, res) => {
  const sql = `
    SELECT *
    FROM chargers
    WHERE host_id = ?
    ORDER BY created_at DESC
  `;
  db.query(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});


module.exports = router;
