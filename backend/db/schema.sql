DROP DATABASE IF EXISTS sparkreach;
CREATE DATABASE sparkreach;
USE sparkreach;

-- ==========================================================
-- USERS TABLE
-- ==========================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    city VARCHAR(150),

    ev_make VARCHAR(100),
    ev_model VARCHAR(100),
    ev_year INT,
    battery_capacity VARCHAR(50),
    compatible_charger_types JSON,

    is_host TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- HOSTS TABLE (Additional Verification)
-- ==========================================================
CREATE TABLE hosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    aadhaar_number VARCHAR(20),
    verification_video VARCHAR(255),
    verification_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- CHARGERS (Charging Station Listings)
-- ==========================================================
CREATE TABLE chargers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    host_id INT NOT NULL,

    location_name VARCHAR(200) NOT NULL,
    area VARCHAR(200) NOT NULL,
    charger_type VARCHAR(100) NOT NULL,
    full_address TEXT NOT NULL,

    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),

    power_output VARCHAR(100) NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    description TEXT,

    photo_1 VARCHAR(255),
    photo_2 VARCHAR(255),
    photo_3 VARCHAR(255),
    photo_4 VARCHAR(255),
    photo_5 VARCHAR(255),

    amenities JSON,
    available_time_slots JSON,

    is_verified TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (host_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- BOOKINGS
-- ==========================================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    charger_id INT NOT NULL,

    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,

    amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (charger_id) REFERENCES chargers(id)
);

-- ==========================================================
-- PAYMENTS (for Razorpay)
-- ==========================================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),

    amount DECIMAL(10,2),
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- ==========================================================
-- CONTACT MESSAGES
-- ==========================================================
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    email VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- ADMIN USERS
-- ==========================================================
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL
);
