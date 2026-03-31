import { motion } from 'motion/react';
import { useIsMobile } from '../hooks/useIsMobile';

const E = [0.22, 1, 0.36, 1] as const;

// ─── Animated SVG icons ────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <motion.svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2"
      className="w-full h-full text-[#C9A84C]">
      <motion.path d="M16 3L5 8v7c0 7.18 4.7 13.18 11 15 6.3-1.82 11-7.82 11-15V8L16 3z"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} />
      <motion.path d="M11 16l3 3 7-7"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.5 }} />
    </motion.svg>
  );
}

function ServerIcon() {
  return (
    <motion.svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2"
      className="w-full h-full text-[#C9A84C]">
      <motion.rect x="5" y="4" width="22" height="8" rx="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} />
      <motion.rect x="5" y="20" width="22" height="8" rx="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.3 }} />
      <motion.path d="M16 12v8"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.6 }} />
      <motion.circle cx="9" cy="8" r="1" fill="#C9A84C" stroke="none"
        initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.4, delay: 1.5, repeat: Infinity, repeatDelay: 3 }} />
      <motion.circle cx="9" cy="24" r="1" fill="#C9A84C" stroke="none"
        initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.4, delay: 2, repeat: Infinity, repeatDelay: 3 }} />
    </motion.svg>
  );
}

function AuditIcon() {
  return (
    <motion.svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2"
      className="w-full h-full text-[#C9A84C]">
      <motion.rect x="6" y="3" width="20" height="26" rx="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} />
      <motion.path d="M11 10h10M11 15h10M11 20h6"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.4 }} />
      <motion.circle cx="22" cy="22" r="5" fill="none" stroke="#C9A84C" strokeWidth="0.5"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5, 2] }}
        transition={{ duration: 1.5, delay: 1.8, repeat: Infinity, repeatDelay: 2 }} />
    </motion.svg>
  );
}

const cards = [
  {
    Icon: ShieldIcon,
    title: 'LGPD & Privacidade',
    description: 'Dados tratados com base legal, consentimento documentado e políticas claras de retenção.',
  },
  {
    Icon: ServerIcon,
    title: 'Infraestrutura Segura',
    description: 'Hospedagem em cloud dedicada com acesso restrito, firewall e criptografia ativa.',
  },
  {
    Icon: AuditIcon,
    title: 'Auditoria & Logs',
    description: 'Cada ação registrada com data, hora e usuário. Rastreabilidade total do sistema.',
  },
];

function ComplianceCard({ card, index }: { key?: number; card: typeof cards[0]; index: number }) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 16 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: E, delay: index * 0.08 }}
      className="group relative h-full rounded-2xl
                 bg-white/[0.02] border border-white/[0.06] p-5 sm:p-6 md:p-8
                 transition-colors duration-500
                 hover:border-[#C9A84C]/30 hover:bg-white/[0.04]"
    >
      {/* Icon */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 mb-5">
        <card.Icon />
      </div>

      {/* Title */}
      <h3 className="text-white text-lg md:text-xl font-serif font-normal tracking-tight mb-3
                     group-hover:text-[#C9A84C] transition-colors duration-500">
        {card.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed font-light">
        {card.description}
      </p>
    </motion.div>
  );
}

export default function ComplianceSection() {
  return (
    <section className="py-20 md:py-28 bg-[#080808] px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.2,
        }}
      />

      <div className="relative max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: E }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-6 h-px bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-[10px] md:text-xs font-medium uppercase tracking-[0.3em]">
              Compliance & Segurança
            </span>
            <div className="w-6 h-px bg-[#C9A84C]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: E, delay: 0.08 }}
            className="font-serif font-light text-white tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
          >
            Segurança que você apresenta ao seu cliente com{' '}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent">
              confiança.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: E, delay: 0.16 }}
            className="text-sm md:text-base text-gray-400 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Proteção de dados e governança integradas em cada sistema que entregamos.
          </motion.p>
        </div>

        {/* Cards grid — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, i) => (
            <ComplianceCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
