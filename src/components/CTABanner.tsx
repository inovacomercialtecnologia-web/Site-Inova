import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface CTABannerProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  to?: string;
}

export default function CTABanner({
  headline = 'Pronto para transformar sua operação?',
  description = 'Conte-nos sobre seu desafio. Nossa equipe vai entender seu cenário e propor a solução ideal — sem compromisso.',
  buttonText = 'Iniciar conversa',
  to = '/contato-quiz',
}: CTABannerProps) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A84C]/[0.03] to-transparent" />
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
          <h2 className="text-2xl md:text-4xl font-light text-white leading-snug">
            {headline}
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed max-w-xl">
            {description}
          </p>

          {/* CTA Button */}
          <Link
            to={to}
            onClick={() => window.scrollTo(0, 0)}
            className="group mt-4 inline-flex items-center gap-3 bg-[#C9A84C] text-[#080808] px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-[#E8C97A] transition-all duration-300 shadow-lg shadow-[#C9A84C]/10"
          >
            {buttonText}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
