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
header('Access-Control-Max-Age: 86400');

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
$token = $_SERVER['HTTP_X_CONTACT_TOKEN'] ?? '';
$tokenParts = explode('.', $token, 2);
if (count($tokenParts) !== 2) {
    http_response_code(403);
    echo json_encode(['error' => 'Acesso negado']);
    exit;
}
[$ts, $hash] = $tokenParts;

// Token secret from config (NOT hardcoded)
$configFile = __DIR__ . '/config.local.php';
$config = file_exists($configFile) ? require $configFile : [];
$tokenSecret = $config['token_secret'] ?? getenv('CONTACT_TOKEN_SECRET') ?: '';
if (empty($tokenSecret)) {
    http_response_code(500);
    echo json_encode(['error' => 'Service unavailable']);
    exit;
}

// Validate timestamp format
if (!ctype_digit($ts) || (int)$ts < 1000000000) {
    http_response_code(403);
    echo json_encode(['error' => 'Acesso negado']);
    exit;
}

$expectedHash = hash_hmac('sha256', $ts, $tokenSecret);

// Token must match and be at most 2 minutes old
if (!hash_equals($expectedHash, $hash) || abs(time() - (int)$ts) > 120) {
    http_response_code(403);
    echo json_encode(['error' => 'Token invalido ou expirado']);
    exit;
}

// ── Rate limiting by IP (proxy-aware + file locking) ────────────────────────
$trustedProxies = ['127.0.0.1', '::1'];
$remoteAddr = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (in_array($remoteAddr, $trustedProxies, true) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
} else {
    $ip = $remoteAddr;
}
// Validate IP format
if (!filter_var($ip, FILTER_VALIDATE_IP)) {
    $ip = $remoteAddr;
}

$rateDir = sys_get_temp_dir() . '/contact_rate';
if (!is_dir($rateDir)) {
    @mkdir($rateDir, 0700, true);
}

$ipHash = md5($ip);
$rateFile = $rateDir . '/' . $ipHash . '.json';

// Atomic read-modify-write with file locking
$handle = fopen($rateFile, 'c+');
if ($handle && flock($handle, LOCK_EX)) {
    $contents = stream_get_contents($handle);
    $rateData = $contents ? json_decode($contents, true) : null;

    if (!$rateData || !isset($rateData['date']) || $rateData['date'] !== date('Y-m-d')) {
        $rateData = ['date' => date('Y-m-d'), 'count' => 0, 'last' => 0];
    }

    // Max 1 request per 30 seconds
    if (time() - ($rateData['last'] ?? 0) < 30) {
        flock($handle, LOCK_UN);
        fclose($handle);
        http_response_code(429);
        echo json_encode(['error' => 'Aguarde antes de enviar novamente.']);
        exit;
    }

    // Max 5 submissions per day per IP
    if (($rateData['count'] ?? 0) >= 5) {
        flock($handle, LOCK_UN);
        fclose($handle);
        http_response_code(429);
        echo json_encode(['error' => 'Limite diario atingido. Tente novamente amanha.']);
        exit;
    }

    $rateData['count']++;
    $rateData['last'] = time();
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($rateData));
    flock($handle, LOCK_UN);
    fclose($handle);
} else {
    // If file locking fails, allow the request but log it
    if ($handle) fclose($handle);
    error_log('contact.php: failed to acquire rate limit lock for IP ' . $ipHash);
}

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
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

// ── Honeypot check (bot detection) ──────────────────────────────────────────
if (!empty($data['website_url'] ?? '')) {
    // Silently reject — bots fill hidden fields
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

// ── Validate required fields ────────────────────────────────────────────────
$required = ['nome', 'empresa', 'whatsapp', 'email'];
foreach ($required as $field) {
    $val = trim($data[$field] ?? '');
    if ($val === '' || mb_strlen($val) > 500) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados invalidos']);
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
$erpUrl = $config['erp_url'] ?? getenv('ERP_API_URL') ?: '';
$erpKey = $config['erp_key'] ?? getenv('ERP_API_KEY') ?: '';

if (empty($erpUrl) || empty($erpKey)) {
    http_response_code(500);
    echo json_encode(['error' => 'Service unavailable']);
    exit;
}

// Validate ERP URL is HTTPS
if (strpos($erpUrl, 'https://') !== 0) {
    error_log('contact.php: ERP URL must use HTTPS');
    http_response_code(500);
    echo json_encode(['error' => 'Service unavailable']);
    exit;
}

// Validate API key format (no CRLF injection)
if (preg_match('/[\r\n]/', $erpKey)) {
    error_log('contact.php: ERP API key contains invalid characters');
    http_response_code(500);
    echo json_encode(['error' => 'Service unavailable']);
    exit;
}

// ── Sanitize all string fields ──────────────────────────────────────────────
$sanitize = function($val, $maxLen = 200) {
    return mb_substr(preg_replace('/[<>{}]/', '', trim($val)), 0, $maxLen);
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
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error || $httpCode >= 400) {
    error_log("contact.php: ERP error (HTTP $httpCode): " . substr($response ?? '', 0, 500));
    http_response_code(502);
    echo json_encode(['error' => 'Falha ao enviar dados']);
    exit;
}

http_response_code(200);
echo json_encode(['success' => true]);
