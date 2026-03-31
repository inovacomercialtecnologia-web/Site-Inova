import React, { useMemo } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useMagnetic } from '../hooks/useMagnetic';

const E = [0.22, 1, 0.36, 1] as const;

interface CTABannerProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  to?: string;
  showWhatsApp?: boolean;
  trustNote?: string;
}

// Floating gold particles
function FloatingParticles({ count }: { count: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 2 + Math.random() * 2,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 5,
      opacityMax: 0.1 + Math.random() * 0.2,
    })),
  [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#C9A84C]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: '-5%',
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight * 0.5 : 500)],
            opacity: [0, p.opacityMax, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

export default function CTABanner({
  headline = 'Sua operação merece mais do que um sistema genérico.',
  description = 'Conte-nos sobre seu desafio. Nossa equipe vai entender seu cenário e propor a solução ideal — sem compromisso.',
  buttonText = 'Diagnosticar minha operação',
  to = '/contato-quiz',
  showWhatsApp = true,
  trustNote = 'Diagnóstico gratuito. Resposta em até 24h. Zero pressão.',
}: CTABannerProps) {
  const isMobile = useIsMobile();
  const magnetic = useMagnetic({ strength: 0.2, radius: 100 });
  const particleCount = isMobile ? 4 : 10;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles count={particleCount} />

      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A84C]/[0.03] to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="absolute inset-0 border-t border-b border-white/[0.04]" />

      <div className="relative max-w-3xl mx-auto px-6 md:px-12 text-center">

        {/* Overline — stagger 0 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: E }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-6 h-px bg-[#C9A84C]" />
          <span className="text-[10px] uppercase tracking-[0.34em] text-[#C9A84C] font-medium">
            Próximo passo
          </span>
          <div className="w-6 h-px bg-[#C9A84C]" />
        </motion.div>

        {/* Headline — stagger 80ms */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: E, delay: 0.08 }}
          className="text-2xl md:text-4xl font-serif font-light text-white leading-snug mb-6"
        >
          {headline}
        </motion.h2>

        {/* Description — stagger 160ms */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: E, delay: 0.16 }}
          className="text-sm md:text-base text-gray-400 font-light leading-relaxed max-w-xl mx-auto mb-8"
        >
          {description}
        </motion.p>

        {/* CTAs — stagger 240ms */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: E, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          {...(!isMobile ? magnetic.handlers : {})}
        >
          <div
            ref={!isMobile ? magnetic.ref : undefined}
            style={!isMobile ? magnetic.style : undefined}
            className="hidden sm:block"
          >
            <Link
              to={to}
              onClick={() => window.scrollTo(0, 0)}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3
                         bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] text-[#080808]
                         px-6 sm:px-8 py-4 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wide sm:tracking-wider
                         hover:shadow-[0_8px_32px_rgba(201,168,76,0.35)] transition-all duration-300"
              style={{ animation: 'ctaPulse 2.5s ease-in-out infinite' }}
            >
              {buttonText}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {showWhatsApp && (
            <Link
              to="/contato-quiz"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3
                         bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] text-[#080808]
                         sm:bg-none sm:bg-transparent sm:text-white sm:border sm:border-white/20
                         px-6 sm:px-8 py-4 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wide sm:tracking-wider
                         hover:shadow-[0_8px_32px_rgba(201,168,76,0.35)] sm:hover:shadow-none sm:hover:bg-white/[0.06] sm:hover:border-white/30 transition-all duration-300"
              style={isMobile ? { animation: 'ctaPulse 2.5s ease-in-out infinite' } : undefined}
            >
              <MessageCircle size={16} />
              Falar com especialista
            </Link>
          )}
        </motion.div>

        {/* Trust note — stagger 320ms */}
        {trustNote && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: E, delay: 0.32 }}
            className="text-gray-500 text-xs mt-6"
          >
            {trustNote}
          </motion.p>
        )}
      </div>
    </section>
  );
}
