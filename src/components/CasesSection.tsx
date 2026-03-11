import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const sectionData = {
  overline: "ONDE O PROCESSO VIRA SISTEMA E SISTEMA VIRA RESULTADO",
  title: "Cada projeto começa pelo processo. Tecnologia construída sob medida.",
  subtitle: "Não existe sistema igual. Cada solução nasce do processo real do negócio.",
  cases: [
    { tag: "APLICAÇÃO WEB • SEGMENTO", title: "Título do sistema web", metric: "X%", metricLabel: "Resultado principal", description: "Problema que a operação enfrentava sem um sistema centralizado. Mapeamos o processo, estruturamos a metodologia e desenvolvemos uma aplicação web que o que passou a funcionar na operação." },
    { tag: "APLICAÇÃO MOBILE • SEGMENTO", title: "Título do app desenvolvido", metric: "X%", metricLabel: "Resultado principal", description: "Problema que a equipe enfrentava sem mobilidade. Estruturamos o processo e desenvolvemos um aplicativo mobile que o que a equipe passou a ter na palma da mão." },
    { tag: "AUTOMAÇÃO • SEGMENTO", title: "Título da automação", metric: "Xh", metricLabel: "Tempo/custo economizado/mês", description: "Processos manuais e repetitivos que consumiam tempo e geravam retrabalho. Automatizamos o que foi automatizado e liberamos a equipe para o que passou a ser prioridade." },
    { tag: "INTELIGÊNCIA ARTIFICIAL • SEGMENTO", title: "Título da aplicação de IA", metric: "X%", metricLabel: "Resultado principal", description: "Problema que exigia decisão manual, lenta ou imprecisa. Integramos Inteligência Artificial ao processo e o que passou a acontecer de forma autônoma e inteligente." },
    { tag: "PROJETO COMPLETO • SEGMENTO", title: "Título do projeto completo", metric: "X%", metricLabel: "Resultado principal", description: "Operação com múltiplos problemas simultâneos. Mapeamos, estruturamos e desenvolvemos quais soluções foram combinadas — entregando uma operação completa, conectada e inteligente." }
  ]
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
};

export default function CasesSection() {
  return (
    <section className="py-32 px-6 bg-[#000000] min-h-screen relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="relative text-center mb-24 py-12">
          {/* Spotlight Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_50%)] pointer-events-none" />
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="relative z-10"
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="text-[#D4AF37] text-xs font-medium uppercase tracking-[0.2em] mb-6"
            >
              {sectionData.overline}
            </motion.div>
            
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="text-5xl md:text-6xl font-serif font-light text-white tracking-tight leading-tight text-balance mx-auto"
            >
              Cada projeto começa pelo processo. Tecnologia construída <span className="bg-gradient-to-r from-[#D4AF37] to-[#FDE047] bg-clip-text text-transparent">sob medida.</span>
            </motion.h2>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="text-gray-400 font-light text-lg mt-8 text-balance max-w-2xl mx-auto"
            >
              {sectionData.subtitle}
            </motion.p>
          </motion.div>
        </div>

        {/* Asymmetric Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {sectionData.cases.map((card, i) => {
            const isLastRow = i >= 3;
            const simpleAsymmetricClass = isLastRow && sectionData.cases.length === 5
              ? (i === 3 ? "lg:col-span-1 lg:col-start-1 lg:translate-x-1/2" : "lg:col-span-1 lg:col-start-2 lg:translate-x-1/2")
              : "";

            return (
              <motion.div 
                key={i} 
                variants={cardVariants}
                className={`relative group cursor-pointer ${simpleAsymmetricClass}`}
              >
                {/* Inner Card - Dark Glass Spotlight */}
                <div className="h-full bg-[radial-gradient(circle_at_top_left,_#1a1a1a,_#050505)] border border-white/5 group-hover:border-[#D4AF37]/50 rounded-2xl p-8 flex flex-col transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:drop-shadow-[0_10px_30px_rgba(212,175,55,0.1)]">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#FDE047] bg-clip-text text-transparent text-xs font-medium uppercase tracking-[0.2em] mb-4 opacity-80">{card.tag}</span>
                  <h3 className="text-white text-2xl font-serif font-normal mb-6 tracking-tight">{card.title}</h3>
                  <div className="mb-6">
                    {/* Metallic Typography Effect */}
                    <span className="font-black text-5xl mb-2 bg-gradient-to-br from-[#FDE047] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent inline-block">
                      {card.metric}
                    </span>
                    <p className="bg-gradient-to-r from-[#D4AF37] to-[#FDE047] bg-clip-text text-transparent text-sm font-medium mt-2 uppercase tracking-[0.2em]">{card.metricLabel}</p>
                  </div>
                  <p className="text-gray-400 text-sm leading-[1.8] flex-grow mb-10 font-light">{card.description}</p>
                  <Link to="/portfolio" className="text-white/80 text-sm font-medium flex items-center gap-2 group-hover:text-[#D4AF37] transition-colors duration-500 mt-auto w-fit">
                    Ver case completo 
                    <ArrowRight className="w-4 h-4 transform transition-transform duration-500 ease-out group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
