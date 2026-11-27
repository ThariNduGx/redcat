<?php
declare(strict_types=1);

const HUB_BODY_LIMIT = 256 * 1024;

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

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method !== 'OPTIONS' && $method !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['error' => 'Use the RedCat Hub Franchise form.']);
}

$configPath = dirname(__DIR__) . '/redcat-careers-config.php';
if (!is_readable($configPath)) {
    respond(503, ['error' => 'Online applications are temporarily unavailable.']);
}

try {
    $config = require $configPath;
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    header('Vary: Origin');
    if ($origin === '' || !in_array($origin, $config['allowed_origins'], true)) {
        respond(403, ['error' => 'Use the RedCat Hub Franchise form.']);
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

    $raw = file_get_contents('php://input', false, null, 0, HUB_BODY_LIMIT + 1);
    if ($raw === false || strlen($raw) > HUB_BODY_LIMIT) {
        respond(413, ['error' => 'Application payload is too large.']);
    }

    $payload = json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
    if (!is_array($payload)) {
        throw new InvalidArgumentException('Invalid application payload.');
    }

    $id = trim((string) ($payload['id'] ?? ''));
    if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/D', $id)) {
        throw new InvalidArgumentException('Reload the form and try again.');
    }

    $fullName = trim((string) ($payload['fullName'] ?? ''));
    $mobile = trim((string) ($payload['mobileNumber'] ?? ''));
    $whatsapp = trim((string) ($payload['whatsappNumber'] ?? ''));
    $email = trim((string) ($payload['email'] ?? ''));
    $resDist = trim((string) ($payload['residentialDistrict'] ?? ''));
    $prefDist = trim((string) ($payload['preferredDistrict'] ?? ''));
    $hub1 = trim((string) ($payload['firstPreferredHub'] ?? ''));
    $hub2 = trim((string) ($payload['secondPreferredHub'] ?? ''));

    if ($fullName === '' || $mobile === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $prefDist === '' || $hub1 === '') {
        throw new InvalidArgumentException('Complete all required personal and hub location fields.');
    }
    if (empty($payload['agreePrivacyTerms']) || empty($payload['agreeContact'])) {
        throw new InvalidArgumentException('You must agree to the declaration terms.');
    }

    $score = scoreHubApplication($payload);
    $encodedPayload = json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    $encodedScore = json_encode($score, JSON_THROW_ON_ERROR);
    $fingerprint = hash('sha256', $encodedPayload);

    $pdo = new PDO($config['dsn'], $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

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

    $insert->execute([
        'id' => $id,
        'full_name' => mb_substr($fullName, 0, 120),
        'mobile_number' => mb_substr($mobile, 0, 32),
        'whatsapp_number' => mb_substr($whatsapp, 0, 32),
        'email' => mb_substr($email, 0, 254),
        'residential_district' => mb_substr($resDist, 0, 64),
        'preferred_district' => mb_substr($prefDist, 0, 64),
        'first_preferred_hub' => mb_substr($hub1, 0, 100),
        'second_preferred_hub' => mb_substr($hub2, 0, 100),
        'total_investment' => mb_substr((string) ($payload['totalAvailableInvestment'] ?? ''), 0, 64),
        'funds_available' => mb_substr((string) ($payload['fundsCurrentlyAvailable'] ?? ''), 0, 64),
        'suitable_premises' => mb_substr((string) ($payload['suitablePremises'] ?? ''), 0, 64),
        'floor_area' => mb_substr((string) ($payload['availableFloorArea'] ?? ''), 0, 64),
        'score_total' => $score['total'],
        'score_breakdown' => $encodedScore,
        'tier' => $score['tier'],
        'payload_json' => $encodedPayload,
        'fingerprint' => $fingerprint,
    ]);

    respond(201, ['id' => $id, 'score' => $score['total'], 'tier' => $score['tier']]);
} catch (InvalidArgumentException $e) {
    respond(400, ['error' => $e->getMessage()]);
} catch (JsonException) {
    respond(400, ['error' => 'Invalid application format.']);
} catch (PDOException $e) {
    if ((int) ($e->errorInfo[1] ?? 0) === 1062) {
        respond(200, ['id' => $id ?? '']);
    }
    error_log('RedCat hub franchise application error: ' . $e->getMessage());
    respond(503, ['error' => 'Unable to save application. Please try again.']);
} catch (Throwable $e) {
    error_log('RedCat hub franchise error: ' . $e->getMessage());
    respond(503, ['error' => 'Unable to save application. Please try again.']);
}
