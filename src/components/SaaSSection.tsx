import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';

const AnimatedCounter = ({ inView, delayMs }: { inView: boolean, delayMs: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      let startTime: number;
      const duration = 1200; // 1.2s
      const target = 98;

      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * target));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [inView, delayMs]);

  return <>{count}%</>;
};

export default function SaaSSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const chartPath = "M 10 70 L 45 55 L 80 65 L 115 35 L 150 40 L 185 15";
  const chartPoints = [
    { cx: 10, cy: 70 },
    { cx: 45, cy: 55 },
    { cx: 80, cy: 65 },
    { cx: 115, cy: 35 },
    { cx: 150, cy: 40 },
    { cx: 185, cy: 15 },
  ];

  return (
    <div className="relative w-full bg-white">
      {/* SaaS Description Block */}
      <section className="w-full bg-white py-12 md:py-24 px-5 md:px-8" ref={ref}>
        <div className="max-w-4xl mx-auto flex flex-col items-start text-left">
          
          <motion.h2 
            className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            SaaS - Software as a Service
          </motion.h2>

          <motion.p 
            className="text-lg md:text-xl text-[#4a4a4a] leading-[1.7] mb-8 font-normal"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
          >
            Desenvolvemos soluções completas em modelo SaaS, onde você acessa o sistema diretamente pelo navegador, sem necessidade de instalações ou infraestrutura complexa. Nossas aplicações são escaláveis, seguras e projetadas para crescer junto com o seu negócio.
          </motion.p>

          <motion.p 
            className="text-xl md:text-2xl text-[#1a1a1a] font-bold"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 1.6 }}
          >
            Do cadastro de clientes à gestão completa de operações.
          </motion.p>

          {/* Visual CTA Card */}
          <motion.div
            className="mt-8 w-full max-w-[640px] h-auto md:h-[180px] rounded-[16px] border border-[#c9a84c] flex flex-col md:flex-row items-stretch md:items-center px-4 md:px-6 py-4"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 1.8 }}
          >
            {/* Column 1: Line Chart (40%) */}
            <div className="w-full md:w-[40%] h-auto md:h-full flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 pr-0 md:pr-6">
              <div className="relative w-full h-[80px]">
                <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
                  <motion.path
                    d={chartPath}
                    fill="none"
                    stroke="#c9a84c"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 2.0 }}
                  />
                  {chartPoints.map((pt, i) => (
                    <motion.circle
                      key={i}
                      cx={pt.cx}
                      cy={pt.cy}
                      r="3"
                      fill="#c9a84c"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                      transition={{ duration: 0.3, delay: 2.0 + (i * 0.25) }}
                    />
                  ))}
                </svg>
              </div>
              <span className="text-[#888] text-[11px] mt-4 block text-center uppercase tracking-wider font-medium">Crescimento</span>
            </div>

            {/* Column 2: Metric (30%) */}
            <div className="w-full md:w-[30%] h-auto md:h-full flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 py-4 md:py-0 px-4">
              <div className="relative w-[80px] h-[80px] flex items-center justify-center mb-2">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#f0f0f0" strokeWidth="2" />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#c9a84c"
                    strokeWidth="2"
                    strokeDasharray="226.19"
                    strokeDashoffset="226.19"
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                    initial={{ strokeDashoffset: 226.19 }}
                    animate={isInView ? { strokeDashoffset: 226.19 - (226.19 * 0.98) } : { strokeDashoffset: 226.19 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 2.0 }}
                  />
                </svg>
                <span className="text-[#1a1a1a] text-2xl font-bold relative z-10">
                  <AnimatedCounter inView={isInView} delayMs={2000} />
                </span>
              </div>
              <span className="text-[#888] text-[11px] uppercase tracking-wider font-medium">Satisfação</span>
            </div>

            {/* Column 3: Status (30%) */}
            <div className="w-full md:w-[30%] h-auto md:h-full flex flex-col justify-center pt-4 md:pt-0 pl-0 md:pl-8 space-y-4">
              {[
                { label: "Escalável", delay: 0 },
                { label: "Seguro", delay: 0.3 },
                { label: "Integrado", delay: 0.6 }
              ].map((item, i) => (
                <div key={i} className="flex items-center">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#c9a84c] mr-3"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                  />
                  <span className="text-[#4a4a4a] text-[13px] font-regular">{item.label}</span>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </section>
    </div>
  );
}
