<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Cache-Control: public, max-age=300');
header_remove('X-Powered-By');

// ── CORS ────────────────────────────────────────────────────
$allowed = ['https://inovasystemssolutions.com', 'https://www.inovasystemssolutions.com'];
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── Blog data path ──────────────────────────────────────────
$dataPath = '/home/u257882461/blog-data/blogPosts.json';

if (!file_exists($dataPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Blog data not found']);
    exit;
}

$posts = json_decode(file_get_contents($dataPath), true);

if ($posts === null) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid blog data']);
    exit;
}

// ── Routes ──────────────────────────────────────────────────
$slug = $_GET['slug'] ?? null;

if ($slug) {
    // Single post by slug
    $slug = preg_replace('/[^a-z0-9\-]/', '', strtolower($slug));
    $found = null;
    foreach ($posts as $post) {
        if ($post['slug'] === $slug) {
            $found = $post;
            break;
        }
    }
    if ($found) {
        echo json_encode($found);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found']);
    }
    exit;
}

// All posts (sorted by publishedAt desc, without content for listing)
usort($posts, function ($a, $b) {
    return strtotime($b['publishedAt']) - strtotime($a['publishedAt']);
});

// For listing, strip heavy content field to reduce payload
$listing = array_map(function ($post) {
    $item = $post;
    unset($item['content']);
    return $item;
}, $posts);

echo json_encode($listing);
