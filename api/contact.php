<?php
header('Content-Type: application/json; charset=utf-8');

// CORS — allow only our domain
$allowed = ['https://inovasystemssolutions.com', 'https://www.inovasystemssolutions.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Rate limiting by IP (max 1 request per 30 seconds)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateDir = sys_get_temp_dir() . '/contact_rate';
if (!is_dir($rateDir)) {
    @mkdir($rateDir, 0700, true);
}
$rateFile = $rateDir . '/' . md5($ip) . '.txt';
if (file_exists($rateFile)) {
    $lastTime = (int) file_get_contents($rateFile);
    if (time() - $lastTime < 30) {
        http_response_code(429);
        echo json_encode(['error' => 'Aguarde antes de enviar novamente.']);
        exit;
    }
}
file_put_contents($rateFile, time());

// Parse body
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Validate required fields
$required = ['nome', 'empresa', 'whatsapp', 'email'];
foreach ($required as $field) {
    if (empty(trim($data[$field] ?? ''))) {
        http_response_code(400);
        echo json_encode(['error' => "Campo obrigatorio: $field"]);
        exit;
    }
}

// Validate email
if (!filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email invalido']);
    exit;
}

// Validate phone (8-20 chars, digits/spaces/parentheses/plus/dash)
if (!preg_match('/^[\d\s()+\-]{8,20}$/', trim($data['whatsapp']))) {
    http_response_code(400);
    echo json_encode(['error' => 'WhatsApp invalido']);
    exit;
}

// Google Sheets URL — injected at deploy time, never exposed to the client
$sheetsUrl = 'https://script.google.com/macros/s/AKfycbw2JxsckTXUGllEs31QQobuTXaI3Dbf4EBsm4mWVHbsMjWlOf1ocH0snu2VF7mcjuSL7Q/exec';

if ($sheetsUrl === 'https://script.google.com/macros/s/AKfycbw2JxsckTXUGllEs31QQobuTXaI3Dbf4EBsm4mWVHbsMjWlOf1ocH0snu2VF7mcjuSL7Q/exec' || empty($sheetsUrl)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server misconfigured']);
    exit;
}

// Sanitize all string fields
$sanitize = function($val, $maxLen = 200) {
    return mb_substr(preg_replace('/[<>{}]/', '', $val), 0, $maxLen);
};

$payload = json_encode([
    'servico'     => $sanitize($data['servico'] ?? '', 500),
    'tamanho'     => $sanitize($data['tamanho'] ?? ''),
    'faturamento' => $sanitize($data['faturamento'] ?? ''),
    'budget'      => $sanitize($data['budget'] ?? ''),
    'status'      => $sanitize($data['status'] ?? ''),
    'descricao'   => $sanitize($data['descricao'] ?? '', 500),
    'nome'        => $sanitize($data['nome'] ?? '', 100),
    'empresa'     => $sanitize($data['empresa'] ?? '', 100),
    'whatsapp'    => $sanitize($data['whatsapp'] ?? '', 20),
    'email'       => $sanitize($data['email'] ?? '', 120),
]);

// Forward to Google Sheets via cURL
$ch = curl_init($sheetsUrl);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT        => 15,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(502);
    echo json_encode(['error' => 'Falha ao enviar dados']);
    exit;
}

http_response_code(200);
echo json_encode(['success' => true]);
