<?php
// Save as redcat-careers-config.php at /home/bestprod/redcat-careers-config.php (outside webroot)
return [
    'dsn' => 'mysql:host=localhost;dbname=bestprod_redcat_careers;charset=utf8mb4',
    'username' => 'bestprod_redcat_intake',
    'password' => 'YOUR_INTAKE_DB_PASSWORD',
    'allowed_origins' => [
        'https://redcat.lk',
        'https://www.redcat.lk',
    ],
    // Admin login credentials for https://apply.bestproducts.lk/admin.php
    'admin' => [
        'username' => 'admin',
        // Enter your private password here:
        'password' => 'REPLACE_WITH_STRONG_ADMIN_PASSWORD',
        // Or optionally use a bcrypt password hash:
        // 'password_hash' => '$2y$10$...',
    ],
];
