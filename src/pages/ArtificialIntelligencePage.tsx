import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ArtificialIntelligencePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /* ── PROGRESS ───────────────────────────────────────── */
    const prog = document.getElementById('progress');
    
    const onScroll = () => {
      if (prog) {
        prog.style.width = (window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight) * 100) + '%';
      }
    };
    window.addEventListener('scroll', onScroll);

    /* ── SCROLL REVEAL (sections 3-5) ───────────────────── */
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.r').forEach(el => obs.observe(el));

    /* ── NEURAL NETWORK CANVAS ──────────────────────────── */
    (function() {
      const canvas = document.getElementById('ia-neural') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let W: number, H: number;
      let particles: any[] = [];
      let signals: any[] = [];
      let frame = 0;
      let mouse = { x: -1000, y: -1000 };

      const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      };
      const onMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
      };

      window.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseleave', onMouseLeave);

      function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        initParticles();
      }

      function initParticles() {
        particles = [];
        // Density based on screen size — reduced on mobile for performance
        const isMobile = W < 768;
        const numParticles = isMobile ? Math.min(30, Math.floor((W * H) / 18000)) : Math.floor((W * H) / 10000);
        for (let i = 0; i < numParticles; i++) {
          const isHub = Math.random() > 0.92;
          particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * (isHub ? 0.15 : 0.35),
            vy: (Math.random() - 0.5) * (isHub ? 0.15 : 0.35),
            radius: isHub ? Math.random() * 3 + 3 : Math.random() * 1.5 + 1,
            isHub: isHub,
            connections: [],
            phase: Math.random() * Math.PI * 2
          });
        }
      }

      function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
          particles[i].connections = [];
        }
        
        for (let i = 0; i < particles.length; i++) {
          // Mouse interaction
          const dxMouse = particles[i].x - mouse.x;
          const dyMouse = particles[i].y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          
          if (distMouse < 200) {
            const alpha = 1 - (distMouse / 200);
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.strokeStyle = `rgba(201,168,76,${alpha * 0.4})`;
            ctx!.lineWidth = 0.8 + (alpha * 1);
            ctx!.stroke();
            
            // Subtle repel
            particles[i].x += (dxMouse / distMouse) * 0.4;
            particles[i].y += (dyMouse / distMouse) * 0.4;
          }

          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = particles[i].isHub || particles[j].isHub ? 220 : 140;
            
            if (dist < maxDist) {
              particles[i].connections.push(particles[j]);
              particles[j].connections.push(particles[i]);
              
              const alpha = 1 - (dist / maxDist);
              ctx!.beginPath();
              ctx!.moveTo(particles[i].x, particles[i].y);
              ctx!.lineTo(particles[j].x, particles[j].y);
              ctx!.strokeStyle = `rgba(201,168,76,${alpha * 0.3})`;
              ctx!.lineWidth = 0.5 + (alpha * 0.6);
              ctx!.stroke();
            }
          }
        }
      }

      function spawnSignal() {
        if (particles.length === 0) return;
        // Prefer spawning from hubs
        const hubs = particles.filter(p => p.isHub);
        const pool = hubs.length > 0 && Math.random() > 0.5 ? hubs : particles;
        const startNode = pool[Math.floor(Math.random() * pool.length)];
        
        if (startNode.connections.length > 0) {
          const targetNode = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];
          signals.push({
            start: startNode,
            target: targetNode,
            progress: 0,
            speed: 0.01 + Math.random() * 0.02
          });
        }
      }

      function updateAndDrawSignals() {
        for (let i = signals.length - 1; i >= 0; i--) {
          const s = signals[i];
          s.progress += s.speed;
          
          if (s.progress >= 1) {
            if (Math.random() > 0.1 && s.target.connections.length > 1) {
              const nextTargets = s.target.connections.filter((n: any) => n !== s.start);
              if (nextTargets.length > 0) {
                s.start = s.target;
                s.target = nextTargets[Math.floor(Math.random() * nextTargets.length)];
                s.progress = 0;
              } else {
                signals.splice(i, 1);
              }
            } else {
              signals.splice(i, 1);
            }
            continue;
          }
          
          const x = s.start.x + (s.target.x - s.start.x) * s.progress;
          const y = s.start.y + (s.target.y - s.start.y) * s.progress;
          
          ctx!.beginPath();
          ctx!.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx!.fillStyle = '#ffffff';
          ctx!.fill();
          
          ctx!.beginPath();
          ctx!.arc(x, y, 10, 0, Math.PI * 2);
          ctx!.fillStyle = 'rgba(255,255,255,0.2)';
          ctx!.fill();
        }
      }

      function drawNodes() {
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.x < 0) { p.x = 0; p.vx *= -1; }
          if (p.x > W) { p.x = W; p.vx *= -1; }
          if (p.y < 0) { p.y = 0; p.vy *= -1; }
          if (p.y > H) { p.y = H; p.vy *= -1; }
          
          const breathe = Math.sin(frame * 0.03 + p.phase) * (p.isHub ? 2.5 : 1.2);
          const r = p.radius;
          
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r + 6 + breathe, 0, Math.PI * 2);
          ctx!.fillStyle = p.isHub ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.08)';
          ctx!.fill();
          
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx!.fillStyle = p.isHub ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.6)';
          ctx!.fill();
        });
      }

      function loop() {
        ctx!.clearRect(0, 0, W, H);
        frame++;

        if (frame % 20 === 0) spawnSignal();
        if (frame % 35 === 0) spawnSignal();

        drawConnections();
        drawNodes();
        updateAndDrawSignals();

        (window as any)._iahero_animationId = requestAnimationFrame(loop);
      }

      resize();
      window.addEventListener('resize', resize);
      canvas.style.opacity = '1';
      loop();
      
      (window as any)._iahero_cleanup = () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseleave', onMouseLeave);
        cancelAnimationFrame((window as any)._iahero_animationId);
      };
    })();

    /* ── SECTION 2 HOVER REVEAL ────────────────────────── */
    const section2 = document.getElementById('sConnect');
    let io2: IntersectionObserver;
    let s2Interval: any;

    if (section2) {
      const items = section2.querySelectorAll('.sc2-item');
      const panels = section2.querySelectorAll('.sc2-svg-panel');
      
      const activate = (index: number) => {
        items.forEach((item, i) => {
          item.classList.toggle('active', i === index);
        });
        panels.forEach((panel, i) => {
          panel.classList.toggle('active', i === index);
        });
      };

      items.forEach((item, i) => {
        item.addEventListener('click', () => activate(i));
        item.addEventListener('mouseenter', () => activate(i));
      });

      let current = 0;
      s2Interval = setInterval(() => {
        current = (current + 1) % items.length;
        activate(current);
      }, 4000);

      io2 = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        // The .r classes will handle the entrance animation
        io2.disconnect();
      }, { threshold: 0.1 });
      io2.observe(section2);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if ((window as any)._iahero_cleanup) (window as any)._iahero_cleanup();
      obs.disconnect();
      if (io2) io2.disconnect();
      if (s2Interval) clearInterval(s2Interval);
    };
  }, []);

  useEffect(() => {
    const iahero_initEntrance = () => {
      setTimeout(() => {
        const b = document.querySelector('.iahero-breadcrumb') as HTMLElement;
        if (b) { b.style.opacity = '1'; b.style.transition = 'all 0.5s ease-out'; b.style.transform = 'translateY(0)'; }
      }, 100);
      setTimeout(() => {
        const l1 = document.querySelector('.iahero-line1') as HTMLElement;
        if (l1) { l1.style.opacity = '1'; l1.style.transition = 'all 0.7s ease-out'; l1.style.transform = 'translateX(0)'; }
      }, 300);
      setTimeout(() => {
        const l2 = document.querySelector('.iahero-line2') as HTMLElement;
        if (l2) { l2.style.opacity = '1'; l2.style.transition = 'all 0.7s ease-out'; l2.style.transform = 'translateX(0)'; }
      }, 600);
      setTimeout(() => {
        const cl = document.querySelector('.iahero-chapter-line') as HTMLElement;
        if (cl) { cl.style.opacity = '1'; cl.style.transition = 'all 0.5s ease-out'; cl.style.transform = 'scaleX(1)'; }
      }, 900);
      setTimeout(() => document.getElementById('heroSubCols')?.classList.add('visible'), 1060);
      setTimeout(() => {
        const badges = document.querySelectorAll('.iahero-badge');
        badges.forEach((b, i) => {
          (b as HTMLElement).style.opacity = '1';
          (b as HTMLElement).style.transition = `all 0.5s ease-out ${i * 0.15}s`;
        });
      }, 1400);
    };
    iahero_initEntrance();
  }, []);

  return (
    <div className="ia-page-container">
      <div className="progress" id="progress"></div>

      {/* HERO */}
      <section className="iahero-wrapper">
        <div className="iahero-shield"></div>
        <canvas id="ia-neural" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}}></canvas>
        <div className="iahero-left">
            <div className="iahero-breadcrumb">
              O que fazemos / Inteligência Artificial
            </div>
            
            <h1 className="iahero-headline">
              <span className="iahero-line1">Inteligência</span>
              <span className="iahero-line2">Artificial</span>
            </h1>
            
            <div className="iahero-chapter-line"></div>
            
            <div className="iahero-sub-cols" id="heroSubCols">
              <p className="iahero-sub-primary">A Inteligência Artificial deixou de ser tendência e se tornou uma vantagem competitiva real.</p>
              <div className="iahero-sub-divider"></div>
              <p className="iahero-sub-secondary">Integramos IA diretamente nas soluções do seu negócio — potencializando sistemas, automatizando decisões e elevando a experiência dos seus usuários.</p>
            </div>

            <div className="iahero-badges">
              <div className="iahero-badge">IA Generativa</div>
              <div className="iahero-badge">Modelos Preditivos</div>
            </div>
          </div>
          <div className="iahero-right"></div>
      </section>

      <div className="divider"></div>

      {/* SECTION 2 */}
      <section className="s-connect" id="sConnect" data-theme="light">
        {/* LEFT: headline + list */}
        <div className="sc2-left">
          <div className="sc2-headline-block">
            <div className="sc2-label-row r d1" id="scLabelRow">
              <span className="sc2-gold-line"></span>
              <span className="sc2-label">A Camada que Potencializa Tudo</span>
            </div>
            <h2 className="sc2-headline">
              <span className="sc2-h-outline r d2" id="scHOutline">IA que se</span>
              <span className="sc2-h-solid r d3" id="scHSolid">conecta com tudo</span>
            </h2>
          </div>
          <p className="sc2-lead r d4" id="scLead">
            A Inteligência Artificial não é um produto isolado — ela é uma
            <strong>camada que potencializa tudo que construímos</strong>.
            Integramos IA às aplicações web e mobile para criar experiências
            mais inteligentes e personalizadas para os seus usuários.
          </p>
          <ul className="sc2-list r d4" id="scList">
            <li className="sc2-item active" data-item="0">
              <div className="sc2-item-header">
                <span className="sc2-num">01</span>
                <span className="sc2-title">IA em Aplicações Web & Mobile</span>
                <span className="sc2-arrow">→</span>
              </div>
              <div className="sc2-content">
                <p>Integramos IA diretamente nos sistemas e apps do seu negócio, criando experiências personalizadas, recomendações inteligentes e interfaces que aprendem com o comportamento do usuário.</p>
              </div>
            </li>
            <li className="sc2-item" data-item="1">
              <div className="sc2-item-header">
                <span className="sc2-num">02</span>
                <span className="sc2-title">IA em Automações</span>
                <span className="sc2-arrow">→</span>
              </div>
              <div className="sc2-content">
                <p>Fluxos automatizados que não apenas executam tarefas — eles aprendem, se adaptam e tomam decisões de forma autônoma, tornando a sua operação cada vez mais eficiente com o tempo.</p>
              </div>
            </li>
            <li className="sc2-item" data-item="2">
              <div className="sc2-item-header">
                <span className="sc2-num">03</span>
                <span className="sc2-title">Assistentes & Bases de Conhecimento</span>
                <span className="sc2-arrow">→</span>
              </div>
              <div className="sc2-content">
                <p>Desenvolvemos assistentes inteligentes capazes de atender, responder e operar em escala — permitindo que o seu negócio interaja com clientes e equipes 24 horas por dia, sem intervenção manual.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* RIGHT: animated SVG panel */}
        <div className="sc2-right r d4">
          {/* SVG 0: App interface with AI nodes */}
          <div className="sc2-svg-panel active" data-panel="0">
            <svg viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sc2-grad-bg" x1="0" y1="0" x2="400" y2="340" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#050505" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="sc2-grad-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F27D26" />
                  <stop offset="100%" stopColor="#c9a84c" />
                </linearGradient>
                <filter id="sc2-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* App frame */}
              <rect x="60" y="20" width="280" height="300" rx="16" fill="url(#sc2-grad-bg)" stroke="#c9a84c" strokeWidth="1.5" opacity="0.9"/>
              {/* Top bar */}
              <rect x="60" y="20" width="280" height="40" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(201,168,76,0.2)" strokeWidth="1"/>
              <circle cx="85" cy="40" r="5" fill="#F27D26" opacity="0.8"/>
              <circle cx="100" cy="40" r="5" fill="#c9a84c" opacity="0.8"/>
              <circle cx="115" cy="40" r="5" fill="#4A90E2" opacity="0.8"/>
              <rect x="140" y="35" width="80" height="10" rx="5" fill="rgba(255,255,255,0.1)"/>
              
              {/* Interface cards */}
              <rect x="80" y="80" width="115" height="70" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
              <rect x="205" y="80" width="115" height="70" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
              <rect x="80" y="165" width="240" height="50" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
              <rect x="80" y="228" width="115" height="70" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
              <rect x="205" y="228" width="115" height="70" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
              
              {/* Connections */}
              <line className="sc2-dash-line" x1="138" y1="115" x2="200" y2="190" stroke="url(#sc2-grad-gold)" strokeWidth="1.5" opacity="0.7"/>
              <line className="sc2-dash-line" x1="262" y1="115" x2="200" y2="190" stroke="url(#sc2-grad-gold)" strokeWidth="1.5" opacity="0.7"/>
              <line className="sc2-dash-line" x1="200" y1="190" x2="138" y2="263" stroke="url(#sc2-grad-gold)" strokeWidth="1.5" opacity="0.7"/>
              <line className="sc2-dash-line" x1="200" y1="190" x2="262" y2="263" stroke="url(#sc2-grad-gold)" strokeWidth="1.5" opacity="0.7"/>
              
              {/* AI nodes overlaid */}
              <circle className="sc2-node-glow" cx="138" cy="115" r="8" fill="#F27D26" filter="url(#sc2-glow)"/>
              <circle className="sc2-node-glow" cx="262" cy="115" r="8" fill="#4A90E2" filter="url(#sc2-glow)"/>
              <circle className="sc2-node-glow" cx="200" cy="190" r="12" fill="url(#sc2-grad-gold)" filter="url(#sc2-glow)"/>
              <circle className="sc2-node-glow" cx="138" cy="263" r="8" fill="#c9a84c" filter="url(#sc2-glow)"/>
              <circle className="sc2-node-glow" cx="262" cy="263" r="8" fill="#F27D26" filter="url(#sc2-glow)"/>
            </svg>
          </div>

          {/* SVG 1: N8N workflow */}
          <div className="sc2-svg-panel" data-panel="1">
            <svg viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sc2-grad-n8n" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F27D26" />
                  <stop offset="100%" stopColor="#c9a84c" />
                </linearGradient>
                <filter id="sc2-glow-2" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Connectors */}
              <path className="sc2-dash-line" d="M90 170 C115 170 115 120 140 120" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
              <path className="sc2-dash-line" d="M90 170 C115 170 115 220 140 220" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
              <line className="sc2-dash-line" x1="200" y1="120" x2="250" y2="148" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
              <line className="sc2-dash-line" x1="200" y1="220" x2="250" y2="210" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
              <line className="sc2-dash-line" x1="310" y1="150" x2="340" y2="165" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
              <line className="sc2-dash-line" x1="310" y1="210" x2="340" y2="173" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
              
              {/* Nodes */}
              <rect x="30" y="150" width="60" height="40" rx="8" fill="#1a1a1a" stroke="#c9a84c" strokeWidth="1.5"/>
              <rect x="140" y="100" width="60" height="40" rx="8" fill="#1a1a1a" stroke="#c9a84c" strokeWidth="1.5"/>
              <rect x="140" y="200" width="60" height="40" rx="8" fill="#1a1a1a" stroke="#c9a84c" strokeWidth="1.5"/>
              <rect x="250" y="130" width="60" height="40" rx="8" fill="url(#sc2-grad-n8n)" stroke="#F27D26" strokeWidth="2" filter="url(#sc2-glow-2)"/>
              <rect x="250" y="190" width="60" height="40" rx="8" fill="#1a1a1a" stroke="#c9a84c" strokeWidth="1.5"/>
              <rect x="340" y="155" width="50" height="30" rx="8" fill="#1a1a1a" stroke="#c9a84c" strokeWidth="1.5"/>
              
              {/* Center node highlighted */}
              <rect className="sc2-node-glow" x="246" y="126" width="68" height="48" rx="10" fill="none" stroke="#F27D26" strokeWidth="1.5" opacity="0.8"/>
              
              {/* Node labels */}
              <text x="60" y="174" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="600" fontFamily="Syne,sans-serif">TRIGGER</text>
              <text x="170" y="124" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="600" fontFamily="Syne,sans-serif">FILTER</text>
              <text x="170" y="224" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="600" fontFamily="Syne,sans-serif">TRANSFORM</text>
              <text x="280" y="154" textAnchor="middle" fontSize="9" fill="#1a1a1a" fontWeight="800" fontFamily="Syne,sans-serif">IA</text>
              <text x="280" y="214" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="600" fontFamily="Syne,sans-serif">ACTION</text>
              <text x="365" y="173" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="600" fontFamily="Syne,sans-serif">OUT</text>
              
              {/* Animated signals */}
              <circle className="sc2-signal-dot" cx="0" cy="0" r="4" fill="#F27D26" filter="url(#sc2-glow-2)"/>
              <circle className="sc2-signal-dot-2" cx="0" cy="0" r="4" fill="#4A90E2" filter="url(#sc2-glow-2)"/>
            </svg>
          </div>

          {/* SVG 2: Chat assistant with voice waves */}
          <div className="sc2-svg-panel" data-panel="2">
            <svg viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sc2-grad-chat" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#2a2a2a" />
                </linearGradient>
                <linearGradient id="sc2-grad-ai" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F27D26" />
                  <stop offset="100%" stopColor="#c9a84c" />
                </linearGradient>
                <filter id="sc2-glow-3" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Chat bubbles */}
              <rect x="60" y="40" width="200" height="55" rx="16" fill="url(#sc2-grad-chat)" stroke="#c9a84c" strokeWidth="1.5" opacity="0.9"/>
              {/* Tail */}
              <path d="M80 95 L65 110 L100 95" fill="#2a2a2a" stroke="#c9a84c" strokeWidth="1.5"/>
              {/* Text lines in bubble */}
              <rect x="80" y="58" width="120" height="6" rx="3" fill="#fff" opacity="0.8"/>
              <rect x="80" y="72" width="80" height="6" rx="3" fill="#fff" opacity="0.6"/>
              
              {/* Response bubble right */}
              <rect x="140" y="130" width="200" height="70" rx="16" fill="url(#sc2-grad-ai)" stroke="#F27D26" strokeWidth="1.5" opacity="0.95"/>
              <path d="M320 200 L340 215 L305 200" fill="#c9a84c" stroke="#F27D26" strokeWidth="1.5"/>
              <rect x="160" y="148" width="120" height="6" rx="3" fill="#1a1a1a" opacity="0.8"/>
              <rect x="160" y="162" width="90" height="6" rx="3" fill="#1a1a1a" opacity="0.6"/>
              <rect x="160" y="176" width="60" height="6" rx="3" fill="#1a1a1a" opacity="0.5"/>
              
              {/* AI avatar circle */}
              <circle className="sc2-node-glow" cx="340" cy="240" r="28" fill="url(#sc2-grad-ai)" filter="url(#sc2-glow-3)"/>
              <text x="340" y="245" textAnchor="middle" fontSize="12" fill="#1a1a1a" fontFamily="Syne,sans-serif" fontWeight="800">IA</text>
              
              {/* Voice waves */}
              <path className="sc2-wave" d="M50 240 Q60 220 70 240 Q80 260 90 240" stroke="#F27D26" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path className="sc2-wave" d="M30 240 Q48 205 66 240 Q84 275 102 240" stroke="#c9a84c" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path className="sc2-wave" d="M10 240 Q35 190 60 240 Q85 290 110 240" stroke="#4A90E2" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              
              {/* Typing indicator dots */}
              <circle className="sc2-dot" cx="175" cy="290" r="5" fill="#c9a84c"/>
              <circle className="sc2-dot" cx="195" cy="290" r="5" fill="#F27D26"/>
              <circle className="sc2-dot" cx="215" cy="290" r="5" fill="#4A90E2"/>
            </svg>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* SECTION 3 */}
      <section className="s-ecosystem" data-theme="light">
        <div className="eco-inner">
          <div className="eco-left r fl">
            <div className="eco-badge">
              <span className="eco-badge-dot"></span>
              Ecossistema Integrado
            </div>
            <h2 className="eco-title">Uma inteligência<br/><em>que permeia tudo</em></h2>
            
            <div className="eco-desc-wrapper">
              <div className="eco-desc-line"></div>
              <p className="eco-desc">
                A IA não substitui o que construímos — ela <strong>amplifica</strong>. Cada solução que desenvolvemos pode ser potencializada com camadas de inteligência artificial, tornando sistemas mais preditivos, automações mais autônomas e experiências mais humanas.
              </p>
            </div>

            <div className="eco-features">
              <div className="eco-feature">
                <div className="eco-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path d="M12 8v4l3 3"></path></svg>
                </div>
                <span>Tempo Real</span>
              </div>
              <div className="eco-feature">
                <div className="eco-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-3a2 2 0 01-2-2V2"></path><path d="M9 18a2 2 0 01-2-2V4a2 2 0 012-2h7l4 4v10a2 2 0 01-2 2h-2"></path><path d="M3 15h6"></path><path d="M3 18h6"></path></svg>
                </div>
                <span>Dados Integrados</span>
              </div>
              <div className="eco-feature">
                <div className="eco-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path></svg>
                </div>
                <span>ROI Otimizado</span>
              </div>
            </div>
          </div>
          <div className="eco-diagram r fr d2">
            <div className="eco-ring eco-ring-1"></div>
            <div className="eco-ring eco-ring-2"></div>
            <div className="eco-ring eco-ring-3"></div>
            
            <svg className="eco-connections" viewBox="-250 -250 500 500">
              <defs>
                <radialGradient id="eco-line-grad">
                  <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#c9a84c" stopOpacity="0"/>
                </radialGradient>
              </defs>
              {[
                { angle: 0, delay: 0 },
                { angle: 45, delay: 1.5 },
                { angle: 90, delay: 0.5 },
                { angle: 135, delay: 2 },
                { angle: 180, delay: 1 },
                { angle: 225, delay: 2.5 },
                { angle: 270, delay: 0.2 },
                { angle: 315, delay: 1.8 }
              ].map((item, i) => {
                const rad = (item.angle * Math.PI) / 180;
                const x = Math.cos(rad) * 220;
                const y = Math.sin(rad) * 220;
                return (
                  <g key={i}>
                    <line x1="0" y1="0" x2={x} y2={y} stroke="url(#eco-line-grad)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <circle cx="0" cy="0" r="3" fill="#F27D26">
                      <animate attributeName="cx" values={`0; ${x}`} dur="3s" begin={`${item.delay}s`} repeatCount="indefinite" />
                      <animate attributeName="cy" values={`0; ${y}`} dur="3s" begin={`${item.delay}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1; 0" dur="3s" begin={`${item.delay}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}
            </svg>

            <div className="eco-core">
              <div className="eco-core-inner">
                <div className="eco-core-glow"></div>
                <svg className="eco-core-svg" viewBox="0 0 100 100">
                  <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.5"/>
                  <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.8"/>
                </svg>
                <span>IA</span>
              </div>
            </div>

            <div className="eco-sat-wrapper">
              {[
                { label: 'Web Apps', angle: 0 },
                { label: 'Analytics', angle: 45 },
                { label: 'Mobile', angle: 90 },
                { label: 'CRM', angle: 135 },
                { label: 'Automações', angle: 180 },
                { label: 'E-commerce', angle: 225 },
                { label: 'Assistentes', angle: 270 },
                { label: 'ERP', angle: 315 },
              ].map((item, i) => (
                <div className={`eco-sat eco-sat-${i}`} key={i} style={{ '--angle': `${item.angle}deg` } as React.CSSProperties}>
                  <div className="eco-sat-card">
                    <div className="eco-sat-dot"></div>
                    <span className="eco-sat-label">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* SECTION 4 */}
      <section className="s-cap" data-theme="dark">
        <div className="cap-statement r">
          <blockquote>"O futuro não é sobre <em>substituir pessoas</em> — é sobre dar à sua equipe uma <span>inteligência que nunca dorme</span>."</blockquote>
        </div>
        <div className="cap-rows">
          <div className="cap-row r d1">
            <span className="cap-row-num">01</span>
            <h4>Personalização em Escala</h4>
            <p>Experiências únicas para cada usuário, geradas em tempo real com base em comportamento e dados.</p>
          </div>
          <div className="cap-row r d2">
            <span className="cap-row-num">02</span>
            <h4>Decisões Automatizadas</h4>
            <p>Sistemas que analisam dados e tomam decisões operacionais de forma autônoma e precisa.</p>
          </div>
          <div className="cap-row r d3">
            <span className="cap-row-num">03</span>
            <h4>Atendimento Inteligente</h4>
            <p>Assistentes com base de conhecimento que respondem, orientam e resolvem sem intervenção humana.</p>
          </div>
          <div className="cap-row r d4">
            <span className="cap-row-num">04</span>
            <h4>Aprendizado Contínuo</h4>
            <p>Modelos que evoluem com o uso — quanto mais operam, mais precisos e eficientes se tornam.</p>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* SECTION 5 */}
      <section className="s-cta" data-theme="dark">
        <div className="cta-glow"></div>
        <h2 className="r">O futuro do seu negócio <em>começa agora</em></h2>
        <p className="r d1">Fale com nossos especialistas e descubra como a IA pode transformar a sua operação.</p>
        <Link to="/contato-quiz" className="btn-gold r d2">Iniciar conversa</Link>
      </section>

      <style>{`
        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --black: #080808;
          --off-black: #111111;
          --white: #FAFAF8;
          --off-white: #F2F0EC;
          --text-dark: #1a1a1a;
        }
        .ia-page-container {
          background: var(--black);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }
        .progress {
          position: fixed; top: 0; left: 0; height: 2px; background: var(--gold); z-index: 1000; width: 0; transition: width .08s linear;
        }

        .s-connect {
          background: #f5f3ee;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .s-connect::before {
          content: '';
          position: absolute;
          top: 28px; left: 28px;
          width: 28px; height: 28px;
          border-top: 1.5px solid rgba(201,168,76,.4);
          border-left: 1.5px solid rgba(201,168,76,.4);
        }
        .s-connect::after {
          content: '';
          position: absolute;
          bottom: 28px; right: 28px;
          width: 28px; height: 28px;
          border-bottom: 1.5px solid rgba(201,168,76,.4);
          border-right: 1.5px solid rgba(201,168,76,.4);
        }
        .sc2-left {
          padding: 100px 60px 100px 80px;
          position: relative;
          z-index: 2;
        }
        .sc2-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 500px;
          border-left: 1px solid rgba(201,168,76,.15);
        }
        /* SVG panels */
        .sc2-svg-panel {
          position: absolute;
          width: 80%;
          max-width: 420px;
          opacity: 0;
          transform: translateY(20px) scale(0.97);
          transition: opacity .5s ease, transform .5s ease;
          pointer-events: none;
        }
        .sc2-svg-panel.active {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        /* Label row */
        .sc2-label-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }
        .sc2-gold-line { width: 48px; height: 1px; background: #c9a84c; display: block; }
        .sc2-label { font-size: .68rem; letter-spacing: .3em; color: #c9a84c; text-transform: uppercase; font-weight: 600; }
        /* Headline */
        .sc2-headline { margin: 0 0 32px; line-height: .92; letter-spacing: -.04em; }
        .sc2-h-outline {
          display: block;
          font-size: clamp(2.5rem,4vw,4rem);
          font-weight: 900;
          color: #c9a84c;
        }
        .sc2-h-solid {
          display: block;
          font-size: clamp(2.5rem,4vw,4rem);
          font-weight: 900;
          color: #1a1a1a;
        }
        /* Lead */
        .sc2-lead {
          font-size: .95rem;
          line-height: 1.85;
          color: rgba(26,26,26,.6);
          max-width: 480px;
          margin-bottom: 48px;
        }
        .sc2-lead strong { color: #1a1a1a; font-weight: 500; }
        /* List */
        .sc2-list { list-style: none; border-top: 1px solid rgba(201,168,76,.2); padding: 0; margin: 0; }
        .sc2-item {
          border-bottom: 1px solid rgba(201,168,76,.15);
          cursor: pointer;
          overflow: hidden;
          transition: opacity .3s ease;
        }
        .sc2-item:not(.active) { opacity: .45; }
        .sc2-item-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 22px 0;
        }
        .sc2-num {
          font-size: .68rem;
          font-weight: 700;
          color: #c9a84c;
          letter-spacing: .15em;
          min-width: 24px;
        }
        .sc2-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #1a1a1a;
          flex: 1;
          letter-spacing: -.02em;
          transition: color .3s;
        }
        .sc2-item.active .sc2-title { color: #c9a84c; }
        .sc2-arrow {
          font-size: 1rem;
          color: #c9a84c;
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity .3s, transform .3s;
        }
        .sc2-item.active .sc2-arrow { opacity: 1; transform: translateX(0); }
        .sc2-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height .5s cubic-bezier(.25,.46,.45,.94);
        }
        .sc2-item.active .sc2-content { max-height: 200px; }
        .sc2-content p {
          font-size: .88rem;
          line-height: 1.85;
          color: rgba(26,26,26,.6);
          padding-bottom: 24px;
          margin: 0;
          max-width: 440px;
        }
        /* SVG animations */
        @keyframes sc2-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes sc2-pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes sc2-dash-move {
          to { stroke-dashoffset: -20; }
        }
        @keyframes sc2-wave-anim {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.6); }
        }
        @keyframes sc2-typing {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-4px); }
        }
        @keyframes sc2-signal-move {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }

        .sc2-svg-panel.active svg {
          animation: sc2-float 6s ease-in-out infinite;
        }
        .sc2-node-glow {
          animation: sc2-pulse-glow 3s ease-in-out infinite;
          transform-origin: center;
        }
        .sc2-node-glow:nth-child(2) { animation-delay: 1s; }
        .sc2-node-glow:nth-child(3) { animation-delay: 2s; }
        
        .sc2-dash-line {
          stroke-dasharray: 6 6;
          animation: sc2-dash-move 1s linear infinite;
        }

        .sc2-wave {
          transform-origin: center;
          animation: sc2-wave-anim 2s ease-in-out infinite;
        }
        .sc2-wave:nth-child(2) { animation-delay: 0.3s; }
        .sc2-wave:nth-child(3) { animation-delay: 0.6s; }

        .sc2-dot {
          animation: sc2-typing 1.4s infinite;
        }
        .sc2-dot:nth-child(2) { animation-delay: 0.2s; }
        .sc2-dot:nth-child(3) { animation-delay: 0.4s; }

        .sc2-signal-dot {
          offset-path: path('M90 170 C115 170 115 120 140 120 L200 120 L250 148');
          animation: sc2-signal-move 3s linear infinite;
        }
        .sc2-signal-dot-2 {
          offset-path: path('M90 170 C115 170 115 220 140 220 L200 220 L250 210');
          animation: sc2-signal-move 3s linear infinite 1.5s;
        }

        .s-ecosystem { background: #faf9f6; color: var(--text-dark); padding: 160px 64px; position: relative; overflow: hidden; border-top: 1px solid rgba(201, 168, 76, .1); }
        .s-ecosystem::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: linear-gradient(rgba(201, 168, 76, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201, 168, 76, 0.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; }
        .eco-inner { display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: center; max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }
        
        .eco-badge { display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px; background: rgba(201, 168, 76, 0.08); border: 1px solid rgba(201, 168, 76, 0.2); border-radius: 100px; font-family: 'Syne', sans-serif; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 32px; }
        .eco-badge-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; box-shadow: 0 0 8px var(--gold); animation: ecoPulse 2s infinite; }
        @keyframes ecoPulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        
        .eco-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(3rem, 4.5vw, 4.5rem); font-weight: 300; line-height: 1.05; letter-spacing: -0.02em; color: var(--text-dark); margin-bottom: 40px; }
        .eco-title em { font-style: italic; color: var(--gold); display: block; }
        
        .eco-desc-wrapper { display: flex; gap: 24px; margin-bottom: 48px; }
        .eco-desc-line { width: 2px; background: linear-gradient(to bottom, var(--gold), transparent); border-radius: 2px; flex-shrink: 0; }
        .eco-desc { font-size: 1.05rem; font-weight: 300; line-height: 1.8; color: rgba(26, 26, 26, 0.7); max-width: 480px; }
        .eco-desc strong { color: var(--text-dark); font-weight: 500; }
        
        .eco-features { display: flex; gap: 24px; flex-wrap: wrap; }
        .eco-feature { display: flex; align-items: center; gap: 12px; background: #fff; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid rgba(201, 168, 76, 0.1); transition: transform 0.3s, box-shadow 0.3s; }
        .eco-feature:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(201, 168, 76, 0.08); border-color: rgba(201, 168, 76, 0.3); }
        .eco-feature-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: rgba(201, 168, 76, 0.1); color: var(--gold); border-radius: 6px; }
        .eco-feature span { font-family: 'Syne', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; color: var(--text-dark); text-transform: uppercase; }
        
        .eco-diagram { position: relative; height: 500px; display: flex; align-items: center; justify-content: center; }
        .eco-ring { position: absolute; border-radius: 50%; border: 1px dashed rgba(201, 168, 76, 0.2); top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .eco-ring-1 { width: 220px; height: 220px; animation: ecoSpin 30s linear infinite; }
        .eco-ring-2 { width: 360px; height: 360px; border-style: solid; border-color: rgba(201, 168, 76, 0.05); animation: ecoSpin 45s linear infinite reverse; }
        .eco-ring-3 { width: 500px; height: 500px; animation: ecoSpin 60s linear infinite; }
        @keyframes ecoSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        
        .eco-connections { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 500px; height: 500px; z-index: 1; pointer-events: none; }
        
        .eco-core { position: absolute; z-index: 10; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; }
        .eco-core-inner { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border-radius: 50%; box-shadow: 0 10px 40px rgba(201, 168, 76, 0.15), inset 0 0 20px rgba(201, 168, 76, 0.1); border: 1px solid rgba(201, 168, 76, 0.4); }
        .eco-core-glow { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: radial-gradient(circle, rgba(201, 168, 76, 0.4) 0%, transparent 70%); animation: ecoCorePulse 3s ease-in-out infinite; }
        @keyframes ecoCorePulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.3); opacity: 1; } }
        .eco-core-svg { position: absolute; width: 110%; height: 110%; animation: ecoSpin 20s linear infinite; }
        .eco-core span { position: relative; z-index: 2; font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; letter-spacing: 0.1em; color: var(--gold); text-shadow: 0 2px 10px rgba(255,255,255,0.8); }
        
        .eco-sat-wrapper { position: absolute; width: 100%; height: 100%; top: 0; left: 0; }
        .eco-sat { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(var(--angle)) translate(220px) rotate(calc(-1 * var(--angle))); animation: ecoFloat 6s ease-in-out infinite; z-index: 5; }
        .eco-sat-0 { animation-delay: 0s; } .eco-sat-1 { animation-delay: -1s; } .eco-sat-2 { animation-delay: -2s; } .eco-sat-3 { animation-delay: -3s; }
        .eco-sat-4 { animation-delay: -4s; } .eco-sat-5 { animation-delay: -5s; } .eco-sat-6 { animation-delay: -2.5s; } .eco-sat-7 { animation-delay: -1.5s; }
        @keyframes ecoFloat { 0%, 100% { margin-top: 0; } 50% { margin-top: -10px; } }
        
        .eco-sat-card { display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(4px); padding: 8px 16px; border-radius: 100px; box-shadow: 0 8px 24px rgba(0,0,0,0.04); border: 1px solid rgba(201, 168, 76, 0.2); transition: all 0.3s ease; cursor: default; }
        .eco-sat-card:hover { transform: scale(1.05); border-color: var(--gold); box-shadow: 0 12px 32px rgba(201, 168, 76, 0.12); }
        .eco-sat-dot { width: 8px; height: 8px; background: var(--gold); border-radius: 50%; box-shadow: 0 0 8px var(--gold); }
        .eco-sat-label { font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; color: var(--text-dark); text-transform: uppercase; white-space: nowrap; }

        .s-cap { background: var(--black); padding: 140px 64px; position: relative; overflow: hidden; }
        .s-cap::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(201, 168, 76, .18), transparent); }
        .cap-statement { max-width: 1200px; margin: 0 auto 80px; }
        .cap-statement blockquote { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 3.5vw, 3.5rem); font-weight: 300; line-height: 1.2; letter-spacing: -.02em; color: rgba(245, 243, 238, .35); font-style: italic; border: none; padding: 0; }
        .cap-statement blockquote em { color: var(--white); font-style: normal; }
        .cap-statement blockquote span { color: var(--gold); }
        .cap-rows { display: flex; flex-direction: column; gap: 2px; background: rgba(255, 255, 255, .04); max-width: 1200px; margin: 0 auto; }
        .cap-row { background: var(--black); display: grid; grid-template-columns: 60px 1fr 1fr; align-items: center; gap: 48px; padding: 36px 44px; border-left: 2px solid transparent; transition: all .4s; }
        .cap-row:hover { background: #0e0e0e; border-left-color: var(--gold); }
        .cap-row-num { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: rgba(201, 168, 76, .4); line-height: 1; }
        .cap-row h4 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; letter-spacing: -.01em; white-space: nowrap; }
        .cap-row p { font-size: .85rem; font-weight: 300; line-height: 1.75; color: rgba(245, 243, 238, .42); transition: color .4s; }
        .cap-row:hover p { color: rgba(245, 243, 238, .72); }

        .s-cta { background: var(--black); padding: 200px 64px; text-align: center; position: relative; overflow: hidden; }
        .s-cta::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .cta-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(201, 168, 76, .08) 0%, transparent 65%); pointer-events: none; animation: glowPulse 4s ease-in-out infinite; }
        @keyframes glowPulse { 0%, 100% { opacity: .6; } 50% { opacity: 1; } }
        .s-cta h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(3rem, 5.5vw, 6rem); font-weight: 300; line-height: 1.05; letter-spacing: -.02em; margin-bottom: 28px; position: relative; }
        .s-cta h2 em { font-style: italic; color: var(--gold); }
        .s-cta p { font-size: 1rem; font-weight: 300; color: rgba(245, 243, 238, .4); margin-bottom: 64px; position: relative; }
        .btn-gold { display: inline-flex; align-items: center; gap: 14px; font-family: 'Syne', sans-serif; font-size: .72rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--black); background: var(--gold); padding: 18px 48px; border: none; cursor: none; text-decoration: none; transition: background .3s; }
        .btn-gold::after { content: '→'; font-size: .9rem; transition: transform .3s; }
        .btn-gold:hover { background: var(--gold-light); }
        .btn-gold:hover::after { transform: translateX(6px); }

        .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(201, 168, 76, .18), transparent); }

        .r { opacity: 0; transform: translateY(48px); transition: opacity .9s cubic-bezier(.16, 1, .3, 1), transform .9s cubic-bezier(.16, 1, .3, 1); }
        .r.fl { transform: translateX(-48px); }
        .r.fr { transform: translateX(48px); }
        .r.visible { opacity: 1; transform: translate(0); }
        .d1 { transition-delay: .1s; } .d2 { transition-delay: .22s; } .d3 { transition-delay: .34s; } .d4 { transition-delay: .46s; }

        @keyframes bounceY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
        @keyframes fsRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        /* IA HERO SPLIT SCREEN */
        .iahero-wrapper {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #0a0a0a;
          overflow: hidden;
        }
        .iahero-shield {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            to right,
            rgba(10,10,10,0.96) 0%,
            rgba(10,10,10,0.90) 35%,
            rgba(10,10,10,0.30) 52%,
            transparent 100%
          );
        }
        .iahero-left {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 60px 100px 80px;
          grid-column: 1;
        }
        .iahero-right {
          grid-column: 2;
          position: relative;
          z-index: 1;
        }
        #ia-neural {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        /* IA HERO TYPOGRAPHY & MORPHING */
        .iahero-breadcrumb {
          font-size: 10px;
          letter-spacing: 3px;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 48px;
          text-transform: uppercase;
        }
        .iahero-headline { margin: 0; line-height: 0.92; }
        .iahero-line1 {
          display: block;
          font-size: clamp(3.5rem, 6vw, 5.5rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.04em;
        }
        .iahero-line2 {
          display: block;
          font-size: clamp(3.5rem, 6vw, 5.5rem);
          font-weight: 900;
          color: #c9a84c;
          letter-spacing: -0.04em;
        }
        .iahero-chapter-line {
          width: 40px;
          height: 1px;
          background: #c9a84c;
          margin: 28px 0 20px;
        }
        .iahero-sub-cols {
          display: flex;
          align-items: center;
          gap: 24px;
          max-width: 480px;
          margin-top: 0;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity .6s ease-out, transform .6s ease-out;
        }
        .iahero-sub-cols.visible { opacity:1; transform:translateY(0); }
        .iahero-sub-primary {
          flex: 1.3;
          font-size: .95rem;
          font-weight: 500;
          color: rgba(255,255,255,.82);
          line-height: 1.75;
          margin: 0;
        }
        .iahero-sub-divider {
          width: 1px;
          height: 68px;
          background: linear-gradient(to bottom, transparent, #c9a84c, transparent);
          flex-shrink: 0;
          opacity: .55;
        }
        .iahero-sub-secondary {
          flex: 1;
          font-size: .78rem;
          font-weight: 300;
          color: rgba(255,255,255,.30);
          line-height: 1.9;
          margin: 0;
        }
        .iahero-badges {
          display: flex;
          gap: 20px;
          margin-top: 32px;
        }
        .iahero-badge {
          font-size: 10px;
          letter-spacing: 3px;
          color: #c9a84c;
          text-transform: uppercase;
          opacity: 0.7;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .iahero-badge::before {
          content: '';
          width: 4px;
          height: 4px;
          background: #c9a84c;
          border-radius: 50%;
          display: block;
        }

        /* ENTRANCE ANIMATION INITIAL STATE */
        .iahero-breadcrumb, .iahero-line1, .iahero-line2, .iahero-chapter-line, .iahero-badge {
          opacity: 0;
        }

        @media (max-width: 768px) {
          .iahero-wrapper {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
          }
          .iahero-left {
            padding: 100px 24px 60px;
            grid-column: 1;
          }
          .iahero-right {
            grid-column: 1;
            height: 220px;
          }
          .iahero-sub-cols {
            flex-direction: column;
            gap: 16px;
            max-width: 100%;
          }
          .iahero-sub-divider { display: none; }
          .s-connect {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .sc2-left {
            padding: 60px 24px 40px;
          }
          .sc2-right {
            min-height: 320px;
            border-left: none;
            border-top: 1px solid rgba(201,168,76,.15);
          }
          .sc2-svg-panel {
            width: 90%;
            max-width: 340px;
          }
          .sc2-headline .sc2-h-outline,
          .sc2-headline .sc2-h-solid {
            font-size: clamp(1.8rem, 7vw, 3rem);
          }
          .sc2-lead { font-size: 0.9rem; }
          .s-ecosystem { padding: 60px 20px; }
          .eco-inner {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .eco-title { font-size: clamp(1.8rem, 6vw, 3rem); margin-bottom: 24px; }
          .eco-desc { font-size: 0.9rem; }
          .eco-features { gap: 12px; }
          .eco-feature { padding: 10px 14px; }
          .eco-diagram { height: 280px; }
          .eco-ring-1 { width: 120px; height: 120px; }
          .eco-ring-2 { width: 200px; height: 200px; }
          .eco-ring-3 { width: 280px; height: 280px; }
          .eco-connections { width: 280px; height: 280px; }
          .eco-core { width: 80px; height: 80px; }
          .eco-core span { font-size: 0.85rem; }
          .eco-sat { transform: translate(-50%, -50%) rotate(var(--angle)) translate(130px) rotate(calc(-1 * var(--angle))); }
          .eco-sat-card { padding: 5px 10px; }
          .eco-sat-label { font-size: 0.55rem; }
          .eco-sat-dot { width: 5px; height: 5px; }
          .s-cap { padding: 60px 20px; }
          .cap-statement blockquote { font-size: clamp(1.4rem, 5vw, 2.5rem); }
          .cap-row {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 20px 16px;
          }
          .cap-row-num { display: none; }
          .cap-row h4 { font-size: 0.85rem; white-space: normal; }
          .cap-row p { font-size: 0.78rem; }
          .s-cta { padding: 80px 20px; }
          .s-cta p { margin-bottom: 40px; }
        }
      `}</style>
    </div>
  );
};

export default ArtificialIntelligencePage;
