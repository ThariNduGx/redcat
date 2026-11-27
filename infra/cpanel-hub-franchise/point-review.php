<?php
declare(strict_types=1);

// Loaded by hub-admin.php after staff authentication and CSRF checks.
function pointQualificationSections(): array
{
    $yesNo = ['Yes', 'No'];
    return [
        'Personal and location details' => [
            'whatsapp' => ['WhatsApp number', 'tel', [], true],
            'residentialTown' => ['Residential town', 'text'],
            'occupationDetails' => ['Occupation details', 'select', ['Business owner', 'Private or government employee', 'Self-employed', 'Overseas employee or returnee', 'Retired', 'Not employed', 'Other']],
            'areaKnowledge' => ['Knowledge of preferred area', 'select', $yesNo],
            'localContacts' => ['Existing local business contacts', 'select', $yesNo],
            'mobileConfirmed' => ['Mobile number confirmed by staff', 'select', $yesNo],
        ],
        'Business experience' => [
            'operatingBusiness' => ['Currently operating a business', 'select', $yesNo],
            'yearsExperience' => ['Years of business experience', 'select', ['None', '1–3', '3–5', '5+']],
            'businessType' => ['Current business type', 'text', [], true],
            'courierExperience' => ['Courier or logistics experience', 'select', $yesNo],
            'customerService' => ['Customer service experience', 'select', $yesNo],
            'appSkills' => ['Computer and mobile app skills', 'select', ['Basic', 'Intermediate', 'Advanced']],
        ],
        'Financial capability' => [
            'fundsReady' => ['Investment funds ready', 'select', ['Fully', 'Partially', 'Not yet']],
            'fundingSource' => ['Funding source', 'select', ['Own funds', 'Bank loan', 'Business partner']],
            'workingCapital' => ['Additional working capital available', 'select', ['Yes', 'No', 'Need more information']],
            'financesVerified' => ['Financial readiness verified by staff', 'select', $yesNo, true],
        ],
        'Business premises' => [
            'premisesSize' => ['Premises size (sq ft)', 'select', ['Below 300', '300–500', '500–1,000', '1,000+']],
            'roadFrontage' => ['Main road frontage', 'select', $yesNo],
            'parking' => ['Parking available', 'select', $yesNo],
            'existingBusiness' => ['Existing business at the site', 'select', $yesNo],
            'address' => ['Proposed business address', 'text'],
            'mapPin' => ['Google Maps link or coordinates', 'text', [], true],
            'locationVerified' => ['Location inspected and verified by staff', 'select', $yesNo, true],
        ],
        'Operational commitment' => [
            'pointManager' => ['Who will manage the Point?', 'select', ['Self', 'Family member', 'Manager']],
            'mainBusiness' => ['Main or additional business', 'select', ['Full-time', 'Additional business']],
            'staffRecruitment' => ['Ready to recruit staff', 'select', $yesNo],
            'serviceHours' => ['Can meet required service hours', 'select', $yesNo],
            'training' => ['Willing to complete RedCat training', 'select', $yesNo],
            'itSystem' => ['Willing to use the RedCat IT system', 'select', $yesNo],
            'standards' => ['Agrees to operational standards', 'select', $yesNo],
        ],
    ];
}

function pointScoreCategories(): array
{
    return [
        'investment' => ['Investment capability', 30],
        'premises' => ['Location and premises', 25],
        'experience' => ['Business experience', 15],
        'operation' => ['Operational commitment', 15],
        'readiness' => ['Business readiness', 10],
        'market' => ['Local market knowledge', 5],
    ];
}

function pointQualificationSinhala(): array
{
    return [
        'whatsapp' => 'WhatsApp අංකය',
        'residentialTown' => 'පදිංචි නගරය',
        'occupationDetails' => 'රැකියාව පිළිබඳ විස්තර',
        'areaKnowledge' => 'කැමති ප්‍රදේශය පිළිබඳ දැනුම',
        'localContacts' => 'ප්‍රදේශයේ ව්‍යාපාරික සම්බන්ධතා',
        'mobileConfirmed' => 'කාර්ය මණ්ඩලය ජංගම අංකය තහවුරු කළාද?',
        'operatingBusiness' => 'දැනට ව්‍යාපාරයක් පවත්වාගෙන යනවාද?',
        'yearsExperience' => 'ව්‍යාපාරික පළපුරුද්ද (වසර)',
        'businessType' => 'දැනට පවතින ව්‍යාපාර වර්ගය',
        'courierExperience' => 'කුරියර් හෝ ප්‍රවාහන පළපුරුද්ද',
        'customerService' => 'පාරිභෝගික සේවා පළපුරුද්ද',
        'appSkills' => 'පරිගණක හා ජංගම යෙදුම් භාවිත හැකියාව',
        'fundsReady' => 'ආයෝජන මුදල් සූදානම්ද?',
        'fundingSource' => 'මුදල් ලබාගන්නා මාර්ගය',
        'workingCapital' => 'අමතර මෙහෙයුම් ප්‍රාග්ධනය තිබේද?',
        'financesVerified' => 'මූල්‍ය සූදානම තහවුරු කළාද?',
        'premisesSize' => 'ගොඩනැගිල්ලේ ප්‍රමාණය (වර්ග අඩි)',
        'roadFrontage' => 'ප්‍රධාන මාර්ගයට මුහුණලා තිබේද?',
        'parking' => 'වාහන නැවැත්වීමේ පහසුකම් තිබේද?',
        'existingBusiness' => 'එම ස්ථානයේ දැනට ව්‍යාපාරයක් තිබේද?',
        'address' => 'යෝජිත ව්‍යාපාරික ලිපිනය',
        'mapPin' => 'Google Maps සබැඳිය හෝ ඛණ්ඩාංක',
        'locationVerified' => 'ස්ථානය පරීක්ෂා කර තහවුරු කළාද?',
        'pointManager' => 'Point එක කළමනාකරණය කරන්නේ කවුද?',
        'mainBusiness' => 'ප්‍රධාන හෝ අමතර ව්‍යාපාරයක්ද?',
        'staffRecruitment' => 'සේවකයන් බඳවා ගැනීමට සූදානම්ද?',
        'serviceHours' => 'නියමිත සේවා වේලාවන් පිළිපැදිය හැකිද?',
        'training' => 'RedCat පුහුණුව සම්පූර්ණ කිරීමට කැමතිද?',
        'itSystem' => 'RedCat තොරතුරු තාක්ෂණ පද්ධතිය භාවිත කිරීමට කැමතිද?',
        'standards' => 'මෙහෙයුම් ප්‍රමිතීන්ට එකඟද?',
        'Yes' => 'ඔව්', 'No' => 'නැත', 'Other' => 'වෙනත්',
        'Business owner' => 'ව්‍යාපාරික', 'Private or government employee' => 'පෞද්ගලික හෝ රාජ්‍ය සේවක',
        'Self-employed' => 'ස්වයං රැකියා', 'Overseas employee or returnee' => 'විදේශ රැකියා හෝ නැවත පැමිණි',
        'Retired' => 'විශ්‍රාමික', 'Not employed' => 'රැකියාවක් නැත', 'None' => 'නැත',
        'Basic' => 'මූලික', 'Intermediate' => 'මධ්‍යම', 'Advanced' => 'උසස්',
        'Fully' => 'සම්පූර්ණයෙන්', 'Partially' => 'කොටසක්', 'Not yet' => 'තවම නැත',
        'Own funds' => 'තමන්ගේ මුදල්', 'Bank loan' => 'බැංකු ණය', 'Business partner' => 'ව්‍යාපාරික හවුල්කරු',
        'Need more information' => 'වැඩි විස්තර අවශ්‍යයි', 'Below 300' => '300 ට අඩු',
        'Self' => 'තමන්', 'Family member' => 'පවුලේ සාමාජිකයෙක්', 'Manager' => 'කළමනාකරු',
        'Full-time' => 'පූර්ණකාලීන', 'Additional business' => 'අමතර ව්‍යාපාරය',
    ];
}

function pointScoreTier(int $score): string
{
    return match (true) {
        $score >= 80 => 'A+ Priority',
        $score >= 65 => 'A Qualified',
        $score >= 50 => 'B Potential',
        default => 'C Manual review',
    };
}

function pointSelectionStages(): array
{
    return [
        1 => 'Online registration', 'Lead qualification', 'Telephone interview', 'Location inspection',
        'Final interview', 'Approval and agreement', 'Training', 'Point opening',
    ];
}

function pointReviewFiles(): array
{
    return [
        1 => 'Premises photo 1', 'Premises photo 2', 'Premises photo 3',
        'Identity document', 'Bank statement', 'Business registration',
    ];
}

function savePointQualification(PDO $pdo, string $id, string $staff): void
{
    $revision = filter_var($_POST['revision'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0]]);
    if ($revision === false) fail(422, 'The application version is missing. Reopen the application.');
    $submitted = $_POST['answers'] ?? [];
    $submittedScores = $_POST['scores'] ?? [];
    if (!is_array($submitted) || !is_array($submittedScores)) fail(422, 'Invalid qualification answers.');
    $answers = [];
    $missing = [];
    foreach (pointQualificationSections() as $fields) {
        foreach ($fields as $key => $rule) {
            [$label, $type] = $rule;
            $value = $submitted[$key] ?? '';
            if (!is_string($value)) fail(422, 'Invalid field: ' . $label);
            $value = trim($value);
            if ($value === '') {
                if (empty($rule[3])) $missing[] = $label;
            } elseif (mb_strlen($value) > ($type === 'tel' ? 32 : 500) ||
                ($type === 'tel' && !preg_match('/^\+?\d[\d ()-]{6,30}$/D', $value)) ||
                ($type === 'select' && !in_array($value, $rule[2], true))) {
                fail(422, 'Check this field: ' . $label);
            }
            $answers[$key] = $value;
        }
    }

    $scores = [];
    foreach (pointScoreCategories() as $key => [$label, $max]) {
        $raw = $submittedScores[$key] ?? '';
        if ($raw === '') continue;
        $value = filter_var($raw, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0, 'max_range' => $max]]);
        if ($value === false) fail(422, 'Enter a score between 0 and ' . $max . ' for ' . $label . '.');
        $scores[$key] = $value;
    }
    if ($scores !== [] && $missing) fail(422, 'Complete the detailed questionnaire before recording scores. Missing: ' . implode(', ', $missing));
    $total = count($scores) === count(pointScoreCategories()) ? array_sum($scores) : null;
    $stage = filter_var($_POST['stage'] ?? null, FILTER_VALIDATE_INT);
    if (!isset(pointSelectionStages()[$stage])) fail(422, 'Select a valid Point application stage.');
    if ($stage >= 6 && ($total === null || $answers['financesVerified'] !== 'Yes' || $answers['locationVerified'] !== 'Yes')) {
        fail(422, 'Record a complete qualification score and verify the location and finances before recording approval.');
    }

    $files = [];
    foreach (pointReviewFiles() as $slot => $label) {
        $image = $slot <= 3;
        $maxMb = $image ? 2 : 5;
        $limit = $maxMb * 1024 * 1024;
        $file = $_FILES['file_' . $slot] ?? null;
        if ($file === null || ($file['error'] ?? null) === UPLOAD_ERR_NO_FILE) continue;
        if (($file['error'] ?? null) !== UPLOAD_ERR_OK || !is_string($file['tmp_name'] ?? null) ||
            !is_uploaded_file($file['tmp_name']) || ($file['size'] ?? 0) > $limit) {
            fail(422, $label . ' could not be uploaded. The maximum is ' . $maxMb . ' MB.');
        }
        $contents = file_get_contents($file['tmp_name'], false, null, 0, $limit + 1);
        if ($contents === false || $contents === '' || strlen($contents) > $limit) fail(422, 'Check the file for ' . $label . '.');
        if ($image) {
            $dimensions = @getimagesizefromstring($contents);
            $mime = $dimensions['mime'] ?? '';
            if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true) || $dimensions[0] * $dimensions[1] > 25000000) {
                fail(422, $label . ' must be a valid JPEG, PNG or WebP image up to 25 megapixels.');
            }
        } else {
            $mime = (new finfo(FILEINFO_MIME_TYPE))->buffer($contents);
            if ($mime !== 'application/pdf' || !str_starts_with($contents, '%PDF-')) fail(422, $label . ' must be a PDF.');
        }
        $files[$slot] = [$mime, $contents];
    }

    $pdo->beginTransaction();
    try {
        $update = $pdo->prepare(
            'UPDATE point_franchise_applications
             SET qualification_json = ?, score_json = ?, score_total = ?, reviewer = ?, selection_stage = ?,
                 reviewed_at = UTC_TIMESTAMP(), revision = revision + 1
             WHERE id = ? AND revision = ?'
        );
        $update->execute([
            json_encode($answers, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
            json_encode($scores, JSON_THROW_ON_ERROR),
            $total, $staff, $stage, $id, $revision,
        ]);
        if ($update->rowCount() !== 1) {
            $pdo->rollBack();
            fail(409, 'This application changed since you opened it. Reopen it before saving again.');
        }
        foreach ($files as $slot => [$mime, $contents]) {
            $upload = $pdo->prepare(
                'INSERT INTO point_franchise_files (application_id, slot, media_type, contents) VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE media_type = ?, contents = ?'
            );
            $upload->execute([$id, $slot, $mime, $contents, $mime, $contents]);
        }
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}

function sendPointFile(PDO $pdo, string $id, int $slot, string $staff): never
{
    $query = $pdo->prepare('SELECT media_type, contents FROM point_franchise_files WHERE application_id = ? AND slot = ?');
    $query->execute([$id, $slot]);
    $file = $query->fetch();
    $extension = match ($file['media_type'] ?? '') {
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'application/pdf' => 'pdf',
        default => null,
    };
    if ($extension === null) fail(404, 'File not found.');
    error_log('RedCat Point qualification file download by ' . json_encode($staff, JSON_INVALID_UTF8_SUBSTITUTE));
    header('Content-Type: ' . $file['media_type']);
    header('Content-Disposition: attachment; filename="point-' . strtolower(str_replace(' ', '-', pointReviewFiles()[$slot])) . '.' . $extension . '"');
    echo $file['contents'];
    exit;
}

function loadPointReview(PDO $pdo, ?string $id, int $page): array
{
    if ($id === null) {
        $query = $pdo->prepare(
            'SELECT id, full_name, preferred_district, preferred_point, score_total, selection_stage, received_at
             FROM point_franchise_applications ORDER BY received_at DESC, id ASC LIMIT 51 OFFSET ?'
        );
        $query->bindValue(1, ($page - 1) * 50, PDO::PARAM_INT);
        $query->execute();
        $applications = $query->fetchAll();
        $next = count($applications) > 50;
        if ($next) array_pop($applications);
        return compact('applications', 'next');
    }

    $query = $pdo->prepare(
        'SELECT payload_json, qualification_json, score_json, score_total, selection_stage, reviewer, reviewed_at, revision, received_at
         FROM point_franchise_applications WHERE id = ?'
    );
    $query->execute([$id]);
    $application = $query->fetch();
    $query->closeCursor();
    if (!$application) fail(404, 'Application not found.');
    $query = $pdo->prepare('SELECT slot FROM point_franchise_files WHERE application_id = ? ORDER BY slot');
    $query->execute([$id]);
    $fileSlots = array_map('intval', $query->fetchAll(PDO::FETCH_COLUMN));
    $answers = json_decode($application['payload_json'], true, 16, JSON_THROW_ON_ERROR);
    $qualification = json_decode($application['qualification_json'] ?? '{}', true, 16, JSON_THROW_ON_ERROR);
    $scores = json_decode($application['score_json'] ?? '{}', true, 16, JSON_THROW_ON_ERROR);
    $schema = json_decode(file_get_contents(__DIR__ . '/point-application-schema.json'), true, 16, JSON_THROW_ON_ERROR);
    return compact('application', 'fileSlots', 'answers', 'qualification', 'scores', 'schema');
}

function exportPointApplications(PDO $pdo, string $staff): never
{
    $schema = json_decode(file_get_contents(__DIR__ . '/point-application-schema.json'), true, 16, JSON_THROW_ON_ERROR);
    $fields = array_merge(...array_column($schema['sections'], 'fields'));
    $stages = pointSelectionStages();
    $query = $pdo->query('SELECT id, payload_json, score_total, selection_stage, received_at FROM point_franchise_applications ORDER BY received_at DESC, id ASC');
    $out = fopen('php://output', 'w');
    if ($out === false) throw new RuntimeException('Could not open export.');
    error_log('RedCat Point application CSV export by ' . json_encode($staff, JSON_INVALID_UTF8_SUBSTITUTE));
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="redcat_point_franchise_' . gmdate('Y-m-d') . '.csv"');
    fputcsv($out, ['Reference', ...array_column($fields, 'en'), 'Score', 'Tier', 'Selection stage', 'Received (UTC)'], ',', '"', '');
    while ($row = $query->fetch()) {
        $answers = json_decode($row['payload_json'], true, 16, JSON_THROW_ON_ERROR);
        $values = array_map(static fn (array $field): string => displayAnswer($answers[$field['key']] ?? null), $fields);
        $tier = $row['score_total'] === null ? '' : pointScoreTier((int) $row['score_total']);
        fputcsv($out, array_map('csvCell', ['RC-P-' . strtoupper($row['id']), ...$values, $row['score_total'], $tier, $stages[(int) $row['selection_stage']] ?? '', $row['received_at']]), ',', '"', '');
    }
    fclose($out);
    exit;
}
