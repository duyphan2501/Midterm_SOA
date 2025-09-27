-- Tạo database userdb và bảng users
CREATE DATABASE IF NOT EXISTS userdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE userdb;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    fullname NVARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    balance INT NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, fullname, email, phone, balance) VALUES
    ('52300020', '1234', N'Phan Nhựt Duy', 'duyneon09@gmail.com', '0901111111', 10000000),
    ('52300024', '1234', N'Trần Thanh Liêm', 'thuydiem274@gmail.com', '0902222222', 20000000),
    ('52300009', '1234', N'Đỗ Trần Minh Đức', 'ducx345@gmail.com', '0903333333', 15000000);


-- Tạo database tuitiondb và bảng tuitions
CREATE DATABASE IF NOT EXISTS tuitiondb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tuitiondb;

DROP TABLE IF EXISTS tuitions;
CREATE TABLE tuitions (
  tuition_id INT AUTO_INCREMENT PRIMARY KEY,  
  student_id VARCHAR(50) NOT NULL,
  student_name NVARCHAR(150) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  amount INT NOT NULL CHECK (amount >= 0),
  status ENUM('PAID', 'UNPAID') NOT NULL DEFAULT 'UNPAID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (student_id, semester)                  
);

INSERT INTO tuitions (student_id, student_name, semester, amount, status)
VALUES
('52300012', N'Nguyễn Văn A', 'HK1_2024_2025', 5000000, 'UNPAID'),
('52300034', N'Trần Thị B', 'HK1_2023_2024', 4500000, 'UNPAID'),
('52300056', N'Lê Văn C', 'HK1_2024_2025', 6000000, 'UNPAID'),
('52300078', N'Phạm Thị D', 'HK1_2023_2024', 7000000, 'PAID'),
('52300090', N'Hoàng Văn E', 'HK1_2025_2026', 5500000, 'UNPAID');


-- Tạo database paymentdb và bảng payments, otps
CREATE DATABASE IF NOT EXISTS paymentdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE paymentdb;

DROP TABLE IF EXISTS otps;
DROP TABLE IF EXISTS payments;

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_code VARCHAR(30) NOT NULL,
    tuition_id INT NOT NULL,
    payer_id INT NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    amount INT NOT NULL CHECK (amount >= 0),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE otps (
    otp_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    expire_at DATETIME NOT NULL,
    is_used BIT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(otp_code, is_used),
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
);

-- Insert dữ liệu mẫu
INSERT INTO payments (payment_code, tuition_id, payer_id, status, amount)
VALUES 
('HP52300056HK120242025', 3, 1, 'PENDING', 6000000),
('HP52300090HK120242025', 5, 1, 'PENDING', 5500000),
('HP52300034HK120242025', 2, 1, 'PENDING', 4500000),
('HP52300034HK120242025', 2, 2, 'PENDING', 4500000);

INSERT INTO otps (payment_id, otp_code, expire_at)
VALUES
(1, '123456', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(2, '654321', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(3, '111111', DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
(4, '222222', DATE_ADD(NOW(), INTERVAL 10 MINUTE));
