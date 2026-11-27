<?php
declare(strict_types=1);

const HUB_BODY_LIMIT = 32 * 1024;

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

function scoreHubApplication(array $d): array
{
    // 1. Financial capability (25)
    $financial = 0;
    $inv = $d['totalAvailableInvestment'] ?? '';
    if ($inv === 'Above LKR 10M' || $inv === 'LKR 5–10M') $financial += 12;
    elseif ($inv === 'LKR 3–5M') $financial += 10;
    elseif ($inv === 'LKR 2–3M') $financial += 7;
    elseif ($inv === 'Below LKR 2M') $financial += 2;

    $funds = $d['fundsCurrentlyAvailable'] ?? '';
    if ($funds === 'Fully') $financial += 8;
    elseif ($funds === 'Partially') $financial += 4;
    elseif ($funds === 'Arranging') $financial += 1;

    $ops3m = $d['fundThreeMonthsOps'] ?? '';
    if ($ops3m === 'Yes') $financial += 5;
    elseif ($ops3m === 'Need information') $financial += 2;

    // 2. Transport (20)
    $transport = 0;
    $ownVeh = $d['ownCommercialVehicles'] ?? '';
    if ($ownVeh === 'Yes') $transport += 5;
    elseif ($ownVeh === 'No') $transport += 1;

    $vehCount = $d['vehicleCountForRedcat'] ?? '';
    if ($vehCount === 'Over 5') $transport += 7;
    elseif ($vehCount === '4–5') $transport += 6;
    elseif ($vehCount === '2–3') $transport += 5;
    elseif ($vehCount === '1') $transport += 3;

    $arr = $d['transportArrangement'] ?? '';
    if ($arr === 'Own') $transport += 4;
    elseif ($arr === 'Purchase' || $arr === 'Combination') $transport += 3;
    elseif ($arr === 'Lease or rent' || $arr === 'Contracted') $transport += 2;

    if (($d['manageMaintenanceFuelDrivers'] ?? '') === 'Yes') $transport += 4;

    // 3. Premises (20)
    $premises = 0;
    $prem = $d['suitablePremises'] ?? '';
    if ($prem === 'Own') $premises += 6;
    elseif ($prem === 'Rented') $premises += 5;
    elseif ($prem === 'Identified') $premises += 3;
    elseif ($prem === 'Searching') $premises += 1;

    $area = $d['availableFloorArea'] ?? '';
    if ($area === 'Above 3,000' || $area === '2,000–3,000') $premises += 6;
    elseif ($area === '1,500–2,000') $premises += 5;
    elseif ($area === 'Below 1,500') $premises += 2;

    $acc = $d['vehicleAccessParkingLoading'] ?? '';
    if ($acc === 'Yes') $premises += 4;
    elseif ($acc === 'Can arrange') $premises += 2;

    $early = $d['earlyNightAccess'] ?? '';
    if ($early === 'Yes') $premises += 4;
    elseif ($early === 'To confirm') $premises += 2;

    // 4. Management experience (15)
    $management = 0;
    if (($d['currentlyOperateBusiness'] ?? '') === 'Yes') $management += 3;

    $yrs = $d['yearsExperience'] ?? '';
    if ($yrs === 'Over 5 years') $management += 5;
    elseif ($yrs === '3–5 years') $management += 4;
    elseif ($yrs === '1–3 years') $management += 3;
    elseif ($yrs === 'Under 1 year') $management += 1;

    if (($d['logisticsExperience'] ?? '') === 'Yes') $management += 4;

    $emp = $d['largestEmployeesManaged'] ?? '';
    if ($emp === 'Over 20' || $emp === '11–20') $management += 3;
    elseif ($emp === '6–10') $management += 2;
    elseif ($emp === '1–5') $management += 1;

    // 5. Operational commitment (10)
    $operational = 0;
    $prim = $d['primaryBusiness'] ?? '';
    if ($prim === 'Primary') $operational += 2;
    elseif ($prim === 'Additional') $operational += 1;

    if (($d['recruitManageStaffDrivers'] ?? '') === 'Yes') $operational += 2;
    $coord = $d['coordinatePoints'] ?? '';
    if ($coord === 'Yes') $operational += 2;
    elseif ($coord === 'With training') $operational += 1;
    if (($d['maintainShifts'] ?? '') === 'Yes') $operational += 2;
    if (($d['operateDailyWeekendsHolidays'] ?? '') === 'Yes') $operational += 1;
    if (($d['followProcedures'] ?? '') === 'Yes') $operational += 1;

    // 6. Business readiness (5)
    $readiness = 0;
    $when = $d['commenceWhen'] ?? '';
    if ($when === 'Immediately' || $when === 'Within 30 days') $readiness += 4;
    elseif ($when === '60 days') $readiness += 3;
    elseif ($when === '90 days') $readiness += 2;
    elseif ($when === 'Over 90 days') $readiness += 1;

    if (mb_strlen(trim((string) ($d['whyInterested'] ?? '')), 'UTF-8') >= 15) $readiness += 1;

    // 7. Technology & training (5)
    $technology = 0;
    $comp = $d['computerMobileKnowledge'] ?? '';
    if ($comp === 'Advanced' || $comp === 'Intermediate') $technology += 2;
    elseif ($comp === 'Basic') $technology += 1;
    if (($d['useRedcatItSystem'] ?? '') === 'Yes') $technology += 2;
    if (($d['completeThreeDayCourse'] ?? '') === 'Yes') $technology += 1;

    $total = $financial + $transport + $premises + $management + $operational + $readiness + $technology;
    $tier = 'C';
    if ($total >= 80) $tier = 'A+';
    elseif ($total >= 65) $tier = 'A';
    elseif ($total >= 50) $tier = 'B';

    return [
        'financial' => $financial,
        'transport' => $transport,
        'premises' => $premises,
        'management' => $management,
        'operational' => $operational,
        'readiness' => $readiness,
        'technology' => $technology,
        'total' => $total,
        'tier' => $tier,
    ];
}

function validateApplication(array $payload, array $schema, array $catalog): array
{
    $rules = array_merge(...array_column($schema['sections'], 'fields'));
    $allowed = array_flip(array_merge(['id', 'termsVersion'], array_column($rules, 'key')));
    if (array_diff_key($payload, $allowed)) {
        respond(400, ['error' => 'Unexpected application fields.']);
    }

    $answers = [];
    foreach ($rules as $rule) {
        $key = $rule['key'];
        $value = $payload[$key] ?? null;
        $options = array_column($rule['options'] ?? [], 'value');
        $invalid = static fn () => respond(422, ['field' => $key, 'error' => 'Check this answer.']);

        if ($rule['type'] === 'consent') {
            if ($value !== true) $invalid();
        } elseif ($rule['type'] === 'multi') {
            if (!is_array($value) || !array_is_list($value) || !$value || count($value) > count($options)) $invalid();
            foreach ($value as $item) {
                if (!in_array($item, $options, true)) $invalid();
            }
            if (count(array_unique($value)) !== count($value) || (count($value) > 1 && in_array('None', $value, true))) $invalid();
            // Answers with multiple selections have a canonical order for retry comparison.
            sort($value, SORT_STRING);
        } else {
            if (!is_string($value)) $invalid();
            $value = trim($value);
            if ($value === '') {
                if (empty($rule['optional'])) $invalid();
            } else {
                if (mb_strlen($value) > ($rule['max'] ?? 120)) $invalid();
                if ($options && !in_array($value, $options, true)) $invalid();
                if ($rule['type'] === 'tel' && !preg_match('/^\+?\d[\d ()-]{6,30}$/D', $value)) $invalid();
                if ($rule['type'] === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) $invalid();
                if ($rule['type'] === 'date') {
                    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value, new DateTimeZone('Asia/Colombo'));
                    if (!$date || $date->format('Y-m-d') !== $value) $invalid();
                }
            }
        }
        $answers[$key] = $value;
    }
    foreach (['preferredDistrict', 'residentialDistrict'] as $key) {
        if (!in_array($answers[$key], $catalog['districts'], true)) respond(422, ['field' => $key]);
    }
    if (defined('POINT_FRANCHISE_INTAKE')) {
        $second = $answers['secondPreferredPoint'];
        if ($second !== '' && mb_strtolower($second) === mb_strtolower($answers['firstPreferredPoint'])) {
            respond(422, ['field' => 'secondPreferredPoint']);
        }
    } else {
        $hubDistricts = array_column($catalog['hubs'], 'district', 'name');
        if (($hubDistricts[$answers['firstPreferredHub']] ?? null) !== $answers['preferredDistrict']) {
            respond(422, ['field' => 'firstPreferredHub']);
        }
        $second = $answers['secondPreferredHub'];
        if ($second !== '' && (!isset($hubDistricts[$second]) || $second === $answers['firstPreferredHub'])) {
            respond(422, ['field' => 'secondPreferredHub']);
        }
    }
    return ['id' => $payload['id'], 'termsVersion' => $payload['termsVersion'], ...$answers];
}

function allowRequest(string $directory, string $address): bool
{
    $directory = realpath($directory);
    $root = realpath($_SERVER['DOCUMENT_ROOT'] ?? __DIR__);
    if ($directory === false || $root === false || $directory === $root || str_starts_with($directory . '/', $root . '/')) {
        throw new RuntimeException('Rate limiter requires a private directory.');
    }

    $lock = fopen($directory . '/hub-rate.lock', 'c');
    if ($lock === false || !flock($lock, LOCK_EX)) throw new RuntimeException('Could not lock rate limiter.');
    try {
        $file = $directory . '/hub-rate.json';
        $minute = intdiv(time(), 60);
        $state = is_file($file) ? json_decode(file_get_contents($file), true, 8, JSON_THROW_ON_ERROR) : [];
        if (($state['minute'] ?? null) !== $minute) $state = ['minute' => $minute, 'total' => 0, 'addresses' => []];
        $key = hash('sha256', $address);
        if ($state['total'] >= 120 || ($state['addresses'][$key] ?? 0) >= 10) return false;
        $state['total']++;
        $state['addresses'][$key] = ($state['addresses'][$key] ?? 0) + 1;
        $temp = $file . '.tmp';
        $json = json_encode($state, JSON_THROW_ON_ERROR);
        if (file_put_contents($temp, $json) !== strlen($json) || !rename($temp, $file)) {
            throw new RuntimeException('Could not update rate limiter.');
        }
        return true;
    } finally {
        fclose($lock);
    }
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method !== 'OPTIONS' && $method !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['error' => 'Use the RedCat franchise application form.']);
}

$configPath = dirname(__DIR__) . '/redcat-hub-franchise-config.php';
if (!is_readable($configPath)) {
    respond(503, ['error' => 'Online applications are temporarily unavailable.']);
}

try {
    $config = require $configPath;
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    header('Vary: Origin');
    if ($origin === '' || !in_array($origin, $config['allowed_origins'], true)) {
        respond(403, ['error' => 'Use the RedCat franchise application form.']);
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    if ($method === 'OPTIONS') {
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        respond(204);
    }

    $contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '', 2)[0]));
    if ($contentType !== 'application/json') {
        respond(415, ['error' => 'Invalid content type.']);
    }

    if (!allowRequest($config['rate_limit_directory'], $_SERVER['REMOTE_ADDR'] ?? 'unknown')) {
        header('Retry-After: ' . (60 - time() % 60));
        respond(429, ['error' => 'Too many requests. Try again shortly.']);
    }
    $raw = file_get_contents('php://input', false, null, 0, HUB_BODY_LIMIT + 1);
    if ($raw === false || strlen($raw) > HUB_BODY_LIMIT) {
        respond(413, ['error' => 'Application payload is too large.']);
    }
    try {
        $input = json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        respond(400, ['error' => 'Invalid application format.']);
    }
    if (!is_array($input) || array_is_list($input)) {
        respond(400, ['error' => 'Invalid application format.']);
    }
    $id = $input['id'] ?? '';
    if (!is_string($id) || !preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/D', $id)) {
        respond(400, ['error' => 'Reload the form and try again.']);
    }

    $pointIntake = defined('POINT_FRANCHISE_INTAKE');
    $schemaFile = $pointIntake ? '/point-application-schema.json' : '/application-schema.json';
    $schema = json_decode(file_get_contents(__DIR__ . $schemaFile), true, 16, JSON_THROW_ON_ERROR);
    if (($input['termsVersion'] ?? null) !== $schema['termsVersion']) {
        respond(409, ['code' => 'terms_changed']);
    }
    $catalog = json_decode(file_get_contents(__DIR__ . '/hub-catalog.json'), true, 16, JSON_THROW_ON_ERROR);
    $payload = validateApplication($input, $schema, $catalog);
    $encodedPayload = json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    $fingerprint = hash('sha256', $encodedPayload);

    $pdo = new PDO($config['dsn'], $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    if ($pointIntake) {
        savePointApplication($pdo, $payload, $encodedPayload, $fingerprint);
    }

    $score = scoreHubApplication($payload);
    $encodedScore = json_encode($score, JSON_THROW_ON_ERROR);
    $insert = $pdo->prepare(
        'INSERT INTO hub_franchise_applications (
            id, full_name, mobile_number, whatsapp_number, email,
            residential_district, preferred_district, first_preferred_hub, second_preferred_hub,
            total_investment, funds_available, suitable_premises, floor_area,
            score_total, score_breakdown, tier, selection_stage,
            payload_json, fingerprint, received_at
        ) VALUES (
            :id, :full_name, :mobile_number, :whatsapp_number, :email,
            :residential_district, :preferred_district, :first_preferred_hub, :second_preferred_hub,
            :total_investment, :funds_available, :suitable_premises, :floor_area,
            :score_total, :score_breakdown, :tier, 1,
            :payload_json, :fingerprint, UTC_TIMESTAMP()
        )'
    );

    try {
        $insert->execute([
            'id' => $id,
            'full_name' => $payload['fullName'],
            'mobile_number' => $payload['mobileNumber'],
            'whatsapp_number' => $payload['whatsappNumber'],
            'email' => $payload['email'],
            'residential_district' => $payload['residentialDistrict'],
            'preferred_district' => $payload['preferredDistrict'],
            'first_preferred_hub' => $payload['firstPreferredHub'],
            'second_preferred_hub' => $payload['secondPreferredHub'],
            'total_investment' => $payload['totalAvailableInvestment'],
            'funds_available' => $payload['fundsCurrentlyAvailable'],
            'suitable_premises' => $payload['suitablePremises'],
            'floor_area' => $payload['availableFloorArea'],
            'score_total' => $score['total'],
            'score_breakdown' => $encodedScore,
            'tier' => $score['tier'],
            'payload_json' => $encodedPayload,
            'fingerprint' => $fingerprint,
        ]);
    } catch (PDOException $e) {
        if ((int) ($e->errorInfo[1] ?? 0) !== 1062) throw $e;
        $existing = $pdo->prepare('SELECT fingerprint FROM hub_franchise_applications WHERE id = :id');
        $existing->execute(['id' => $id]);
        $saved = $existing->fetchColumn();
        if (is_string($saved) && hash_equals($saved, $fingerprint)) {
            respond(200, ['id' => $id, 'saved' => true]);
        }
        respond(409, ['code' => 'reference_conflict']);
    }
    respond(201, ['id' => $id, 'saved' => true]);
} catch (Throwable $e) {
    error_log('RedCat hub franchise submission failed (' . get_class($e) . ').');
    respond(503, ['error' => 'Unable to save application. Please try again.']);
}
