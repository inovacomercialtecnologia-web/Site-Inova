import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Clock, User, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import CTABanner from '../components/CTABanner';

const blogPosts = [
  {
    id: 1,
    title: "Como um ERP customizado pode reduzir custos operacionais em até 30%?",
    excerpt: "Descubra por que sistemas genéricos podem estar drenando seus lucros e como uma solução sob medida otimiza processos críticos.",
    category: "Gestão & ERP",
    author: "Equipe Inova",
    date: "18 Fev, 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    slug: "erp-customizado-reducao-custos"
  },
  {
    id: 2,
    title: "Flutter vs React Native: Qual a melhor escolha para o seu app em 2026?",
    excerpt: "Uma análise técnica profunda sobre performance, custo de desenvolvimento e experiência do usuário para ajudar na sua decisão estratégica.",
    category: "Mobile",
    author: "Tech Lead Inova",
    date: "12 Fev, 2026",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    slug: "flutter-vs-react-native-2026"
  },
  {
    id: 3,
    title: "Automação de processos com IA: O guia definitivo para PMEs",
    excerpt: "A inteligência artificial não é mais exclusividade de gigantes. Saiba como pequenas e médias empresas estão ganhando escala com automação.",
    category: "IA & Automação",
    author: "Especialista IA",
    date: "05 Fev, 2026",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    slug: "automacao-ia-guia-pme"
  }
];

const BlogPage = () => {
  const [search, setSearch] = useState('');
  const [newsletter, setNewsletter] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#FAFAF8] font-sans overflow-x-hidden pt-24">
      <PageMeta title="Blog" description="Artigos sobre transformação digital, tecnologia empresarial, automação e inteligência artificial para negócios B2B." />

      {/* HERO SECTION */}
      <section className="relative py-20 px-6 md:px-12 lg:px-24 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-[#C9A84C] text-[10px] md:text-[12px] font-bold uppercase tracking-[0.4em] mb-6 block">INOVA SYSTEMS SOLUTIONS</span>
            <h1 className="text-[clamp(2rem,6vw,4rem)] font-[200] leading-[1.1] tracking-tighter mb-8">
              Processo, tecnologia e <span className="italic font-[400] text-[#C9A84C]">gestão na prática.</span>
            </h1>
            <p className="text-base md:text-lg font-light text-white/40 leading-relaxed mb-12">
              Conteúdo produzido por quem estrutura operações e desenvolve tecnologia todos os dias.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-sm md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Pesquisar artigos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="py-8 px-6 md:px-12 lg:px-24 bg-[#0D0D0F]">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center gap-4 md:gap-8">
          <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold mr-4">Categorias:</span>
          {['Todos', 'Gestão & ERP', 'Mobile', 'IA & Automação', 'Web Development', 'Estratégia'].map((cat, i) => (
            <button 
              key={i}
              className={`text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                i === 0 ? 'bg-[#C9A84C] border-[#C9A84C] text-[#080808]' : 'bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {blogPosts.filter(post => !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase())).map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-8">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#C9A84C] text-[#080808] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold leading-tight mb-4 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-white/40 text-sm font-light leading-relaxed mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-white/20" />
                      </div>
                      <span className="text-[11px] font-medium text-white/60">{post.author}</span>
                    </div>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-[#C9A84C] hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-24 flex justify-center">
            <button className="border border-white/10 text-white/40 px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all">
              Carregar mais artigos
            </button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-16 md:py-32 px-6 md:px-12 lg:px-24 bg-[#0D0D0F] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />
        
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[28px] md:text-[40px] font-[200] leading-tight tracking-tighter mb-6">
              Assine nossa <span className="italic font-[400] text-[#C9A84C]">Newsletter</span>
            </h2>
            <p className="text-white/40 font-light max-w-md">
              Receba mensalmente os melhores insights sobre tecnologia e negócios diretamente no seu e-mail. Sem spam, apenas inteligência.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={newsletter}
              onChange={(e) => setNewsletter(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:border-[#C9A84C]/50 transition-all"
            />
            <button
              onClick={() => {
                if (!newsletter || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletter)) {
                  alert('Por favor, informe um e-mail válido.');
                  return;
                }
                alert('Obrigado! Você será notificado sobre novos artigos.');
                setNewsletter('');
              }}
              className="bg-[#C9A84C] text-[#080808] px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-[#E8C97A] transition-all shadow-xl shadow-[#C9A84C]/10"
            >
              Inscrever
            </button>
          </motion.div>
        </div>
      </section>

      <CTABanner
        headline="Quer aplicar essas ideias no seu negócio?"
        description="Nosso time transforma insights em soluções reais. Fale com a gente e descubra como acelerar sua operação."
        buttonText="Falar com a Inova"
      />

    </div>
  );
};

export default BlogPage;
