<?php
declare(strict_types=1);

const CV_LIMIT = 10_000_000;
const DOC_LIMIT = 10_000_000;
const BODY_LIMIT = 30 * 1024 * 1024;

function respond(int $status, array $payload = []): never
{
    http_response_code($status);
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    if ($status !== 204) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload);
    }
    exit;
}

function applicationData(array $payload): array
{
    if (!empty($payload['website'])) {
        throw new InvalidArgumentException('We couldn’t accept this submission.');
    }

    $fields = [];
    $limits = ['id' => 36, 'role' => 7, 'name' => 120, 'email' => 254, 'phone' => 32, 'message' => 2000];
    foreach ($limits as $key => $limit) {
        $value = $payload[$key] ?? '';
        if (!is_string($value) || mb_strlen($value, 'UTF-8') > $limit) {
            throw new InvalidArgumentException('Check your application details and try again.');
        }
        $fields[$key] = trim($value);
    }
    if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/D', $fields['id'])) {
        throw new InvalidArgumentException('Reload the form and try again.');
    }
    if ($fields['name'] === '' || !in_array($fields['role'], ['bdm', 'zom', 'general'], true)) {
        throw new InvalidArgumentException('Enter your name and select a position.');
    }
    if (!filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Enter a valid email address.');
    }
    $phone = $fields['phone'];
    $digits = strlen(preg_replace('/\D/', '', $phone));
    if (!preg_match('/^[+\d][\d() .-]+$/D', $phone) || $digits < 7 || $digits > 15) {
        throw new InvalidArgumentException('Enter a valid phone number.');
    }

    // Required CV (PDF, under 10 MB)
    $encodedCv = $payload['cv'] ?? null;
    $cv = is_string($encodedCv) && strlen($encodedCv) <= 4 * intdiv(CV_LIMIT + 2, 3)
        ? base64_decode($encodedCv, true)
        : false;
    if ($cv === false || strlen($cv) > CV_LIMIT || !str_starts_with($cv, '%PDF-') ||
        (new finfo(FILEINFO_MIME_TYPE))->buffer($cv) !== 'application/pdf') {
        throw new InvalidArgumentException('Choose a valid PDF CV under 10 MB.');
    }

    // Optional Document / Work Experience Letter (PDF, under 10 MB)
    $doc = null;
    $encodedDoc = $payload['document'] ?? null;
    if (!empty($encodedDoc)) {
        if (!is_string($encodedDoc) || strlen($encodedDoc) > 4 * intdiv(DOC_LIMIT + 2, 3)) {
            throw new InvalidArgumentException('Work experience letter or document must be under 10 MB.');
        }
        $decodedDoc = base64_decode($encodedDoc, true);
        if ($decodedDoc === false || strlen($decodedDoc) > DOC_LIMIT || !str_starts_with($decodedDoc, '%PDF-') ||
            (new finfo(FILEINFO_MIME_TYPE))->buffer($decodedDoc) !== 'application/pdf') {
            throw new InvalidArgumentException('Work experience letter or document must be a valid PDF under 10 MB.');
        }
        $doc = $decodedDoc;
    }

    return [$fields, $cv, $doc];
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method !== 'OPTIONS' && $method !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['error' => 'Use the RedCat careers form.']);
}

$configPath = dirname(__DIR__) . '/redcat-careers-config.php';
if (!is_readable($configPath)) {
    respond(503, ['error' => 'Online applications are temporarily unavailable. Please try again later.']);
}

try {
    $config = require $configPath;
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    header('Vary: Origin');
    if ($origin === '' || !in_array($origin, $config['allowed_origins'], true)) {
        respond(403, ['error' => 'Use the RedCat careers form.']);
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    if ($method === 'OPTIONS') {
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        respond(204);
    }

    $contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '', 2)[0]));
    if ($contentType !== 'application/json') {
        respond(415, ['error' => 'Use the RedCat careers form.']);
    }
    $raw = file_get_contents('php://input', false, null, 0, BODY_LIMIT + 1);
    if ($raw === false || strlen($raw) > BODY_LIMIT) {
        respond(413, ['error' => 'Uploaded files exceed the maximum allowed size (10 MB).']);
    }
    $payload = json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
    if (!is_array($payload)) {
        throw new InvalidArgumentException('Enter your application details.');
    }
    [$fields, $cv, $doc] = applicationData($payload);

    $fingerprint = hash('sha256', json_encode($fields, JSON_THROW_ON_ERROR) . $cv . ($doc ?? ''));
    $pdo = new PDO($config['dsn'], $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    // Check whether the database table has the 'document' column
    static $hasDocColumn = null;
    if ($hasDocColumn === null) {
        $checkCol = $pdo->prepare("SHOW COLUMNS FROM career_applications LIKE 'document'");
        $checkCol->execute();
        $hasDocColumn = (bool) $checkCol->fetch();
    }

    if ($hasDocColumn) {
        $insert = $pdo->prepare(
            'INSERT INTO career_applications (id, role, name, email, phone, message, cv, document, fingerprint, received_at)
             VALUES (:id, :role, :name, :email, :phone, :message, :cv, :document, :fingerprint, UTC_TIMESTAMP())'
        );
        foreach ($fields as $key => $value) {
            $insert->bindValue(':' . $key, $value);
        }
        $insert->bindValue(':cv', $cv, PDO::PARAM_LOB);
        $insert->bindValue(':document', $doc, $doc !== null ? PDO::PARAM_LOB : PDO::PARAM_NULL);
        $insert->bindValue(':fingerprint', $fingerprint);
    } else {
        $insert = $pdo->prepare(
            'INSERT INTO career_applications (id, role, name, email, phone, message, cv, fingerprint, received_at)
             VALUES (:id, :role, :name, :email, :phone, :message, :cv, :fingerprint, UTC_TIMESTAMP())'
        );
        foreach ($fields as $key => $value) {
            $insert->bindValue(':' . $key, $value);
        }
        $insert->bindValue(':cv', $cv, PDO::PARAM_LOB);
        $insert->bindValue(':fingerprint', $fingerprint);
    }

    try {
        $insert->execute();
    } catch (PDOException $exception) {
        if ((int) ($exception->errorInfo[1] ?? 0) !== 1062) {
            throw $exception;
        }
        $lookup = $pdo->prepare('SELECT fingerprint FROM career_applications WHERE id = :id');
        $lookup->execute(['id' => $fields['id']]);
        if ($lookup->fetchColumn() !== $fingerprint) {
            respond(409, ['error' => 'The application details changed. Reload the form and try again.']);
        }
        respond(200, ['id' => $fields['id']]);
    }
    respond(201, ['id' => $fields['id']]);
} catch (InvalidArgumentException $exception) {
    respond(400, ['error' => $exception->getMessage()]);
} catch (JsonException) {
    respond(400, ['error' => 'Enter your application details and choose a PDF CV.']);
} catch (Throwable) {
    error_log('RedCat careers application could not be saved.');
    respond(503, ['error' => 'We couldn’t confirm your submission. Please try again.']);
}
