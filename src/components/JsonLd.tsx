import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

export default function JsonLd({ data, id }: JsonLdProps) {
  useEffect(() => {
    const scriptId = id ?? `jsonld-${Math.random().toString(36).slice(2, 9)}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      script?.remove();
    };
  }, [data, id]);

  return null;
}

export const SITE_URL = 'https://inovasystemssolutions.com';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Inova Systems Solutions',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    'Transformamos inteligência operacional em tecnologia sob medida. Sistemas web, apps mobile, automações e IA para empresas B2B.',
  slogan: 'Tecnologia sob medida para empresas',
  areaServed: 'BR',
  knowsLanguage: ['pt-BR'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    availableLanguage: ['Portuguese'],
    url: `${SITE_URL}/contato-quiz`,
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Inova Systems Solutions',
  url: SITE_URL,
  inLanguage: 'pt-BR',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export const breadcrumb = (items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const service = (name: string, description: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: `${SITE_URL}${path}`,
  provider: {
    '@type': 'Organization',
    name: 'Inova Systems Solutions',
    url: SITE_URL,
  },
  areaServed: 'BR',
  serviceType: name,
});

export const aboutPage = (name: string, description: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name,
  description,
  url: `${SITE_URL}${path}`,
  inLanguage: 'pt-BR',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Inova Systems Solutions',
    url: SITE_URL,
  },
});

export const contactPage = (path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Diagnóstico Interativo de Transformação Digital',
  url: `${SITE_URL}${path}`,
  inLanguage: 'pt-BR',
  mainEntity: {
    '@type': 'Organization',
    name: 'Inova Systems Solutions',
    url: SITE_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      availableLanguage: ['Portuguese'],
      url: `${SITE_URL}${path}`,
    },
  },
});

export const blogSchema = (
  posts: Array<{ title: string; slug: string; excerpt: string; publishedAt?: string; image?: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Blog — Inova Systems Solutions',
  description:
    'Insights sobre transformação digital, ERP sob medida, automação e IA aplicada para empresas B2B.',
  url: `${SITE_URL}/blog`,
  inLanguage: 'pt-BR',
  publisher: { '@type': 'Organization', name: 'Inova Systems Solutions', url: SITE_URL },
  blogPost: posts.map((p) => ({
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.excerpt,
    url: `${SITE_URL}/blog/${p.slug}`,
    datePublished: p.publishedAt,
    image: p.image,
    author: { '@type': 'Organization', name: 'Inova Systems Solutions' },
  })),
});

export const collectionPage = (
  name: string,
  description: string,
  path: string,
  items: Array<{ name: string; url?: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url: `${SITE_URL}${path}`,
  inLanguage: 'pt-BR',
  hasPart: items.map((item, idx) => ({
    '@type': 'CreativeWork',
    name: item.name,
    position: idx + 1,
    ...(item.url ? { url: item.url } : {}),
  })),
});
