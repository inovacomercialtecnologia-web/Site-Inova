import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

// Luxurious Expo-Out curve for buttery smooth, natural deceleration
const customEase = [0.16, 1, 0.3, 1]; 

const BentoCard = ({ 
  children, 
  className, 
  delay = 0,
  isDark = false
}: { 
  children: React.ReactNode, 
  className?: string, 
  delay?: number,
  isDark?: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 1.2, ease: customEase, delay }}
      className={`relative overflow-hidden rounded-[2rem] p-10 md:p-12 group transition-all duration-700 ease-out hover:-translate-y-2 ${
        isDark 
          ? 'bg-[#000000] border border-white/5 hover:border-[#C9A84C]/40 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(201,168,76,0.1)]' 
          : 'bg-[#FFFFFF] border border-gray-100 hover:border-[#C9A84C]/40 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05),0_0_20px_rgba(201,168,76,0.05)]'
      } ${className}`}
    >
      {/* Subtle animated border glow effect on enter */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: customEase, delay: delay + 0.2 }}
        className="absolute inset-0 border border-[#C9A84C]/0 group-hover:border-[#C9A84C]/20 rounded-[2rem] transition-colors duration-700 pointer-events-none"
      />
      {children}
    </motion.div>
  );
};

// Micro-animated Icons with entrance scale & continuous Lottie-style drawing
const ProcessIcon = () => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, ease: customEase, delay: 0.2 }}
    className="w-14 h-14 mb-10 relative"
  >
    <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-[#C9A84C]">
      <motion.path
        d="M6 3v18M18 3v18M3 12h18"
        initial={{ pathLength: 0, opacity: 0.2 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      />
      <circle cx="12" cy="12" r="3" className="fill-[#C9A84C]/10" />
    </motion.svg>
  </motion.div>
);

const MethodIcon = () => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, ease: customEase, delay: 0.3 }}
    className="w-14 h-14 mb-10 relative"
  >
    <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-[#C9A84C]">
      <motion.rect
        x="3" y="3" width="18" height="18" rx="2"
        initial={{ pathLength: 0, opacity: 0.2 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
      />
      <motion.path
        d="M3 9h18M9 21V9"
        initial={{ pathLength: 0, opacity: 0.2 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
      />
    </motion.svg>
  </motion.div>
);

const TechIcon = () => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, ease: customEase, delay: 0.4 }}
    className="w-16 h-16 mb-8 relative"
  >
    <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-[#C9A84C]">
      <motion.path
        d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        initial={{ pathLength: 0, opacity: 0.2 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
      />
    </motion.svg>
  </motion.div>
);

export default function TriadeSection() {
  return (
    <section className="py-32 px-6 bg-[#FFFFFF] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - High-end Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1.2, ease: customEase }}
          className="text-center mb-24"
        >
          <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent text-sm font-medium uppercase tracking-[0.2em] mb-6 block">
            O Método
          </span>
          <h2 className="text-[40px] md:text-[72px] lg:text-[88px] font-serif font-light text-black tracking-tight leading-[0.85]">
            A Tríade da <br />
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent">Transformação</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Processo */}
          <BentoCard delay={0.1} className="md:col-span-2">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[140px] font-serif font-black leading-none pointer-events-none group-hover:scale-105 group-hover:opacity-[0.05] transition-all duration-1000 ease-out">
              01
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <ProcessIcon />
              <h3 className="text-2xl md:text-3xl font-serif font-normal text-black mb-3 tracking-tight">PROCESSO</h3>
              <p className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent text-sm font-medium uppercase tracking-[0.2em] mb-6">Mapeamento da sua operação</p>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light max-w-xl">
                Entendemos como sua empresa funciona, identificando gargalos e documentando fluxos que hoje são invisíveis. A base de qualquer sistema inteligente é um processo bem definido e estruturado.
              </p>
            </div>
          </BentoCard>

          {/* Card 2: Metodologia */}
          <BentoCard delay={0.2} className="md:col-span-1">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[140px] font-serif font-black leading-none pointer-events-none group-hover:scale-105 group-hover:opacity-[0.05] transition-all duration-1000 ease-out">
              02
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <MethodIcon />
              <h3 className="text-2xl md:text-3xl font-serif font-normal text-black mb-3 tracking-tight">METODOLOGIA</h3>
              <p className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent text-sm font-medium uppercase tracking-[0.2em] mb-6">Estruturação</p>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">
                Transformamos o conhecimento em processos replicáveis e mensuráveis, tornando a operação independente de pessoas específicas.
              </p>
            </div>
          </BentoCard>

          {/* Card 3: Tecnologia */}
          <BentoCard delay={0.3} isDark={true} className="md:col-span-3">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-[200px] font-serif font-black leading-none pointer-events-none text-white group-hover:scale-105 group-hover:opacity-[0.04] transition-all duration-1000 ease-out">
              03
            </div>
            
            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/0 to-[#C9A84C]/0 group-hover:from-[#C9A84C]/[0.03] group-hover:to-transparent transition-colors duration-1000 ease-out" />

            <div className="relative z-10 h-full flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-20">
              <div className="flex-shrink-0">
                <TechIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-white mb-4 tracking-tight">TECNOLOGIA</h3>
                <p className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent text-sm font-medium uppercase tracking-[0.2em] mb-6">Desenvolvimento da Solução</p>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light max-w-3xl">
                  Construímos a solução seja Web, Mobile, Automação ou IA, desenhada especificamente para a metodologia que foi estruturada para o seu negócio. Onde o processo vira sistema e o sistema vira resultado.
                </p>
              </div>
              
              <div className="flex-shrink-0 mt-8 md:mt-0">
                <motion.a 
                  href="/contato-quiz"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E5C05C] flex items-center justify-center text-black hover:bg-white hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all duration-500 group/btn"
                >
                  <ArrowRight className="w-6 h-6 md:w-8 md:h-8 transform group-hover/btn:translate-x-1 transition-transform duration-500 ease-out" />
                </motion.a>
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
