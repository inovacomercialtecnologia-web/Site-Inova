import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

// ─── Minimal background — very faint lines, barely perceptible ────────────
function MinimalRays() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0%"   y1="0%"   x2="50%" y2="50%" stroke="rgba(160,130,50,0.08)" strokeWidth="1" />
      <line x1="100%" y1="0%"   x2="50%" y2="50%" stroke="rgba(160,130,50,0.08)" strokeWidth="1" />
      <line x1="0%"   y1="100%" x2="50%" y2="50%" stroke="rgba(160,130,50,0.08)" strokeWidth="1" />
      <line x1="100%" y1="100%" x2="50%" y2="50%" stroke="rgba(160,130,50,0.08)" strokeWidth="1" />
      <line x1="50%"  y1="0%"   x2="50%" y2="50%" stroke="rgba(160,130,50,0.04)" strokeWidth="0.7" />
      <line x1="50%"  y1="100%" x2="50%" y2="50%" stroke="rgba(160,130,50,0.04)" strokeWidth="0.7" />
    </svg>
  );
}

// ─── Animated SVG icons ───────────────────────────────────────────────────
function ProcessIcon() {
  return (
    <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
      className="w-full h-full text-[#C9A84C]">
      <motion.path d="M6 3v18M18 3v18M3 12h18"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} />
      <circle cx="12" cy="12" r="3" fill="rgba(201,168,76,0.10)" stroke="none" />
    </motion.svg>
  );
}

function MethodIcon() {
  return (
    <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
      className="w-full h-full text-[#C9A84C]">
      <motion.rect x="3" y="3" width="18" height="18" rx="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.2 }} />
      <motion.path d="M3 9h18M9 21V9"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.5 }} />
    </motion.svg>
  );
}

function TechIcon() {
  return (
    <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
      className="w-full h-full text-[#C9A84C]">
      <motion.path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.8 }} />
    </motion.svg>
  );
}

// ─── Spring config for the "snap into place" feel ────────────────────────
const SNAP = { stiffness: 110, damping: 16, restDelta: 0.001 };

export default function TriadeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // ─── Entry / exit curtains (disabled on mobile — previous section handles it) ─
  const entryCurtain = useTransform(scrollYProgress, [0, 0.01], isMobile ? [0, 0] : [1, 0]);
  const exitCurtain  = useTransform(scrollYProgress, [0.93, 1.0], isMobile ? [0, 0] : [0, 1]);

  // ─── Background rays ─────────────────────────────────────────────────────
  const raysOp = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  // ─── Soft gold radial breath ─────────────────────────────────────────────
  const bgPulse = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  // ─── Header (mobile: appears early but with readable pace) ───────────────
  // 220vh → 120vh effective. Each 1% ≈ 10px.
  const labelOp = useTransform(scrollYProgress, isMobile ? [0.02, 0.06] : [0.005, 0.04], [0, 1]);
  const labelY  = useTransform(scrollYProgress, isMobile ? [0.02, 0.06] : [0.005, 0.04], [20, 0]);
  const titleOp = useTransform(scrollYProgress, isMobile ? [0.04, 0.10] : [0.02, 0.07], [0, 1]);
  const titleSc = useTransform(scrollYProgress, isMobile ? [0.04, 0.10] : [0.02, 0.07], [0.62, 1]);

  // ─── Progress line ────────────────────────────────────────────────────────
  const lineScaleX = useTransform(scrollYProgress, [0.04, 0.84], [0, 1]);

  // ─── Exit ─────────────────────────────────────────────────────────────────
  const exitSc      = useTransform(scrollYProgress, [0.88, 1.0], [1, isMobile ? 1.02 : 1.07]);
  const exitOp      = useTransform(scrollYProgress, [0.88, 1.0], [1, 0]);
  const exitBlurNum = useTransform(scrollYProgress, [0.88, 1.0], isMobile ? [0, 0] : [0, 14]);
  const exitBlur    = useTransform(exitBlurNum, (v: number) => `blur(${v}px)`);

  // ════════════════════════════════════════════════════════════════════════
  // CARD 1 — PROCESSO — enters from top-left
  // Mobile 220vh: 120vh effective scroll. Cards spaced 15→55%.
  // ════════════════════════════════════════════════════════════════════════
  const rawC1RotY = useTransform(scrollYProgress, isMobile ? [0.15, 0.28] : [0.18, 0.32], isMobile ? [0, 0] : [-28, 0]);
  const rawC1RotX = useTransform(scrollYProgress, isMobile ? [0.15, 0.28] : [0.18, 0.32], isMobile ? [0, 0] : [-10, 0]);
  const rawC1X    = useTransform(scrollYProgress, isMobile ? [0.15, 0.28] : [0.18, 0.32], isMobile ? [-30, 0] : [-80, 0]);
  const rawC1Op   = useTransform(scrollYProgress, isMobile ? [0.15, 0.25] : [0.18, 0.30], [0, 1]);

  const c1RotY = useSpring(rawC1RotY, SNAP);
  const c1RotX = useSpring(rawC1RotX, SNAP);
  const c1X    = useSpring(rawC1X,    SNAP);

  // ════════════════════════════════════════════════════════════════════════
  // CARD 2 — METODOLOGIA — enters from top-right
  // ════════════════════════════════════════════════════════════════════════
  const rawC2RotY = useTransform(scrollYProgress, isMobile ? [0.30, 0.43] : [0.30, 0.44], isMobile ? [0, 0] : [28, 0]);
  const rawC2RotX = useTransform(scrollYProgress, isMobile ? [0.30, 0.43] : [0.30, 0.44], isMobile ? [0, 0] : [-10, 0]);
  const rawC2X    = useTransform(scrollYProgress, isMobile ? [0.30, 0.43] : [0.30, 0.44], isMobile ? [30, 0] : [80, 0]);
  const rawC2Op   = useTransform(scrollYProgress, isMobile ? [0.30, 0.40] : [0.30, 0.42], [0, 1]);

  const c2RotY = useSpring(rawC2RotY, SNAP);
  const c2RotX = useSpring(rawC2RotX, SNAP);
  const c2X    = useSpring(rawC2X,    SNAP);

  // ════════════════════════════════════════════════════════════════════════
  // CARD 3 — TECNOLOGIA — enters from below
  // ════════════════════════════════════════════════════════════════════════
  const rawC3RotX = useTransform(scrollYProgress, isMobile ? [0.45, 0.58] : [0.42, 0.56], isMobile ? [0, 0] : [20, 0]);
  const rawC3Y    = useTransform(scrollYProgress, isMobile ? [0.45, 0.58] : [0.42, 0.56], isMobile ? [30, 0] : [80, 0]);
  const rawC3Op   = useTransform(scrollYProgress, isMobile ? [0.45, 0.55] : [0.42, 0.53], [0, 1]);

  const c3RotX = useSpring(rawC3RotX, SNAP);
  const c3Y    = useSpring(rawC3Y,    SNAP);

  return (
    <section ref={sectionRef} style={{ height: isMobile ? '220vh' : '300vh' }} className="relative">

      {/* ── Sticky viewport ─────────────────────────────────────────────── */}
      <motion.div
        style={{ scale: exitSc, opacity: exitOp, filter: exitBlur, background: '#F5F2EC' }}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center pt-20 md:pt-24 pb-6 md:pb-10"
      >

        {/* Minimal rays */}
        <motion.div style={{ opacity: raysOp }} className="absolute inset-0 pointer-events-none">
          <MinimalRays />
        </motion.div>

        {/* Gold breath at center */}
        <motion.div
          style={{
            opacity: bgPulse,
            background: 'radial-gradient(ellipse 46% 46% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)',
          }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Progress line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-black/[0.08] z-20">
          <motion.div
            style={{ scaleX: lineScaleX, transformOrigin: 'left' }}
            className="h-full bg-gradient-to-r from-[#C9A84C]/60 via-[#D4AF37] to-[#C9A84C]/60"
          />
        </div>

        {/* Curtains — entry starts black (matching ImpactCarousel exit) then blends away */}
        <motion.div style={{ opacity: entryCurtain }}
          className="absolute inset-0 z-40 pointer-events-none bg-black" />
        <motion.div style={{ opacity: exitCurtain }}
          className="absolute inset-0 z-40 pointer-events-none bg-black" />

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

          {/* Header */}
          <div className="text-center mb-3 md:mb-6 lg:mb-8">
            <motion.p style={{ opacity: labelOp, y: labelY }}
              className="text-[#C9A84C] text-[10px] md:text-xs font-medium uppercase tracking-[0.32em] mb-2 md:mb-4">
              O Método
            </motion.p>
            <motion.h2 style={{ opacity: titleOp, scale: titleSc }}
              className="text-[clamp(1.4rem,5vw,3.8rem)]
                         font-serif font-light text-black tracking-tight leading-[1.05] md:leading-[0.92]">
              A Tríade da{' '}
              <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent">
                Transformação
              </span>
            </motion.h2>
          </div>

          {/* ── Bento Grid — perspective parent for 3D snap ──────────────── */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
            style={{ perspective: '1100px', perspectiveOrigin: '50% 40%' }}
          >

            {/* ── Card 1 — PROCESSO ── enters from left, Y-rotated ── */}
            <motion.div
              style={{ rotateY: c1RotY, rotateX: c1RotX, x: c1X, opacity: rawC1Op }}
            >
              <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 lg:p-6 h-full
                              bg-white border-l-[3px] border-l-[#C9A84C]
                              shadow-[0_2px_20px_rgba(0,0,0,0.07)]
                              group transition-all duration-600
                              hover:-translate-y-1
                              hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(201,168,76,0.18)]">
                <div className="absolute -top-2 right-3 opacity-[0.05] text-[90px] md:text-[110px]
                                font-serif font-black leading-none pointer-events-none select-none text-black">
                  01
                </div>
                <div className="absolute inset-0 rounded-2xl
                                bg-gradient-to-br from-[#C9A84C]/0 to-transparent
                                group-hover:from-[#C9A84C]/[0.03]
                                transition-colors duration-700 pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-6 h-6 md:w-7 md:h-7 mb-2 md:mb-3"><ProcessIcon /></div>
                  <h3 className="text-sm md:text-base font-serif font-normal text-black mb-0.5 md:mb-1 tracking-tight">PROCESSO</h3>
                  <p className="text-[#C9A84C] text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.28em] mb-1.5 md:mb-2">
                    Mapeamento da sua operação
                  </p>
                  <p className="text-gray-500 text-[11px] md:text-xs leading-snug font-light max-w-xl line-clamp-3 md:line-clamp-none">
                    Entendemos como sua empresa funciona, identificando gargalos e documentando
                    fluxos que hoje são invisíveis.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Card 2 — METODOLOGIA ── enters from right, opposite Y-rotation ── */}
            <motion.div
              style={{ rotateY: c2RotY, rotateX: c2RotX, x: c2X, opacity: rawC2Op }}
            >
              <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 lg:p-6 h-full
                              bg-white border-l-[3px] border-l-[#C9A84C]
                              shadow-[0_2px_20px_rgba(0,0,0,0.07)]
                              group transition-all duration-600
                              hover:-translate-y-1
                              hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(201,168,76,0.18)]">
                <div className="absolute -top-2 right-3 opacity-[0.05] text-[90px] md:text-[110px]
                                font-serif font-black leading-none pointer-events-none select-none text-black">
                  02
                </div>
                <div className="absolute inset-0 rounded-2xl
                                bg-gradient-to-br from-[#C9A84C]/0 to-transparent
                                group-hover:from-[#C9A84C]/[0.03]
                                transition-colors duration-700 pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-6 h-6 md:w-7 md:h-7 mb-2 md:mb-3"><MethodIcon /></div>
                  <h3 className="text-sm md:text-base font-serif font-normal text-black mb-0.5 md:mb-1 tracking-tight">METODOLOGIA</h3>
                  <p className="text-[#C9A84C] text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.28em] mb-1.5 md:mb-2">
                    Estruturação
                  </p>
                  <p className="text-gray-500 text-[11px] md:text-xs leading-snug font-light line-clamp-3 md:line-clamp-none">
                    Transformamos o conhecimento em processos replicáveis e mensuráveis,
                    tornando a operação independente de pessoas específicas.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Card 3 — TECNOLOGIA ── enters from below, X-rotation (forward tilt) ── */}
            <motion.div
              style={{ rotateX: c3RotX, y: c3Y, opacity: rawC3Op }}
              className="md:col-span-2"
            >
              <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 lg:p-6
                              bg-[#0A0A0A] border-l-[3px] border-l-[#C9A84C]
                              shadow-[0_4px_32px_rgba(0,0,0,0.22)]
                              group transition-all duration-600
                              hover:-translate-y-1
                              hover:shadow-[0_16px_56px_-12px_rgba(0,0,0,0.40),0_0_0_1px_rgba(201,168,76,0.20)]">
                <div className="absolute -top-2 right-5 opacity-[0.04] text-[150px]
                                font-serif font-black leading-none pointer-events-none select-none text-white">
                  03
                </div>
                <div className="absolute inset-0 rounded-2xl
                                bg-gradient-to-br from-[#C9A84C]/0 to-transparent
                                group-hover:from-[#C9A84C]/[0.05]
                                transition-colors duration-700 pointer-events-none" />
                <div className="relative z-10 flex flex-row items-center gap-3 md:flex-col md:items-start md:gap-0 lg:flex-row lg:items-center lg:gap-14">
                  <div className="w-7 h-7 md:w-11 md:h-11 flex-shrink-0"><TechIcon /></div>
                  <div className="flex-1">
                    <h3 className="text-sm md:text-3xl lg:text-[2.2rem] font-serif font-normal text-white mb-1 md:mb-2 tracking-tight">
                      TECNOLOGIA
                    </h3>
                    <p className="text-[#C9A84C] text-[9px] font-semibold uppercase tracking-[0.28em] mb-1 md:mb-4">
                      Desenvolvimento da Solução
                    </p>
                    <p className="hidden md:block text-gray-400 text-sm md:text-base leading-relaxed font-light max-w-3xl">
                      Construímos a solução — Web, Mobile, Automação ou IA — desenhada especificamente
                      para a metodologia estruturada para o seu negócio. Onde o processo vira sistema
                      e o sistema vira resultado.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <motion.a href="/contato-quiz"
                      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                      className="w-9 h-9 md:w-14 md:h-14 rounded-full
                                 bg-gradient-to-br from-[#C9A84C] to-[#E5C05C]
                                 flex items-center justify-center text-black
                                 hover:shadow-[0_0_28px_rgba(201,168,76,0.40)]
                                 transition-shadow duration-500 group/btn">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform duration-500" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
