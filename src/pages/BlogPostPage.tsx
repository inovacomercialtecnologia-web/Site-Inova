import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import DOMPurify from 'dompurify';

const blogPostsContent = {
  "erp-customizado-reducao-custos": {
    title: "Como um ERP customizado pode reduzir custos operacionais em até 30%?",
    category: "Gestão & ERP",
    author: "Equipe Inova",
    date: "15 Mai, 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p>No cenário competitivo atual, a eficiência operacional não é apenas um diferencial, mas uma questão de sobrevivência. Muitas empresas recorrem a sistemas de gestão (ERP) genéricos na esperança de organizar seus processos, mas acabam encontrando uma barreira: o sistema não se adapta ao negócio, o negócio é que precisa se adaptar ao sistema.</p>
      
      <h2>O Problema dos Sistemas Genéricos</h2>
      <p>Sistemas "de prateleira" são construídos para atender a média do mercado. Isso significa que eles possuem funcionalidades que você nunca usará e carecem de processos específicos que são vitais para sua operação única. O resultado? Planilhas paralelas, retrabalho e dados descentralizados.</p>
      
      <h2>Como a Customização Gera Economia</h2>
      <p>Um ERP customizado é desenhado em torno da sua metodologia de trabalho. Aqui estão os três pilares onde a redução de custos é mais visível:</p>
      <ul>
        <li><strong>Eliminação de Tarefas Manuais:</strong> Automação de fluxos que antes dependiam de intervenção humana, reduzindo erros e tempo de execução.</li>
        <li><strong>Visibilidade em Tempo Real:</strong> Decisões baseadas em dados precisos evitam desperdícios de estoque e falhas na logística.</li>
        <li><strong>Escalabilidade sem Aumento de Headcount:</strong> Sua empresa cresce em volume de transações sem precisar contratar proporcionalmente mais pessoas para o administrativo.</li>
      </ul>
      
      <blockquote>"A tecnologia deve ser o acelerador da sua estratégia, não o freio da sua operação."</blockquote>
      
      <h2>Conclusão</h2>
      <p>Investir em uma solução sob medida pode parecer um custo maior inicialmente, mas o Retorno sobre o Investimento (ROI) se paga rapidamente através da eficiência ganha. Na Inova, mapeamos sua operação real antes de escrever a primeira linha de código, garantindo que o sistema seja uma luva para o seu negócio.</p>
    `
  },
  "flutter-vs-react-native-2026": {
    title: "Flutter vs React Native: Qual a melhor escolha para o seu app em 2026?",
    category: "Mobile",
    author: "Tech Lead Inova",
    date: "10 Mai, 2026",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p>A eterna disputa entre os dois gigantes do desenvolvimento multiplataforma continua em 2026. Com o amadurecimento de ambas as tecnologias, a escolha hoje depende menos de "qual é melhor" e mais de "qual é a certa para o seu projeto".</p>
      
      <h2>Flutter: Performance e UI Consistente</h2>
      <p>O Flutter, mantido pelo Google, continua sendo a escolha preferida para projetos que exigem uma interface rica, personalizada e com performance idêntica ao nativo. Sua engine de renderização própria (Impeller) garante que o app tenha a mesma aparência em qualquer dispositivo.</p>
      
      <h2>React Native: Ecossistema e Agilidade</h2>
      <p>O React Native, do Meta, brilha quando a integração com bibliotecas JavaScript existentes é crucial ou quando a equipe já possui forte domínio de React. Em 2026, com a nova arquitetura totalmente estável, a diferença de performance para o Flutter diminuiu drasticamente.</p>
      
      <h2>O Veredito</h2>
      <p>Na Inova Systems, analisamos os seguintes pontos antes de recomendar uma stack:</p>
      <ul>
        <li><strong>Complexidade da UI:</strong> Flutter vence em designs altamente customizados.</li>
        <li><strong>Time-to-Market:</strong> React Native pode ser mais rápido se houver reaproveitamento de código web.</li>
        <li><strong>Manutenção a Longo Prazo:</strong> Ambas são excelentes, mas o Flutter oferece uma estrutura mais opinativa e organizada.</li>
      </ul>
    `
  },
  "automacao-ia-guia-pme": {
    title: "Automação de processos com IA: O guia definitivo para PMEs",
    category: "IA & Automação",
    author: "Especialista IA",
    date: "05 Mai, 2026",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p>Muitos gestores de PMEs ainda acreditam que Inteligência Artificial é algo restrito ao Vale do Silício ou a grandes corporações. A realidade de 2026 mostra o contrário: a IA tornou-se a ferramenta mais democrática para ganhar escala.</p>
      
      <h2>Onde começar a automatizar?</h2>
      <p>Não tente automatizar tudo de uma vez. Comece pelos "gargalos silenciosos":</p>
      <ul>
        <li><strong>Atendimento ao Cliente:</strong> Agentes de IA que resolvem 80% das dúvidas comuns sem intervenção humana.</li>
        <li><strong>Análise de Documentos:</strong> Extração automática de dados de notas fiscais e contratos.</li>
        <li><strong>Lead Scoring:</strong> Priorização automática de vendas com base no comportamento do cliente.</li>
      </ul>
      
      <h2>O Impacto no Bottom Line</h2>
      <p>A automação libera seu time talentoso de tarefas burocráticas para focarem em estratégia e relacionamento. Isso aumenta a satisfação da equipe e reduz o turnover, além de garantir que nenhum lead seja esquecido por falha humana.</p>
    `
  }
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = slug && slug in blogPostsContent
    ? blogPostsContent[slug as keyof typeof blogPostsContent]
    : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post) {
      navigate('/blog', { replace: true });
    }
  }, [post, navigate]);

  const sanitizedContent = useMemo(
    () => post ? DOMPurify.sanitize(post.content, { ALLOWED_TAGS: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'a', 'br'], ALLOWED_ATTR: ['href', 'target', 'rel'] }) : '',
    [post]
  );

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#080808] text-[#FAFAF8] font-sans overflow-x-hidden pt-24">
      
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
              src={post.image} 
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
                {['Tecnologia', 'Inovação', 'B2B', 'Software'].map(tag => (
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
                {Object.entries(blogPostsContent)
                  .filter(([s]) => s !== slug)
                  .slice(0, 2)
                  .map(([s, p]) => (
                    <Link key={s} to={`/blog/${s}`} className="group block">
                      <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" loading="lazy" />
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
