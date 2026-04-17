import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const SITE_URL = 'https://inovasystemssolutions.com';

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/quem-somos', changefreq: 'monthly', priority: '0.8' },
  { path: '/missao', changefreq: 'monthly', priority: '0.6' },
  { path: '/filosofia', changefreq: 'monthly', priority: '0.6' },
  { path: '/portfolio', changefreq: 'weekly', priority: '0.9' },
  { path: '/solucoes/aplicacoes-web', changefreq: 'monthly', priority: '0.9' },
  { path: '/solucoes/aplicacoes-mobile', changefreq: 'monthly', priority: '0.9' },
  { path: '/solucoes/automacoes', changefreq: 'monthly', priority: '0.9' },
  { path: '/solucoes/ia', changefreq: 'monthly', priority: '0.9' },
  { path: '/diagnostico/processo-na-cabeca-do-dono', changefreq: 'monthly', priority: '0.7' },
  { path: '/diagnostico/sistema-generico', changefreq: 'monthly', priority: '0.7' },
  { path: '/diagnostico/dados-irreais', changefreq: 'monthly', priority: '0.7' },
  { path: '/diagnostico/decisao-no-achismo', changefreq: 'monthly', priority: '0.7' },
  { path: '/contato-quiz', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/termos', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacidade', changefreq: 'yearly', priority: '0.3' },
  { path: '/cookies', changefreq: 'yearly', priority: '0.3' },
];

const blogPosts = JSON.parse(
  readFileSync(resolve(root, 'src/data/blogPosts.json'), 'utf-8')
);

const today = new Date().toISOString().split('T')[0];

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const urls = [
  ...staticRoutes.map((r) => ({
    loc: `${SITE_URL}${r.path}`,
    lastmod: today,
    changefreq: r.changefreq,
    priority: r.priority,
  })),
  ...blogPosts.map((p) => ({
    loc: `${SITE_URL}/blog/${p.slug}`,
    lastmod: (p.publishedAt || today).split('T')[0],
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escape(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
console.log(`Generated sitemap with ${urls.length} URLs`);
