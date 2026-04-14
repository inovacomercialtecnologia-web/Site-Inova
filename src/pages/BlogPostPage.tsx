import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import DOMPurify from 'dompurify';
import PageMeta from '../components/PageMeta';
import blogPostsData from '../data/blogPosts.json';

const blogPostsBySlug = Object.fromEntries(
  blogPostsData.map(post => [post.slug, post])
);

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = slug ? blogPostsBySlug[slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post) {
      navigate('/blog', { replace: true });
    }
  }, [post, navigate]);

  // JSON-LD structured data for SEO
  useEffect(() => {
    if (!post) return;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.metaDescription,
      "image": post.imageLarge,
      "datePublished": post.publishedAt,
      "author": {
        "@type": "Organization",
        "name": "Inova Systems Solutions",
        "url": "https://inovasystemssolutions.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Inova Systems Solutions",
        "url": "https://inovasystemssolutions.com"
      }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [post]);

  const sanitizedContent = useMemo(
    () => post ? DOMPurify.sanitize(post.content, { ALLOWED_TAGS: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'a', 'br'], ALLOWED_ATTR: ['href', 'target', 'rel'] }) : '',
    [post]
  );

  const relatedPosts = useMemo(
    () => blogPostsData.filter(p => p.slug !== slug).slice(0, 2),
    [slug]
  );

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#080808] text-[#FAFAF8] font-sans overflow-x-hidden pt-24">
      <PageMeta title={post.title} description={post.metaDescription} />

      {/* ARTICLE HEADER */}
      <header className="relative py-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="max-w-[900px] mx-auto relative z-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#C9A84C] text-[11px] font-bold uppercase tracking-widest mb-12 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Voltar ao Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full mb-8 inline-block border border-[#C9A84C]/20">
              {post.category}
            </span>
            <h1 className="text-[clamp(1.8rem,5vw,3.2rem)] font-bold leading-[1.1] tracking-tighter mb-10">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 py-8 border-y border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-white/20" />
                </div>
                <div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest mb-0.5">Autor</div>
                  <div className="text-sm font-medium text-white">{post.author}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white/20" />
                </div>
                <div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest mb-0.5">Publicado em</div>
                  <div className="text-sm font-medium text-white">{post.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white/20" />
                </div>
                <div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest mb-0.5">Leitura</div>
                  <div className="text-sm font-medium text-white">{post.readTime}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* FEATURED IMAGE */}
      <section className="px-6 md:px-12 lg:px-24 mb-20">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] rounded-[1.25rem] md:rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <img
              src={post.imageLarge}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="px-6 md:px-12 lg:px-24 pb-16 md:pb-32">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">

            {/* Sidebar Share */}
            <aside className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-32 flex flex-col items-center gap-6">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold [writing-mode:vertical-rl] mb-4">Compartilhar</span>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all">
                  <Linkedin className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </aside>

            {/* Main Content Body */}
            <div className="lg:col-span-8 lg:col-start-3">
              <div
                className="prose prose-invert prose-gold max-w-none
                  prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mb-8 prose-h2:mt-16
                  prose-p:text-base prose-p:font-light prose-p:leading-relaxed prose-p:text-white/60 prose-p:mb-8
                  prose-ul:text-white/60 prose-ul:mb-8 prose-li:mb-4 prose-li:text-base prose-li:font-light
                  prose-blockquote:border-l-4 prose-blockquote:border-[#C9A84C] prose-blockquote:bg-[#C9A84C]/5 prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:font-light prose-blockquote:text-white/80"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              {/* Tags */}
              <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap gap-3">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest text-white/30 border border-white/10 px-4 py-2 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Horizontal Section - Related/CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/5 pt-24">
            <div className="lg:col-span-4 lg:col-start-3">
              <div className="bg-[#0D0D0F] border border-white/5 rounded-3xl p-8 h-full">
                <h4 className="text-lg font-bold mb-6">Precisa de uma solução similar?</h4>
                <p className="text-sm text-white/40 font-light mb-8 leading-relaxed">
                  Nossa equipe é especialista em transformar desafios operacionais em tecnologia de alta performance.
                </p>
                <Link
                  to="/contato-quiz"
                  className="flex items-center justify-center gap-3 w-full bg-[#C9A84C] text-[#080808] py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#E8C97A] transition-all"
                >
                  Falar com especialista
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">Leia também</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {relatedPosts.map(p => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                      <img src={p.imageLarge} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" loading="lazy" />
                    </div>
                    <h5 className="text-sm font-bold leading-tight group-hover:text-[#C9A84C] transition-colors line-clamp-2">{p.title}</h5>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER NAV */}
      <section className="py-20 border-t border-white/5 bg-[#0D0D0F]">
        <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C9A84C] transition-all">
              <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-[#C9A84C]" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Todos os artigos</span>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default BlogPostPage;
