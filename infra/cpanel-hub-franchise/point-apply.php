<?php
declare(strict_types=1);

define('POINT_FRANCHISE_INTAKE', true);

function savePointApplication(PDO $pdo, array $answers, string $payload, string $fingerprint): never
{
    $id = $answers['id'];
    $insert = $pdo->prepare(
        'INSERT INTO point_franchise_applications
            (id, full_name, preferred_district, preferred_point, payload_json, fingerprint, received_at)
         VALUES (?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())'
    );
    try {
        $insert->execute([$id, $answers['fullName'], $answers['preferredDistrict'], $answers['firstPreferredPoint'], $payload, $fingerprint]);
    } catch (PDOException $e) {
        if ((int) ($e->errorInfo[1] ?? 0) !== 1062) throw $e;
        $existing = $pdo->prepare('SELECT fingerprint FROM point_franchise_applications WHERE id = ?');
        $existing->execute([$id]);
        $saved = $existing->fetchColumn();
        if (is_string($saved) && hash_equals($saved, $fingerprint)) {
            respond(200, ['id' => $id, 'saved' => true]);
        }
        respond(409, ['code' => 'reference_conflict']);
    }
    respond(201, ['id' => $id, 'saved' => true]);
}

require __DIR__ . '/hub-apply.php';
