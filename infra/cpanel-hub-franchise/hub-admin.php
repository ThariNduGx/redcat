<?php
declare(strict_types=1);

header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: no-referrer');
$nonce = base64_encode(random_bytes(18));
header("Content-Security-Policy: default-src 'none'; style-src 'nonce-$nonce'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");

function fail(int $status, string $message): never
{
    http_response_code($status);
    header('Content-Type: text/plain; charset=utf-8');
    exit($message);
}

function h(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function csvCell(mixed $value): string
{
    $value = (string) $value;
    return preg_match('/^(?:[\x00-\x20]*[=+\-@\x{FF1D}\x{FF0B}\x{FF0D}\x{FF20}]|[\t\r\n])/u', $value) ? "'" . $value : $value;
}

if (($_SERVER['HTTPS'] ?? '') !== 'on') fail(403, 'HTTPS is required.');
$configFile = dirname(__DIR__) . '/redcat-hub-franchise-config.php';
if (!is_readable($configFile)) fail(503, 'Franchise review is unavailable.');
$config = require $configFile;

$configuredReviewers = $config['reviewers'] ?? [];
$gatewayUser = $_SERVER['REMOTE_USER'] ?? '';
$gatewayReview = is_array($configuredReviewers) && $gatewayUser !== '' && in_array($gatewayUser, $configuredReviewers, true);
$careersReviewers = $config['careers_reviewers'] ?? [];
$careersReview = !$gatewayReview && is_array($careersReviewers) && $careersReviewers !== [];
if (!$gatewayReview && !$careersReview) fail(403, 'Franchise review access required.');

ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_name($gatewayReview ? 'redcat_hub_review' : 'redcat_staff');
session_set_cookie_params([
    'path' => $gatewayReview ? '/hub-admin.php' : '/',
    'secure' => true, 'httponly' => true, 'samesite' => 'Strict',
]);
session_start();
if ($gatewayReview) {
    $staff = $gatewayUser;
    if (($_SESSION['staff'] ?? null) !== $staff || time() - ($_SESSION['activity'] ?? 0) > 1200) {
        session_regenerate_id(true);
        $_SESSION = ['staff' => $staff];
    }
    $_SESSION['activity'] = time();
} else {
    if (($_SESSION['admin_logged_in'] ?? false) !== true || time() - (int) ($_SESSION['admin_login_time'] ?? 0) >= 28800) {
        session_write_close();
        header('Location: admin.php', true, 303);
        exit;
    }
    $staff = $_SESSION['admin_user'] ?? '';
    if (($_SESSION['franchise_reviewer_login'] ?? false) !== true || !in_array($staff, $careersReviewers, true)) {
        session_write_close();
        fail(403, 'Franchise review access required. Sign out of Careers and sign in with an approved account.');
    }
}
$csrf = $_SESSION['hub_export_csrf'] ??= bin2hex(random_bytes(32));
session_write_close();

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if (!in_array($method, ['GET', 'POST'], true)) fail(405, 'Method not allowed.');
if ($method === 'POST' && (
    ($_POST['action'] ?? null) !== 'export' ||
    !is_string($_POST['csrf'] ?? null) ||
    !hash_equals($csrf, $_POST['csrf'])
)) fail(403, 'Refresh the dashboard and try again.');

$id = $_GET['id'] ?? null;
if ($id !== null && (!is_string($id) || !preg_match('/^[0-9a-f-]{36}$/D', $id))) fail(400, 'Invalid reference.');
$page = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 100000]]) ?: 1;
$columns = 'id, full_name, mobile_number, whatsapp_number, email, residential_district, preferred_district, first_preferred_hub, second_preferred_hub, total_investment, funds_available, suitable_premises, floor_area, score_total, tier, selection_stage, received_at';
$order = ' ORDER BY score_total DESC, received_at DESC, id ASC';
$stages = [
    1 => 'Online registration', 'Lead scoring', 'Telephone interview', 'Detailed application',
    'Financial verification', 'Premises and vehicle inspection', 'Final interview',
    'Approval and agreement', 'Certificate course', 'Setup and testing', 'Hub opening',
];

$db = $config['review_database'] ?? null;
if (!is_array($db) ||
    !is_string($db['dsn'] ?? null) || !str_starts_with($db['dsn'], 'mysql:') ||
    !is_string($db['username'] ?? null) || trim($db['username']) === '' ||
    !is_string($db['password'] ?? null) || $db['password'] === '') {
    fail(503, 'Franchise review database settings are incomplete. Check review_database in redcat-hub-franchise-config.php.');
}

try {
    $pdo = new PDO($db['dsn'], $db['username'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => false,
    ]);

    if ($method === 'POST') {
        $query = $pdo->query('SELECT ' . $columns . ' FROM hub_franchise_applications' . $order);
        $out = fopen('php://output', 'w');
        if ($out === false) throw new RuntimeException('Could not open export.');
        error_log('RedCat hub application CSV export by ' . json_encode($staff, JSON_INVALID_UTF8_SUBSTITUTE));
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="redcat_hub_franchise_' . gmdate('Y-m-d') . '.csv"');
        fputcsv($out, ['Reference', 'Name', 'Mobile', 'WhatsApp', 'Email', 'Residential district', 'Preferred district', 'First hub', 'Second hub', 'Investment', 'Funds available', 'Premises', 'Floor area', 'Score', 'Tier', 'Stage', 'Received (UTC)'], ',', '"', '');
        while ($row = $query->fetch()) {
            $row['selection_stage'] = $stages[(int) $row['selection_stage']] ?? $row['selection_stage'];
            fputcsv($out, array_map('csvCell', array_values($row)), ',', '"', '');
        }
        fclose($out);
        exit;
    }

    if ($id !== null) {
        $query = $pdo->prepare('SELECT payload_json, score_breakdown, received_at, selection_stage FROM hub_franchise_applications WHERE id = :id');
        $query->execute(['id' => $id]);
        $application = $query->fetch();
        if (!$application) fail(404, 'Application not found.');
        $answers = json_decode($application['payload_json'], true, 16, JSON_THROW_ON_ERROR);
        $scores = json_decode($application['score_breakdown'], true, 16, JSON_THROW_ON_ERROR);
        $schema = json_decode(file_get_contents(__DIR__ . '/application-schema.json'), true, 16, JSON_THROW_ON_ERROR);
    } else {
        $query = $pdo->prepare('SELECT ' . $columns . ' FROM hub_franchise_applications' . $order . ' LIMIT 51 OFFSET :offset');
        $query->bindValue('offset', ($page - 1) * 50, PDO::PARAM_INT);
        $query->execute();
        $applications = $query->fetchAll();
        $next = count($applications) === 51;
        if ($next) array_pop($applications);
    }
} catch (PDOException $e) {
    // Log the driver error number only. Raw database messages can contain private details.
    $code = (int) ($e->errorInfo[1] ?? 0);
    error_log('RedCat hub franchise dashboard database error (' . $code . ').');
    $message = match ($code) {
        1045, 1698 => 'The franchise review database login was rejected. Check the MySQL username and password under review_database.',
        1044, 1142, 1143 => 'The franchise review database user lacks access. Grant it SELECT on hub_franchise_applications.',
        1049 => 'The franchise review database was not found. Check the database name under review_database.',
        1054, 1146 => 'The franchise table or a required column was not found. Check that the franchise schema is installed in the database under review_database.',
        2002, 2003, 2006, 2013 => 'The franchise dashboard could not connect to the database. Check the host in review_database and try again.',
        default => 'The franchise dashboard could not load the database. Check the PHP error log for the database error number.',
    };
    fail(503, $message);
} catch (Throwable $e) {
    error_log('RedCat hub franchise dashboard failed (' . get_class($e) . ').');
    fail(503, 'Franchise review is temporarily unavailable.');
}

function displayAnswer(mixed $value): string
{
    if (is_bool($value)) return $value ? 'Yes' : 'No';
    if (is_array($value)) $value = implode(', ', array_filter($value, 'is_string'));
    return is_string($value) && $value !== '' ? $value : '—';
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RedCat Hub Franchise Review</title>
  <style nonce="<?= h($nonce) ?>">
    *{box-sizing:border-box}
    body{font:1rem/1.5 system-ui,sans-serif;background:#f5f3ef;color:#1c1b19;margin:0}
    main{max-width:74rem;margin:auto;padding:clamp(1rem,4vw,3rem)}
    header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid #bdb6aa;padding-bottom:1rem}
    h1,h2,p{margin:.4em 0}
    a{color:#8f1717}
    button{background:#1c1b19;color:#fff;border:0;cursor:pointer;font:inherit;font-weight:700;padding:.7rem 1rem;border-radius:.5rem}
    :focus-visible{outline:3px solid #981c1c;outline-offset:3px}
    section,.table{background:#fff;border:1px solid #d6d0c7;border-radius:.75rem;padding:1rem;margin-top:1rem}
    .table{overflow:auto}
    table{border-collapse:collapse;width:100%;text-align:left}
    th,td{padding:.75rem;vertical-align:top;border-bottom:1px solid #ddd7ce}
    td{overflow-wrap:anywhere}
    nav{display:flex;gap:1.5rem;margin-top:1rem}
    dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr));gap:1rem}
    dt{font-weight:600;color:#49443d}
    dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
  </style>
</head>
<body>
<main>
  <header>
    <div>
      <h1>Hub Franchise Review</h1>
      <p>Signed in as <?= h($staff) ?></p>
    </div>
    <?php if ($id === null): ?>
      <form method="post" action="hub-admin.php">
        <input type="hidden" name="action" value="export">
        <input type="hidden" name="csrf" value="<?= h($csrf) ?>">
        <button type="submit">Export applications as CSV</button>
      </form>
    <?php else: ?>
      <a href="hub-admin.php?page=<?= $page ?>">Back to applications</a>
    <?php endif; ?>
  </header>
  <?php if ($careersReview): ?>
    <nav aria-label="RedCat administration"><a href="admin.php">Careers</a><strong aria-current="page">Hub Franchise</strong></nav>
  <?php endif; ?>

  <?php if ($id !== null): ?>
    <section>
      <h2>Application summary</h2>
      <dl>
        <div><dt>Reference</dt><dd><?= h($id) ?></dd></div>
        <div><dt>Received (UTC)</dt><dd><?= h($application['received_at']) ?></dd></div>
        <div><dt>Selection stage</dt><dd><?= h($stages[(int) $application['selection_stage']] ?? 'Unknown') ?></dd></div>
        <?php foreach (['financial' => 'Financial / 25', 'transport' => 'Transport / 20', 'premises' => 'Premises / 20', 'management' => 'Management / 15', 'operational' => 'Operations / 10', 'readiness' => 'Readiness / 5', 'technology' => 'Technology / 5', 'total' => 'Total / 100', 'tier' => 'Tier'] as $key => $label): ?>
          <div><dt><?= h($label) ?></dt><dd><?= h($scores[$key] ?? '—') ?></dd></div>
        <?php endforeach; ?>
        <div><dt>Terms version</dt><dd><?= h(displayAnswer($answers['termsVersion'] ?? null)) ?></dd></div>
      </dl>
    </section>
    <?php foreach ($schema['sections'] as $section): ?>
      <section>
        <h2><?= h($section['en']) ?></h2>
        <dl>
          <?php foreach ($section['fields'] as $field): ?>
            <div><dt><?= h($field['en']) ?></dt><dd><?= h(displayAnswer($answers[$field['key']] ?? null)) ?></dd></div>
          <?php endforeach; ?>
        </dl>
      </section>
    <?php endforeach; ?>
  <?php elseif (!$applications): ?>
    <p>No applications on this page.</p>
    <?php if ($page > 1): ?><p><a href="hub-admin.php">Return to page 1</a></p><?php endif; ?>
  <?php else: ?>
    <div class="table" tabindex="0" role="region" aria-label="Applications">
      <table>
        <thead><tr><th scope="col">Applicant</th><th scope="col">Preferred hub</th><th scope="col">Investment</th><th scope="col">Premises</th><th scope="col">Score</th><th scope="col">Received (UTC)</th></tr></thead>
        <tbody>
          <?php foreach ($applications as $row): ?>
            <tr>
              <th scope="row"><a href="?id=<?= h(rawurlencode($row['id'])) ?>&amp;page=<?= $page ?>"><?= h($row['full_name']) ?></a></th>
              <td><?= h($row['first_preferred_hub']) ?><br><?= h($row['preferred_district']) ?></td>
              <td><?= h($row['total_investment']) ?></td>
              <td><?= h($row['suitable_premises']) ?></td>
              <td><?= h($row['score_total']) ?> / 100 · <?= h($row['tier']) ?></td>
              <td><?= h($row['received_at']) ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <nav aria-label="Application pages">
      <?php if ($page > 1): ?><a href="?page=<?= $page - 1 ?>">Previous</a><?php endif; ?>
      <span>Page <?= $page ?></span>
      <?php if ($next): ?><a href="?page=<?= $page + 1 ?>">Next</a><?php endif; ?>
    </nav>
  <?php endif; ?>
</main>
</body>
</html>
