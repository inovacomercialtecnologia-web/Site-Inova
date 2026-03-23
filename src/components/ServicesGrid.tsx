import React from 'react';
import { motion } from 'motion/react';
import { Globe, Smartphone, Zap, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

const E = [0.22, 1, 0.36, 1] as const;

const services = [
  {
    icon: Globe,
    title: 'Aplicações Web',
    description: 'Sistemas web sob medida para gestão, operação e controle do seu negócio. ERP, CRM, BI, portais e intranets.',
    to: '/solucoes/aplicacoes-web',
  },
  {
    icon: Smartphone,
    title: 'Aplicações Mobile',
    description: 'Apps nativos para equipes em campo, clientes e operações descentralizadas. iOS e Android.',
    to: '/solucoes/aplicacoes-mobile',
  },
  {
    icon: Zap,
    title: 'Automações',
    description: 'Robôs e integrações que eliminam tarefas manuais e conectam seus sistemas existentes.',
    to: '/solucoes/automacoes',
  },
  {
    icon: Brain,
    title: 'Inteligência Artificial',
    description: 'IA aplicada ao seu processo: triagem, classificação, previsão e atendimento inteligente.',
    to: '/solucoes/ia',
  },
];

export default function ServicesGrid() {
  const isMobile = useIsMobile();

  return (
    <section className="py-20 md:py-28 bg-[#080808] px-6 md:px-12 lg:px-24">
      <div className="max-w-[1440px] mx-auto">

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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: isMobile ? 16 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: E, delay: i * 0.08 }}
            >
              <Link
                to={service.to}
                className="group block h-full rounded-2xl p-6 md:p-8
                           bg-white/[0.02] border border-white/[0.06]
                           transition-all duration-500
                           hover:-translate-y-1 hover:border-[#C9A84C]/30
                           hover:bg-white/[0.04]
                           hover:shadow-[0_16px_48px_-12px_rgba(201,168,76,0.12)]"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-5
                                group-hover:bg-[#C9A84C]/15 transition-colors duration-500">
                  <service.icon className="w-6 h-6 text-[#C9A84C]" />
                </div>

                {/* Title */}
                <h3 className="text-white text-lg md:text-xl font-serif font-normal tracking-tight mb-3
                               group-hover:text-[#C9A84C] transition-colors duration-500">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed font-light mb-5">
                  {service.description}
                </p>

                {/* Link */}
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em]
                                text-gray-500 group-hover:text-[#C9A84C] transition-colors duration-500">
                  Saiba mais
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
