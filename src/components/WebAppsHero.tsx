import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export default function WebAppsHero() {
  const { lines, dots } = useMemo(() => {
    const uiShapes = [
      // Top Nav
      [{x: 50, y: 80}, {x: 1550, y: 80}],
      [{x: 1400, y: 80}], [{x: 1450, y: 80}], [{x: 1500, y: 80}],

      // Sidebar
      [{x: 50, y: 120}, {x: 180, y: 120}, {x: 180, y: 850}, {x: 50, y: 850}, {x: 50, y: 120}],
      [{x: 80, y: 160}, {x: 150, y: 160}],
      [{x: 80, y: 200}, {x: 150, y: 200}],
      [{x: 80, y: 240}, {x: 150, y: 240}],
      [{x: 80, y: 280}, {x: 150, y: 280}],

      // Card 1: Data Table (Bottom Left)
      [{x: 220, y: 650}, {x: 600, y: 650}, {x: 600, y: 850}, {x: 220, y: 850}, {x: 220, y: 650}],
      [{x: 250, y: 700}, {x: 570, y: 700}],
      [{x: 250, y: 740}, {x: 570, y: 740}],
      [{x: 250, y: 780}, {x: 570, y: 780}],
      [{x: 250, y: 820}, {x: 570, y: 820}],

      // Card 2: Line Chart (Bottom Center)
      [{x: 640, y: 650}, {x: 1050, y: 650}, {x: 1050, y: 850}, {x: 640, y: 850}, {x: 640, y: 650}],
      [{x: 670, y: 800}, {x: 740, y: 720}, {x: 810, y: 760}, {x: 880, y: 680}, {x: 950, y: 740}, {x: 1020, y: 680}],

      // Card 3: Stats (Top Right)
      [{x: 1090, y: 120}, {x: 1550, y: 120}, {x: 1550, y: 350}, {x: 1090, y: 350}, {x: 1090, y: 120}],
      [{x: 1140, y: 235}], // Dot
      [{x: 1190, y: 215}, {x: 1500, y: 215}],
      [{x: 1190, y: 255}, {x: 1400, y: 255}],

      // Card 4: Bar Chart (Center Right)
      [{x: 1090, y: 390}, {x: 1550, y: 390}, {x: 1550, y: 850}, {x: 1090, y: 850}, {x: 1090, y: 390}],
      [{x: 1150, y: 800}, {x: 1150, y: 500}],
      [{x: 1250, y: 800}, {x: 1250, y: 600}],
      [{x: 1350, y: 800}, {x: 1350, y: 450}],
      [{x: 1450, y: 800}, {x: 1450, y: 550}]
    ];

    const generatedLines = [];
    const dotsMap = new Map();

    uiShapes.forEach((shape) => {
      if (shape.length > 1) {
        const pathD = shape.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
        generatedLines.push(pathD);
      }
      shape.forEach(pt => {
        const key = `${pt.x},${pt.y}`;
        if (!dotsMap.has(key)) {
          dotsMap.set(key, { x: pt.x, y: pt.y });
        }
      });
    });

    const allDots = [];
    let dotIndex = 0;

    // UI Dots (Vertices)
    dotsMap.forEach((pt) => {
      const i = dotIndex++;
      const randomX = (Math.sin(i * 12.34) * 0.5 + 0.5) * 1600;
      const randomY = (Math.cos(i * 43.21) * 0.5 + 0.5) * 900;
      allDots.push({
        id: `ui-dot-${i}`,
        ix: randomX,
        iy: randomY,
        fx: pt.x,
        fy: pt.y,
        isUI: true,
        opacity: 0.6 + (Math.sin(i) * 0.4) // 0.2 to 1.0
      });
    });

    // Background Noise Dots
    for (let i = 0; i < 40; i++) {
      const idx = dotIndex++;
      const randomX = (Math.sin(idx * 33.33) * 0.5 + 0.5) * 1600;
      const randomY = (Math.cos(idx * 55.55) * 0.5 + 0.5) * 900;
      const driftX = randomX + (Math.sin(idx * 2) * 100);
      const driftY = randomY + (Math.cos(idx * 2) * 100);
      allDots.push({
        id: `bg-dot-${idx}`,
        ix: randomX,
        iy: randomY,
        fx: driftX,
        fy: driftY,
        isUI: false,
        opacity: 0.1 + (Math.cos(idx) * 0.5 + 0.5) * 0.3 // 0.1 to 0.4
      });
    }

    return { lines: generatedLines, dots: allDots };
  }, []);

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 0.3,
      transition: { 
        pathLength: { duration: 1.5, delay: 0.5, ease: "easeInOut" },
        opacity: { duration: 0.5, delay: 0.5 }
      }
    }
  };

  return (
    <section className="min-h-screen w-full bg-[#0a0a0a] flex items-center relative overflow-hidden">
      
      {/* Abstract Geometric Blueprint Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg 
          viewBox="0 0 1600 900" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Lines */}
          {lines.map((d, i) => (
            <motion.path
              key={`line-${i}`}
              d={d}
              stroke="#c9a84c"
              strokeWidth="1"
              fill="none"
              variants={lineVariants}
              initial="hidden"
              animate="visible"
            />
          ))}

          {/* Dots */}
          {dots.map((dot) => {
            const randomDuration = 3 + Math.random() * 2;
            const randomDelay = Math.random() * 2;
            
            return (
              <motion.g
                key={dot.id}
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: randomDuration, delay: 2 + randomDelay, ease: "easeInOut" }}
              >
                <motion.circle
                  r={dot.isUI ? 2 : 1.5}
                  fill="#c9a84c"
                  initial={{ cx: dot.ix, cy: dot.iy, opacity: 0 }}
                  animate={{ 
                    cx: [dot.ix, dot.ix, dot.fx], 
                    cy: [dot.iy, dot.iy, dot.fy],
                    opacity: [0, dot.opacity, dot.opacity]
                  }}
                  transition={{ 
                    cx: { duration: 2, times: [0, 0.25, 1], ease: "easeInOut" },
                    cy: { duration: 2, times: [0, 0.25, 1], ease: "easeInOut" },
                    opacity: { duration: 2, times: [0, 0.25, 1], ease: "easeOut" }
                  }}
                />
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-start text-left max-w-4xl px-8 ml-0 md:ml-[150px] lg:ml-[220px] w-full mt-16">
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0, ease: "easeOut" }}
        >
          Aplicações Web
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.3, ease: "easeOut" }}
        >
          Softwares desenvolvidos para otimizar e integrar todos os processos internos do seu negócio.
        </motion.p>
      </div>

    </section>
  );
}
