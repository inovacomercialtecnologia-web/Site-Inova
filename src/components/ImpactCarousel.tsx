import React from 'react';
import { motion } from 'motion/react';
import { useIsMobile } from '../hooks/useIsMobile';

const E = [0.22, 1, 0.36, 1] as const;

const cards = [
  {
    category: 'PROCESSO',
    title: 'O processo vive na cabeça do dono',
    description: 'Quando o colaborador sai, o conhecimento vai junto. Nada documentado, nada replicável.',
  },
  {
    category: 'TECNOLOGIA',
    title: 'O sistema genérico não foi feito para você',
    description: 'Você adapta sua operação ao sistema, quando deveria ser o contrário.',
  },
  {
    category: 'DADOS',
    title: 'O dado não reflete o que acontece de verdade',
    description: 'Dashboard bonito, número que ninguém confia. Relatório que gera mais dúvida do que decisão.',
  },
  {
    category: 'GESTÃO',
    title: 'A decisão ainda é no achismo',
    description: 'Sem processo estruturado, toda decisão vira intuição. A operação continua refém do improviso.',
  },
];

export default function ProblemSolution() {
  const isMobile = useIsMobile();

  return (
    <section className="py-20 md:py-28 bg-[#080808] px-6 md:px-12 lg:px-24 relative overflow-hidden">

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.10) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.15,
        }}
      />

      <div className="relative max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: Text content */}
          <div className="lg:sticky lg:top-32">
            <motion.p
              initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: E }}
              className="text-[#C9A84C] text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] mb-6 md:mb-8
                         flex items-center gap-3"
            >
              <span className="w-6 h-px bg-[#C9A84C]/50 flex-shrink-0" />
              Por que o sistema sozinho não resolve
            </motion.p>

            <div className="mb-8 md:mb-10">
              <motion.h2
                initial={{ opacity: 0, x: isMobile ? 0 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: E, delay: 0.08 }}
                className="font-serif font-light text-white tracking-tight leading-[1.08] mb-2"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}
              >
                Você não tem problema de tecnologia.
              </motion.h2>
              <motion.h2
                initial={{ opacity: 0, x: isMobile ? 0 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: E, delay: 0.16 }}
                className="font-serif font-light tracking-tight leading-[1.08]
                           bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}
              >
                Tem problema de processo.
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: E, delay: 0.24 }}
              className="relative p-5 md:p-6 rounded-xl bg-white/[0.025] border border-white/[0.07] overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full
                              bg-gradient-to-b from-[#C9A84C] via-[#C9A84C] to-transparent" />
              <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed pl-4">
                A maioria das empresas já investiu em sistema, já contratou ferramenta, já tentou organizar
                com planilha. E o resultado foi sempre o mesmo: tecnologia rodando em cima de um processo
                que nunca foi estruturado.
              </p>
            </motion.div>
          </div>

          {/* Right: Pain point cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: isMobile ? 16 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: E, delay: i * 0.08 }}
                className="group rounded-xl p-5 md:p-6
                           bg-white/[0.02] border border-white/[0.06]
                           border-l-[3px] border-l-[#C9A84C]/50
                           transition-all duration-500
                           hover:border-l-[#C9A84C] hover:bg-white/[0.04]
                           hover:shadow-[0_12px_40px_-12px_rgba(201,168,76,0.10)]"
              >
                {/* Category */}
                <span className="text-[10px] font-bold uppercase tracking-[0.28em]
                                 bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent
                                 mb-3 block">
                  {card.category}
                </span>

                {/* Title */}
                <h3 className="text-white text-sm md:text-base font-serif font-normal leading-snug mb-2.5
                               group-hover:text-[#C9A84C] transition-colors duration-500">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
