CREATE DATABASE IF NOT EXISTS sparkreach CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sparkreach;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  ev_model VARCHAR(100),
  is_host BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hosts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(150),
  phone VARCHAR(30),
  address_brief VARCHAR(255),
  lat DECIMAL(10,7),
  lon DECIMAL(10,7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE chargers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  host_id INT,
  connector_type VARCHAR(50),
  power_kw DECIMAL(6,2),
  is_ac BOOLEAN,
  is_dc BOOLEAN,
  per_kwh_price DECIMAL(8,2) DEFAULT 10,
  per_min_price DECIMAL(8,2) DEFAULT 0.5,
  lat DECIMAL(10,7),
  lon DECIMAL(10,7),
  availability_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (host_id) REFERENCES hosts(id)
);

CREATE TABLE public_chargers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ext_id VARCHAR(100),
  name VARCHAR(255),
  connector_type VARCHAR(50),
  power_kw DECIMAL(6,2),
  lat DECIMAL(10,7),
  lon DECIMAL(10,7),
  network VARCHAR(100),
  source VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  charger_id INT,
  host_id INT,
  start_time DATETIME,
  end_time DATETIME,
  estimated_kwh DECIMAL(6,2),
  price_total DECIMAL(10,2),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  status ENUM('pending','paid','cancelled','completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  amount DECIMAL(10,2),
  currency VARCHAR(10),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
