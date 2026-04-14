<?php
/**
 * Pipeline de geração automática de blog posts
 * Roda na VPS via crontab (semanalmente)
 *
 * Etapas:
 * 1. Pesquisa de palavras-chave de cauda longa (Gemini API)
 * 2. Geração do artigo completo em pt-BR (Gemini API)
 * 3. Seleção de imagem (Unsplash API)
 * 4. Salva no blogPosts.json
 *
 * Uso: php /home/u257882461/blog-scripts/generate-blog-post.php
 * Cron: 0 9 * * 1 php /home/u257882461/blog-scripts/generate-blog-post.php >> /home/u257882461/blog-data/cron.log 2>&1
 */

// ── Config ──────────────────────────────────────────────────
$configPath = __DIR__ . '/blog-config.php';
if (!file_exists($configPath)) {
    die("[ERRO] blog-config.php não encontrado em: $configPath\n");
}
$config = require $configPath;

$GEMINI_API_KEY      = $config['gemini_api_key'] ?? '';
$UNSPLASH_ACCESS_KEY = $config['unsplash_access_key'] ?? '';
$BLOG_DATA_PATH      = $config['blog_data_path'] ?? '/home/u257882461/blog-data/blogPosts.json';

if (empty($GEMINI_API_KEY)) {
    die("[ERRO] GEMINI_API_KEY não configurada\n");
}

echo "=== Blog Post Generator — " . date('Y-m-d H:i:s') . " ===\n\n";

// ── Helpers ─────────────────────────────────────────────────

function geminiRequest(string $apiKey, string $prompt, float $temperature = 0.7, int $maxTokens = 8192): string {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey";

    $payload = [
        'contents' => [
            ['parts' => [['text' => $prompt]]]
        ],
        'generationConfig' => [
            'temperature' => $temperature,
            'maxOutputTokens' => $maxTokens,
        ],
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 120,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    if ($error) {
        throw new RuntimeException("cURL error: $error");
    }
    if ($httpCode !== 200) {
        throw new RuntimeException("Gemini API HTTP $httpCode: $response");
    }

    $data = json_decode($response, true);
    $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

    if (empty($text)) {
        throw new RuntimeException("Gemini retornou resposta vazia");
    }

    return $text;
}

function extractJson(string $text): array {
    // Try markdown code block first
    if (preg_match('/```(?:json)?\s*\n?(.*?)\n?```/s', $text, $m)) {
        $parsed = json_decode(trim($m[1]), true);
        if ($parsed !== null) return $parsed;
    }
    // Try direct parse
    $parsed = json_decode(trim($text), true);
    if ($parsed !== null) return $parsed;

    throw new RuntimeException("Não foi possível extrair JSON da resposta");
}

function slugify(string $text): string {
    $map = ['á'=>'a','à'=>'a','ã'=>'a','â'=>'a','é'=>'e','ê'=>'e','í'=>'i','ó'=>'o','ô'=>'o','õ'=>'o','ú'=>'u','ü'=>'u','ç'=>'c'];
    $text = mb_strtolower($text, 'UTF-8');
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s]+/', '-', trim($text));
    $text = preg_replace('/-+/', '-', $text);
    return substr($text, 0, 80);
}

function formatDatePtBR(string $date): string {
    $months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    $ts = strtotime($date);
    return sprintf('%02d %s, %d', date('d', $ts), $months[(int)date('m', $ts) - 1], date('Y', $ts));
}

function countWords(string $html): int {
    $text = strip_tags($html);
    $text = preg_replace('/\s+/', ' ', trim($text));
    return str_word_count($text);
}

function countH2(string $html): int {
    return preg_match_all('/<h2>/i', $html);
}

// ── Step 1: Keyword Research ────────────────────────────────

function researchKeywords(string $apiKey, array $existingTitles): array {
    echo "[1/4] Pesquisando palavras-chave de cauda longa...\n";

    $titlesList = implode("\n", array_map(fn($t) => "- $t", $existingTitles));

    $prompt = "Você é um especialista em SEO para o mercado brasileiro de tecnologia B2B.

A empresa é a Inova Systems Solutions, que oferece: ERP customizado, aplicativos mobile (Flutter/React Native), automação de processos com IA, e desenvolvimento web sob medida para PMEs.

Artigos já publicados (NÃO repita esses tópicos):
$titlesList

Sua tarefa: sugira 5 palavras-chave de cauda longa em pt-BR para artigos de blog. Foque em:
- Alta intenção comercial (empresários buscando soluções)
- Baixa/média concorrência
- Relevância para os serviços da Inova
- Setores: gestão empresarial, ERP, apps mobile, IA, automação, transformação digital

Para cada keyword, retorne em JSON:
{
  \"keywords\": [
    {
      \"keyword\": \"a palavra-chave de cauda longa\",
      \"title\": \"título proposto para o artigo (máx 80 chars)\",
      \"category\": \"uma das: Gestão & ERP | Mobile | IA & Automação | Web Development | Estratégia\",
      \"reasoning\": \"por que essa keyword é boa (1 frase)\"
    }
  ]
}

Retorne APENAS o JSON, sem texto adicional.";

    $response = geminiRequest($apiKey, $prompt, 0.7, 2048);
    $parsed = extractJson($response);

    echo "   " . count($parsed['keywords']) . " keywords encontradas\n";
    return $parsed['keywords'];
}

// ── Step 2: Generate Article ────────────────────────────────

function generateArticle(string $apiKey, array $keyword): array {
    echo "[2/4] Gerando artigo para: \"{$keyword['keyword']}\"\n";

    $prompt = "Você é um redator sênior de conteúdo B2B da Inova Systems Solutions, uma empresa brasileira de tecnologia que desenvolve ERP customizado, apps mobile, automações com IA e sistemas web sob medida para PMEs.

Escreva um artigo completo de blog otimizado para SEO com a seguinte palavra-chave de cauda longa: \"{$keyword['keyword']}\"

Título proposto: \"{$keyword['title']}\"
Categoria: {$keyword['category']}

REGRAS OBRIGATÓRIAS:
1. Conteúdo em português brasileiro (pt-BR), tom profissional mas acessível
2. Entre 1500 e 2500 palavras
3. Use APENAS estas tags HTML: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <a>, <br>
4. NÃO use <h1> (o título é renderizado separadamente)
5. Inclua a keyword naturalmente no primeiro parágrafo, em pelo menos um <h2>, e na conclusão
6. Mínimo 3 seções com <h2>
7. Inclua dados, estatísticas ou exemplos práticos quando possível
8. Termine com uma conclusão que mencione sutilmente a Inova (sem ser um anúncio explícito)
9. Escreva como especialista do setor, NÃO como IA genérica
10. Evite frases vazias como \"no mundo atual\" ou \"é muito importante\"

Retorne APENAS um JSON válido (sem markdown, sem código):
{
  \"title\": \"título final do artigo (pode ajustar o proposto)\",
  \"excerpt\": \"resumo atrativo do artigo (máx 200 caracteres)\",
  \"content\": \"HTML completo do artigo (string única)\",
  \"metaDescription\": \"meta description para SEO (máx 160 caracteres)\",
  \"tags\": [\"tag1\", \"tag2\", \"tag3\", \"tag4\"],
  \"readTime\": \"X min\",
  \"author\": \"Equipe Inova\"
}";

    $response = geminiRequest($apiKey, $prompt, 0.8, 8192);
    $article = extractJson($response);

    $wordCount = countWords($article['content']);
    $h2Count   = countH2($article['content']);

    echo "   Palavras: $wordCount | Seções H2: $h2Count\n";

    if ($wordCount < 800) {
        throw new RuntimeException("Artigo muito curto: $wordCount palavras (mín: 800)");
    }
    if ($h2Count < 2) {
        throw new RuntimeException("Poucas seções: $h2Count H2 (mín: 2)");
    }

    return $article;
}

// ── Step 3: Fetch Image ─────────────────────────────────────

function fetchImage(string $apiKey, string $unsplashKey, string $keyword, string $category): array {
    echo "[3/4] Buscando imagem...\n";

    $fallbacks = [
        'Gestão & ERP'   => 'photo-1460925895917-afdab827c52f',
        'Mobile'         => 'photo-1512941937669-90a1b58e7e9c',
        'IA & Automação'  => 'photo-1677442136019-21780ecad995',
        'Web Development' => 'photo-1547658719-da2b51169166',
        'Estratégia'      => 'photo-1553877522-43269d4ea984',
    ];

    if (empty($unsplashKey)) {
        echo "   Sem UNSPLASH_ACCESS_KEY, usando fallback por categoria\n";
        $photoId = $fallbacks[$category] ?? $fallbacks['Gestão & ERP'];
        return [
            'image'      => "https://images.unsplash.com/$photoId?auto=format&fit=crop&q=80&w=800",
            'imageLarge'  => "https://images.unsplash.com/$photoId?auto=format&fit=crop&q=80&w=1200",
        ];
    }

    // Get English search terms via Gemini
    $termsResponse = geminiRequest($apiKey,
        "Given this Portuguese article topic: \"$keyword\". Return 2-3 English search terms for finding a professional business/technology photo. Return ONLY the terms separated by spaces.",
        0.3, 50
    );
    $query = trim($termsResponse);
    echo "   Busca Unsplash: \"$query\"\n";

    $url = "https://api.unsplash.com/search/photos?" . http_build_query([
        'query'       => $query,
        'orientation' => 'landscape',
        'per_page'    => 5,
        'client_id'   => $unsplashKey,
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        echo "   Unsplash falhou (HTTP $httpCode), usando fallback\n";
        $photoId = $fallbacks[$category] ?? $fallbacks['Gestão & ERP'];
        return [
            'image'      => "https://images.unsplash.com/$photoId?auto=format&fit=crop&q=80&w=800",
            'imageLarge'  => "https://images.unsplash.com/$photoId?auto=format&fit=crop&q=80&w=1200",
        ];
    }

    $data = json_decode($response, true);
    if (empty($data['results'])) {
        echo "   Nenhuma imagem encontrada, usando fallback\n";
        $photoId = $fallbacks[$category] ?? $fallbacks['Gestão & ERP'];
        return [
            'image'      => "https://images.unsplash.com/$photoId?auto=format&fit=crop&q=80&w=800",
            'imageLarge'  => "https://images.unsplash.com/$photoId?auto=format&fit=crop&q=80&w=1200",
        ];
    }

    $photo = $data['results'][0];
    $baseUrl = $photo['urls']['raw'] ?? "https://images.unsplash.com/photo-{$photo['id']}";

    echo "   Imagem selecionada: {$photo['id']}\n";

    return [
        'image'      => "$baseUrl&auto=format&fit=crop&q=80&w=800",
        'imageLarge'  => "$baseUrl&auto=format&fit=crop&q=80&w=1200",
    ];
}

// ── Main Pipeline ───────────────────────────────────────────

try {
    // Load existing posts
    if (!file_exists($BLOG_DATA_PATH)) {
        die("[ERRO] blogPosts.json não encontrado em: $BLOG_DATA_PATH\n");
    }

    $existingPosts = json_decode(file_get_contents($BLOG_DATA_PATH), true);
    if ($existingPosts === null) {
        die("[ERRO] blogPosts.json inválido\n");
    }

    $existingTitles = array_map(fn($p) => $p['title'], $existingPosts);
    $existingSlugs  = array_map(fn($p) => $p['slug'], $existingPosts);
    $nextId         = max(array_map(fn($p) => $p['id'], $existingPosts)) + 1;

    // Step 1: Research keywords
    $keywords = researchKeywords($GEMINI_API_KEY, $existingTitles);

    if (empty($keywords)) {
        die("[ERRO] Nenhuma keyword retornada\n");
    }

    // Pick best keyword that doesn't already exist
    $chosenKeyword = null;
    foreach ($keywords as $kw) {
        $testSlug = slugify($kw['title']);
        if (!in_array($testSlug, $existingSlugs, true)) {
            $chosenKeyword = $kw;
            break;
        }
    }
    if (!$chosenKeyword) {
        $chosenKeyword = $keywords[0];
    }

    echo "\n=> Keyword escolhida: \"{$chosenKeyword['keyword']}\"\n";
    echo "   Categoria: {$chosenKeyword['category']}\n\n";

    // Step 2: Generate article (with retry)
    $article = null;
    for ($attempt = 1; $attempt <= 2; $attempt++) {
        try {
            $article = generateArticle($GEMINI_API_KEY, $chosenKeyword);
            break;
        } catch (Exception $e) {
            echo "   Tentativa $attempt falhou: {$e->getMessage()}\n";
            if ($attempt === 2) {
                throw new RuntimeException("Falha na geração após 2 tentativas");
            }
            sleep(5);
        }
    }

    // Step 3: Fetch image
    try {
        $images = fetchImage($GEMINI_API_KEY, $UNSPLASH_ACCESS_KEY, $chosenKeyword['keyword'], $chosenKeyword['category']);
    } catch (Exception $e) {
        echo "   Erro na imagem, usando fallback: {$e->getMessage()}\n";
        $images = [
            'image'      => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            'imageLarge'  => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
        ];
    }

    // Step 4: Assemble and save
    echo "[4/4] Montando e salvando post...\n";

    $now = date('c');
    $newPost = [
        'id'              => $nextId,
        'title'           => $article['title'],
        'excerpt'         => $article['excerpt'],
        'category'        => $chosenKeyword['category'],
        'author'          => $article['author'] ?? 'Equipe Inova',
        'date'            => formatDatePtBR($now),
        'readTime'        => $article['readTime'] ?? '8 min',
        'image'           => $images['image'],
        'imageLarge'       => $images['imageLarge'],
        'slug'            => slugify($article['title']),
        'tags'            => $article['tags'] ?? ['Tecnologia', 'Inovação', 'B2B'],
        'metaDescription' => $article['metaDescription'] ?? $article['excerpt'],
        'publishedAt'     => $now,
        'content'         => $article['content'],
    ];

    // Prepend (newest first)
    array_unshift($existingPosts, $newPost);

    $json = json_encode($existingPosts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    file_put_contents($BLOG_DATA_PATH, $json . "\n");

    echo "\n✅ Post gerado com sucesso!\n";
    echo "   Título: {$newPost['title']}\n";
    echo "   Slug: {$newPost['slug']}\n";
    echo "   Categoria: {$newPost['category']}\n";
    echo "   Palavras: " . countWords($newPost['content']) . "\n";
    echo "   Salvo em: $BLOG_DATA_PATH\n\n";

} catch (Exception $e) {
    echo "\n[ERRO FATAL] {$e->getMessage()}\n";
    exit(1);
}
