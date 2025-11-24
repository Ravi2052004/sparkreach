USE sparkreach;

-- Admin user
INSERT INTO admin_users (email, password_hash, name)
VALUES (
    'admin@sparkreach.com',
    '$2b$10$adminhashedpassword12345678',
    'SparkReach Admin'
);

-- Sample Users
INSERT INTO users (
    full_name, phone, email, password_hash, city,
    ev_make, ev_model, ev_year, battery_capacity,
    compatible_charger_types, is_host
) VALUES
(
    'Rohit Sharma', '9876543210', 'rohit@example.com',
    '$2b$10$hashedpass123', 'Delhi',
    'Tata', 'Nexon EV', 2022, '40 kWh',
    JSON_ARRAY('CCS2', 'Type 2'),
    1
),
(
    'Neha Singh', '9123456780', 'neha@example.com',
    '$2b$10$hashedpass456', 'Noida',
    'Mahindra', 'XUV400', 2023, '35 kWh',
    JSON_ARRAY('CCS2'),
    0
);

-- Host verification
INSERT INTO hosts (user_id, verification_status)
VALUES (1, 'APPROVED');

-- Sample Charger Listing
INSERT INTO chargers (
    host_id, location_name, area, charger_type, full_address,
    latitude, longitude, power_output, price_per_hour,
    description, amenities, available_time_slots, is_verified
) VALUES
(
    1,
    'Green Park EV Point',
    'Green Park, Delhi',
    'CCS2',
    'Near Metro Station, Green Park, New Delhi',
    28.5556, 77.2005,
    '30 kW Fast Charger', 250,
    'Fast charging point with CCTV and parking.',
    JSON_ARRAY('CCTV', 'Parking', '24/7'),
    JSON_ARRAY('08:00-12:00', '12:00-16:00'),
    1
);

-- Booking
INSERT INTO bookings (
    user_id, charger_id, start_time, end_time, amount, status
) VALUES
(
    2, 1,
    '2024-11-24 10:00:00',
    '2024-11-24 12:00:00',
    500, 'CONFIRMED'
);

-- Payment
INSERT INTO payments (
    booking_id, razorpay_order_id,
    razorpay_payment_id, razorpay_signature,
    amount, status
) VALUES
(
    1,
    'order_abc123',
    'pay_abc123',
    'signature_abc123',
    500,
    'SUCCESS'
);
