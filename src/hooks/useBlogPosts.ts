import { useState, useEffect } from 'react';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  imageLarge: string;
  slug: string;
  tags: string[];
  metaDescription: string;
  publishedAt: string;
  content?: string;
}

// In dev mode, fall back to static JSON import since there's no PHP server
const isDev = import.meta.env.DEV;

// In-memory cache to avoid refetching on navigation
let cachedList: BlogPost[] | null = null;
const cachedPosts: Record<string, BlogPost> = {};

async function fetchBlogList(): Promise<BlogPost[]> {
  if (isDev) {
    // Dynamic import of the seed data for local development
    const data = await import('../data/blogPosts.json');
    // Strip content for listing (matches API behavior)
    return (data.default as BlogPost[])
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .map(({ content, ...rest }) => rest as BlogPost);
  }
  const res = await fetch('/api/blog.php');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchBlogPost(slug: string): Promise<BlogPost> {
  if (isDev) {
    const data = await import('../data/blogPosts.json');
    const post = (data.default as BlogPost[]).find(p => p.slug === slug);
    if (!post) throw new Error('not_found');
    return post;
  }
  const res = await fetch(`/api/blog.php?slug=${encodeURIComponent(slug)}`);
  if (res.status === 404) throw new Error('not_found');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function useBlogList() {
  const [posts, setPosts] = useState<BlogPost[]>(cachedList || []);
  const [loading, setLoading] = useState(!cachedList);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedList) return;

    let cancelled = false;

    fetchBlogList()
      .then(data => {
        if (cancelled) return;
        cachedList = data;
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        console.error('Failed to load blog posts:', err);
        setError('Erro ao carregar artigos');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { posts, loading, error };
}

export function useBlogPost(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(slug ? cachedPosts[slug] || null : null);
  const [loading, setLoading] = useState(!!(slug && !cachedPosts[slug]));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    if (cachedPosts[slug]) {
      setPost(cachedPosts[slug]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetchBlogPost(slug)
      .then(data => {
        if (cancelled) return;
        cachedPosts[slug] = data;
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        if (err.message === 'not_found') {
          setError('not_found');
        } else {
          console.error('Failed to load blog post:', err);
          setError('Erro ao carregar artigo');
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug]);

  return { post, loading, error };
}
