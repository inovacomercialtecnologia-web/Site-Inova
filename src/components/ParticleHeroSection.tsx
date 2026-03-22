import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface Particle {
  id: number;
  chaosX: number; chaosY: number;
  gridX: number; gridY: number;
  cloudX: number; cloudY: number;
  baseSize: number;
  speed: number;
  angle: number;
  isGold: boolean;
}

export default function ParticleHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const text1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.3], [1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.35, 0.6, 0.65], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.3, 0.65], [50, -50]);

  const text3Opacity = useTransform(scrollYProgress, [0.65, 0.7, 1], [0, 1, 1]);
  const text3Y = useTransform(scrollYProgress, [0.65, 1], [50, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect prefers-reduced-motion — render one static frame then stop
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    let lastTime = 0;
    const isMobileDevice = cw < 768;
    const fpsInterval = isMobileDevice ? 1000 / 30 : 1000 / 60;

    const initParticles = () => {
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = cw * window.devicePixelRatio;
      canvas.height = ch * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      let numParticles = cw < 480 ? 12 : cw < 768 ? 35 : cw < 1024 ? 600 : 800;
      particles = [];

      for (let i = 0; i < numParticles; i++) {
        const chaosX = Math.random() * cw;
        const chaosY = Math.random() * ch;

        const cols = 8, rows = 5;
        const cellW = (cw * 0.6) / cols, cellH = (ch * 0.6) / rows;
        let gridX = cw * 0.2 + Math.floor(Math.random() * (cols + 1)) * cellW;
        let gridY = ch * 0.2 + Math.floor(Math.random() * (rows + 1)) * cellH;
        
        if (Math.random() > 0.5) {
          if (Math.random() > 0.5) gridX += (Math.random() - 0.5) * cellW;
          else gridY += (Math.random() - 0.5) * cellH;
        }

        let cloudX = cw / 2, cloudY = ch / 2;
        const cloudWidth = cw * 0.4;
        const R = cloudWidth / 4;
        const cx = cw / 2, cy = ch / 2;
        
        let found = false, attempts = 0;
        while (!found && attempts < 100) {
          const px = cx - R * 2.5 + Math.random() * R * 5;
          const py = cy - R * 2 + Math.random() * R * 4;
          
          const d1 = Math.hypot(px - cx, py - cy);
          const d2 = Math.hypot(px - (cx - R * 1.2), py - (cy + R * 0.3));
          const d3 = Math.hypot(px - (cx + R * 1.2), py - (cy + R * 0.3));
          const d4 = Math.hypot(px - (cx - R * 0.6), py - (cy - R * 0.5));
          const d5 = Math.hypot(px - (cx + R * 0.6), py - (cy - R * 0.5));
          
          if (d1 < R || d2 < R * 0.8 || d3 < R * 0.8 || d4 < R * 0.7 || d5 < R * 0.7 || 
             (px > cx - R * 1.2 && px < cx + R * 1.2 && py > cy && py < cy + R * 0.6)) {
            cloudX = px; cloudY = py; found = true;
          }
          attempts++;
        }
        if (!found) { cloudX = cx + (Math.random() - 0.5) * R * 2; cloudY = cy + (Math.random() - 0.5) * R * 2; }

        particles.push({
          id: i, chaosX, chaosY, gridX, gridY, cloudX, cloudY,
          baseSize: Math.random() * 2 + 1,
          speed: Math.random() * 0.002 + 0.001,
          angle: Math.random() * Math.PI * 2,
          isGold: Math.random() > 0.8
        });
      }
    };

    initParticles();
    window.addEventListener('resize', initParticles);

    const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      
      const elapsed = time - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = time - (elapsed % fpsInterval);

      ctx.clearRect(0, 0, cw, ch);
      const p = scrollYProgress.get();
      const currentPositions: {x: number, y: number}[] = [];
      const cloudScale = 1 + Math.sin(time * 0.002) * 0.02;

      particles.forEach((particle) => {
        let targetX = particle.chaosX, targetY = particle.chaosY;
        let color = particle.isGold ? 'rgba(201, 168, 76, 0.3)' : 'rgba(255, 255, 255, 0.4)';
        let size = particle.baseSize;

        if (p < 0.3) {
          targetX = particle.chaosX; targetY = particle.chaosY;
        } else if (p < 0.65) {
          const t = (p - 0.3) / 0.35;
          const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          targetX = lerp(particle.chaosX, particle.gridX, easeT);
          targetY = lerp(particle.chaosY, particle.gridY, easeT);
          color = particle.isGold ? `rgba(201, 168, 76, ${0.3 + easeT * 0.5})` : `rgba(255, 255, 255, ${0.4 + easeT * 0.2})`;
          if (t > 0.5 && particle.id % 10 === 0) size = Math.max(0.1, particle.baseSize + Math.sin(time * 0.005 + particle.id) * 1.5);
        } else {
          const t = (p - 0.65) / 0.35;
          const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          const cx = cw / 2, cy = ch / 2;
          targetX = lerp(particle.gridX, cx + (particle.cloudX - cx) * cloudScale, easeT);
          targetY = lerp(particle.gridY, cy + (particle.cloudY - cy) * cloudScale, easeT);
          color = particle.isGold ? `rgba(201, 168, 76, ${0.8 + Math.sin(time * 0.003 + particle.id) * 0.2})` : `rgba(201, 168, 76, ${0.4 + easeT * 0.4})`;
        }

        const wobbleX = Math.cos(time * particle.speed + particle.angle) * 20 * (1 - p * 0.8);
        const wobbleY = Math.sin(time * particle.speed + particle.angle) * 20 * (1 - p * 0.8);
        const finalX = targetX + wobbleX, finalY = targetY + wobbleY;
        
        currentPositions.push({ x: finalX, y: finalY });

        ctx.beginPath();
        ctx.arc(finalX, finalY, Math.max(0.1, size), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      let lineOpacity = 0.05;
      if (p >= 0.3 && p < 0.65) lineOpacity = lerp(0.05, 0.25, (p - 0.3) / 0.35);
      else if (p >= 0.65) lineOpacity = lerp(0.25, 0.1, (p - 0.65) / 0.35);

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(201, 168, 76, ${lineOpacity})`;

      const isMobile = cw < 768;
      const maxConnect = Math.min(isMobile ? 60 : 200, particles.length);
      for (let i = 0; i < maxConnect; i++) {
        for (let j = i + 1; j < maxConnect; j++) {
          const dx = currentPositions[i].x - currentPositions[j].x;
          const dy = currentPositions[i].y - currentPositions[j].y;
          if (dx * dx + dy * dy < 8000) {
            ctx.beginPath();
            ctx.moveTo(currentPositions[i].x, currentPositions[i].y);
            ctx.lineTo(currentPositions[j].x, currentPositions[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Render one frame, then only continue if motion is allowed
    render(performance.now());
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
    return () => { window.removeEventListener('resize', initParticles); cancelAnimationFrame(animationFrameId); };
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative h-[150vh] md:h-[300vh] bg-[#000000] w-full z-30">
      <canvas ref={canvasRef} className="sticky top-0 left-0 w-full h-screen pointer-events-none z-0" style={{ willChange: 'transform' }} />
      <div className="sticky top-0 h-screen w-full flex items-center justify-center pointer-events-none z-10 -mt-[100vh]">
        <motion.div style={{ opacity: text1Opacity, y: text1Y }} className="absolute text-center px-6 md:px-24 lg:px-32 xl:px-48 w-full max-w-5xl">
          <h2 className="text-lg md:text-3xl lg:text-5xl font-light text-white tracking-tight leading-tight">
            Tecnologia sem processo digitaliza <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent">caos.</span>
          </h2>
        </motion.div>
        <motion.div style={{ opacity: text2Opacity, y: text2Y }} className="absolute text-center px-6 md:px-24 lg:px-32 xl:px-48 w-full max-w-5xl">
          <h2 className="text-lg md:text-3xl lg:text-5xl font-light text-white tracking-tight leading-tight">
            Processos inteligentes transformam dados em <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent">decisões.</span>
          </h2>
        </motion.div>
        <motion.div style={{ opacity: text3Opacity, y: text3Y }} className="absolute text-center px-6 md:px-24 lg:px-32 xl:px-48 w-full max-w-5xl">
          <h2 className="text-lg md:text-3xl lg:text-5xl font-light text-white tracking-tight leading-tight">
            Sua operação na <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent">nuvem.</span><br />
            <span className="text-gray-400 text-sm md:text-2xl lg:text-3xl mt-4 block font-light">Simples. Escalável.</span>
          </h2>
        </motion.div>
        <div className="absolute bottom-12 left-0 w-full text-center">
          <p className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent text-xs md:text-sm tracking-[0.2em] uppercase font-medium">A virada de chave que sua operação precisa.</p>
        </div>
      </div>
    </section>
  );
}
