import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

const E = [0.22, 1, 0.36, 1] as const;

const metrics = [
  { value: '50+', label: 'Projetos entregues' },
  { value: '140h', label: 'Economizadas/cliente' },
  { value: '68%', label: 'Menos retrabalho' },
];

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#080808] px-6 md:px-12 lg:px-24 overflow-hidden">

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gold radial pulse — center */}
        <motion.div
          animate={{
            opacity: [0.04, 0.08, 0.04],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.15) 0%, transparent 60%)',
          }}
        />
        {/* Secondary accent — top right */}
        <motion.div
          animate={{
            opacity: [0.03, 0.06, 0.03],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 65%)',
          }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.10) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            opacity: 0.2,
          }}
        />
        {/* Edge vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-24 md:py-32">

        {/* Supertitle */}
        <motion.span
          initial={{ opacity: 0, y: isMobile ? 12 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E, delay: 0.1 }}
          className="text-[#C9A84C] text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] mb-6 md:mb-8 block"
        >
          Inova Systems Solutions
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: isMobile ? 12 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: E, delay: 0.2 }}
          className="font-serif font-light text-white tracking-tight leading-[1.08] md:leading-[1.02] mb-6 md:mb-8"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
        >
          Não vendemos sistema.
          <br />
          <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent">
            Construímos o seu.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: isMobile ? 12 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E, delay: 0.35 }}
          className="text-gray-300 text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12"
        >
          Processo estruturado. Metodologia aplicada. Tecnologia sob medida para o seu negócio.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 12 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/contato-quiz"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3
                       bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] text-black
                       px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider
                       hover:shadow-[0_8px_32px_rgba(201,168,76,0.4)] transition-all duration-300
                       min-h-[52px]"
          >
            Diagnosticar minha operação
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://wa.me/5500000000000?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20da%20Inova."
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3
                       border border-white/20 text-white
                       px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider
                       hover:bg-white/[0.06] hover:border-white/30 transition-all duration-300
                       min-h-[52px]"
          >
            <MessageCircle size={16} />
            Falar com especialista
          </a>
        </motion.div>

        {/* Social proof metrics */}
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 12 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E, delay: 0.65 }}
          className="flex items-center justify-center gap-6 md:gap-10 mt-14 md:mt-16"
        >
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[#C9A84C] text-2xl md:text-3xl font-bold tracking-tight">
                {m.value}
              </span>
              <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider font-medium">
                {m.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
