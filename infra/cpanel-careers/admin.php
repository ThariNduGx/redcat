<?php
declare(strict_types=1);

/**
 * RedCat Careers - HR & Recruitment Admin Portal
 * Single-file dashboard for reviewing applications and downloading CVs.
 */

// Enable strict session cookie settings
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

$configPath = dirname(__DIR__) . '/redcat-careers-config.php';
if (!is_readable($configPath)) {
    http_response_code(500);
    echo '<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;"><h3>Configuration file not found.</h3><p>Ensure redcat-careers-config.php exists one directory above the webroot.</p></body></html>';
    exit;
}

$config = require $configPath;

// Database connection
function getPdo(array $config): PDO {
    return new PDO($config['dsn'], $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

// CSRF token helper
function getCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken(?string $token): bool {
    return !empty($token) && !empty($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// -------------------------------------------------------------
// AUTHENTICATION LOGIC
// -------------------------------------------------------------
$error = '';
$action = $_GET['action'] ?? '';

// Logout
if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Process Login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_submit'])) {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? null)) {
        $error = 'Session expired. Please try again.';
    } else {
        $user = trim($_POST['username'] ?? '');
        $pass = $_POST['password'] ?? '';

        $adminConfig = $config['admin'] ?? [];
        $expectedUser = $adminConfig['username'] ?? 'admin';
        $expectedHash = $adminConfig['password_hash'] ?? '';
        $plainFallback = $adminConfig['password'] ?? null;

        $valid = false;
        if ($user === $expectedUser) {
            if (!empty($expectedHash) && password_verify($pass, $expectedHash)) {
                $valid = true;
            } elseif (!empty($plainFallback) && hash_equals($plainFallback, $pass)) {
                $valid = true;
            }
        }

        if ($valid) {
            session_regenerate_id(true);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user'] = $user;
            $_SESSION['admin_login_time'] = time();
            header('Location: admin.php');
            exit;
        } else {
            $error = 'Invalid username or password.';
        }
    }
}

$isLoggedIn = !empty($_SESSION['admin_logged_in']);

// -------------------------------------------------------------
// SECURED ACTIONS: CV DOWNLOAD / PREVIEW / CSV EXPORT
// -------------------------------------------------------------
if ($isLoggedIn) {
    // 1. Download or View CV / Document
    if (isset($_GET['cv_id']) || isset($_GET['doc_id'])) {
        $fileId = $_GET['doc_id'] ?? $_GET['cv_id'];
        $isDoc = isset($_GET['doc_id']) || (($_GET['type'] ?? '') === 'doc');
        $download = !empty($_GET['download']);

        if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $fileId)) {
            http_response_code(400);
            exit('Invalid File ID');
        }

        try {
            $pdo = getPdo($config);
            $column = $isDoc ? 'document' : 'cv';

            // If downloading extra document, verify the column exists in database
            if ($isDoc) {
                $checkCol = $pdo->query("SHOW COLUMNS FROM career_applications LIKE 'document'");
                if (!$checkCol || !$checkCol->fetch()) {
                    http_response_code(404);
                    exit('Document column is not configured in database.');
                }
            }

            $stmt = $pdo->prepare("SELECT name, role, {$column} AS file_data FROM career_applications WHERE id = :id LIMIT 1");
            $stmt->execute(['id' => $fileId]);
            $row = $stmt->fetch();

            if (!$row || empty($row['file_data'])) {
                http_response_code(404);
                exit(($isDoc ? 'Document' : 'CV') . ' not found.');
            }

            $sanitizedName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $row['name']);
            $prefix = $isDoc ? 'Document' : 'CV';
            $filename = sprintf('%s-%s-%s.pdf', $prefix, strtoupper($row['role']), $sanitizedName);

            header('Content-Type: application/pdf');
            header('Content-Length: ' . strlen($row['file_data']));
            header('X-Content-Type-Options: nosniff');
            header('Cache-Control: private, max-age=3600');

            if ($download) {
                header('Content-Disposition: attachment; filename="' . $filename . '"');
            } else {
                header('Content-Disposition: inline; filename="' . $filename . '"');
            }

            echo $row['file_data'];
            exit;
        } catch (Throwable $e) {
            http_response_code(500);
            exit('Failed to retrieve file: ' . htmlspecialchars($e->getMessage()));
        }
    }

    // 2. Export All as CSV
    if ($action === 'export_csv') {
        try {
            $pdo = getPdo($config);
            $stmt = $pdo->query('SELECT id, role, name, email, phone, message, received_at FROM career_applications ORDER BY received_at DESC');
            $rows = $stmt->fetchAll();

            $filename = 'redcat_applications_' . date('Y-m-d_His') . '.csv';
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . $filename . '"');

            $out = fopen('php://output', 'w');
            fputcsv($out, ['Reference ID', 'Role', 'Name', 'Email', 'Phone', 'Area / Preferred Location', 'Experience Details', 'Received At (UTC)']);

            foreach ($rows as $r) {
                $area = '';
                $exp = $r['message'];
                if (preg_match('/^Area:\s*(.*?)\nExperience:\s*(.*)$/s', $r['message'], $m)) {
                    $area = trim($m[1]);
                    $exp = trim($m[2]);
                }

                $roleLabel = match($r['role']) {
                    'bdm' => 'Business Development Executive',
                    'zom' => 'Zone Operations Manager',
                    default => 'General Application',
                };

                fputcsv($out, [
                    $r['id'],
                    $roleLabel,
                    $r['name'],
                    $r['email'],
                    $r['phone'],
                    $area,
                    $exp,
                    $r['received_at'],
                ]);
            }
            fclose($out);
            exit;
        } catch (Throwable $e) {
            http_response_code(500);
            exit('Export failed: ' . htmlspecialchars($e->getMessage()));
        }
    }
}

// -------------------------------------------------------------
// DATA RETRIEVAL FOR DASHBOARD
// -------------------------------------------------------------
$applications = [];
$stats = ['total' => 0, 'bdm' => 0, 'zom' => 0, 'general' => 0, 'today' => 0];

if ($isLoggedIn) {
    try {
        $pdo = getPdo($config);
        $checkCol = $pdo->query("SHOW COLUMNS FROM career_applications LIKE 'document'");
        $hasDocCol = $checkCol && (bool) $checkCol->fetch();

        if ($hasDocCol) {
            $stmt = $pdo->query('SELECT id, role, name, email, phone, message, LENGTH(cv) as cv_size, LENGTH(document) as doc_size, received_at FROM career_applications ORDER BY received_at DESC');
        } else {
            $stmt = $pdo->query('SELECT id, role, name, email, phone, message, LENGTH(cv) as cv_size, 0 as doc_size, received_at FROM career_applications ORDER BY received_at DESC');
        }
        $applications = $stmt->fetchAll();

        $today = date('Y-m-d');
        foreach ($applications as $app) {
            $stats['total']++;
            if ($app['role'] === 'bdm') $stats['bdm']++;
            elseif ($app['role'] === 'zom') $stats['zom']++;
            else $stats['general']++;

            if (str_starts_with($app['received_at'], $today)) {
                $stats['today']++;
            }
        }
    } catch (Throwable $e) {
        $error = 'Database query error: ' . $e->getMessage();
    }
}

// Helpers for presentation
function formatRole(string $role): array {
    return match($role) {
        'bdm' => ['label' => 'Business Development Executive', 'bg' => 'bg-red-50 text-red-700 border-red-200', 'badge' => 'BDE'],
        'zom' => ['label' => 'Zone Operations Manager', 'bg' => 'bg-amber-50 text-amber-800 border-amber-200', 'badge' => 'ZOM'],
        default => ['label' => 'General Application', 'bg' => 'bg-slate-100 text-slate-700 border-slate-200', 'badge' => 'General'],
    };
}

function parseMessage(string $msg): array {
    $area = 'Not specified';
    $experience = $msg;
    if (preg_match('/^Area:\s*(.*?)\nExperience:\s*(.*)$/s', $msg, $matches)) {
        $area = trim($matches[1]);
        $experience = trim($matches[2]);
    }
    return ['area' => $area, 'experience' => $experience];
}

function formatPhoneWhatsApp(string $phone): string {
    $digits = preg_replace('/\D/', '', $phone);
    if (str_starts_with($digits, '0') && strlen($digits) === 10) {
        $digits = '94' . substr($digits, 1);
    }
    return $digits;
}
?>
<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RedCat Careers Admin Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .brand-red { background-color: #E12222; }
    .brand-red-text { color: #E12222; }
  </style>
</head>
<body class="h-full text-slate-800 antialiased flex flex-col">

<?php if (!$isLoggedIn): ?>
  <!-- ==================== LOGIN VIEW ==================== -->
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 to-slate-200">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl brand-red text-white shadow-xl shadow-red-500/20 mb-4">
        <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">RedCat Careers</h2>
      <p class="mt-2 text-sm font-medium text-slate-600">Recruitment &amp; Applications Portal</p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="bg-white py-8 px-6 shadow-xl shadow-slate-300/40 rounded-3xl sm:px-10 border border-slate-200/80">
        <?php if (!empty($error)): ?>
          <div class="mb-5 rounded-2xl bg-red-50 p-4 border border-red-200 text-sm font-semibold text-red-700 flex items-center gap-2">
            <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
            <span><?= htmlspecialchars($error) ?></span>
          </div>
        <?php endif; ?>

        <form action="admin.php" method="POST" class="space-y-5">
          <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

          <div>
            <label for="username" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Username</label>
            <input id="username" name="username" type="text" required autofocus
              class="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium">
          </div>

          <div>
            <label for="password" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Password</label>
            <input id="password" name="password" type="password" required
              class="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium">
          </div>

          <button type="submit" name="login_submit" value="1"
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-red-500/25 text-sm font-bold text-white brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
            Sign In to Dashboard
          </button>
        </form>

        <div class="mt-6 border-t border-slate-100 pt-4 text-center">
          <p class="text-xs text-slate-400">Authorized personnel only &bull; RedCat Logistics (Pvt) Ltd</p>
        </div>
      </div>
    </div>
  </div>

<?php else: ?>
  <!-- ==================== DASHBOARD VIEW ==================== -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl brand-red text-white flex items-center justify-center font-black tracking-wider text-lg shadow-md shadow-red-500/20">
            RC
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-900 leading-tight">RedCat Careers Admin</h1>
            <p class="text-xs text-slate-500">Applicant Tracking &amp; CV Repository</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <a href="admin.php?action=export_csv"
             class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Export CSV
          </a>

          <a href="https://redcat.lk/hr" target="_blank"
             class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
            View Live Form &rarr;
          </a>

          <div class="h-6 w-px bg-slate-200"></div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-500 hidden md:inline"><?= htmlspecialchars($_SESSION['admin_user'] ?? 'Admin') ?></span>
            <a href="admin.php?action=logout"
               class="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
              Sign out
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">

    <!-- KPI Metric Cards -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Applicants</p>
        <p class="mt-2 text-3xl font-extrabold text-slate-900"><?= $stats['total'] ?></p>
        <p class="mt-1 text-xs text-emerald-600 font-semibold">+<?= $stats['today'] ?> today</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wider text-red-600">Business Dev. Executives</p>
        <p class="mt-2 text-3xl font-extrabold text-slate-900"><?= $stats['bdm'] ?></p>
        <p class="mt-1 text-xs text-slate-500">BDE candidate pool</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wider text-amber-600">Zone Operations</p>
        <p class="mt-2 text-3xl font-extrabold text-slate-900"><?= $stats['zom'] ?></p>
        <p class="mt-1 text-xs text-slate-500">ZOM candidate pool</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500">General Applicants</p>
        <p class="mt-2 text-3xl font-extrabold text-slate-900"><?= $stats['general'] ?></p>
        <p class="mt-1 text-xs text-slate-500">Drivers, Hub &amp; others</p>
      </div>
    </div>

    <!-- Filter and Search Bar -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Role Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" id="filterPills">
        <button onclick="setFilter('all')" class="filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-slate-900 text-white" data-filter="all">
          All (<?= $stats['total'] ?>)
        </button>
        <button onclick="setFilter('bdm')" class="filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-600 hover:bg-slate-200" data-filter="bdm">
          BDE (<?= $stats['bdm'] ?>)
        </button>
        <button onclick="setFilter('zom')" class="filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-600 hover:bg-slate-200" data-filter="zom">
          Zone Operations (<?= $stats['zom'] ?>)
        </button>
        <button onclick="setFilter('general')" class="filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-600 hover:bg-slate-200" data-filter="general">
          General (<?= $stats['general'] ?>)
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-72">
        <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" id="searchInput" oninput="applySearch()" placeholder="Search name, phone, area..."
          class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20">
      </div>
    </div>

    <!-- Applications Table -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <?php if (empty($applications)): ?>
        <div class="text-center py-16 px-4">
          <div class="h-12 w-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
          </div>
          <h3 class="text-base font-bold text-slate-800">No applications received yet</h3>
          <p class="text-xs text-slate-500 mt-1">Submitted applications from redcat.lk/hr will appear here in real-time.</p>
        </div>
      <?php else: ?>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th class="py-3.5 px-6">Applicant</th>
                <th class="py-3.5 px-4">Role</th>
                <th class="py-3.5 px-4">Contact</th>
                <th class="py-3.5 px-4">Area / District</th>
                <th class="py-3.5 px-4">Received</th>
                <th class="py-3.5 px-6 text-right">CV / Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium" id="applicantRows">
              <?php foreach ($applications as $app):
                $roleMeta = formatRole($app['role']);
                $parsed = parseMessage($app['message']);
                $waPhone = formatPhoneWhatsApp($app['phone']);
                $cvKb = round(($app['cv_size'] ?? 0) / 1024, 1);
                $docKb = !empty($app['doc_size']) ? round($app['doc_size'] / 1024, 1) : 0;
                $receivedTime = date('M j, Y &bull; g:i A', strtotime($app['received_at']));
              ?>
                <tr class="applicant-row hover:bg-slate-50/70 transition-colors"
                    data-role="<?= htmlspecialchars($app['role']) ?>"
                    data-search="<?= htmlspecialchars(strtolower($app['name'] . ' ' . $app['email'] . ' ' . $app['phone'] . ' ' . $parsed['area'] . ' ' . $parsed['experience'])) ?>"
                    data-id="<?= htmlspecialchars($app['id']) ?>"
                    data-name="<?= htmlspecialchars($app['name']) ?>"
                    data-rolelabel="<?= htmlspecialchars($roleMeta['label']) ?>"
                    data-phone="<?= htmlspecialchars($app['phone']) ?>"
                    data-email="<?= htmlspecialchars($app['email']) ?>"
                    data-area="<?= htmlspecialchars($parsed['area']) ?>"
                    data-experience="<?= htmlspecialchars($parsed['experience']) ?>"
                    data-cv-size="<?= $cvKb ?>"
                    data-doc-size="<?= $docKb ?>"
                    data-received="<?= htmlspecialchars($receivedTime) ?>">

                  <!-- Applicant Name & Email -->
                  <td class="py-4 px-6">
                    <div class="font-bold text-slate-900 text-sm"><?= htmlspecialchars($app['name']) ?></div>
                    <div class="text-slate-500 text-xs mt-0.5"><?= htmlspecialchars($app['email']) ?></div>
                    <div class="text-[11px] text-slate-400 font-mono mt-1">Ref: <?= substr($app['id'], 0, 8) ?>...</div>
                  </td>

                  <!-- Role Badge -->
                  <td class="py-4 px-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border <?= $roleMeta['bg'] ?>">
                      <?= $roleMeta['label'] ?>
                    </span>
                  </td>

                  <!-- Contact Buttons -->
                  <td class="py-4 px-4 whitespace-nowrap">
                    <div class="text-slate-900 font-semibold flex items-center gap-2">
                      <span><?= htmlspecialchars($app['phone']) ?></span>
                      <?php if (!empty($waPhone)): ?>
                        <a href="https://wa.me/<?= $waPhone ?>?text=<?= urlencode("Hello " . $app['name'] . ", this is RedCat Careers regarding your application for " . $roleMeta['label'] . ".") ?>"
                           target="_blank" title="Chat on WhatsApp"
                           class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
                          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.004.576 1.761.841 2.806.841 3.181 0 5.767-2.586 5.767-5.766.001-3.18-2.585-5.766-5.767-5.766zm3.395 8.167c-.145.409-.843.766-1.164.814-.321.049-.738.077-2.385-.601-1.996-.821-3.267-2.854-3.366-2.987-.099-.133-.807-1.074-.807-2.049 0-.974.512-1.453.694-1.651.182-.198.397-.248.529-.248.132 0 .264.002.379.008.121.006.284-.046.444.339.165.397.561 1.37.611 1.47.05.099.083.215.017.347-.066.132-.099.215-.198.33-.099.116-.21.258-.3.346-.101.099-.206.207-.089.407.117.2 0.521.86 1.117 1.391.769.684 1.417.896 1.616.996.198.099.314.083.43-.05.116-.132.496-.578.628-.776.132-.198.264-.165.446-.099.182.066 1.156.545 1.355.644.198.099.33.149.379.231.049.083.049.48-.096.889z"/></svg>
                        </a>
                      <?php endif; ?>
                    </div>
                  </td>

                  <!-- Preferred Area -->
                  <td class="py-4 px-4 text-slate-700">
                    <span class="inline-block max-w-[180px] truncate font-semibold" title="<?= htmlspecialchars($parsed['area']) ?>">
                      <?= htmlspecialchars($parsed['area']) ?>
                    </span>
                  </td>

                  <!-- Received Time -->
                  <td class="py-4 px-4 text-slate-500 whitespace-nowrap">
                    <?= $receivedTime ?>
                  </td>

                  <!-- Actions: View Details & PDF Download -->
                  <td class="py-4 px-6 text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-1.5 justify-end">
                      <!-- Details Button -->
                      <button onclick="openModal(this)"
                              class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition border border-slate-200">
                        Details
                      </button>

                      <!-- View CV Inline -->
                      <a href="admin.php?cv_id=<?= urlencode($app['id']) ?>" target="_blank"
                         title="View CV PDF"
                         class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold brand-red-text hover:bg-red-50 transition border border-red-200">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        CV (<?= $cvKb ?> KB)
                      </a>

                      <!-- Download CV PDF -->
                      <a href="admin.php?cv_id=<?= urlencode($app['id']) ?>&download=1"
                         title="Download CV PDF"
                         class="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      </a>

                      <?php if ($docKb > 0): ?>
                        <!-- View Extra Document Inline -->
                        <a href="admin.php?doc_id=<?= urlencode($app['id']) ?>" target="_blank"
                           title="View Experience Letter / Document"
                           class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-800 hover:bg-amber-100 transition border border-amber-300 bg-amber-50">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                          Doc (<?= $docKb ?> KB)
                        </a>

                        <!-- Download Extra Document -->
                        <a href="admin.php?doc_id=<?= urlencode($app['id']) ?>&download=1"
                           title="Download Experience Letter / Document"
                           class="inline-flex items-center justify-center h-8 w-8 rounded-lg text-amber-800 hover:text-amber-950 hover:bg-amber-100 transition border border-amber-300 bg-amber-50">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        </a>
                      <?php endif; ?>
                    </div>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>
    </div>
  </main>

  <!-- ==================== APPLICANT DETAIL MODAL ==================== -->
  <div id="detailModal" class="fixed inset-0 z-50 hidden overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <span id="modalRole" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200"></span>
          <h3 id="modalName" class="text-xl font-extrabold text-slate-900 mt-1"></h3>
        </div>
        <button onclick="closeModal()" class="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-lg font-bold transition">
          &times;
        </button>
      </div>

      <div class="p-6 space-y-5 text-sm">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span class="block text-xs font-bold text-slate-400 uppercase">Phone</span>
            <span id="modalPhone" class="font-bold text-slate-900 text-base"></span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span class="block text-xs font-bold text-slate-400 uppercase">Email</span>
            <span id="modalEmail" class="font-bold text-slate-900 break-all"></span>
          </div>
        </div>

        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span class="block text-xs font-bold text-slate-400 uppercase">Preferred Location / Area</span>
          <span id="modalArea" class="font-bold text-slate-900"></span>
        </div>

        <div>
          <span class="block text-xs font-bold text-slate-400 uppercase mb-2">Candidate Experience Summary</span>
          <div id="modalExp" class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-medium"></div>
        </div>

        <!-- Optional Work Experience Letter / Additional Document -->
        <div id="modalDocSection" class="p-4 rounded-xl border border-amber-200 bg-amber-50/70 hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="block text-xs font-bold text-amber-900 uppercase tracking-wide">Work Experience Letter / Relevant Document</span>
              <span id="modalDocSize" class="text-xs text-amber-700 font-semibold mt-0.5 block"></span>
            </div>
            <div class="flex gap-2">
              <a id="modalDownloadDoc" href="#"
                 class="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-800 text-white hover:bg-amber-900 transition flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Download Doc
              </a>
              <a id="modalViewDoc" href="#" target="_blank"
                 class="px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-400 text-amber-950 bg-white hover:bg-amber-100 transition flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                View Doc
              </a>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <span id="modalReceived" class="text-xs text-slate-400 font-medium"></span>
          <div class="flex gap-2">
            <a id="modalDownloadCv" href="#"
               class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download CV
            </a>
            <a id="modalViewCv" href="#" target="_blank"
               class="px-4 py-2 rounded-xl text-xs font-bold brand-red text-white hover:bg-red-700 transition flex items-center gap-1.5 shadow-md shadow-red-500/20">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              Open CV
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let activeFilter = 'all';

    function setFilter(role) {
      activeFilter = role;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === role) {
          btn.className = 'filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-slate-900 text-white';
        } else {
          btn.className = 'filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-600 hover:bg-slate-200';
        }
      });
      applySearch();
    }

    function applySearch() {
      const q = document.getElementById('searchInput').value.toLowerCase().trim();
      const rows = document.querySelectorAll('.applicant-row');

      rows.forEach(row => {
        const role = row.getAttribute('data-role');
        const search = row.getAttribute('data-search');

        const matchesRole = (activeFilter === 'all' || role === activeFilter);
        const matchesQuery = (!q || search.includes(q));

        if (matchesRole && matchesQuery) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    function openModal(btn) {
      const tr = btn.closest('tr');
      document.getElementById('modalName').textContent = tr.getAttribute('data-name');
      document.getElementById('modalRole').textContent = tr.getAttribute('data-rolelabel');
      document.getElementById('modalPhone').textContent = tr.getAttribute('data-phone');
      document.getElementById('modalEmail').textContent = tr.getAttribute('data-email');
      document.getElementById('modalArea').textContent = tr.getAttribute('data-area');
      document.getElementById('modalExp').textContent = tr.getAttribute('data-experience');
      document.getElementById('modalReceived').textContent = 'Received: ' + tr.getAttribute('data-received');

      const id = tr.getAttribute('data-id');
      document.getElementById('modalViewCv').href = 'admin.php?cv_id=' + encodeURIComponent(id);
      document.getElementById('modalDownloadCv').href = 'admin.php?cv_id=' + encodeURIComponent(id) + '&download=1';

      const docSize = parseFloat(tr.getAttribute('data-doc-size') || '0');
      const docSection = document.getElementById('modalDocSection');
      if (docSize > 0) {
        document.getElementById('modalDocSize').textContent = docSize + ' KB (PDF attached)';
        document.getElementById('modalViewDoc').href = 'admin.php?doc_id=' + encodeURIComponent(id);
        document.getElementById('modalDownloadDoc').href = 'admin.php?doc_id=' + encodeURIComponent(id) + '&download=1';
        docSection.classList.remove('hidden');
      } else {
        docSection.classList.add('hidden');
      }

      document.getElementById('detailModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('detailModal').classList.add('hidden');
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  </script>
<?php endif; ?>

</body>
</html>
