import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { LayoutGrid, Users, ShoppingBag, Network, BarChart3 } from 'lucide-react';

const systems = [
  { 
    title: "ERP (Enterprise Resource Planning)", 
    desc: "Um ERP centraliza e integra todos os setores da sua empresa em um único sistema, eliminando retrabalho e dando mais visibilidade sobre cada etapa do negócio. Desenvolvemos ERPs personalizados que conectam áreas como financeiro, estoque, compras, vendas e muito mais, incluindo o controle completo de contas a pagar e contas a receber, garantindo uma gestão financeira mais eficiente e sem falhas de comunicação entre os departamentos.",
    icon: LayoutGrid
  },
  { 
    title: "CRM (Customer Relationship Management)", 
    desc: "Um CRM é a ferramenta que coloca o cliente no centro do seu negócio. Desenvolvemos soluções personalizadas para gerenciar todo o relacionamento com seus clientes, desde o primeiro contato até o pós-venda, registrando interações, organizando oportunidades de vendas e fornecendo dados estratégicos para sua equipe tomar decisões com mais precisão e agilidade.",
    icon: Users
  },
  { 
    title: "E-commerce", 
    desc: "Desenvolvemos plataformas de e-commerce completas e personalizadas, criadas para oferecer a melhor experiência de compra ao seu cliente e maximizar as conversões do seu negócio. Do catálogo de produtos ao checkout, integramos meios de pagamento, gestão de estoque, logística e muito mais, tudo em uma solução robusta, escalável e pronta para vender.",
    icon: ShoppingBag
  },
  { 
    title: "Marketplaces", 
    desc: "Conectamos compradores e vendedores em uma única plataforma digital, criando ecossistemas de negócio completos e escaláveis. Desenvolvemos marketplaces com gestão de vendedores, controle de comissões, meios de pagamento integrados e uma experiência de compra fluida para o consumidor final. Ideal para empresas que desejam expandir seu modelo de negócio reunindo múltiplos fornecedores em um só lugar.",
    icon: Network
  },
  { 
    title: "Portais e Dashboards de Business Intelligence (BI)", 
    desc: "Transformamos dados em decisões. Desenvolvemos portais e dashboards de Business Intelligence que consolidam informações de diferentes fontes em uma visualização clara, intuitiva e em tempo real, permitindo que gestores e equipes acompanhem indicadores, identifiquem tendências e tomem decisões estratégicas com base em dados concretos, e não em suposições.",
    icon: BarChart3
  }
];

export default function SystemsStorytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Headline
  const headlineY = useTransform(scrollYProgress, [0, 0.12, 0.16], [0, 0, -60]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.12, 0.16], [1, 1, 0]);
  const headlineBlur = useTransform(scrollYProgress, [0, 0.12, 0.16], ["blur(0px)", "blur(0px)", "blur(8px)"]);

  // Card 1: ERP
  const card1X = useTransform(scrollYProgress, [0.16, 0.20, 0.28, 0.32], [-120, 0, 0, 120]);
  const card1Opacity = useTransform(scrollYProgress, [0.16, 0.20, 0.28, 0.32], [0, 1, 1, 0]);
  const card1Blur = useTransform(scrollYProgress, [0.16, 0.20, 0.28, 0.32], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);

  // Card 2: CRM
  const card2X = useTransform(scrollYProgress, [0.32, 0.36, 0.44, 0.48], [120, 0, 0, -120]);
  const card2Opacity = useTransform(scrollYProgress, [0.32, 0.36, 0.44, 0.48], [0, 1, 1, 0]);
  const card2Blur = useTransform(scrollYProgress, [0.32, 0.36, 0.44, 0.48], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);

  // Card 3: E-commerce
  const card3Y = useTransform(scrollYProgress, [0.48, 0.52, 0.60, 0.64], [80, 0, 0, -80]);
  const card3Scale = useTransform(scrollYProgress, [0.48, 0.52, 0.60, 0.64], [0.92, 1, 1, 1.04]);
  const card3Opacity = useTransform(scrollYProgress, [0.48, 0.52, 0.60, 0.64], [0, 1, 1, 0]);

  // Card 4: Marketplaces
  const card4X = useTransform(scrollYProgress, [0.66, 0.70, 0.76, 0.80], [-120, 0, 0, 120]);
  const card4Opacity = useTransform(scrollYProgress, [0.66, 0.70, 0.76, 0.80], [0, 1, 1, 0]);
  const card4Blur = useTransform(scrollYProgress, [0.66, 0.70, 0.76, 0.80], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);

  // Card 5: BI
  const card5Scale = useTransform(scrollYProgress, [0.80, 0.84], [0.85, 1]);
  const card5Opacity = useTransform(scrollYProgress, [0.80, 0.84], [0, 1]);

  // Active dot index
  const activeIndex = useTransform(scrollYProgress, (v) => {
    if (v < 0.16) return -1;
    if (v < 0.32) return 0;
    if (v < 0.48) return 1;
    if (v < 0.64) return 2;
    if (v < 0.80) return 3;
    return 4;
  });

  return (
    <section ref={containerRef} className="relative h-[400vh] md:h-[600vh] bg-[#f5f3ee] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Chapter 0: Headline */}
        <motion.div 
          className="absolute flex flex-col items-center justify-center text-center px-6 w-full h-full"
          style={{ y: headlineY, opacity: headlineOpacity, filter: headlineBlur }}
        >
          <HeadlineCanvas scrollYProgress={scrollYProgress} />
          
          <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto">
            <style>{`
              .s3-title-wrapper {
                position: relative;
                display: inline-block;
                padding: 20px 40px;
                margin-bottom: 20px;
              }
              .s3-title-line-1 {
                font-size: clamp(1.8rem, 8vw, 64px);
                font-weight: 900;
                color: #c9a84c;
                display: block;
                text-align: center;
                line-height: 1.1;
              }
              .s3-title-line-2 {
                font-size: clamp(2.2rem, 10vw, 80px);
                font-weight: 900;
                color: #1a1a1a;
                display: block;
                text-align: center;
                margin-top: -8px;
                line-height: 1.1;
              }
              .s3-corner {
                position: absolute;
                width: 28px;
                height: 28px;
                stroke: #c9a84c;
                stroke-width: 2px;
                fill: none;
              }
              .s3-corner-tl { top: 0; left: 0; }
              .s3-corner-tr { top: 0; right: 0; transform: scaleX(-1); }
              .s3-corner-bl { bottom: 0; left: 0; transform: scaleY(-1); }
              .s3-corner-br { bottom: 0; right: 0; transform: scale(-1); }
              
              .s3-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 40px;
                margin-top: 48px;
                text-align: center;
                width: 100%;
                max-width: 1000px;
                padding: 0 20px;
              }
              .s3-col-icon {
                width: 48px;
                height: 48px;
                stroke: #c9a84c;
                stroke-width: 1.5px;
                fill: none;
                margin: 0 auto 16px;
                display: block;
              }
              .s3-col-title {
                font-size: 16px;
                font-weight: 700;
                color: #c9a84c;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .s3-col-text {
                font-size: 14px;
                color: #666;
                line-height: 1.7;
                max-width: 280px;
                margin: 0 auto;
              }
              
              @media (max-width: 768px) {
                .s3-title-wrapper { padding: 12px 20px; }
                .s3-grid { grid-template-columns: 1fr; gap: 24px; margin-top: 32px; padding: 0 10px; }
                .s3-col-text { font-size: 13px; }
                .s3-btn { padding: 12px 28px; font-size: 14px; }
                .s3-cta { margin-top: 36px; }
              }
              @media (max-width: 480px) {
                .s3-title-wrapper { padding: 10px 14px; margin-bottom: 12px; }
                .s3-grid { gap: 20px; margin-top: 24px; }
                .s3-col-title { font-size: 14px; }
                .s3-col-text { font-size: 12px; }
                .s3-btn { padding: 10px 24px; font-size: 13px; }
                .s3-cta { margin-top: 28px; }
              }
              .s3-cta {
                margin-top: 60px;
                display: flex;
                justify-content: center;
                position: relative;
                z-index: 20;
              }
              .s3-btn {
                background: #1a1a1a;
                color: #fff;
                padding: 14px 36px;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 600;
                transition: 0.3s ease;
                text-decoration: none;
                display: inline-block;
              }
              .s3-btn:hover {
                background: #c9a84c;
                color: #1a1a1a;
              }
              .s3-triangles-canvas {
                position: absolute;
                inset: 0;
                pointer-events: none;
                z-index: 0;
                opacity: 0.2;
                width: 100%;
                height: 100%;
              }
            `}</style>
            
            <S3Triangles />

            {/* Title Wrapper */}
            <div className="s3-title-wrapper">
              <svg className="s3-corner s3-corner-tl" viewBox="0 0 28 28">
                <path d="M1 28 L1 1 L28 1" vectorEffect="non-scaling-stroke" />
              </svg>
              <svg className="s3-corner s3-corner-tr" viewBox="0 0 28 28">
                <path d="M1 28 L1 1 L28 1" vectorEffect="non-scaling-stroke" />
              </svg>
              <svg className="s3-corner s3-corner-bl" viewBox="0 0 28 28">
                <path d="M1 28 L1 1 L28 1" vectorEffect="non-scaling-stroke" />
              </svg>
              <svg className="s3-corner s3-corner-br" viewBox="0 0 28 28">
                <path d="M1 28 L1 1 L28 1" vectorEffect="non-scaling-stroke" />
              </svg>

              <span className="s3-title-line-1">Sistemas de Gestão</span>
              <span className="s3-title-line-2">Personalizados</span>
            </div>

            {/* 3 Column Block */}
            <div className="s3-grid">
              {/* Column 1 */}
              <div>
                <svg className="s3-col-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <path d="M10 8 L6 16" />
                  <path d="M14 8 L18 16" />
                  <path d="M9 18 H15" />
                </svg>
                <h3 className="s3-col-title">Regras e Processos</h3>
                <p className="s3-col-text">
                  Cada negócio tem suas próprias regras, processos e desafios.
                </p>
              </div>

              {/* Column 2 */}
              <div>
                <svg className="s3-col-icon" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
                <h3 className="s3-col-title">Soluções Sob Medida</h3>
                <p className="s3-col-text">
                  Por isso, desenvolvemos sistemas de gestão sob medida, projetados para se adaptar à realidade da sua empresa e não o contrário.
                </p>
              </div>

              {/* Column 3 */}
              <div>
                <svg className="s3-col-icon" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2" />
                  <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2" />
                </svg>
                <h3 className="s3-col-title">Plataforma Inteligente</h3>
                <p className="s3-col-text">
                  Nossas soluções centralizam informações, automatizam tarefas e conectam diferentes áreas do seu negócio em uma única plataforma inteligente.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="s3-cta">
              <a href="/contato-quiz" className="s3-btn">Agende uma Demonstração</a>
            </div>
          </div>
        </motion.div>

        {/* Cards Container */}
        <div className="relative w-full max-w-[680px] h-auto min-h-[300px] md:h-[400px] flex items-center justify-center pointer-events-none px-4 md:px-0">
          
          {/* Card 1 */}
          <motion.div 
            className="absolute w-full bg-white rounded-[12px] md:rounded-[20px] p-5 md:p-10 pointer-events-auto"
            style={{ 
              border: '1px solid rgba(201, 168, 76, 0.6)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
              x: card1X, opacity: card1Opacity, filter: card1Blur
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <LayoutGrid size={16} color="#c9a84c" strokeWidth={2} />
              <span className="text-[#c9a84c] text-[12px] tracking-[2px] font-medium">01/05</span>
            </div>
            <h3 className="text-[#c9a84c] text-[18px] md:text-[22px] font-bold mb-3 md:mb-4">{systems[0].title}</h3>
            <p className="text-[#4a4a4a] text-[13px] md:text-[15px] leading-[1.6] md:leading-[1.7]">{systems[0].desc}</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className="absolute w-full bg-white rounded-[12px] md:rounded-[20px] p-5 md:p-10 pointer-events-auto"
            style={{ 
              border: '1px solid rgba(201, 168, 76, 0.6)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
              x: card2X, opacity: card2Opacity, filter: card2Blur
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <Users size={16} color="#c9a84c" strokeWidth={2} />
              <span className="text-[#c9a84c] text-[12px] tracking-[2px] font-medium">02/05</span>
            </div>
            <h3 className="text-[#c9a84c] text-[18px] md:text-[22px] font-bold mb-3 md:mb-4">{systems[1].title}</h3>
            <p className="text-[#4a4a4a] text-[13px] md:text-[15px] leading-[1.6] md:leading-[1.7]">{systems[1].desc}</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            className="absolute w-full bg-white rounded-[12px] md:rounded-[20px] p-5 md:p-10 pointer-events-auto"
            style={{ 
              border: '1px solid rgba(201, 168, 76, 0.6)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
              y: card3Y, scale: card3Scale, opacity: card3Opacity
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <ShoppingBag size={16} color="#c9a84c" strokeWidth={2} />
              <span className="text-[#c9a84c] text-[12px] tracking-[2px] font-medium">03/05</span>
            </div>
            <h3 className="text-[#c9a84c] text-[18px] md:text-[22px] font-bold mb-3 md:mb-4">{systems[2].title}</h3>
            <p className="text-[#4a4a4a] text-[13px] md:text-[15px] leading-[1.6] md:leading-[1.7]">{systems[2].desc}</p>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            className="absolute w-full bg-white rounded-[12px] md:rounded-[20px] p-5 md:p-10 pointer-events-auto"
            style={{ 
              border: '1px solid rgba(201, 168, 76, 0.6)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
              x: card4X, opacity: card4Opacity, filter: card4Blur
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <Network size={16} color="#c9a84c" strokeWidth={2} />
              <span className="text-[#c9a84c] text-[12px] tracking-[2px] font-medium">04/05</span>
            </div>
            <h3 className="text-[#c9a84c] text-[18px] md:text-[22px] font-bold mb-3 md:mb-4">{systems[3].title}</h3>
            <p className="text-[#4a4a4a] text-[13px] md:text-[15px] leading-[1.6] md:leading-[1.7]">{systems[3].desc}</p>
          </motion.div>

          {/* Card 5 */}
          <motion.div 
            className="absolute w-full bg-white rounded-[12px] md:rounded-[20px] p-5 md:p-10 pointer-events-auto"
            style={{ 
              border: '1px solid rgba(201, 168, 76, 0.6)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
              scale: card5Scale, opacity: card5Opacity
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <BarChart3 size={16} color="#c9a84c" strokeWidth={2} />
              <span className="text-[#c9a84c] text-[12px] tracking-[2px] font-medium">05/05</span>
            </div>
            <h3 className="text-[#c9a84c] text-[18px] md:text-[22px] font-bold mb-3 md:mb-4">{systems[4].title}</h3>
            <p className="text-[#4a4a4a] text-[13px] md:text-[15px] leading-[1.6] md:leading-[1.7]">{systems[4].desc}</p>
          </motion.div>

        </div>

        {/* Progress Indicator */}
        <div className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-3 z-50">
          {[0, 1, 2, 3, 4].map((i) => (
            <DotIndicator key={i} index={i} activeIndex={activeIndex} />
          ))}
        </div>

      </div>
    </section>
  );
}

function DotIndicator({ index, activeIndex }: { index: number, activeIndex: any, key?: any }) {
  const [isActive, setIsActive] = React.useState(false);

  useMotionValueEvent(activeIndex, "change", (latest: number) => {
    setIsActive(latest === index);
  });

  return (
    <motion.div
      className="rounded-full bg-[#c9a84c]"
      animate={{
        width: isActive ? 8 : 6,
        height: isActive ? 8 : 6,
        opacity: isActive ? 1 : 0.3,
      }}
      transition={{ duration: 0.3 }}
    />
  );
}

function HeadlineCanvas({ scrollYProgress }: { scrollYProgress: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);

    const numDots = 40;
    const dots: any[] = [];
    for (let i = 0; i < numDots; i++) {
      const speed = 0.15 + Math.random() * 0.2;
      const angle = Math.random() * Math.PI * 2;
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 0.5,
        opacity: 0.25 + Math.random() * 0.2
      });
    }

    let animationId: number;
    let scatterFactor = 1;
    let lastFrame = 0;

    const render = () => {
      const now = performance.now();
      if (now - lastFrame < 33) { animationId = requestAnimationFrame(render); return; }
      lastFrame = now;

      ctx.clearRect(0, 0, width, height);
      
      const progress = scrollYProgress.get();
      
      let canvasOpacity = 1;
      if (progress > 0.12) {
        const exitProgress = Math.min(1, (progress - 0.12) / 0.04);
        scatterFactor = 1 + exitProgress * 8;
        canvasOpacity = 1 - exitProgress;
      } else {
        scatterFactor = 1;
        canvasOpacity = 1;
      }

      ctx.globalAlpha = canvasOpacity;

      dots.forEach(dot => {
        dot.x += dot.vx * scatterFactor;
        dot.y += dot.vy * scatterFactor;

        if (dot.x < 0) dot.x = width;
        if (dot.x > width) dot.x = 0;
        if (dot.y < 0) dot.y = height;
        if (dot.y > height) dot.y = 0;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${dot.opacity})`;
        ctx.fill();
      });

      ctx.lineWidth = 0.8;
      for (let i = 0; i < numDots; i++) {
        for (let j = i + 1; j < numDots; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            const lineOpacity = 0.15 * (1 - dist / 120);
            ctx.strokeStyle = `rgba(201, 168, 76, ${lineOpacity})`;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [scrollYProgress]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}

function S3Triangles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // s3_initTriangles logic
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    
    const resize = () => {
      width = canvas.parentElement?.clientWidth || canvas.clientWidth;
      height = canvas.parentElement?.clientHeight || canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    resize();
    window.addEventListener('resize', resize);

    const dots: {x: number, y: number}[] = [];
    const numDots = 25;

    for (let i = 0; i < numDots; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height
      });
    }

    let lastFrame = 0;
    let frameCount = 0;
    let animationId: number;
    // Cache sorted distances per dot, only re-sort every 3rd frame
    const cachedNearest: { index: number, dist: number }[][] = new Array(numDots);

    const render = () => {
      const now = performance.now();
      if (now - lastFrame < 33) { animationId = requestAnimationFrame(render); return; }
      lastFrame = now;
      frameCount++;

      ctx.clearRect(0, 0, width, height);

      // Draw dots
      ctx.fillStyle = '#c9a84c';
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect neighbors
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.3)';
      ctx.lineWidth = 0.8;

      dots.forEach((dot, i) => {
        // Only re-sort every 3rd frame to save CPU
        if (frameCount % 3 === 1 || !cachedNearest[i]) {
          const distances = dots.map((d, index) => {
            if (index === i) return { index, dist: Infinity };
            const dx = d.x - dot.x;
            const dy = d.y - dot.y;
            return { index, dist: Math.sqrt(dx * dx + dy * dy) };
          });

          distances.sort((a, b) => a.dist - b.dist);
          cachedNearest[i] = distances.slice(0, 2);
        }

        const nearest = cachedNearest[i];
        nearest.forEach(n => {
          const neighbor = dots[n.index];
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(neighbor.x, neighbor.y);
          ctx.stroke();
        });
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="s3-triangles-canvas" />;
}
