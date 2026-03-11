import React, { useState } from 'react';
import { ArrowRight, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FinancialERP from '../components/FinancialERP';

const PortfolioPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const webInterfaces = [
    { title: "ERP Inteligente", desc: "Gestão financeira e operacional centralizada com interface interativa.", hasPreview: true },
    { title: "CRM", desc: "Pipeline de vendas e relacionamento" },
    { title: "Dashboard de BI", desc: "Indicadores e analytics" },
    { title: "E-commerce Admin", desc: "Gestão de loja e pedidos" },
    { title: "Portal do Cliente", desc: "Área logada do cliente" },
    { title: "LMS", desc: "Plataforma de cursos e trilhas" },
    { title: "Marketplace Admin", desc: "Gestão de vendedores e comissões" },
    { title: "Intranet Corporativa", desc: "Comunicação e documentos internos" },
  ];

  const mobileInterfaces = [
    { title: "Saúde & Bem-estar", desc: "Acompanhamento de treinos, consultas ou hábitos" },
    { title: "Finanças Pessoais", desc: "Controle de gastos e investimentos" },
    { title: "Delivery & Logística", desc: "Rastreamento de pedidos e rotas" },
    { title: "Educação", desc: "Plataforma de cursos e aprendizado" },
    { title: "Gestão Corporativa", desc: "Controle de equipes e tarefas em campo" },
    { title: "E-commerce Mobile", desc: "Loja e experiência de compra" },
    { title: "Agendamento", desc: "Reservas, serviços e calendário" },
    { title: "Streaming", desc: "Conteúdo em vídeo ou áudio" },
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {/* Hero Section */}
      <section className="py-32 px-6 text-center">
        <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.6em] mb-4 block">INOVA SYSTEMS SOLUTIONS</span>
        <h1 className="text-[40px] md:text-[80px] font-serif font-light tracking-tighter mb-8">Cada projeto aqui começou pelo processo.</h1>
        <p className="text-white/60 text-xl font-light max-w-2xl mx-auto">
          Web, Mobile, Automação e IA — desenvolvidos sob medida para a realidade de cada negócio.
        </p>
      </section>

      {/* Interfaces Section */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-light mb-16 text-[#C9A84C]">Interfaces Web — Sistemas</h2>
          
          {/* Web Interfaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-32">
            {webInterfaces.map((item, i) => (
              <div 
                key={i} 
                onClick={() => item.hasPreview && setIsModalOpen(true)}
                className={`bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:border-[#C9A84C]/30 transition-all duration-300 group flex flex-col h-full ${item.hasPreview ? 'cursor-pointer hover:-translate-y-1 shadow-[0_0_30px_rgba(201,168,76,0.05)] hover:shadow-[0_0_40px_rgba(201,168,76,0.1)]' : 'cursor-default'}`}
              >
                <h3 className="text-white text-xl font-serif font-light mb-3 group-hover:text-[#C9A84C] transition-colors">{item.title}</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed flex-grow">{item.desc}</p>
                
                {item.hasPreview && (
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[#C9A84C] text-xs font-medium uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Ver Preview
                    </span>
                    <ArrowRight size={16} className="text-[#C9A84C] transform group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-4xl font-serif font-light mb-16 text-[#C9A84C]">Interfaces Mobile — Apps por segmento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mobileInterfaces.map((item, i) => (
              <div key={i} className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:border-[#C9A84C]/30 transition-all duration-300 group cursor-pointer hover:-translate-y-1">
                <h3 className="text-white text-xl font-serif font-light mb-3 group-hover:text-[#C9A84C] transition-colors">{item.title}</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Screen Interactive Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
          >
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white z-[110] transition-colors"
            >
              <X size={32} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[1400px] h-[85vh] md:h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <FinancialERP />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioPage;
