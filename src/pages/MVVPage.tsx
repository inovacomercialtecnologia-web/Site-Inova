import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  { title: 'Excelência', desc: 'Buscamos o mais alto padrão em cada linha de código e cada entrega.' },
  { title: 'Inovação', desc: 'Exploramos novas tecnologias para criar soluções que transformam negócios.' },
  { title: 'Transparência', desc: 'Comunicação clara e honesta em cada etapa do projeto.' },
  { title: 'Compromisso', desc: 'Tratamos cada projeto como se fosse nosso — com dedicação total.' },
  { title: 'Parceria', desc: 'Construímos relações de longo prazo, não apenas entregas pontuais.' },
  { title: 'Resultado', desc: 'Tecnologia só faz sentido quando gera impacto real no seu negócio.' },
];

const MVVPage = () => {
  useEffect(() => {
    // Dotted grid
    const canvas = document.getElementById('mvv-grid') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const drawGrid = () => {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          const GAP = window.innerWidth < 768 ? 56 : 32;
          const cols = Math.ceil(canvas.width / GAP);
          const rows = Math.ceil(canvas.height / GAP);
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
              const x = i * GAP;
              const y = j * GAP;
              const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
              const maxDist = Math.sqrt(cx * cx + cy * cy);
              const alpha = Math.max(0.03, 0.22 * (1 - dist / maxDist));
              ctx.beginPath();
              ctx.arc(x, y, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(201,168,76,${alpha})`;
              ctx.fill();
            }
          }
        };
        drawGrid();
        window.addEventListener('resize', drawGrid);

        // Entrance animations
        const t1 = setTimeout(() => {
          document.querySelectorAll('.mvv-hline').forEach(el => el.classList.add('visible'));
        }, 400);
        const t2 = setTimeout(() => {
          const center = document.querySelector('.mvv-center');
          if (center) center.classList.add('visible');
        }, 700);

        return () => {
          window.removeEventListener('resize', drawGrid);
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    }
  }, []);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {/* Hero Section */}
      <section className="mvv-hero-section">
        <canvas id="mvv-grid" className="mvv-grid-canvas"></canvas>
        <span className="mvv-corner mvv-corner--tl"></span>
        <span className="mvv-corner mvv-corner--tr"></span>
        <span className="mvv-corner mvv-corner--bl"></span>
        <span className="mvv-corner mvv-corner--br"></span>
        <span className="mvv-hline mvv-hline--top"></span>
        <span className="mvv-hline mvv-hline--bottom"></span>
        <span className="mvv-watermark">MVV</span>

        <div className="mvv-center">
          <div className="mvv-label-row">
            <span className="mvv-gold-line"></span>
            <span className="mvv-label">Quem Somos / MVV</span>
            <span className="mvv-gold-line"></span>
          </div>
          <h1 className="mvv-headline">
            <span className="mvv-h-outline">Missão, Visão</span>
            <span className="mvv-h-solid">& Valores</span>
          </h1>
          <p className="mvv-sub">O que nos move, onde queremos chegar e o que nos guia no dia a dia.</p>
          <div className="mvv-badge-row">
            <span className="mvv-badge">• Propósito</span>
            <span className="mvv-badge">• Direção</span>
            <span className="mvv-badge">• Princípios</span>
          </div>
        </div>

        <span className="mvv-side mvv-side--left">INOVA SYSTEMS SOLUTIONS</span>
        <span className="mvv-side mvv-side--right">EST. 2024</span>
      </section>

      {/* Missão & Visão Section */}
      <section className="relative bg-[#f5f3ee] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {/* Missão */}
            <motion.div {...fadeUp(0)} className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/30 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#C9A84C]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-semibold mb-1">01</p>
                  <h2 className="text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">Nossa Missão</h2>
                </div>
              </div>
              <div className="w-16 h-px bg-[#C9A84C]/40"></div>
              <p className="text-[#1a1a1a]/65 font-light leading-[1.9] text-base md:text-lg">
                Converter a <strong className="text-[#1a1a1a] font-semibold">inteligência operacional</strong> de
                empresas B2B em soluções tecnológicas sob medida, seja mapeando processos consolidados ou
                estruturando novas metodologias, para que a tecnologia seja sempre o
                <strong className="text-[#1a1a1a] font-semibold"> reflexo fiel da eficiência</strong> de cada negócio.
              </p>
            </motion.div>

            {/* Visão */}
            <motion.div {...fadeUp(0.15)} className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/30 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-[#C9A84C]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-semibold mb-1">02</p>
                  <h2 className="text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">Nossa Visão</h2>
                </div>
              </div>
              <div className="w-16 h-px bg-[#C9A84C]/40"></div>
              <p className="text-[#1a1a1a]/65 font-light leading-[1.9] text-base md:text-lg">
                Ser a <strong className="text-[#1a1a1a] font-semibold">referência nacional</strong> em
                desenvolvimento de soluções tecnológicas personalizadas para o mercado B2B, reconhecida pela
                capacidade de transformar <strong className="text-[#1a1a1a] font-semibold">processos complexos em
                sistemas inteligentes</strong> que impulsionam o crescimento sustentável dos nossos clientes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section className="relative bg-[#080808] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-24 md:py-32">
          <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center mb-16 md:mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9A84C]/15 to-transparent border border-[#C9A84C]/25 flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#C9A84C]" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-semibold mb-3">03</p>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-4">
              Nossos <em className="text-[#C9A84C]">Valores</em>
            </h2>
            <p className="text-white/35 font-light max-w-lg">
              Os princípios que guiam cada decisão, cada linha de código e cada relacionamento.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                {...fadeUp(0.08 * i)}
                className="group relative p-7 md:p-8 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#C9A84C]/20 transition-all duration-500"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="text-[10px] tracking-[0.3em] text-[#C9A84C]/60 font-bold mb-4 block">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-medium text-white/90 tracking-tight mb-3 group-hover:text-[#C9A84C] transition-colors duration-300">
                  {val.title}
                </h3>
                <p className="text-sm text-white/35 font-light leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-[#0a0a0a] border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
          <motion.div {...fadeUp(0)}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-semibold mb-6">Vamos construir juntos</p>
            <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight mb-8">
              Pronto para transformar seu negócio com <em className="text-[#C9A84C]">tecnologia sob medida?</em>
            </h2>
            <Link
              to="/contato-quiz"
              className="inline-flex items-center gap-3 bg-[#C9A84C] text-[#080808] text-[11px] font-bold tracking-[0.2em] uppercase px-10 py-4 hover:bg-[#E0BB5E] hover:shadow-[0_0_40px_-8px_rgba(201,168,76,0.55)] transition-all duration-300"
            >
              Fale conosco <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        .mvv-hero-section {
          position: relative;
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .mvv-grid-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.45;
        }
        .mvv-corner {
          position: absolute;
          width: 32px;
          height: 32px;
          z-index: 2;
          pointer-events: none;
        }
        .mvv-corner--tl { top: 36px; left: 36px; border-top: 1.5px solid rgba(201,168,76,.55); border-left: 1.5px solid rgba(201,168,76,.55); }
        .mvv-corner--tr { top: 36px; right: 36px; border-top: 1.5px solid rgba(201,168,76,.55); border-right: 1.5px solid rgba(201,168,76,.55); }
        .mvv-corner--bl { bottom: 36px; left: 36px; border-bottom: 1.5px solid rgba(201,168,76,.55); border-left: 1.5px solid rgba(201,168,76,.55); }
        .mvv-corner--br { bottom: 36px; right: 36px; border-bottom: 1.5px solid rgba(201,168,76,.55); border-right: 1.5px solid rgba(201,168,76,.55); }
        .mvv-hline {
          position: absolute;
          left: 80px; right: 80px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,76,.2) 20%, rgba(201,168,76,.2) 80%, transparent);
          z-index: 2;
          pointer-events: none;
          transform: scaleX(0);
          transition: transform 1s ease-out;
        }
        .mvv-hline--top { top: 80px; }
        .mvv-hline--bottom { bottom: 80px; }
        .mvv-hline.visible { transform: scaleX(1); }
        .mvv-watermark {
          position: absolute;
          font-size: clamp(8rem, 18vw, 16rem);
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px rgba(201,168,76,.04);
          letter-spacing: .15em;
          user-select: none;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .mvv-center {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
          max-width: 900px;
          padding: 0 40px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .8s ease-out, transform .8s ease-out;
        }
        .mvv-center.visible { opacity: 1; transform: translateY(0); }
        .mvv-label-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .mvv-gold-line {
          display: block;
          width: 40px;
          height: 1px;
          background: #c9a84c;
          opacity: .6;
        }
        .mvv-label {
          font-size: .65rem;
          letter-spacing: .35em;
          color: #c9a84c;
          text-transform: uppercase;
          font-weight: 600;
        }
        .mvv-headline {
          font-family: var(--font-serif);
          margin: 0;
          line-height: 0.95;
          letter-spacing: -.03em;
        }
        .mvv-h-outline {
          display: block;
          font-size: clamp(2.2rem, 3.8vw, 3.6rem);
          font-weight: 300;
          color: rgba(255,255,255,0.88);
        }
        .mvv-h-solid {
          display: block;
          font-size: clamp(2.8rem, 5vw, 4.8rem);
          font-weight: 300;
          font-style: italic;
          color: #c9a84c;
        }
        .mvv-sub {
          font-size: 1rem;
          color: rgba(255,255,255,.35);
          letter-spacing: .08em;
          margin: 0;
          font-weight: 300;
        }
        .mvv-badge-row {
          display: flex;
          gap: 24px;
          margin-top: 8px;
        }
        .mvv-badge {
          font-size: .65rem;
          letter-spacing: .3em;
          color: #c9a84c;
          text-transform: uppercase;
          font-weight: 600;
          opacity: .75;
        }
        .mvv-side {
          position: absolute;
          font-size: .55rem;
          letter-spacing: .3em;
          color: rgba(201,168,76,.25);
          text-transform: uppercase;
          font-weight: 600;
          z-index: 2;
          pointer-events: none;
        }
        .mvv-side--left {
          left: 20px;
          top: 50%;
          transform: translateX(-50%) translateY(-50%) rotate(-90deg);
          transform-origin: center;
        }
        .mvv-side--right {
          right: 20px;
          top: 50%;
          transform: translateX(50%) translateY(-50%) rotate(90deg);
          transform-origin: center;
        }
        @media (max-width: 640px) {
          .mvv-hline { left: 20px; right: 20px; }
          .mvv-hline--top { top: 60px; }
          .mvv-hline--bottom { bottom: 60px; }
          .mvv-corner--tl { top: 20px; left: 20px; }
          .mvv-corner--tr { top: 20px; right: 20px; }
          .mvv-corner--bl { bottom: 20px; left: 20px; }
          .mvv-corner--br { bottom: 20px; right: 20px; }
          .mvv-side { display: none; }
          .mvv-center { padding: 0 20px; gap: 14px; }
          .mvv-headline { line-height: 1.05; }
          .mvv-h-outline { font-size: clamp(1.7rem, 7.5vw, 2.2rem); }
          .mvv-h-solid { font-size: clamp(2rem, 9vw, 2.8rem); }
          .mvv-sub { font-size: .85rem; }
          .mvv-badge-row { gap: 10px; flex-wrap: wrap; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default MVVPage;
