<?php
// Save one directory above the handler's document root as redcat-hub-franchise-config.php.
return [
    'dsn' => 'mysql:host=localhost;dbname=YOUR_HUB_DATABASE;charset=utf8mb4',
    'username' => 'YOUR_HUB_INTAKE_DB_USER',
    'password' => 'YOUR_HUB_INTAKE_DB_PASSWORD',
    'review_database' => [
        'dsn' => 'mysql:host=localhost;dbname=YOUR_HUB_DATABASE;charset=utf8mb4',
        'username' => 'YOUR_HUB_READ_ONLY_DB_USER',
        'password' => 'YOUR_HUB_READ_ONLY_DB_PASSWORD',
    ],
    'allowed_origins' => ['https://redcat.lk', 'https://www.redcat.lk'],
    'rate_limit_directory' => '/home/YOUR_ACCOUNT/private/redcat-hub-rate',
    // Usernames set by the authenticated web server or access gateway.
    'reviewers' => [],
    // Exact Careers admin usernames authorized to review franchise applications.
    'careers_reviewers' => [],
];
