import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface CTABannerProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  to?: string;
  showWhatsApp?: boolean;
  trustNote?: string;
}

export default function CTABanner({
  headline = 'Pronto para transformar sua operação?',
  description = 'Conte-nos sobre seu desafio. Nossa equipe vai entender seu cenário e propor a solução ideal — sem compromisso.',
  buttonText = 'Diagnosticar minha operação',
  to = '/contato-quiz',
  showWhatsApp = true,
  trustNote = 'Sem compromisso. Resposta em até 24h.',
}: CTABannerProps) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6"
        >
          {/* Overline */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-px bg-[#C9A84C]" />
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C9A84C] font-medium">
              Próximo passo
            </span>
            <div className="w-6 h-px bg-[#C9A84C]" />
          </div>

          {/* Headline */}
          <h2 className="text-2xl md:text-4xl font-serif font-light text-white leading-snug">
            {headline}
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed max-w-xl">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full sm:w-auto">
            <Link
              to={to}
              onClick={() => window.scrollTo(0, 0)}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3
                         bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] text-[#080808]
                         px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider
                         hover:shadow-[0_8px_32px_rgba(201,168,76,0.35)] transition-all duration-300"
            >
              {buttonText}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {showWhatsApp && (
              <a
                href="https://wa.me/5500000000000?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20da%20Inova."
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3
                           border border-white/20 text-white
                           px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider
                           hover:bg-white/[0.06] hover:border-white/30 transition-all duration-300"
              >
                <MessageCircle size={16} />
                Falar com especialista
              </a>
            )}
          </div>

          {/* Trust note */}
          {trustNote && (
            <p className="text-gray-500 text-xs mt-2">{trustNote}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
