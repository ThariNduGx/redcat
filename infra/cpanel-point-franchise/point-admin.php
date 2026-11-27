<?php
declare(strict_types=1);

/**
 * RedCat Point Franchise - Admin & Qualification Scoring Portal
 */
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
    exit('Configuration file not found.');
}
$config = require $configPath;

function getPdo(array $config): PDO {
    return new PDO($config['dsn'], $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

$error = '';
$action = $_GET['action'] ?? '';

if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: point-admin.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_submit'])) {
    $user = trim($_POST['username'] ?? '');
    $pass = $_POST['password'] ?? '';
    $adminConfig = $config['admin'] ?? [];
    $expectedUser = $adminConfig['username'] ?? 'admin';
    $expectedHash = $adminConfig['password_hash'] ?? '';
    $plainFallback = $adminConfig['password'] ?? null;

    $valid = ($user === $expectedUser) && (
        (!empty($expectedHash) && password_verify($pass, $expectedHash)) ||
        (!empty($plainFallback) && hash_equals($plainFallback, $pass))
    );

    if ($valid) {
        session_regenerate_id(true);
        $_SESSION['point_admin_logged_in'] = true;
        header('Location: point-admin.php');
        exit;
    } else {
        $error = 'Invalid username or password.';
    }
}

$isLoggedIn = !empty($_SESSION['point_admin_logged_in']);

if ($isLoggedIn && $action === 'export_csv') {
    $pdo = getPdo($config);
    $rows = $pdo->query('SELECT rc_ref, stage_mode, full_name, mobile_number, email, residential_district, preferred_district, preferred_point, second_preference, available_investment, business_premises, score_total, tier, received_at FROM point_franchise_applications ORDER BY score_total DESC, received_at DESC')->fetchAll();
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="redcat_point_franchise_' . date('Y-m-d') . '.csv"');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['Ref', 'Stage', 'Name', 'Mobile', 'Email', 'Res. District', 'Pref. District', 'Preferred Point', '2nd Preference', 'Investment', 'Premises', 'Score (/100)', 'Tier', 'Received (UTC)']);
    foreach ($rows as $r) {
        fputcsv($out, array_values($r));
    }
    fclose($out);
    exit;
}

$applications = [];
$stats = ['total' => 0, 'A+' => 0, 'A' => 0, 'B' => 0, 'C' => 0];
if ($isLoggedIn) {
    try {
        $pdo = getPdo($config);
        $applications = $pdo->query('SELECT * FROM point_franchise_applications ORDER BY score_total DESC, received_at DESC')->fetchAll();
        foreach ($applications as $a) {
            $stats['total']++;
            $t = $a['tier'] ?? 'C';
            if (isset($stats[$t])) $stats[$t]++;
        }
    } catch (Throwable $e) {
        $error = 'Database error: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RedCat Point Franchise Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen antialiased">
<?php if (!$isLoggedIn): ?>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
      <div class="text-center mb-6">
        <span class="inline-block bg-red-600 text-white font-black px-3 py-1 rounded-lg text-sm">REDCAT</span>
        <h1 class="text-2xl font-extrabold mt-3">Point Franchise Portal</h1>
        <p class="text-sm text-slate-500 mt-1">100-Mark Scoring &amp; Candidate Selection</p>
      </div>
      <?php if ($error): ?>
        <div class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold"><?= htmlspecialchars($error) ?></div>
      <?php endif; ?>
      <form method="POST" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Username</label>
          <input type="text" name="username" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm">
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
          <input type="password" name="password" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm">
        </div>
        <button type="submit" name="login_submit" value="1" class="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition">Sign In</button>
      </form>
    </div>
  </div>
<?php else: ?>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="bg-red-600 text-white font-black px-2.5 py-1 rounded-lg text-sm">RC</span>
        <div>
          <h1 class="font-bold text-base">REDCAT Point Franchise Admin</h1>
          <p class="text-xs text-slate-500">Prospective Franchisee Qualification &amp; Selection</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <a href="point-admin.php?action=export_csv" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800">Export CSV</a>
        <a href="point-admin.php?action=logout" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100">Sign Out</a>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <?php if ($error): ?>
      <div class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div class="bg-white p-5 rounded-2xl border border-slate-200"><p class="text-xs font-bold text-slate-400 uppercase">Total Apps</p><p class="text-3xl font-extrabold mt-1"><?= $stats['total'] ?></p></div>
      <div class="bg-emerald-50 p-5 rounded-2xl border border-emerald-200"><p class="text-xs font-bold text-emerald-700 uppercase">A+ Priority (80–100)</p><p class="text-3xl font-extrabold text-emerald-900 mt-1"><?= $stats['A+'] ?></p></div>
      <div class="bg-blue-50 p-5 rounded-2xl border border-blue-200"><p class="text-xs font-bold text-blue-700 uppercase">A Qualified (65–79)</p><p class="text-3xl font-extrabold text-blue-900 mt-1"><?= $stats['A'] ?></p></div>
      <div class="bg-amber-50 p-5 rounded-2xl border border-amber-200"><p class="text-xs font-bold text-amber-700 uppercase">B Potential (50–64)</p><p class="text-3xl font-extrabold text-amber-900 mt-1"><?= $stats['B'] ?></p></div>
      <div class="bg-slate-100 p-5 rounded-2xl border border-slate-200"><p class="text-xs font-bold text-slate-500 uppercase">C Review (&lt;50)</p><p class="text-3xl font-extrabold text-slate-700 mt-1"><?= $stats['C'] ?></p></div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <th class="py-3.5 px-5">Ref &amp; Applicant</th>
            <th class="py-3.5 px-4">Preferred Point</th>
            <th class="py-3.5 px-4">Investment &amp; Premises</th>
            <th class="py-3.5 px-4">Stage</th>
            <th class="py-3.5 px-4">Score / Tier</th>
            <th class="py-3.5 px-5 text-right">Details</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <?php foreach ($applications as $app):
            $tierColors = match($app['tier']) {
              'A+' => 'bg-emerald-100 text-emerald-800 border-emerald-300',
              'A' => 'bg-blue-100 text-blue-800 border-blue-300',
              'B' => 'bg-amber-100 text-amber-800 border-amber-300',
              default => 'bg-slate-100 text-slate-700 border-slate-300',
            };
          ?>
            <tr class="hover:bg-slate-50">
              <td class="py-4 px-5">
                <div class="font-mono text-[11px] font-bold text-red-600"><?= htmlspecialchars($app['rc_ref']) ?></div>
                <div class="font-bold text-sm text-slate-900"><?= htmlspecialchars($app['full_name']) ?></div>
                <div class="text-slate-500"><?= htmlspecialchars($app['mobile_number']) ?> &bull; <?= htmlspecialchars($app['email']) ?></div>
              </td>
              <td class="py-4 px-4">
                <div class="font-bold text-slate-900"><?= htmlspecialchars($app['preferred_point']) ?></div>
                <div class="text-slate-500"><?= htmlspecialchars($app['preferred_district']) ?></div>
              </td>
              <td class="py-4 px-4">
                <div class="font-semibold"><?= htmlspecialchars($app['available_investment']) ?></div>
                <div class="text-slate-500">Premises: <?= htmlspecialchars($app['business_premises']) ?></div>
              </td>
              <td class="py-4 px-4">
                <span class="px-2 py-1 rounded bg-slate-100 font-semibold capitalize"><?= htmlspecialchars($app['stage_mode']) ?></span>
              </td>
              <td class="py-4 px-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full font-extrabold border <?= $tierColors ?>">
                  <?= (int)$app['score_total'] ?>/100 &middot; <?= htmlspecialchars($app['tier']) ?>
                </span>
              </td>
              <td class="py-4 px-5 text-right">
                <button onclick='showDetails(<?= json_encode($app["payload_json"]) ?>, <?= json_encode($app["score_breakdown"]) ?>)' class="px-3 py-1.5 rounded-lg border border-slate-200 font-bold hover:bg-slate-100">View Details</button>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </main>

  <div id="modal" class="fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 class="font-extrabold text-lg">Point Franchise Application Details</h2>
        <button onclick="document.getElementById('modal').classList.add('hidden')" class="text-xl font-bold text-slate-400 hover:text-slate-700">&times;</button>
      </div>
      <div id="modalBody" class="p-6 overflow-y-auto space-y-4 text-xs"></div>
    </div>
  </div>

  <script>
    function showDetails(payloadStr, scoreStr) {
      const d = JSON.parse(payloadStr);
      const s = JSON.parse(scoreStr);
      let html = `<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div><span class="text-slate-400 block">Investment (/30)</span><strong>${s.investment}</strong></div>
        <div><span class="text-slate-400 block">Location/Premises (/25)</span><strong>${s.locationPremises}</strong></div>
        <div><span class="text-slate-400 block">Experience (/15)</span><strong>${s.experience}</strong></div>
        <div><span class="text-slate-400 block">Operational (/15)</span><strong>${s.operational}</strong></div>
        <div><span class="text-slate-400 block">Readiness (/10)</span><strong>${s.readiness}</strong></div>
        <div><span class="text-slate-400 block">Local Knowledge (/5)</span><strong>${s.localKnowledge}</strong></div>
        <div><span class="text-slate-400 block">Total (/100)</span><strong class="text-red-600">${s.total} (${s.tier})</strong></div>
      </div><div class="grid sm:grid-cols-2 gap-3">`;
      for (const [k, v] of Object.entries(d)) {
        const val = Array.isArray(v) ? v.join(', ') : String(v);
        html += `<div class="p-2.5 rounded-xl border border-slate-100"><span class="block text-slate-400 font-bold uppercase text-[10px]">${k}</span><span class="font-semibold text-slate-800 break-words">${val.replace(/</g, '&lt;')}</span></div>`;
      }
      html += '</div>';
      document.getElementById('modalBody').innerHTML = html;
      document.getElementById('modal').classList.remove('hidden');
    }
  </script>
<?php endif; ?>
</body>
</html>
