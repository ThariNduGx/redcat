CREATE TABLE IF NOT EXISTS career_applications (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    role VARCHAR(16) NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    message TEXT NOT NULL,
    cv LONGBLOB NOT NULL,
    fingerprint CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    received_at DATETIME NOT NULL,
    INDEX career_applications_received_at (received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
