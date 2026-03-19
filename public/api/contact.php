<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
header_remove('X-Powered-By');

// ── CORS — allow only our domains ───────────────────────────────────────────
$allowed = ['https://inovasystemssolutions.com', 'https://www.inovasystemssolutions.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Contact-Token');

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

// ── Anti-spam: verify time-based token ──────────────────────────────────────
// The frontend generates a token = HMAC(timestamp, secret). Bots/scripts
// without JS execution cannot produce a valid token.
$token = $_SERVER['HTTP_X_CONTACT_TOKEN'] ?? '';
$tokenParts = explode('.', $token, 2);
if (count($tokenParts) !== 2) {
    http_response_code(403);
    echo json_encode(['error' => 'Acesso negado']);
    exit;
}
[$ts, $hash] = $tokenParts;
$tokenSecret = 'inova-contact-2024-hmac-key';
$expectedHash = hash_hmac('sha256', $ts, $tokenSecret);

// Token must match and be at most 5 minutes old
if (!hash_equals($expectedHash, $hash) || abs(time() - (int)$ts) > 300) {
    http_response_code(403);
    echo json_encode(['error' => 'Token invalido ou expirado']);
    exit;
}

// ── Rate limiting by IP ─────────────────────────────────────────────────────
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateDir = sys_get_temp_dir() . '/contact_rate';
if (!is_dir($rateDir)) {
    @mkdir($rateDir, 0700, true);
}

$ipHash = md5($ip);
$rateFile = $rateDir . '/' . $ipHash . '.json';
$rateData = file_exists($rateFile) ? json_decode(file_get_contents($rateFile), true) : null;

if (!$rateData || !isset($rateData['date']) || $rateData['date'] !== date('Y-m-d')) {
    $rateData = ['date' => date('Y-m-d'), 'count' => 0, 'last' => 0];
}

// Max 1 request per 30 seconds
if (time() - ($rateData['last'] ?? 0) < 30) {
    http_response_code(429);
    echo json_encode(['error' => 'Aguarde antes de enviar novamente.']);
    exit;
}

// Max 5 submissions per day per IP
if (($rateData['count'] ?? 0) >= 5) {
    http_response_code(429);
    echo json_encode(['error' => 'Limite diario atingido. Tente novamente amanha.']);
    exit;
}

$rateData['count']++;
$rateData['last'] = time();
file_put_contents($rateFile, json_encode($rateData));

// ── Request body size limit (16KB) ──────────────────────────────────────────
$raw = file_get_contents('php://input', false, null, 0, 16384);
if (strlen($raw) >= 16384) {
    http_response_code(413);
    echo json_encode(['error' => 'Payload too large']);
    exit;
}

$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// ── Validate required fields ────────────────────────────────────────────────
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

// ── Load ERP config ─────────────────────────────────────────────────────────
$configFile = __DIR__ . '/config.local.php';
if (file_exists($configFile)) {
    $erpConfig = require $configFile;
    $erpUrl = $erpConfig['erp_url'] ?? '';
    $erpKey = $erpConfig['erp_key'] ?? '';
} else {
    $erpUrl = getenv('ERP_API_URL') ?: '';
    $erpKey = getenv('ERP_API_KEY') ?: '';
}

if (empty($erpUrl) || empty($erpKey)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server misconfigured']);
    exit;
}

// ── Sanitize all string fields ──────────────────────────────────────────────
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

// ── Forward to ERP via cURL ─────────────────────────────────────────────────
$erpEndpoint = rtrim($erpUrl, '/') . '/api/v1/sales/website-lead/';
$ch = curl_init($erpEndpoint);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'X-API-Key: ' . $erpKey,
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error || $httpCode >= 400) {
    http_response_code(502);
    echo json_encode(['error' => 'Falha ao enviar dados']);
    exit;
}

http_response_code(200);
echo json_encode(['success' => true]);
