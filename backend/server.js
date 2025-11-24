require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/users');
const hostRoutes = require('./routes/hosts');
const chargerRoutes = require('./routes/chargers');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// health check
app.get('/', (req, res) => {
  res.send('SparkReach backend is running');
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/hosts', hostRoutes);
app.use('/api/chargers', chargerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
