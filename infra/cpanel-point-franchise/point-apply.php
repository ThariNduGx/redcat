<?php
declare(strict_types=1);

const POINT_BODY_LIMIT = 128 * 1024;

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

function scorePointApplication(array $d): array
{
    // 1. Investment capability (30)
    $investment = 0;
    $inv = $d['availableInvestment'] ?? '';
    if ($inv === '>3M' || $inv === '2–3M') $investment += 18;
    elseif ($inv === '1.5–2M') $investment += 15;
    elseif ($inv === '1–1.5M') $investment += 10;
    elseif ($inv === '<1M') $investment += 4;

    $ready = $d['investmentFundsReady'] ?? '';
    if ($ready === 'Fully') $investment += 8;
    elseif ($ready === 'Partially') $investment += 4;

    $wc = $d['additionalWorkingCapital'] ?? '';
    if ($wc === 'Yes') $investment += 4;
    elseif ($wc === 'Need more information') $investment += 2;

    // 2. Business location & premises (25)
    $location = 0;
    $prem = $d['businessPremises'] ?? '';
    if ($prem === 'Own') $location += 10;
    elseif ($prem === 'Rented') $location += 8;
    elseif ($prem === 'Planning to rent') $location += 4;

    $size = $d['premisesSize'] ?? '';
    if ($size === '1,000+' || $size === '500–1,000') $location += 7;
    elseif ($size === '300–500') $location += 5;
    elseif ($size === '<300') $location += 2;

    if (($d['mainRoadFrontage'] ?? '') === 'Yes') $location += 4;
    if (($d['parkingAvailable'] ?? '') === 'Yes') $location += 4;

    // 3. Business experience (15)
    $experience = 0;
    if (($d['previousBusinessExperience'] ?? '') === 'Yes') $experience += 5;
    $yrs = $d['yearsBusinessExperience'] ?? '';
    if ($yrs === '5+') $experience += 4;
    elseif ($yrs === '3–5') $experience += 3;
    elseif ($yrs === '1–3') $experience += 2;
    if (($d['courierLogisticsExperience'] ?? '') === 'Yes') $experience += 3;
    if (($d['customerServiceExperience'] ?? '') === 'Yes') $experience += 3;

    // 4. Operational commitment (15)
    $operational = 0;
    $mode = $d['mainOrAdditionalBusiness'] ?? '';
    if ($mode === 'Full-time') $operational += 3;
    elseif ($mode === 'Additional business') $operational += 2;
    if (($d['readyToRecruitStaff'] ?? '') === 'Yes') $operational += 2;
    if (($d['canMeetServiceHours'] ?? '') === 'Yes') $operational += 3;
    if (($d['willingToCompleteTraining'] ?? '') === 'Yes') $operational += 3;
    if (($d['willingToUseItSystem'] ?? '') === 'Yes') $operational += 2;
    if (($d['agreeOperationalStandards'] ?? '') === 'Yes') $operational += 2;

    // 5. Business readiness (10)
    $readiness = 0;
    $start = $d['whenCanYouStart'] ?? '';
    if ($start === 'Immediately') $readiness += 10;
    elseif ($start === 'Within 30 days') $readiness += 8;
    elseif ($start === 'Within 60 days') $readiness += 5;
    elseif ($start === 'Within 90 days') $readiness += 3;

    // 6. Local market knowledge (5)
    $localKnowledge = 0;
    if (($d['knowledgeOfPreferredArea'] ?? '') === 'Yes') $localKnowledge += 3;
    if (($d['existingLocalContacts'] ?? '') === 'Yes') $localKnowledge += 2;

    $total = $investment + $location + $experience + $operational + $readiness + $localKnowledge;
    $tier = 'C';
    if ($total >= 80) $tier = 'A+';
    elseif ($total >= 65) $tier = 'A';
    elseif ($total >= 50) $tier = 'B';

    return [
        'investment' => $investment,
        'locationPremises' => $location,
        'experience' => $experience,
        'operational' => $operational,
        'readiness' => $readiness,
        'localKnowledge' => $localKnowledge,
        'total' => $total,
        'tier' => $tier,
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method !== 'OPTIONS' && $method !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['error' => 'Use the RedCat Point Franchise form.']);
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
        respond(403, ['error' => 'Use the RedCat Point Franchise form.']);
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    if ($method === 'OPTIONS') {
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        respond(204);
    }

    $raw = file_get_contents('php://input', false, null, 0, POINT_BODY_LIMIT + 1);
    if ($raw === false || strlen($raw) > POINT_BODY_LIMIT) {
        respond(413, ['error' => 'Payload too large.']);
    }

    $payload = json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
    if (!is_array($payload)) {
        throw new InvalidArgumentException('Invalid payload.');
    }

    $id = trim((string) ($payload['id'] ?? ''));
    if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/D', $id)) {
        throw new InvalidArgumentException('Reload the form and try again.');
    }

    $rcRef = trim((string) ($payload['rcRef'] ?? ('RC-P-' . strtoupper(substr($id, 0, 6)))));
    $stageMode = ($payload['stageMode'] ?? 'initial') === 'detailed' ? 'detailed' : 'initial';
    $fullName = trim((string) ($payload['fullName'] ?? ''));
    $mobile = trim((string) ($payload['mobileNumber'] ?? ''));
    $email = trim((string) ($payload['email'] ?? ''));
    $resDist = trim((string) ($payload['residentialDistrict'] ?? ''));
    $prefDist = trim((string) ($payload['preferredDistrict'] ?? ''));
    $point = trim((string) ($payload['preferredPoint'] ?? ''));
    $secondPref = trim((string) ($payload['secondPreference'] ?? ''));

    if ($fullName === '' || $mobile === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $prefDist === '' || $point === '') {
        throw new InvalidArgumentException('Complete all required registration fields.');
    }
    if (empty($payload['agreePrivacyTerms']) || empty($payload['agreeContact'])) {
        throw new InvalidArgumentException('You must agree to the privacy notice and consent terms.');
    }

    $score = scorePointApplication($payload);
    $encodedPayload = json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    $encodedScore = json_encode($score, JSON_THROW_ON_ERROR);
    $fingerprint = hash('sha256', $encodedPayload);

    $pdo = new PDO($config['dsn'], $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $insert = $pdo->prepare(
        'INSERT INTO point_franchise_applications (
            id, rc_ref, stage_mode, full_name, mobile_number, email,
            residential_district, preferred_district, preferred_point, second_preference,
            available_investment, business_premises,
            score_total, score_breakdown, tier,
            payload_json, fingerprint, received_at
        ) VALUES (
            :id, :rc_ref, :stage_mode, :full_name, :mobile_number, :email,
            :residential_district, :preferred_district, :preferred_point, :second_preference,
            :available_investment, :business_premises,
            :score_total, :score_breakdown, :tier,
            :payload_json, :fingerprint, UTC_TIMESTAMP()
        )'
    );

    $insert->execute([
        'id' => $id,
        'rc_ref' => mb_substr($rcRef, 0, 24),
        'stage_mode' => $stageMode,
        'full_name' => mb_substr($fullName, 0, 120),
        'mobile_number' => mb_substr($mobile, 0, 32),
        'email' => mb_substr($email, 0, 254),
        'residential_district' => mb_substr($resDist, 0, 64),
        'preferred_district' => mb_substr($prefDist, 0, 64),
        'preferred_point' => mb_substr($point, 0, 100),
        'second_preference' => mb_substr($secondPref, 0, 100),
        'available_investment' => mb_substr((string) ($payload['availableInvestment'] ?? ''), 0, 64),
        'business_premises' => mb_substr((string) ($payload['businessPremises'] ?? ''), 0, 64),
        'score_total' => $score['total'],
        'score_breakdown' => $encodedScore,
        'tier' => $score['tier'],
        'payload_json' => $encodedPayload,
        'fingerprint' => $fingerprint,
    ]);

    respond(201, ['id' => $id, 'rcRef' => $rcRef, 'score' => $score['total'], 'tier' => $score['tier']]);
} catch (InvalidArgumentException $e) {
    respond(400, ['error' => $e->getMessage()]);
} catch (PDOException $e) {
    if ((int) ($e->errorInfo[1] ?? 0) === 1062) {
        respond(200, ['id' => $id ?? '', 'rcRef' => $rcRef ?? '']);
    }
    error_log('RedCat point franchise error: ' . $e->getMessage());
    respond(503, ['error' => 'Unable to save application.']);
} catch (Throwable $e) {
    error_log('RedCat point franchise error: ' . $e->getMessage());
    respond(503, ['error' => 'Unable to save application.']);
}
