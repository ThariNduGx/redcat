CREATE TABLE IF NOT EXISTS point_franchise_applications (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    preferred_district VARCHAR(64) NOT NULL,
    preferred_point VARCHAR(120) NOT NULL,
    payload_json JSON NOT NULL,
    fingerprint CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    received_at DATETIME NOT NULL,
    qualification_json JSON DEFAULT NULL,
    score_json JSON DEFAULT NULL,
    score_total TINYINT UNSIGNED DEFAULT NULL,
    selection_stage TINYINT UNSIGNED NOT NULL DEFAULT 1,
    reviewer VARCHAR(120) DEFAULT NULL,
    reviewed_at DATETIME DEFAULT NULL,
    revision INT UNSIGNED NOT NULL DEFAULT 0,
    INDEX point_applications_received (received_at, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS point_franchise_files (
    application_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    slot TINYINT UNSIGNED NOT NULL,
    media_type VARCHAR(16) NOT NULL,
    contents MEDIUMBLOB NOT NULL,
    PRIMARY KEY (application_id, slot),
    FOREIGN KEY (application_id) REFERENCES point_franchise_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
