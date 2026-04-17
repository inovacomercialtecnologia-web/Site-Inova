import React, { useEffect } from 'react';
import { ArrowRight, ChevronDown, LayoutGrid, Users, ShoppingBag, Network, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import WebAppsHero from '../components/WebAppsHero';
import SaaSSection from '../components/SaaSSection';
import AnimatedSvgDivider from '../components/AnimatedSvgDivider';
import SystemsStorytelling from '../components/SystemsStorytelling';
import PageMeta from '../components/PageMeta';
import JsonLd, { service, breadcrumb } from '../components/JsonLd';
import CTABanner from '../components/CTABanner';

const WebApplicationsPage = () => {
  useEffect(() => {
    const _timeouts: number[] = [];
    let _morphInterval: number | null = null;
    let _observer: IntersectionObserver | null = null;

    function s4_initMorphing() {
      const words = document.querySelectorAll('.s4-morph-word');
      if (!words.length) return;
      let currentIndex = 0;

      _morphInterval = window.setInterval(() => {
        const currentWord = words[currentIndex] as HTMLElement;
        const nextIndex = (currentIndex + 1) % words.length;
        const nextWord = words[nextIndex] as HTMLElement;

        currentWord.classList.remove('s4-active');
        currentWord.classList.add('s4-exit');

        const t = window.setTimeout(() => {
          currentWord.classList.remove('s4-exit');
          nextWord.classList.add('s4-active');
        }, 400);
        _timeouts.push(t);

        currentIndex = nextIndex;
      }, 2500);
    }

    function s4_initCards() {
      const blocks = document.querySelectorAll('.s4-block');
      if (!blocks.length) return;

      _observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.getAttribute('data-s4-delay') || '0s';
            const transform = el.getAttribute('data-s4-transform') || 'translateY(0)';

            el.style.transition = `transform 0.7s ease-out ${delay}, opacity 0.7s ease-out ${delay}`;
            el.style.opacity = '1';
            el.style.transform = transform;

            const t = window.setTimeout(() => {
              el.style.transition = 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease';
            }, 700 + (parseFloat(delay) || 0) * 1000);
            _timeouts.push(t);

            _observer?.unobserve(el);
          }
        });
      }, { threshold: 0.1 });

      blocks.forEach(block => _observer!.observe(block));
    }

    s4_initMorphing();
    s4_initCards();

    return () => {
      if (_morphInterval) clearInterval(_morphInterval);
      _timeouts.forEach(t => clearTimeout(t));
      if (_observer) _observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <PageMeta title="Aplicações Web" description="Desenvolvimento de sistemas web sob medida: ERP, CRM, dashboards, e-commerce, portais e plataformas SaaS para empresas B2B." />
      <JsonLd id="jsonld-service-web" data={service('Desenvolvimento de Aplicações Web', 'ERP, CRM, dashboards, e-commerce, portais e plataformas SaaS sob medida para empresas B2B.', '/solucoes/aplicacoes-web')} />
      <JsonLd id="jsonld-breadcrumb-web" data={breadcrumb([{ name: 'Início', path: '/' }, { name: 'Soluções', path: '/portfolio' }, { name: 'Aplicações Web', path: '/solucoes/aplicacoes-web' }])} />
      {/* Hero Section */}
      <WebAppsHero />

      {/* Animated SVG Divider */}
      <AnimatedSvgDivider />

      {/* SaaS Section */}
      <SaaSSection />

      {/* Systems of Management Section - Full Scroll Storytelling */}
      <SystemsStorytelling />

      {/* Education/LMS Section */}
      <section className="py-12 px-4 md:py-24 md:px-6 bg-[#0A0A0A] relative">
        <style>{`
          .s4-bento {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            gap: 20px;
            margin-top: 64px;
          }
          @media (max-width: 768px) {
            .s4-bento {
              grid-template-columns: 1fr;
            }
          }
          .s4-block {
            background: #111111;
            border: 1px solid rgba(201, 168, 76, 0.2);
            border-radius: 20px;
            padding: 36px;
            position: relative;
            overflow: hidden;
            transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          }
          .s4-block:hover {
            transform: translateY(-4px);
            border-color: rgba(201, 168, 76, 0.7);
            box-shadow: 0 0 32px rgba(201, 168, 76, 0.1);
          }
          .s4-block-panoramic {
            grid-column: 1 / -1;
          }
          .s4-morph-container {
            position: relative;
            min-height: 90px;
          }
          .s4-morph-word {
            position: absolute;
            top: 0;
            left: 0;
            font-size: 72px;
            font-weight: 800;
            color: #c9a84c;
            opacity: 0;
            filter: blur(12px);
            transform: translateY(20px);
            transition: opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease;
            white-space: nowrap;
          }
          @media (max-width: 768px) {
            .s4-morph-word {
              font-size: clamp(1.8rem, 10vw, 48px);
            }
          }
          .s4-morph-word.s4-active {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0);
          }
          .s4-morph-word.s4-exit {
            opacity: 0;
            filter: blur(12px);
            transform: translateY(-20px);
          }
          
          /* SVG Animations */
          @keyframes s4-pulse-node {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          .s4-node-1 { animation: s4-pulse-node 2s infinite ease-in-out; transform-origin: center; }
          .s4-node-2 { animation: s4-pulse-node 2s infinite ease-in-out 0.6s; transform-origin: center; }
          .s4-node-3 { animation: s4-pulse-node 2s infinite ease-in-out 1.2s; transform-origin: center; }

          @keyframes s4-wifi-draw {
            0% { stroke-dashoffset: 100; }
            50%, 100% { stroke-dashoffset: 0; }
          }
          .s4-wifi-arc {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: s4-wifi-draw 2s infinite ease-in-out;
          }
          .s4-wifi-arc-2 { animation-delay: 0.3s; }
          .s4-wifi-arc-3 { animation-delay: 0.6s; }

          @keyframes s4-intersect-pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.5; }
          }
          .s4-intersect { animation: s4-intersect-pulse 2.5s infinite ease-in-out; }

          @keyframes s4-light-up {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          .s4-dot-1 { animation: s4-light-up 2s infinite ease-in-out 0s; }
          .s4-dot-2 { animation: s4-light-up 2s infinite ease-in-out 0.4s; }
          .s4-dot-3 { animation: s4-light-up 2s infinite ease-in-out 0.8s; }
          .s4-dot-4 { animation: s4-light-up 2s infinite ease-in-out 1.2s; }
          .s4-dot-5 { animation: s4-light-up 2s infinite ease-in-out 1.6s; }
          @media (max-width: 768px) {
            .s4-bento {
              gap: 14px;
              margin-top: 40px;
            }
            .s4-block {
              padding: 24px;
            }
            .s4-morph-container {
              min-height: 60px;
            }
          }
          @media (max-width: 640px) {
            .s4-morph-word { font-size: clamp(1.6rem, 9vw, 40px); }
            .s4-block { padding: 18px; }
            .s4-morph-container { min-height: 48px; }
            .s4-bento {
              gap: 12px;
              margin-top: 32px;
            }
          }
          @media (max-width: 480px) {
            .s4-morph-word { font-size: clamp(1.4rem, 8vw, 32px); }
            .s4-block { padding: 16px; }
            .s4-morph-container { min-height: 40px; }
          }
        `}</style>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start justify-between">
            {/* Left Zone (55%) */}
            <div className="w-full md:w-[55%] relative">
              <div className="absolute -bottom-10 -left-6 text-[#c9a84c] opacity-[0.06] text-[180px] font-black leading-none pointer-events-none z-0 hidden md:block">
                04
              </div>
              <div className="h-[1px] w-[48px] bg-[#c9a84c] mb-6 relative z-10" />
              <h2 className="relative z-10 text-left">
                <span className="block text-[clamp(1.8rem,6vw,48px)] font-serif font-light text-[#ffffff] leading-tight">Plataformas de</span>
                <div className="s4-morph-container">
                  <span className="s4-morph-word s4-active">E-learning</span>
                  <span className="s4-morph-word">PWA</span>
                  <span className="s4-morph-word">Portais</span>
                  <span className="s4-morph-word">Intranets</span>
                </div>
              </h2>
            </div>
            
            {/* Right Zone (45%) */}
            <div className="w-full md:w-[45%] flex items-start mt-8 md:mt-[60px] relative z-10">
              <div className="w-[3px] h-[36px] md:h-[48px] bg-[#c9a84c] shrink-0" />
              <p className="text-[#aaa] text-[14px] md:text-[15px] leading-[1.7] md:leading-[1.8] ml-[14px] md:ml-[20px] text-left">
                Desenvolvemos plataformas EAD completas e personalizadas, semelhantes a soluções como Hotmart e Kiwify, porém criadas exclusivamente para o seu negócio. Nossas soluções permitem o cadastro de cursos, trilhas de aprendizado, emissão de certificados, acompanhamento de progresso dos alunos, integração com meios de pagamento e muito mais, seja para treinamento corporativo interno ou para a venda de infoprodutos e cursos online.
              </p>
            </div>
          </div>

          <div className="s4-bento">
            {/* Block 1: LMS */}
            <div className="s4-block" style={{ opacity: 0, transform: 'translateY(60px)' }} data-s4-delay="0s" data-s4-transform="translateY(0)">
              <div className="relative z-10">
                <span className="text-[#c9a84c] text-[12px] tracking-[3px] uppercase font-medium block mb-4">E-learning (LMS)</span>
                <h3 className="text-[#ffffff] text-[18px] font-serif font-bold mb-4">Plataformas de Educação</h3>
                <p className="text-[#888] text-[13px] md:text-[14px] leading-[1.7] max-w-full md:max-w-[80%]">
                  Cursos, trilhas de aprendizado, certificados e acompanhamento de alunos em um ambiente exclusivo.
                </p>
              </div>
              <svg className="absolute bottom-4 right-4 md:bottom-6 md:right-6 opacity-40 md:opacity-60 w-[80px] h-[54px] md:w-[120px] md:h-[80px]" viewBox="0 0 120 80" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                <path d="M20 40 L60 20 L100 60" strokeDasharray="4 4" />
                <circle cx="20" cy="40" r="8" className="s4-node-1" />
                <circle cx="60" cy="20" r="12" className="s4-node-2" />
                <circle cx="100" cy="60" r="10" className="s4-node-3" />
              </svg>
            </div>

            {/* Block 2: PWA */}
            <div className="s4-block" style={{ opacity: 0, transform: 'translateX(60px)' }} data-s4-delay="0.15s" data-s4-transform="translateX(0)">
              <div className="relative z-10">
                <span className="text-[#c9a84c] text-[12px] tracking-[3px] uppercase font-medium block mb-4">Progressive Web Apps</span>
                <h3 className="text-[#ffffff] text-[18px] font-serif font-bold mb-4">PWA</h3>
                <p className="text-[#888] text-[14px] leading-[1.7]">
                  A experiência de um app nativo direto no navegador.
                </p>
              </div>
              <svg className="absolute bottom-4 right-4 md:bottom-6 md:right-6 opacity-40 md:opacity-60 w-[56px] h-[56px] md:w-[80px] md:h-[80px]" viewBox="0 0 80 80" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                <rect x="25" y="15" width="30" height="50" rx="4" />
                <line x1="35" y1="25" x2="45" y2="25" />
                <line x1="32" y1="35" x2="48" y2="35" />
                <line x1="32" y1="45" x2="48" y2="45" />
                <path d="M20 10 Q40 -5 60 10" className="s4-wifi-arc s4-wifi-arc-1" />
                <path d="M15 20 Q40 0 65 20" className="s4-wifi-arc s4-wifi-arc-2" />
                <path d="M10 30 Q40 5 70 30" className="s4-wifi-arc s4-wifi-arc-3" />
              </svg>
            </div>

            {/* Block 3: Portais */}
            <div className="s4-block" style={{ opacity: 0, transform: 'translateX(-60px)' }} data-s4-delay="0.15s" data-s4-transform="translateX(0)">
              <div className="relative z-10">
                <span className="text-[#c9a84c] text-[12px] tracking-[3px] uppercase font-medium block mb-4">Portais de Cliente</span>
                <h3 className="text-[#ffffff] text-[18px] font-serif font-bold mb-4">Portais</h3>
                <p className="text-[#888] text-[14px] leading-[1.7]">
                  Ambientes digitais exclusivos para seus clientes.
                </p>
              </div>
              <svg className="absolute bottom-4 right-4 md:bottom-6 md:right-6 opacity-40 md:opacity-60 w-[56px] h-[56px] md:w-[80px] md:h-[80px]" viewBox="0 0 80 80" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                <circle cx="30" cy="40" r="20" />
                <circle cx="50" cy="40" r="20" />
                <path d="M40 23 A20 20 0 0 0 40 57 A20 20 0 0 0 40 23 Z" fill="#c9a84c" stroke="none" className="s4-intersect" />
              </svg>
            </div>

            {/* Block 4: Intranets */}
            <div className="s4-block s4-block-panoramic" style={{ opacity: 0, transform: 'translateY(40px)' }} data-s4-delay="0.3s" data-s4-transform="translateY(0)">
              <div className="relative z-10 w-full md:w-1/2">
                <span className="text-[#c9a84c] text-[12px] tracking-[3px] uppercase font-medium block mb-4">Comunicação Interna</span>
                <h3 className="text-[#ffffff] text-[18px] font-serif font-bold mb-4">Intranets</h3>
                <p className="text-[#888] text-[14px] leading-[1.7]">
                  Conecte equipes, facilite a comunicação e a gestão de processos internos.
                </p>
              </div>
              <svg className="absolute top-1/2 -translate-y-1/2 right-12 opacity-80 hidden md:block" width="200" height="60" viewBox="0 0 200 60" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                <line x1="20" y1="30" x2="180" y2="30" strokeDasharray="2 4" opacity="0.3" />
                <circle cx="20" cy="30" r="6" fill="#c9a84c" className="s4-dot-1" />
                <circle cx="60" cy="30" r="6" fill="#c9a84c" className="s4-dot-2" />
                <circle cx="100" cy="30" r="6" fill="#c9a84c" className="s4-dot-3" />
                <circle cx="140" cy="30" r="6" fill="#c9a84c" className="s4-dot-4" />
                <circle cx="180" cy="30" r="6" fill="#c9a84c" className="s4-dot-5" />
              </svg>
            </div>

          </div>
        </div>
      </section>

      <CTABanner
        headline="Pronto para sua aplicação web sob medida?"
        description="Da concepção ao deploy — criamos sistemas web que resolvem problemas reais e escalam com o seu negócio."
        buttonText="Solicitar proposta"
      />
    </div>
  );
};

export default WebApplicationsPage;
