import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

const E = [0.22, 1, 0.36, 1] as const;

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

const steps = [
  {
    num: '01',
    Icon: ProcessIcon,
    title: 'PROCESSO',
    subtitle: 'Mapeamento da sua operação',
    description: 'Entendemos como sua empresa funciona, identificando gargalos e documentando fluxos que hoje são invisíveis.',
  },
  {
    num: '02',
    Icon: MethodIcon,
    title: 'METODOLOGIA',
    subtitle: 'Estruturação',
    description: 'Transformamos o conhecimento em processos replicáveis e mensuráveis, tornando a operação independente de pessoas específicas.',
  },
  {
    num: '03',
    Icon: TechIcon,
    title: 'TECNOLOGIA',
    subtitle: 'Desenvolvimento da Solução',
    description: 'Construímos a solução — Web, Mobile, Automação ou IA — desenhada especificamente para a metodologia estruturada para o seu negócio.',
  },
];

export default function TriadeSection() {
  const isMobile = useIsMobile();

  return (
    <section className="py-20 md:py-28 bg-[#F5F2EC] px-6 md:px-12 lg:px-24 relative overflow-hidden">

      {/* Minimal background rays */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
        preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0%" y1="0%" x2="50%" y2="50%" stroke="rgb(160,130,50)" strokeWidth="1" />
        <line x1="100%" y1="0%" x2="50%" y2="50%" stroke="rgb(160,130,50)" strokeWidth="1" />
        <line x1="0%" y1="100%" x2="50%" y2="50%" stroke="rgb(160,130,50)" strokeWidth="1" />
        <line x1="100%" y1="100%" x2="50%" y2="50%" stroke="rgb(160,130,50)" strokeWidth="1" />
      </svg>

      {/* Gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 46% 46% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: E }}
            className="text-[#C9A84C] text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] mb-4"
          >
            O Método
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: E, delay: 0.08 }}
            className="font-serif font-light text-black tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3.5rem)' }}
          >
            A Tríade da{' '}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent">
              Transformação
            </span>
          </motion.h2>
        </div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-6 lg:gap-8 relative">

            {/* Connecting line behind cards */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.2, ease: E, delay: 0.3 }}
              className="absolute top-[52px] left-[16%] right-[16%] h-px bg-gradient-to-r from-[#C9A84C]/40 via-[#C9A84C] to-[#C9A84C]/40 z-0"
              style={{ transformOrigin: 'left' }}
            />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: E, delay: 0.1 + i * 0.15 }}
                className="relative z-10"
              >
                <div className={`rounded-2xl p-6 lg:p-8 h-full
                                transition-all duration-500 group
                                hover:-translate-y-1
                                ${i === 2
                                  ? 'bg-[#0A0A0A] border-l-[3px] border-l-[#C9A84C] shadow-[0_4px_32px_rgba(0,0,0,0.22)] hover:shadow-[0_16px_56px_-12px_rgba(0,0,0,0.40)]'
                                  : 'bg-white border-l-[3px] border-l-[#C9A84C] shadow-[0_2px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)]'
                                }`}>

                  {/* Step number watermark */}
                  <div className={`absolute -top-2 right-3 text-[80px] lg:text-[100px] font-serif font-black
                                   leading-none pointer-events-none select-none
                                   ${i === 2 ? 'text-white opacity-[0.04]' : 'text-black opacity-[0.05]'}`}
                    aria-hidden="true">
                    {step.num}
                  </div>

                  {/* Icon */}
                  <div className="w-8 h-8 lg:w-10 lg:h-10 mb-4">
                    <step.Icon />
                  </div>

                  {/* Title */}
                  <h3 className={`text-base lg:text-lg font-serif font-normal tracking-tight mb-1
                                  ${i === 2 ? 'text-white' : 'text-black'}`}>
                    {step.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-[#C9A84C] text-[10px] font-semibold uppercase tracking-[0.28em] mb-3">
                    {step.subtitle}
                  </p>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed font-light
                                 ${i === 2 ? 'text-gray-400' : 'text-gray-500'}`}>
                    {step.description}
                  </p>

                  {/* CTA on last card */}
                  {i === 2 && (
                    <Link to="/contato-quiz" className="mt-5 inline-block">
                      <motion.div
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E5C05C]
                                   flex items-center justify-center text-black
                                   hover:shadow-[0_0_28px_rgba(201,168,76,0.40)] transition-shadow duration-500"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden relative pl-8">

          {/* Vertical gold line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1, ease: E, delay: 0.2 }}
            className="absolute left-[11px] top-4 bottom-4 w-px bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/50 to-transparent"
            style={{ transformOrigin: 'top' }}
          />

          <div className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease: E, delay: i * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-8 top-6 w-[9px] h-[9px] rounded-full bg-[#C9A84C]
                                ring-4 ring-[#F5F2EC]" />

                <div className={`rounded-xl p-5 ${
                  i === 2
                    ? 'bg-[#0A0A0A] border-l-[3px] border-l-[#C9A84C] shadow-lg'
                    : 'bg-white border-l-[3px] border-l-[#C9A84C] shadow-md'
                }`}>

                  {/* Icon + Number row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 flex-shrink-0"><step.Icon /></div>
                    <span className={`text-[10px] font-bold tracking-[0.2em]
                                      ${i === 2 ? 'text-white/20' : 'text-black/10'}`}>
                      {step.num}
                    </span>
                  </div>

                  <h3 className={`text-sm font-serif font-normal tracking-tight mb-0.5
                                  ${i === 2 ? 'text-white' : 'text-black'}`}>
                    {step.title}
                  </h3>
                  <p className="text-[#C9A84C] text-[9px] font-semibold uppercase tracking-[0.28em] mb-2">
                    {step.subtitle}
                  </p>
                  <p className={`text-xs leading-relaxed font-light
                                 ${i === 2 ? 'text-gray-400' : 'text-gray-500'}`}>
                    {step.description}
                  </p>

                  {i === 2 && (
                    <Link to="/contato-quiz" className="mt-4 inline-flex items-center gap-2
                                                         text-[10px] font-semibold uppercase tracking-[0.2em]
                                                         text-[#C9A84C]">
                      Começar agora
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
