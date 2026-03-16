import React from 'react';
import { motion } from 'motion/react';

const metrics = [
  {
    label: "Escalabilidade",
    value: "10x",
    description: "Pronto para o crescimento exponencial e demanda global."
  },
  {
    label: "Inteligência de Negócios",
    value: "100%",
    description: "Visibilidade total da sua operação em tempo real."
  },
  {
    label: "Suporte",
    value: "24/7",
    description: "Monitoramento proativo e suporte especializado contínuo."
  }
];

const MetricsSection = () => {
  return (
    <section className="relative min-h-[500px] md:h-[650px] w-full overflow-hidden flex items-center justify-center bg-[#000000] py-20 md:py-0">
      {/* Background Image with Parallax-like feel */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
          alt="Tech Infrastructure"
          className="w-full h-full object-cover brightness-[0.2] scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(201,168,76,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.2)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-32">
          {metrics.map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center md:items-start text-center md:text-left group"
            >
              <div className="relative mb-6">
                <span className="text-[40px] md:text-[96px] font-black bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent leading-none tracking-tighter block group-hover:scale-105 transition-transform duration-700">
                  {metric.value}
                </span>
                <div className="absolute -bottom-2 left-0 w-12 h-[3px] bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] group-hover:w-full transition-all duration-700 ease-in-out"></div>
              </div>
              
              <h3 className="text-white text-lg md:text-xl font-light uppercase tracking-[0.2em] mb-4">
                {metric.label}
              </h3>
              
              <p className="text-gray-400 text-xs md:text-base font-light leading-relaxed max-w-[280px] group-hover:text-gray-300 transition-colors duration-500">
                {metric.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
