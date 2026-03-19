import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export default function ProcessTechSection() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const isMobileDevice = window.innerWidth < 768;
    const particleCount = isMobileDevice ? 150 : 800;
    const particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      chaos: number;
      id: number;

      constructor(w: number, h: number, id: number) {
        this.id = id;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        
        // Grid target (Order) - Centered
        const cols = 40;
        const rows = Math.ceil(particleCount / cols);
        const spacing = Math.min(w / cols, h / rows) * 0.85;
        const gridWidth = cols * spacing;
        const gridHeight = rows * spacing;
        
        const startX = (w - gridWidth) / 2;
        const startY = (h - gridHeight) / 2;

        this.baseX = startX + (id % cols) * spacing + spacing / 2;
        this.baseY = startY + Math.floor(id / cols) * spacing + spacing / 2;
        
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = Math.random() > 0.8 ? '#C9A84C' : '#FFFFFF';
        this.chaos = Math.random() * 100;
      }

      update(w: number, h: number, progress: number, mouse: {x: number, y: number}) {
        // Transition from Chaos to Order based on scroll progress
        // Reaches 100% order at progress 0.75 and stays there
        const assemblyProgress = Math.min(progress / 0.75, 1);
        const orderFactor = Math.pow(assemblyProgress, 1.5);
        const chaosFactor = 1 - orderFactor;

        // Chaos movement
        this.x += this.vx * chaosFactor * 5;
        this.y += this.vy * chaosFactor * 5;

        // Bounce chaos
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Order attraction
        const dx = this.baseX - this.x;
        const dy = this.baseY - this.y;
        this.x += dx * orderFactor * 0.15;
        this.y += dy * orderFactor * 0.15;

        // Mouse interaction (Magnet effect)
        const mdx = mouse.x - this.x;
        const mdy = mouse.y - this.y;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= mdx * force * 0.15 * (1 - orderFactor * 0.5);
          this.y -= mdy * force * 0.15 * (1 - orderFactor * 0.5);
        }
      }

      draw(ctx: CanvasRenderingContext2D, progress: number) {
        const assemblyProgress = Math.min(progress / 0.75, 1);
        ctx.globalAlpha = 0.2 + assemblyProgress * 0.6;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections if close and ordered
        if (assemblyProgress > 0.85 && this.id % 6 === 0) {
          ctx.globalAlpha = (assemblyProgress - 0.85) * 0.3;
          ctx.strokeStyle = '#C9A84C';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.baseX, this.baseY);
          ctx.stroke();
        }
      }
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles();
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.offsetWidth, canvas.offsetHeight, i));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const progress = smoothProgress.get();
      
      particles.forEach(p => {
        p.update(canvas.offsetWidth, canvas.offsetHeight, progress, mouse);
        p.draw(ctx, progress);
      });

      // Draw "Process Filter" line - Simplified to prevent flickering
      if (progress > 0.05 && progress < 0.8) {
        // Map 0.05-0.8 to 0-1 for line position
        const lineProgress = (progress - 0.05) / 0.75;
        const lineY = canvas.offsetHeight * (1 - lineProgress);
        
        ctx.save();
        ctx.globalAlpha = 0.4 * Math.sin(lineProgress * Math.PI); // Fade in/out at edges
        ctx.strokeStyle = '#C9A84C';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(canvas.offsetWidth, lineY);
        ctx.stroke();
        
        // Subtle glow without shadowBlur (which causes flickering)
        ctx.globalAlpha = 0.15 * Math.sin(lineProgress * Math.PI);
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#000000] h-[250vh] md:h-[400vh] font-sans">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center pt-20 md:pt-24">
        {/* Technical Background */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Side: Manifesto */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div
              style={{ 
                opacity: useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
                x: useTransform(smoothProgress, [0, 0.1], [-30, 0])
              }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-px bg-[#C9A84C]"></div>
                <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent text-[10px] uppercase tracking-[0.4em] font-medium">
                  A virada de chave
                </span>
              </div>
              
              <h2 className="text-[24px] md:text-[56px] font-light leading-[1.1] tracking-tight text-white mb-6 md:mb-8">
                Tecnologia sem processo <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent font-light tracking-tight">digitaliza caos.</span>
              </h2>

              <p className="text-[16px] md:text-[20px] font-light text-gray-400 leading-relaxed mb-12 max-w-[450px]">
                Sistemas caros não salvam operações ruins. Eles apenas as tornam mais rápidas na direção errada.
              </p>
            </motion.div>
          </div>

          {/* Right Side: The Engine */}
          <div className="lg:col-span-7 relative h-[300px] md:h-[500px] lg:h-[700px] w-full group">
            {/* Interactive Canvas */}
            <canvas 
              ref={canvasRef} 
              className="w-full h-full cursor-crosshair"
            />
            
            {/* Floating Status Labels */}
            <motion.div 
              style={{ opacity: useTransform(smoothProgress, [0, 0.35], [1, 0]) }}
              className="absolute top-10 left-1/2 -translate-x-1/2 px-6 py-3 border border-white/10 rounded-full bg-black/60 backdrop-blur-xl flex flex-col items-center gap-1"
            >
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest animate-pulse">Estado Atual</span>
              <span className="text-[12px] font-medium text-white uppercase tracking-[0.2em]">O Caos</span>
            </motion.div>

            <motion.div 
              style={{ opacity: useTransform(smoothProgress, [0.7, 0.85], [0, 1]) }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 border border-[#C9A84C]/30 rounded-full bg-[#C9A84C]/10 backdrop-blur-xl flex flex-col items-center gap-1"
            >
              <span className="text-[10px] font-mono text-[#C9A84C]/70 uppercase tracking-widest">Resultado Inova</span>
              <span className="text-[12px] font-medium text-[#C9A84C] uppercase tracking-[0.1em] text-center">Processos definidos e estruturados</span>
            </motion.div>

            {/* Hint for interaction */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-[8px] uppercase tracking-[0.3em] text-white/20">Mova o mouse para interagir</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
