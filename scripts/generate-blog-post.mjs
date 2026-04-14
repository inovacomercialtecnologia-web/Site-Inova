/**
 * Pipeline de geração automática de blog posts
 * Roda semanalmente via GitHub Actions
 *
 * Etapas:
 * 1. Pesquisa de palavras-chave de cauda longa (Gemini)
 * 2. Geração do artigo completo (Gemini)
 * 3. Seleção de imagem (Unsplash API)
 * 4. Salva no blogPosts.json
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DATA_PATH = path.resolve(__dirname, '../src/data/blogPosts.json');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is required');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ─── Helpers ───────────────────────────────────────────────

function loadExistingPosts() {
  const raw = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function savePosts(posts) {
  fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(posts, null, 2) + '\n', 'utf-8');
}

function slugify(text) {
  const map = { 'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'é': 'e', 'ê': 'e', 'í': 'i', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ú': 'u', 'ü': 'u', 'ç': 'c' };
  return text
    .toLowerCase()
    .replace(/[áàãâéêíóôõúüç]/g, c => map[c] || c)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function formatDatePtBR(date) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month}, ${year}`;
}

function extractJsonFromResponse(text) {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1].trim());
  }
  return JSON.parse(text.trim());
}

function countWords(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
}

function countH2(html) {
  return (html.match(/<h2>/gi) || []).length;
}

// ─── Step 1: Keyword Research ──────────────────────────────

async function researchKeywords(existingTitles) {
  console.log('🔍 Pesquisando palavras-chave de cauda longa...');

  const prompt = `Você é um especialista em SEO para o mercado brasileiro de tecnologia B2B.

A empresa é a Inova Systems Solutions, que oferece: ERP customizado, aplicativos mobile (Flutter/React Native), automação de processos com IA, e desenvolvimento web sob medida para PMEs.

Artigos já publicados (NÃO repita esses tópicos):
${existingTitles.map(t => `- ${t}`).join('\n')}

Sua tarefa: pesquise tendências atuais de busca no Google Brasil e sugira 5 palavras-chave de cauda longa em pt-BR para artigos de blog. Foque em:
- Alta intenção comercial (empresários buscando soluções)
- Baixa/média concorrência
- Relevância para os serviços da Inova
- Setores: gestão empresarial, ERP, apps mobile, IA, automação, transformação digital

Para cada keyword, retorne em JSON:
{
  "keywords": [
    {
      "keyword": "a palavra-chave de cauda longa",
      "title": "título proposto para o artigo (máx 80 chars)",
      "category": "uma das: Gestão & ERP | Mobile | IA & Automação | Web Development | Estratégia",
      "reasoning": "por que essa keyword é boa (1 frase)"
    }
  ]
}

Retorne APENAS o JSON, sem texto adicional.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.7,
    },
  });

  const text = response.text;
  console.log('📊 Resposta da pesquisa recebida');

  const parsed = extractJsonFromResponse(text);
  return parsed.keywords;
}

// ─── Step 2: Generate Article ──────────────────────────────

async function generateArticle(keyword) {
  console.log(`📝 Gerando artigo para: "${keyword.keyword}"`);

  const prompt = `Você é um redator sênior de conteúdo B2B da Inova Systems Solutions, uma empresa brasileira de tecnologia que desenvolve ERP customizado, apps mobile, automações com IA e sistemas web sob medida para PMEs.

Escreva um artigo completo de blog otimizado para SEO com a seguinte palavra-chave de cauda longa: "${keyword.keyword}"

Título proposto: "${keyword.title}"
Categoria: ${keyword.category}

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
10. Evite frases vazias como "no mundo atual" ou "é muito importante"

Retorne APENAS um JSON válido (sem markdown, sem código):
{
  "title": "título final do artigo (pode ajustar o proposto)",
  "excerpt": "resumo atrativo do artigo (máx 200 caracteres)",
  "content": "HTML completo do artigo (string única, sem quebras de linha desnecessárias)",
  "metaDescription": "meta description para SEO (máx 160 caracteres)",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "readTime": "X min",
  "author": "Equipe Inova"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      temperature: 0.8,
      maxOutputTokens: 8192,
    },
  });

  const text = response.text;
  const article = extractJsonFromResponse(text);

  const wordCount = countWords(article.content);
  const h2Count = countH2(article.content);

  console.log(`   Palavras: ${wordCount}, Seções H2: ${h2Count}`);

  if (wordCount < 800) {
    throw new Error(`Artigo muito curto: ${wordCount} palavras (mín: 800)`);
  }
  if (h2Count < 2) {
    throw new Error(`Poucas seções: ${h2Count} H2 (mín: 2)`);
  }

  return article;
}

// ─── Step 3: Fetch Image ───────────────────────────────────

async function fetchImage(keyword, category) {
  const fallbacks = {
    'Gestão & ERP': 'photo-1460925895917-afdab827c52f',
    'Mobile': 'photo-1512941937669-90a1b58e7e9c',
    'IA & Automação': 'photo-1677442136019-21780ecad995',
    'Web Development': 'photo-1547658719-da2b51169166',
    'Estratégia': 'photo-1553877522-43269d4ea984',
  };

  if (!UNSPLASH_ACCESS_KEY) {
    console.log('📷 Sem UNSPLASH_ACCESS_KEY, usando imagem padrão por categoria');
    const photoId = fallbacks[category] || fallbacks['Gestão & ERP'];
    return {
      image: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=800`,
      imageLarge: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=1200`,
    };
  }

  console.log('📷 Buscando imagem no Unsplash...');

  const searchTerms = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Given this Portuguese article topic: "${keyword}". Return 2-3 English search terms for finding a professional business/technology photo on Unsplash. Return ONLY the terms separated by spaces, nothing else.`,
    config: { temperature: 0.3, maxOutputTokens: 50 },
  });

  const query = searchTerms.text.trim();
  console.log(`   Busca: "${query}"`);

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=5&client_id=${UNSPLASH_ACCESS_KEY}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (!data.results || data.results.length === 0) throw new Error('No results');

    const photo = data.results[0];
    const baseUrl = photo.urls.raw;

    return {
      image: `${baseUrl}&auto=format&fit=crop&q=80&w=800`,
      imageLarge: `${baseUrl}&auto=format&fit=crop&q=80&w=1200`,
    };
  } catch (err) {
    console.warn(`   Unsplash falhou: ${err.message}, usando fallback`);
    const photoId = fallbacks[category] || fallbacks['Gestão & ERP'];
    return {
      image: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=800`,
      imageLarge: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=1200`,
    };
  }
}

// ─── Main Pipeline ─────────────────────────────────────────

async function main() {
  console.log('🚀 Iniciando pipeline de geração de blog post...\n');

  const existingPosts = loadExistingPosts();
  const existingTitles = existingPosts.map(p => p.title);
  const existingSlugs = existingPosts.map(p => p.slug);
  const nextId = Math.max(...existingPosts.map(p => p.id)) + 1;

  // Step 1: Research keywords
  let keywords;
  try {
    keywords = await researchKeywords(existingTitles);
  } catch (err) {
    console.error('Erro na pesquisa de keywords:', err.message);
    process.exit(1);
  }

  if (!keywords || keywords.length === 0) {
    console.error('Nenhuma keyword retornada');
    process.exit(1);
  }

  let chosenKeyword = null;
  for (const kw of keywords) {
    const testSlug = slugify(kw.title);
    if (!existingSlugs.includes(testSlug)) {
      chosenKeyword = kw;
      break;
    }
  }
  if (!chosenKeyword) chosenKeyword = keywords[0];

  console.log(`\n✅ Keyword escolhida: "${chosenKeyword.keyword}"`);
  console.log(`   Categoria: ${chosenKeyword.category}\n`);

  // Step 2: Generate article (with retry)
  let article;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      article = await generateArticle(chosenKeyword);
      break;
    } catch (err) {
      console.warn(`   Tentativa ${attempt} falhou: ${err.message}`);
      if (attempt === 2) {
        console.error('Falha na geração do artigo após 2 tentativas');
        process.exit(1);
      }
    }
  }

  // Step 3: Fetch image
  let images;
  try {
    images = await fetchImage(chosenKeyword.keyword, chosenKeyword.category);
  } catch (err) {
    console.warn('Erro ao buscar imagem, usando fallback:', err.message);
    images = {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      imageLarge: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    };
  }

  // Step 4: Assemble post
  const now = new Date();
  const slug = slugify(article.title);
  const newPost = {
    id: nextId,
    title: article.title,
    excerpt: article.excerpt,
    category: chosenKeyword.category,
    author: article.author || 'Equipe Inova',
    date: formatDatePtBR(now),
    readTime: article.readTime || '8 min',
    image: images.image,
    imageLarge: images.imageLarge,
    slug,
    tags: article.tags || ['Tecnologia', 'Inovação', 'B2B'],
    metaDescription: article.metaDescription || article.excerpt,
    publishedAt: now.toISOString(),
    content: article.content,
  };

  existingPosts.unshift(newPost);
  savePosts(existingPosts);

  console.log('\n✅ Post gerado com sucesso!');
  console.log(`   Título: ${newPost.title}`);
  console.log(`   Slug: ${newPost.slug}`);
  console.log(`   Categoria: ${newPost.category}`);
  console.log(`   Palavras: ${countWords(newPost.content)}`);
  console.log(`   Salvo em: ${BLOG_DATA_PATH}\n`);
}

main().catch(err => {
  console.error('Erro fatal no pipeline:', err);
  process.exit(1);
});
