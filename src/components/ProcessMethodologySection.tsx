import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useMotionValueEvent } from 'motion/react';
import { Link } from 'react-router-dom';
import { Target, Layers, Cpu, Zap, ArrowRight, Maximize2 } from 'lucide-react';

const methodologySteps = [
  {
    id: "01",
    code: "SYS_MAP_01",
    description: "Análise profunda do ecossistema atual para identificar gargalos e oportunidades de automação.",
    icon: <Target className="w-5 h-5" />,
    details: ["Fluxos Críticos", "Gargalos Operacionais", "ROI Estimado"]
  },
  {
    id: "02",
    code: "ARCH_STR_02",
    description: "Desenvolvimento da arquitetura lógica e definição das ferramentas ideais para o projeto.",
    icon: <Layers className="w-5 h-5" />,
    details: ["Data Pipeline", "API Gateway", "Security Layer"]
  },
  {
    id: "03",
    code: "AI_CORE_03",
    description: "Implementação de modelos de inteligência artificial personalizados para o seu negócio.",
    icon: <Cpu className="w-5 h-5" />,
    details: ["Custom LLMs", "RAG Systems", "Agentic Workflows"]
  },
  {
    id: "04",
    code: "SCALE_OPT_04",
    description: "Otimização contínua para garantir que o sistema cresça junto com a sua demanda.",
    icon: <Zap className="w-5 h-5" />,
    details: ["Auto-scaling", "Performance Monitoring", "Edge Computing"]
  }
];

const ProcessMethodologySection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 200, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 40 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-0 md:min-h-screen bg-[#FFFFFF] overflow-hidden py-12 md:py-32 cursor-none"
    >
      {/* 1. TECHNICAL DOT GRID BACKGROUND */}
      <TechnicalGrid mouseX={springX} mouseY={springY} />

      <motion.div 
        style={{ opacity }}
        className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-10"
      >
        {/* HEADER SECTION */}
        <div className="mb-10 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-2 h-2 bg-[#C9A84C] rounded-full"></div>
              <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent text-[11px] uppercase tracking-[0.5em] font-medium">Metodologia Operacional</span>
            </motion.div>
            
            <h2 className="text-[26px] md:text-[64px] font-light leading-[1.05] md:leading-[0.95] tracking-tight text-gray-900">
              O sistema que a sua empresa precisa <br />
              <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent font-light tracking-tight">começa pelo processo.</span>
            </h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-gray-400 text-base md:text-lg font-light max-w-2xl leading-relaxed"
            >
              Processo estruturado, metodologia aplicada, SaaS desenvolvido para o seu negócio.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden lg:block text-right"
          >
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">System_Status</div>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-gray-900">OPTIMIZED_FLOW_ACTIVE</span>
            </div>
          </motion.div>
        </div>

        {/* 2. BLUEPRINT CARDS GRID - REMOVED AS REQUESTED */}

        {/* 3. TECHNICAL FOOTER */}
        <div className="mt-12 md:mt-24 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <Link
            to="/contato-quiz"
            className="group relative px-12 py-6 bg-[#000000] text-white rounded-full overflow-hidden flex items-center gap-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <span className="relative z-10 font-medium tracking-[0.3em] uppercase text-[11px]">Entrar em contato</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>
      </motion.div>

      {/* 4. TECHNICAL CROSSHAIR CURSOR */}
      <motion.div
        style={{ 
          left: springX, 
          top: springY,
          opacity: isHovered ? 1 : 0,
        }}
        className="absolute w-10 h-10 z-50 pointer-events-none flex items-center justify-center hidden md:flex"
      >
        {/* Crosshair Lines */}
        <div className="absolute w-[1px] h-full bg-[#C9A84C]/40"></div>
        <div className="absolute h-[1px] w-full bg-[#C9A84C]/40"></div>
        
        {/* Center Dot */}
        <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)]"></div>
        
        {/* Dynamic Coordinates */}
        <div className="absolute left-6 top-6 flex flex-col gap-1">
          <Coordinate label="X" value={springX} />
          <Coordinate label="Y" value={springY} />
        </div>
      </motion.div>
    </section>
  );
};

// --- SUB-COMPONENTS ---

const Coordinate = ({ label, value }: { label: string; value: any }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(value, "change", (v) => {
    if (ref.current) {
      ref.current.textContent = `${label}: ${Math.round(v as number)}`;
    }
  });

  return (
    <span 
      ref={ref}
      className="text-[8px] font-mono text-[#C9A84C] uppercase tracking-tighter"
    >
      {label}: 0
    </span>
  );
};

const TechnicalGrid = ({ mouseX, mouseY }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const spacing = 40;
    const dotSize = 1;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mX = mouseX.get();
      const mY = mouseY.get();

      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          const dx = mX - x;
          const dy = mY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let offsetX = 0;
          let offsetY = 0;
          
          if (dist < 200) {
            const force = (200 - dist) / 200;
            offsetX = (dx / dist) * force * -10;
            offsetY = (dy / dist) * force * -10;
          }

          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, dotSize, 0, Math.PI * 2);
          
          const intensity = Math.max(0, 1 - dist / 400);
          ctx.fillStyle = intensity > 0.1 
            ? `rgba(201, 168, 76, ${0.1 + intensity * 0.4})` 
            : 'rgba(0, 0, 0, 0.05)';
          
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

const BlueprintCard = ({ step, index, mouseX, mouseY }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="relative bg-white p-6 md:p-10 flex flex-col group cursor-default h-full min-h-[280px] md:min-h-[450px]"
    >
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-[#C9A84C] font-medium tracking-widest mb-1">
            {step.code}
          </span>
          <div className="w-8 h-[1px] bg-gray-100 group-hover:w-full group-hover:bg-[#C9A84C]/30 transition-all duration-700"></div>
        </div>
        <div className="text-[32px] font-light text-gray-100 group-hover:text-[#C9A84C]/10 transition-colors duration-500 select-none">
          {step.id}
        </div>
      </div>

      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#C9A84C] group-hover:text-white transition-all duration-500 mb-6">
          {step.icon}
        </div>
      </div>

      <p className="text-gray-400 text-xs leading-relaxed font-light mb-10">
        {step.description}
      </p>

      <div className="mt-auto space-y-3">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-50 space-y-3">
                {step.details.map((detail: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-[#C9A84C] rounded-full"></div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isHovered && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-300 uppercase tracking-widest">
            <Maximize2 className="w-3 h-3" />
            <span>Expand_Details</span>
          </div>
        )}
      </div>

      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-transparent group-hover:border-[#C9A84C]/40 transition-colors duration-500"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-transparent group-hover:border-[#C9A84C]/40 transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-transparent group-hover:border-[#C9A84C]/40 transition-colors duration-500"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-transparent group-hover:border-[#C9A84C]/40 transition-colors duration-500"></div>
    </motion.div>
  );
};

export default ProcessMethodologySection;
