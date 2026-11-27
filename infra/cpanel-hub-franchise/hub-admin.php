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
if ($careersReview) {
    $signOutToken = $_SESSION['csrf_token'] ??= bin2hex(random_bytes(32));
}
session_write_close();

$isPoint = ($_GET['type'] ?? null) === 'point';
$program = $isPoint ? 'Point Franchise' : 'Hub Franchise';
$publicForm = 'https://redcat.lk/dealers/' . ($isPoint ? 'point/application' : 'hub-franchise');
$reviewUrl = static function (array $params = []) use ($isPoint): string {
    $query = http_build_query(($isPoint ? ['type' => 'point'] : []) + $params);
    return $query === '' ? 'hub-admin.php' : 'hub-admin.php?' . $query;
};
if ($isPoint) require __DIR__ . '/point-review.php';

$method = $_SERVER['REQUEST_METHOD'] ?? '';
$action = $_POST['action'] ?? null;
if (!in_array($method, ['GET', 'POST'], true)) fail(405, 'Method not allowed.');
if ($method === 'POST' && (
    ($action !== 'export' && !($isPoint && $action === 'qualification')) ||
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

// An optional override lets deployments use a dedicated read-only MySQL account.
$db = $isPoint ? $config : ($config['review_database'] ?? $config);
$dbSettings = !$isPoint && isset($config['review_database']) ? 'review_database' : 'the top-level database settings';
if (!is_array($db) ||
    !is_string($db['dsn'] ?? null) || !str_starts_with($db['dsn'], 'mysql:') ||
    !is_string($db['username'] ?? null) || trim($db['username']) === '' ||
    !is_string($db['password'] ?? null) || $db['password'] === '') {
    fail(503, "Franchise review database settings are incomplete. Check $dbSettings in redcat-hub-franchise-config.php.");
}

try {
    $pdo = new PDO($db['dsn'], $db['username'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => false,
    ]);

    if ($isPoint && $method === 'POST') {
        if ($action === 'export') exportPointApplications($pdo, $staff);
        if ($id === null) fail(400, 'Application reference is required.');
        savePointQualification($pdo, $id, $staff);
        header('Location: ' . $reviewUrl(['id' => $id, 'page' => $page, 'saved' => 1]) . '#qualification', true, 303);
        exit;
    }

    if ($isPoint) {
        if (isset($_GET['file'])) {
            $slot = filter_var($_GET['file'], FILTER_VALIDATE_INT);
            if ($id === null || !isset(pointReviewFiles()[$slot])) fail(404, 'File not found.');
            sendPointFile($pdo, $id, $slot, $staff);
        }
        $pointReview = loadPointReview($pdo, $id, $page);
        if ($id === null) {
            ['applications' => $applications, 'next' => $next] = $pointReview;
        } else {
            ['application' => $application, 'answers' => $answers, 'scores' => $scores, 'schema' => $schema,
             'qualification' => $qualification, 'fileSlots' => $fileSlots] = $pointReview;
        }
    } elseif ($method === 'POST') {
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
    } elseif ($id !== null) {
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
    error_log('RedCat ' . $program . ' dashboard database error (' . $code . ').');
    $message = match ($code) {
        1045, 1698 => "The franchise review database login was rejected. Check the MySQL username and password in $dbSettings.",
        1044, 1142, 1143 => $isPoint
            ? 'The Point database user lacks access. Check SELECT, INSERT and UPDATE permissions on the Point application and file tables.'
            : 'The franchise review database user lacks access. Grant it SELECT on hub_franchise_applications.',
        1049 => "The franchise review database was not found. Check the database name in $dbSettings.",
        1054, 1146 => "The franchise table or a required column was not found. Check that the franchise schema is installed in the database configured in $dbSettings.",
        2002, 2003, 2006, 2013 => "The franchise dashboard could not connect to the database. Check the host in $dbSettings and try again.",
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
  <title>RedCat <?= h($program) ?> Review</title>
  <style nonce="<?= h($nonce) ?>">
    :root{color-scheme:light;--ink:#0f172a;--muted:#475569;--line:#dce3ed;--wash:#f5f7fa;--brand:#b91c1c}
    *{box-sizing:border-box}
    body{font:1rem/1.5 system-ui,sans-serif;background:var(--wash);color:var(--ink);margin:0}
    h1,h2,p{margin:0}
    h1{font-size:clamp(1.6rem,4vw,2rem);line-height:1.2;letter-spacing:-.035em}
    h2{font-size:1.15rem;line-height:1.3}
    a{color:var(--brand);text-underline-offset:.2em}
    a:hover{text-decoration-thickness:2px}
    :focus-visible{outline:3px solid var(--brand);outline-offset:3px}
    .container{width:min(100%,80rem);margin:auto;padding-inline:clamp(1rem,4vw,2rem)}
    .top{background:white;border-bottom:1px solid var(--line)}
    .top-row,.content-heading,.controls,.identity,.pager{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem}
    .top-row,.content-heading{justify-content:space-between}
    .top-row{min-height:4.5rem;padding-block:.75rem}
    .identity strong,.identity small{display:block}
    .identity small,.muted{color:var(--muted)}
    .mark{display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:.7rem;background:#dc2626;color:white;font-weight:800}
    .controls{font-size:.875rem}
    .action,.tabs a,.tabs span,.pager a{min-height:2.75rem;display:inline-flex;align-items:center;justify-content:center}
    .action{border:1px solid var(--line);border-radius:.65rem;background:white;color:var(--ink);padding:.55rem .85rem;font:inherit;font-weight:650;text-decoration:none;cursor:pointer}
    .action:hover{background:#eef2f7}
    .sign-out{border-color:transparent;color:var(--brand)}
    .tabs{display:flex;flex-wrap:wrap;gap:0 1.25rem;border-top:1px solid var(--line);font-size:.9rem;font-weight:650}
    .tabs a,.tabs span{padding-inline:.1rem;border-bottom:2px solid transparent;color:var(--muted);text-decoration:none}
    .tabs [aria-current]{border-color:var(--brand);color:var(--brand)}
    .tabs a:hover{color:var(--ink)}
    main{padding-block:2rem}
    .content-heading{margin-bottom:1.25rem}
    .content-heading p{margin-top:.35rem}
    .panel,.table{background:white;border:1px solid var(--line);border-radius:1rem;margin-bottom:1rem}
    section.panel{padding:clamp(1rem,3vw,1.5rem)}
    .empty{text-align:center;padding:clamp(2.5rem,8vw,5rem) 1rem}
    .empty p{margin:.5rem auto 1rem;max-width:32rem}
    .table{overflow:auto}
    table{width:100%;border-collapse:collapse;text-align:left;font-size:.9rem}
    thead{color:var(--muted)}
    th,td{padding:.85rem 1rem;vertical-align:top;border-bottom:1px solid var(--line)}
    tr:last-child td,tr:last-child th[scope=row]{border-bottom:0}
    tbody tr:hover{background:#f8fafc}
    .number{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
    .date{white-space:nowrap}
    .pager{justify-content:flex-end;font-size:.9rem}
    dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr));gap:1rem;margin-bottom:0}
    dt{font-size:.85rem;font-weight:650;color:var(--muted)}
    dd{margin:.15rem 0 0;white-space:pre-wrap;overflow-wrap:anywhere}
    .fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr));gap:1rem;margin-top:1rem}
    .fields label{display:grid;gap:.35rem;align-content:start;min-width:0;font-size:.875rem;font-weight:650}
    .fields input,.fields select{width:100%;min-height:2.65rem;border:1px solid var(--line);border-radius:.55rem;padding:.5rem;color:var(--ink);background:white;font:inherit;font-weight:400}
    .form-note{margin:.45rem 0 0}
    .success{border:1px solid #bbf7d0;background:#f0fdf4;color:#166534;border-radius:.75rem;padding:.75rem;margin-bottom:1rem}
    .primary{background:var(--brand);border-color:var(--brand);color:white}
    .primary:hover{background:#991b1b}
    @media(max-width:42rem){main{padding-block:1.25rem}.content-heading{align-items:flex-start}.top-row{gap:.3rem}.staff-name{display:none}th,td{padding:.65rem .75rem}}
  </style>
</head>
<body>
<header class="top">
  <div class="container">
    <div class="top-row">
      <div class="identity">
        <span class="mark" aria-hidden="true">RC</span>
        <div><strong>RedCat Admin</strong><small><?= h($program) ?></small></div>
      </div>
      <div class="controls">
        <a class="action" href="<?= h($publicForm) ?>" target="_blank" rel="noopener noreferrer">View franchise form</a>
        <span class="muted staff-name"><?= h($staff) ?></span>
        <?php if ($careersReview): ?>
          <form method="post" action="admin.php?action=logout">
            <input type="hidden" name="csrf_token" value="<?= h($signOutToken) ?>">
            <button type="submit" class="action sign-out">Sign out</button>
          </form>
        <?php endif; ?>
      </div>
    </div>
    <nav class="tabs" aria-label="RedCat administration">
      <?php if ($careersReview): ?><a href="admin.php">Careers</a><?php endif; ?>
      <a href="hub-admin.php"<?= $isPoint ? '' : ' aria-current="page"' ?>>Hub Franchise</a>
      <a href="hub-admin.php?type=point"<?= $isPoint ? ' aria-current="page"' : '' ?>>Point Franchise</a>
    </nav>
  </div>
</header>
<main class="container">
  <?php if ($id === null): ?>
    <div class="content-heading">
      <div>
        <h1><?= h($program) ?> applications</h1>
        <p class="muted"><?= $isPoint ? 'Review Point registrations and record qualification interviews.' : 'Review regional hub applications and qualification scores.' ?></p>
      </div>
      <form method="post" action="<?= h($reviewUrl()) ?>">
        <input type="hidden" name="action" value="export">
        <input type="hidden" name="csrf" value="<?= h($csrf) ?>">
        <button type="submit" class="action">Export CSV</button>
      </form>
    </div>
  <?php else: ?>
    <div class="content-heading">
      <div>
        <a href="<?= h($reviewUrl(['page' => $page])) ?>">← All <?= $isPoint ? 'Point' : 'hub' ?> applications</a>
        <h1><?= h(displayAnswer($answers['fullName'] ?? null)) ?></h1>
      </div>
    </div>
  <?php endif; ?>

  <?php if ($id !== null): ?>
    <section class="panel">
      <h2>Application summary</h2>
      <dl>
        <div><dt>Reference</dt><dd><?= h($isPoint ? 'RC-P-' . strtoupper($id) : $id) ?></dd></div>
        <div><dt>Received (UTC)</dt><dd><?= h($application['received_at']) ?></dd></div>
        <?php if ($isPoint): ?>
          <div><dt>Selection stage</dt><dd><?= h(pointSelectionStages()[(int) $application['selection_stage']] ?? 'Unknown') ?></dd></div>
          <div><dt>Score</dt><dd><?= $application['score_total'] === null ? 'Unscored' : h($application['score_total']) . ' / 100 · ' . h(pointScoreTier((int) $application['score_total'])) ?></dd></div>
          <?php if ($application['reviewed_at'] !== null): ?>
            <div><dt>Last saved (UTC)</dt><dd><?= h($application['reviewed_at']) ?> · <?= h($application['reviewer']) ?></dd></div>
          <?php endif; ?>
        <?php else: ?>
          <div><dt>Selection stage</dt><dd><?= h($stages[(int) $application['selection_stage']] ?? 'Unknown') ?></dd></div>
          <?php foreach (['financial' => 'Financial / 25', 'transport' => 'Transport / 20', 'premises' => 'Premises / 20', 'management' => 'Management / 15', 'operational' => 'Operations / 10', 'readiness' => 'Readiness / 5', 'technology' => 'Technology / 5', 'total' => 'Total / 100', 'tier' => 'Tier'] as $key => $label): ?>
            <div><dt><?= h($label) ?></dt><dd><?= h($scores[$key] ?? '—') ?></dd></div>
          <?php endforeach; ?>
        <?php endif; ?>
        <div><dt>Terms version</dt><dd><?= h(displayAnswer($answers['termsVersion'] ?? null)) ?></dd></div>
      </dl>
    </section>
    <?php foreach ($schema['sections'] as $section): ?>
      <section class="panel">
        <h2><?= h($section['en']) ?></h2>
        <dl>
          <?php foreach ($section['fields'] as $field): ?>
            <div><dt><?= h($field['en']) ?></dt><dd><?= h(displayAnswer($answers[$field['key']] ?? null)) ?></dd></div>
          <?php endforeach; ?>
        </dl>
      </section>
    <?php endforeach; ?>
    <?php if ($isPoint): ?>
      <form id="qualification" method="post" enctype="multipart/form-data" action="<?= h($reviewUrl(['id' => $id, 'page' => $page])) ?>">
        <input type="hidden" name="action" value="qualification">
        <input type="hidden" name="csrf" value="<?= h($csrf) ?>">
        <input type="hidden" name="revision" value="<?= h($application['revision']) ?>">
        <div class="content-heading">
          <div><h2>Qualification interview</h2><p class="muted">Save a draft at any time. Complete the interview before entering scores.</p></div>
        </div>
        <?php if (($_GET['saved'] ?? null) === '1'): ?><p class="success" role="status">Qualification saved.</p><?php endif; ?>
        <section class="panel">
          <h2>Selection progress</h2>
          <p class="muted form-note">Record approval after scoring the interview and verifying the location and finances.</p>
          <div class="fields">
            <label>Selection stage
              <select name="stage">
                <?php foreach (pointSelectionStages() as $value => $label): ?>
                  <option value="<?= $value ?>"<?= (int) $application['selection_stage'] === $value ? ' selected' : '' ?>><?= h($label) ?></option>
                <?php endforeach; ?>
              </select>
            </label>
          </div>
        </section>
        <?php $sinhala = pointQualificationSinhala(); ?>
        <?php foreach (pointQualificationSections() as $heading => $fields): ?>
          <section class="panel">
            <h2><?= h($heading) ?></h2>
            <div class="fields">
              <?php foreach ($fields as $key => $rule): [$label, $type] = $rule; $value = $qualification[$key] ?? ''; ?>
                <label>
                  <span><?= h($label) ?><?= empty($rule[3]) ? '' : ' (optional)' ?><br><span class="muted" lang="si"><?= h($sinhala[$key]) ?></span></span>
                  <?php if ($type === 'select'): ?>
                    <select name="answers[<?= h($key) ?>]">
                      <option value="">Select an answer</option>
                      <?php foreach ($rule[2] as $option): ?>
                        <option value="<?= h($option) ?>"<?= $value === $option ? ' selected' : '' ?>><?= h($option . (isset($sinhala[$option]) ? ' / ' . $sinhala[$option] : '')) ?></option>
                      <?php endforeach; ?>
                    </select>
                  <?php else: ?>
                    <input type="<?= h($type) ?>" name="answers[<?= h($key) ?>]" maxlength="<?= $type === 'tel' ? 32 : 500 ?>" value="<?= h($value) ?>">
                  <?php endif; ?>
                </label>
              <?php endforeach; ?>
            </div>
          </section>
        <?php endforeach; ?>
        <?php
          $pointFiles = pointReviewFiles();
          $fileGroups = [
              ['Premises photos', 'Optional. Upload JPEG, PNG or WebP images up to 2 MB each.', 'image/jpeg,image/png,image/webp', 1, 3],
              ['Verification documents', 'Upload PDFs up to 5 MB each during qualification. Files are available to authorized staff.', 'application/pdf,.pdf', 4, 6],
          ];
        ?>
        <?php foreach ($fileGroups as [$heading, $note, $accept, $start, $end]): ?>
          <section class="panel">
            <h2><?= h($heading) ?></h2>
            <p class="muted form-note"><?= h($note) ?></p>
            <div class="fields">
              <?php for ($slot = $start; $slot <= $end; $slot++): ?>
                <div>
                  <label><?= h($pointFiles[$slot]) ?><input type="file" name="file_<?= $slot ?>" accept="<?= h($accept) ?>"></label>
                  <?php if (in_array($slot, $fileSlots, true)): ?>
                    <a href="<?= h($reviewUrl(['id' => $id, 'file' => $slot])) ?>">Download <?= h(strtolower($pointFiles[$slot])) ?></a>
                  <?php endif; ?>
                </div>
              <?php endfor; ?>
            </div>
          </section>
        <?php endforeach; ?>
        <section class="panel">
          <h2>Qualification scores</h2>
          <p class="muted form-note">The dashboard assigns a tier after you enter all six scores.</p>
          <div class="fields">
            <?php foreach (pointScoreCategories() as $key => [$label, $max]): ?>
              <label><?= h($label) ?> / <?= $max ?>
                <input type="number" name="scores[<?= h($key) ?>]" min="0" max="<?= $max ?>" step="1" value="<?= h($scores[$key] ?? '') ?>">
              </label>
            <?php endforeach; ?>
          </div>
        </section>
        <button type="submit" class="action primary">Save qualification</button>
      </form>
    <?php endif; ?>
  <?php elseif (!$applications): ?>
    <section class="panel empty">
      <?php if ($page > 1): ?>
        <h2>No applications on this page</h2>
        <p class="muted">Return to the first page to review applications.</p>
        <a class="action" href="<?= h($reviewUrl()) ?>">Return to first page</a>
      <?php else: ?>
        <h2>No <?= $isPoint ? 'Point' : 'hub' ?> applications yet</h2>
        <p class="muted">Applications submitted through the <?= $isPoint ? 'Point Franchise' : 'regional hub' ?> form will appear here.</p>
      <?php endif; ?>
    </section>
  <?php else: ?>
    <div class="table" tabindex="0" role="region" aria-label="Applications">
      <table>
        <thead><tr><th scope="col">Applicant</th><th scope="col"><?= $isPoint ? 'Preferred area' : 'Preferred hub' ?></th>
          <?php if ($isPoint): ?><th scope="col">Review status</th><?php else: ?><th scope="col">Investment</th><th scope="col">Premises</th><?php endif; ?>
          <th scope="col" class="number">Score</th><th scope="col" class="date">Received (UTC)</th></tr></thead>
        <tbody>
          <?php foreach ($applications as $row): ?>
            <tr>
              <th scope="row"><a href="<?= h($reviewUrl(['id' => $row['id'], 'page' => $page])) ?>"><?= h($row['full_name']) ?></a></th>
              <td><?= h($row[$isPoint ? 'preferred_point' : 'first_preferred_hub']) ?><br><span class="muted"><?= h($row['preferred_district']) ?></span></td>
              <?php if ($isPoint): ?>
                <td><?= h(pointSelectionStages()[(int) $row['selection_stage']] ?? 'Unknown') ?></td>
              <?php else: ?>
                <td><?= h($row['total_investment']) ?></td>
                <td><?= h($row['suitable_premises']) ?></td>
              <?php endif; ?>
              <td class="number"><?php if ($row['score_total'] === null): ?>—<?php else: ?>
                <strong><?= h($row['score_total']) ?></strong> / 100 <span class="muted">· <?= h($isPoint ? pointScoreTier((int) $row['score_total']) : $row['tier']) ?></span>
              <?php endif; ?></td>
              <td class="date"><?= h($row['received_at']) ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <nav class="pager" aria-label="Application pages">
      <?php if ($page > 1): ?><a href="<?= h($reviewUrl(['page' => $page - 1])) ?>">Previous</a><?php endif; ?>
      <span aria-current="page">Page <?= $page ?></span>
      <?php if ($next): ?><a href="<?= h($reviewUrl(['page' => $page + 1])) ?>">Next</a><?php endif; ?>
    </nav>
  <?php endif; ?>
</main>
</body>
</html>
