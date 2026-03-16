import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

const cards = [
  {
    category: "PROCESSO",
    title: "O processo vive na cabeça do dono",
    description: "Quando o colaborador sai, o conhecimento vai junto. Nada documentado. Nada replicável. A operação depende de pessoa, não de método.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "TECNOLOGIA",
    title: "O sistema genérico não foi feito para você",
    description: "Foi construído para servir todo mundo. Por isso não resolve ninguém de verdade. Você adapta sua operação ao sistema, quando deveria ser o contrário.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "DADOS",
    title: "O dado não reflete o que acontece de verdade",
    description: "Dashboard bonito, número que ninguém confia. Indicador que não indica nada. Relatório que gera mais dúvida do que decisão.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "GESTÃO",
    title: "A decisão ainda é no achismo",
    description: "Sem processo estruturado, toda decisão vira intuição. O empresário continua apagando incêndio e a operação continua refém do improviso.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function ImpactCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const outerRef  = useRef<HTMLDivElement>(null);

  // ─── motion value for measured scroll distance (reactive to resize) ───
  const scrollDistMV = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current && outerRef.current) {
        const d = Math.max(0, trackRef.current.scrollWidth - outerRef.current.clientWidth);
        scrollDistMV.set(d);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [scrollDistMV]);

  // ─── master scroll progress ───────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // ─── entry curtain ───────────────────────────────────────────────────
  const entryCurtain = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  // ─── text phase (no separate phase — stays as header) ──────────────
  const textGroupOp = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const textGroupY  = useTransform(scrollYProgress, [0, 1], [0, 0]);

  const line1Op = useTransform(scrollYProgress, [0.01, 0.08], [0, 1]);
  const line1X  = useTransform(scrollYProgress, [0.01, 0.08], [-40, 0]);
  const line2Op = useTransform(scrollYProgress, [0.03, 0.10], [0, 1]);
  const line2X  = useTransform(scrollYProgress, [0.03, 0.10], [40, 0]);

  const paraOp = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const paraY  = useTransform(scrollYProgress, [0, 1], [0, 0]);

  const scrollHintOp = useTransform(scrollYProgress, [0, 1], [0, 0]);

  // ─── cards phase (visible from start) ──────────────────────────────
  const cardsGroupOp = useTransform(scrollYProgress, [0.02, 0.10], [0, 1]);
  const cardsGroupY  = useTransform(scrollYProgress, [0.02, 0.10], [30, 0]);

  // horizontal scroll driven by vertical scroll
  const rawX = useTransform(
    [scrollYProgress, scrollDistMV] as const,
    ([yP, dist]: number[]) => {
      const t = Math.max(0, Math.min(1, (yP - 0.08) / (0.82 - 0.08)));
      return -dist * t;
    }
  );
  const isMobile = useIsMobile();
  const cardsX = useSpring(rawX, { stiffness: isMobile ? 60 : 90, damping: isMobile ? 26 : 22, restDelta: 0.5 });

  const cardsHintOp = useTransform(scrollYProgress, [0.06, 0.14], [0.45, 0]);

  // ─── progress line ───────────────────────────────────────────────────
  const lineScaleX = useTransform(scrollYProgress, [0.03, 0.84], [0, 1]);

  // ─── exit ─────────────────────────────────────────────────────────────
  const exitScale   = useTransform(scrollYProgress, [0.84, 1.0], [1, 0.96]);
  const exitOp      = useTransform(scrollYProgress, [0.84, 1.0], [1, 0]);
  const exitBlurNum = useTransform(scrollYProgress, [0.84, 1.0], [0, 10]);
  const exitFilter  = useTransform(exitBlurNum, (v: number) => `blur(${v}px)`);
  const exitCurtain = useTransform(scrollYProgress, [0.86, 1.0], [0, 1]);

  return (
    <section ref={sectionRef} style={{ height: '110vh' }} className="relative">

      {/* ── Sticky viewport ── */}
      <motion.div
        style={{ scale: exitScale, opacity: exitOp, filter: exitFilter }}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#030303] flex flex-col"
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            opacity: 0.28,
          }}
        />
        {/* Edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(0,0,0,0.75) 100%)' }}
        />

        {/* Progress line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.05] z-20">
          <motion.div
            style={{ scaleX: lineScaleX, transformOrigin: 'left' }}
            className="h-full bg-gradient-to-r from-[#C9A84C]/50 via-[#FDE047] to-[#C9A84C]/50"
          />
        </div>

        {/* Entry curtain */}
        <motion.div style={{ opacity: entryCurtain }} className="absolute inset-0 bg-black z-40 pointer-events-none" />
        {/* Exit curtain */}
        <motion.div style={{ opacity: exitCurtain }} className="absolute inset-0 bg-black z-40 pointer-events-none" />

        {/* ══════════════════════════════════════
            CONTENT — heading + cards in one phase
        ══════════════════════════════════════ */}
        <motion.div
          style={{ opacity: cardsGroupOp, y: cardsGroupY }}
          className="absolute inset-0 z-[6] flex flex-col justify-center"
        >
          {/* Collapsed heading */}
          <div className="px-6 md:px-12 lg:px-24 mb-8 md:mb-10">
            <p className="text-[#D4AF37] text-[9px] md:text-[10px] font-medium uppercase tracking-[0.38em] mb-2.5">
              POR QUE O SISTEMA SOZINHO NÃO RESOLVE
            </p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <span className="text-xl md:text-2xl lg:text-[1.7rem] font-serif font-light text-white leading-tight">
                Você não tem problema de tecnologia.
              </span>
              <span className="text-xl md:text-2xl lg:text-[1.7rem] font-serif font-light leading-tight
                               bg-gradient-to-r from-[#D4AF37] to-[#FDE047] bg-clip-text text-transparent">
                Tem problema de processo.
              </span>
            </div>
          </div>

          {/* Cards horizontal track */}
          <div ref={outerRef} className="w-full overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x: cardsX }}
              className="flex gap-5 md:gap-6 w-max
                         pl-6 md:pl-12 lg:pl-24
                         pr-6 md:pr-12 lg:pr-24"
            >
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="w-[calc(100vw-48px)] sm:w-[270px] md:w-[320px] lg:w-[360px] flex-shrink-0 group cursor-pointer"
                >
                  <div className="flex flex-col rounded-2xl border border-white/[0.06]
                                  bg-white/[0.015] overflow-hidden
                                  transition-all duration-500
                                  hover:border-[#C9A84C]/40 hover:bg-white/[0.03]
                                  hover:shadow-[0_20px_48px_-15px_rgba(201,168,76,0.13)]">
                    {/* Image */}
                    <div className="relative h-[148px] bg-[#0d0d0d] overflow-hidden flex-shrink-0">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover grayscale
                                   transition-transform duration-1000 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 mix-blend-overlay
                                      bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/15
                                      transition-colors duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                      <span className="absolute bottom-3 left-4 text-[9px] font-bold uppercase
                                       tracking-[0.28em]
                                       bg-gradient-to-r from-[#C9A84C] to-[#E5C05C]
                                       bg-clip-text text-transparent">
                        {card.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-[1rem] font-serif font-light text-white mb-2.5
                                     leading-snug
                                     group-hover:text-[#C9A84C] transition-colors duration-500">
                        {card.title}
                      </h3>
                      <p className="text-gray-500 text-[0.78rem] leading-relaxed mb-4 flex-grow">
                        {card.description}
                      </p>
                      <div className="flex items-center gap-2 mt-auto
                                      text-[0.65rem] font-semibold uppercase tracking-[0.2em]
                                      text-gray-600 group-hover:text-[#C9A84C]
                                      transition-colors duration-500">
                        Fale com nossa equipe
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.p
            style={{ opacity: cardsHintOp }}
            className="text-center text-white/20 text-[9px] uppercase tracking-widest mt-7 font-light"
          >
            ↔ arraste ou continue rolando para explorar
          </motion.p>
        </motion.div>

      </motion.div>
    </section>
  );
}
