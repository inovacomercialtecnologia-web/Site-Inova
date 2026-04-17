import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageCircle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import { useCountUp, parseMetric } from '../hooks/useCountUp';
import NeuralBackground from './NeuralBackground';
import { Logo } from './Logo';

const E = [0.22, 1, 0.36, 1] as const;

const metrics = [
  { raw: '100+', label: 'Projetos entregues' },
  { raw: '140h', label: 'Economizadas/cliente' },
  { raw: '68%', label: 'Menos retrabalho' },
];

// Word-by-word mask reveal component
function MaskRevealLine({ children, baseDelay, className }: {
  children: string;
  baseDelay: number;
  className?: string;
}) {
  const words = children.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 0.6, ease: E, delay: baseDelay + i * 0.08 }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

// Count-up metric badge
function MetricBadge({ raw, label, delay }: { raw: string; label: string; delay: number }) {
  const { value, suffix } = parseMetric(raw);
  const { display, ref } = useCountUp(value, { duration: 1500, delay, suffix });

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className="text-[#C9A84C] text-2xl md:text-3xl font-bold tracking-tight"
      >
        {display}
      </span>
      <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#080808] px-6 md:px-12 lg:px-24 overflow-hidden">

      {/* Neural particle background */}
      <NeuralBackground
        className="absolute inset-0 z-[1]"
        opacity={0.30}
        nodeCount={60}
        connectionDist={170}
        color="201, 168, 76"
      />

      {/* Ghost logo watermark */}
      {!isMobile && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] z-[2] pointer-events-none"
          style={{ opacity: 0.03 }}
        >
          <Logo color="#C9A84C" />
        </motion.div>
      )}

      {/* Edge vignette */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-24 md:py-32">

        {/* Supertitle */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E, delay: 0.1 }}
          className="text-[#C9A84C] text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] mb-6 md:mb-8 block"
        >
          Inteligência operacional aplicada
        </motion.span>

        {/* Headline — mask reveal */}
        <h1 className="font-serif font-light text-white tracking-tight leading-[1.08] md:leading-[1.02] mb-10 md:mb-12"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}>
          <MaskRevealLine baseDelay={0.2}>
            Não vendemos sistema.
          </MaskRevealLine>
          <br />
          <motion.span
            className="inline-block bg-gradient-to-r from-[#C9A84C] via-[#E5C05C] to-[#C9A84C] bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% auto',
            }}
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{
              clipPath: 'inset(0% 0 0 0)',
              backgroundPosition: ['0% center', '200% center'],
            }}
            transition={{
              clipPath: { duration: 0.55, ease: E, delay: 0.35 },
              backgroundPosition: { duration: 3, ease: 'linear', delay: 0.5, repeat: Infinity },
            }}
          >
            Construímos o seu.
          </motion.span>
        </h1>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 12 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: E, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/contato-quiz"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3
                       bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] text-black
                       px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider
                       hover:shadow-[0_8px_32px_rgba(201,168,76,0.4)] transition-all duration-300
                       min-h-[52px]"
            style={{ animation: 'ctaPulse 2.5s ease-in-out infinite' }}
          >
            <MessageCircle size={16} />
            Falar com especialista
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Social proof metrics — count-up */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: E, delay: 0.75 }}
          className="flex items-center justify-center gap-6 md:gap-10 mt-14 md:mt-16"
        >
          {metrics.map((m, i) => (
            <MetricBadge key={i} raw={m.raw} label={m.label} delay={900 + i * 120} />
          ))}
        </motion.div>
      </div>

      {/* Scroll hint — animated chevrons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, 4, 0],
              opacity: [0.2 + i * 0.15, 0.6, 0.2 + i * 0.15],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          >
            <ChevronDown className="w-5 h-5 text-[#C9A84C]" strokeWidth={1.5} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
