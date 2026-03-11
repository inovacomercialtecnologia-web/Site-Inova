import React, { useMemo } from 'react';

export default function AnimatedSvgDivider() {
  const { nodes, edges } = useMemo(() => {
    const numNodes = 40;
    const nodes = [];
    
    for (let i = 0; i < numNodes; i++) {
      // Distribute x from 0 to 100
      let x = (i / (numNodes - 1)) * 100;
      // Make it denser in the center
      const distFromCenter = x - 50;
      x = x - distFromCenter * 0.4 + (Math.random() * 6 - 3);
      // Keep within bounds
      x = Math.max(1, Math.min(99, x));
      
      // Y base position forming a loose wave
      const wave = Math.sin((x / 100) * Math.PI) * 15;
      const yBase = 70 + wave + (Math.random() * 30 - 15);
      
      const duration = 2 + Math.random() * 2; // 2s to 4s
      const delay = Math.random() * 4; // 0s to 4s
      const amplitude = 5 + Math.random() * 10; // 5px to 15px

      nodes.push({
        id: i,
        x,
        yBase,
        duration,
        delay,
        amplitude
      });
    }

    const edges = [];
    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].yBase - nodes[j].yBase;
        // Approximate distance (assuming 100% width is roughly 1200px)
        const pxDx = dx * 12;
        const dist = Math.sqrt(pxDx * pxDx + dy * dy);
        
        if (dist < 120) {
          if (Math.random() > 0.4) {
            edges.push({ source: i, target: j });
          }
        }
      }
    }

    return { nodes, edges };
  }, []);

  return (
    <div className="relative w-full h-[140px] bg-transparent overflow-hidden block m-0 p-0">
      {/* Top gradient blending into black hero */}
      <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      
      {/* Bottom gradient blending into white SaaS section */}
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-b from-transparent to-[#ffffff] z-10 pointer-events-none" />

      <svg className="w-full h-full block" style={{ minHeight: '140px' }}>
        {edges.map((edge, i) => {
          const source = nodes[edge.source];
          const target = nodes[edge.target];
          return (
            <line
              key={`edge-${i}`}
              x1={`${source.x}%`}
              x2={`${target.x}%`}
              stroke="#c9a84c"
              strokeWidth="1"
              strokeOpacity="0.4"
            >
              <animate
                attributeName="y1"
                values={`${source.yBase - source.amplitude};${source.yBase + source.amplitude};${source.yBase - source.amplitude}`}
                dur={`${source.duration}s`}
                begin={`-${source.delay}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              />
              <animate
                attributeName="y2"
                values={`${target.yBase - target.amplitude};${target.yBase + target.amplitude};${target.yBase - target.amplitude}`}
                dur={`${target.duration}s`}
                begin={`-${target.delay}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              />
            </line>
          );
        })}
        {nodes.map((node) => (
          <circle
            key={`node-${node.id}`}
            cx={`${node.x}%`}
            r="2"
            fill="#c9a84c"
          >
            <animate
              attributeName="cy"
              values={`${node.yBase - node.amplitude};${node.yBase + node.amplitude};${node.yBase - node.amplitude}`}
              dur={`${node.duration}s`}
              begin={`-${node.delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}
