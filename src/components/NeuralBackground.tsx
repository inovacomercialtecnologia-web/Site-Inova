import React, { useEffect, useRef } from 'react';

interface NeuralBackgroundProps {
  className?: string;
  opacity?: number;
  nodeCount?: number;
  connectionDist?: number;
  color?: string; // rgba format
}

export default function NeuralBackground({
  className = "absolute inset-0 z-[1]",
  opacity = 0.55,
  nodeCount = 55,
  connectionDist = 160,
  color = "201, 168, 76" // #C9A84C in RGB
}: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const isMobile = window.innerWidth < 768;
    const actualNodeCount = isMobile ? Math.min(nodeCount, 20) : nodeCount;
    const actualConnectionDist = isMobile ? Math.min(connectionDist, 100) : connectionDist;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const nodes: any[] = [];

    for (let i = 0; i < actualNodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1.5,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let lastFrame = 0;

    const drawNeural = () => {
      const now = performance.now();
      const frameInterval = isMobile ? 50 : 33; // ~20fps mobile, ~30fps desktop
      if (now - lastFrame < frameInterval) { animationFrameId = requestAnimationFrame(drawNeural); return; }
      lastFrame = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Move nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.02;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < actualConnectionDist) {
            const alpha = (1 - d / actualConnectionDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const pulse = Math.sin(n.pulse) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${pulse * 0.8})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawNeural);
    };

    drawNeural();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodeCount, connectionDist, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className} 
      style={{ opacity }}
    />
  );
}
