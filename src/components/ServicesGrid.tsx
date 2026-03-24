import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import { useTilt } from '../hooks/useTilt';

const E = [0.22, 1, 0.36, 1] as const;

// ─── Animated SVG icons ────────────────────────────────────────────────────
function WebIcon() {
  return (
    <motion.svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2"
      className="w-full h-full text-[#C9A84C]">
      <motion.circle cx="16" cy="16" r="12"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} />
      <motion.ellipse cx="16" cy="16" rx="5" ry="12"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.3 }} />
      <motion.path d="M4 16h24M6 9h20M6 23h20"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.6 }} />
    </motion.svg>
  );
}

function MobileIcon() {
  return (
    <motion.svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2"
      className="w-full h-full text-[#C9A84C]">
      <motion.rect x="8" y="4" width="16" height="24" rx="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} />
      <motion.path d="M13 7h6"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.4 }} />
      <motion.circle cx="16" cy="24" r="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5, repeat: Infinity, repeatType: 'reverse', repeatDelay: 2 }} />
      {/* Notification badge */}
      <motion.circle cx="22" cy="6" r="3" fill="#C9A84C" stroke="none"
        initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.4, delay: 2, repeat: Infinity, repeatDelay: 3 }} />
    </motion.svg>
  );
}

function AutomationIcon() {
  return (
    <motion.svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2"
      className="w-full h-full text-[#C9A84C]">
      <motion.path d="M16 3l3 10h-6l3-10zM16 29l-3-10h6l-3 10z"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} />
      <motion.path d="M16 13v6"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1.5 }} />
      {/* Flash glow */}
      <motion.circle cx="16" cy="16" r="6" fill="none" stroke="#C9A84C" strokeWidth="0.5"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5, 2] }}
        transition={{ duration: 1.5, delay: 1.8, repeat: Infinity, repeatDelay: 2 }} />
    </motion.svg>
  );
}

function AIIcon() {
  return (
    <motion.svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      {/* Neural network nodes */}
      {[[8, 10], [8, 22], [16, 8], [16, 16], [16, 24], [24, 10], [24, 22]].map(([x, y], i) => (
        <motion.circle key={`n${i}`} cx={x} cy={y} r="2.5" fill="#C9A84C"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: 1 }}
          transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }} />
      ))}
      {/* Connections */}
      {[
        [8, 10, 16, 8], [8, 10, 16, 16], [8, 22, 16, 16], [8, 22, 16, 24],
        [16, 8, 24, 10], [16, 16, 24, 10], [16, 16, 24, 22], [16, 24, 24, 22],
      ].map(([x1, y1, x2, y2], i) => (
        <motion.line key={`c${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#C9A84C" strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.5 + i * 0.1, repeat: Infinity, repeatType: 'reverse' }} />
      ))}
    </motion.svg>
  );
}

const services = [
  {
    Icon: WebIcon,
    title: 'Aplicações Web',
    description: 'Sistemas web sob medida para gestão, operação e controle do seu negócio. ERP, CRM, BI, portais e intranets.',
    to: '/solucoes/aplicacoes-web',
  },
  {
    Icon: MobileIcon,
    title: 'Aplicações Mobile',
    description: 'Apps nativos para equipes em campo, clientes e operações descentralizadas. iOS e Android.',
    to: '/solucoes/aplicacoes-mobile',
  },
  {
    Icon: AutomationIcon,
    title: 'Automações',
    description: 'Robôs e integrações que eliminam tarefas manuais e conectam seus sistemas existentes.',
    to: '/solucoes/automacoes',
  },
  {
    Icon: AIIcon,
    title: 'Inteligência Artificial',
    description: 'IA aplicada ao seu processo: triagem, classificação, previsão e atendimento inteligente.',
    to: '/solucoes/ia',
  },
];

// Service card with tilt effect (desktop) and mouse glow
function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const isMobile = useIsMobile();
  const tilt = useTilt({ maxDegrees: 5, perspective: 800, scale: 1.02 });
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
    });
    tilt.handlers.onMouseMove(e);
  }, [isMobile, tilt.handlers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 16 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: E, delay: index * 0.08 }}
    >
      <Link
        to="/contato-quiz"
        className="block h-full"
      >
        <div
          ref={!isMobile ? tilt.ref : undefined}
          style={!isMobile ? tilt.style : undefined}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { tilt.handlers.onMouseLeave(); setIsHovering(false); }}
          onMouseEnter={() => setIsHovering(true)}
          className="group relative h-full rounded-2xl p-6 md:p-8
                     bg-white/[0.02] border border-white/[0.06]
                     transition-colors duration-500
                     hover:border-[#C9A84C]/30 hover:bg-white/[0.04]"
        >
          {/* Mouse-following glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
            style={{
              opacity: isHovering ? 1 : 0,
              background: `radial-gradient(circle 200px at ${mousePos.x} ${mousePos.y}, rgba(201,168,76,0.08), transparent 70%)`,
            }}
          />

          {/* Icon */}
          <div className="w-12 h-12 mb-5 relative z-10">
            <service.Icon />
          </div>

          {/* Title */}
          <h3 className="relative z-10 text-white text-lg md:text-xl font-serif font-normal tracking-tight mb-3
                         group-hover:text-[#C9A84C] transition-colors duration-500">
            {service.title}
          </h3>

          {/* Description */}
          <p className="relative z-10 text-gray-400 text-sm leading-relaxed font-light mb-5">
            {service.description}
          </p>

          {/* Link */}
          <div className="relative z-10 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em]
                          text-gray-500 group-hover:text-[#C9A84C] transition-colors duration-500">
            Saiba mais
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ServicesGrid() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionMouse, setSectionMouse] = useState({ x: 0, y: 0 });

  const handleSectionMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    setSectionMouse({ x: e.clientX, y: e.clientY });
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="py-20 md:py-28 bg-[#080808] px-6 md:px-12 lg:px-24 relative overflow-hidden"
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.2,
        }}
      />

      {/* Mouse-reactive highlight (desktop only) */}
      {!isMobile && (
        <div
          className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 transition-opacity duration-300"
          style={{
            left: sectionMouse.x - 200,
            top: sectionMouse.y - 200,
            background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
            opacity: sectionMouse.x > 0 ? 1 : 0,
          }}
        />
      )}

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
            O Que Construímos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: E, delay: 0.08 }}
            className="font-serif font-light text-white tracking-tight"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3.5rem)' }}
          >
            Soluções{' '}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent">
              sob medida
            </span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
