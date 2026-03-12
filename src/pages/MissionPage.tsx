import React, { useEffect } from 'react';

const MissionPage = () => {
  useEffect(() => {
    // Dotted grid
    const canvas = document.getElementById('nmhero-grid') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const drawGrid = () => {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          const GAP = 32;
          const cols = Math.ceil(canvas.width / GAP);
          const rows = Math.ceil(canvas.height / GAP);
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
              const x = i * GAP;
              const y = j * GAP;
              // Distance-based opacity: brighter near center, fade to edges
              const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
              const maxDist = Math.sqrt(cx * cx + cy * cy);
              const alpha = Math.max(0.03, 0.22 * (1 - dist / maxDist));
              ctx.beginPath();
              ctx.arc(x, y, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(201,168,76,${alpha})`;
              ctx.fill();
            }
          }
        };
        drawGrid();
        window.addEventListener('resize', drawGrid);
        
        // Entrance animations
        const t1 = setTimeout(() => {
          document.querySelectorAll('.nmhero-hline').forEach(el => el.classList.add('visible'));
        }, 400);
        const t2 = setTimeout(() => {
          const center = document.querySelector('.nmhero-center');
          if (center) center.classList.add('visible');
        }, 700);

        // Section 2 scroll-triggered entrance
        const section2 = document.getElementById('nossaMissaoS2');
        const line = document.getElementById('nm2TlLine');
        const items = section2 ? section2.querySelectorAll('.nm2-tl-item') : [];

        let triggered = false;
        const onScroll = () => {
          if (triggered || !section2) return;
          const rect = section2.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.75) {
            triggered = true;
            if (line) setTimeout(() => line.classList.add('visible'), 100);
            items.forEach((item) => {
              const delay = parseInt((item as HTMLElement).dataset.delay || '0');
              setTimeout(() => item.classList.add('visible'), 300 + delay);
            });
            window.removeEventListener('scroll', onScroll);
          }
        };
        window.addEventListener('scroll', onScroll);
        // Initial check
        setTimeout(onScroll, 100);

        return () => {
          window.removeEventListener('resize', drawGrid);
          window.removeEventListener('scroll', onScroll);
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    }
  }, []);

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {/* Hero Section */}
      <section className="nmhero-section" id="nossaMissaoHero">
        {/* Dotted grid background canvas */}
        <canvas id="nmhero-grid" className="nmhero-grid-canvas"></canvas>

        {/* Corner marks */}
        <span className="nmhero-corner nmhero-corner--tl"></span>
        <span className="nmhero-corner nmhero-corner--tr"></span>
        <span className="nmhero-corner nmhero-corner--bl"></span>
        <span className="nmhero-corner nmhero-corner--br"></span>

        {/* Horizontal rule lines */}
        <span className="nmhero-hline nmhero-hline--top"></span>
        <span className="nmhero-hline nmhero-hline--bottom"></span>

        {/* Watermark */}
        <span className="nmhero-watermark">MISSÃO</span>

        {/* Center content */}
        <div className="nmhero-center">
          <div className="nmhero-label-row">
            <span className="nmhero-gold-line"></span>
            <span className="nmhero-label">Quem Somos / Nossa Missão</span>
            <span className="nmhero-gold-line"></span>
          </div>
          <h1 className="nmhero-headline">
            <span className="nmhero-h-outline">Construindo o futuro</span>
            <span className="nmhero-h-solid">do seu negócio</span>
          </h1>
          <p className="nmhero-sub">Seu processo. Sua metodologia. Seu sistema.</p>
          <div className="nmhero-badge-row">
            <span className="nmhero-badge">• Inovação</span>
            <span className="nmhero-badge">• Tecnologia</span>
            <span className="nmhero-badge">• Resultados</span>
          </div>
        </div>

        {/* Side vertical labels */}
        <span className="nmhero-side nmhero-side--left">INOVA SYSTEMS SOLUTIONS</span>
        <span className="nmhero-side nmhero-side--right">EST. 2024</span>
      </section>

      {/* Mission Content Section */}
      <section className="nm2-section" id="nossaMissaoS2">
        {/* Corner marks */}
        <span className="nm2-corner nm2-corner--tl"></span>
        <span className="nm2-corner nm2-corner--br"></span>

        {/* LEFT: text */}
        <div className="nm2-left">
          <div className="nm2-label-row">
            <span className="nm2-gold-line"></span>
            <span className="nm2-label">Nossa Missão</span>
          </div>
          <p className="nm2-text">
            Nossa missão é converter a
            <strong className="nm2-highlight"> inteligência operacional </strong>
            de empresas B2B em soluções tecnológicas sob medida, seja
            <strong className="nm2-highlight"> mapeando processos consolidados </strong>
            ou estruturando novas metodologias, para que a tecnologia seja sempre o
            <strong className="nm2-highlight"> reflexo fiel da eficiência </strong>
            de cada negócio.
          </p>
          <div className="nm2-stat-row">
            <div className="nm2-stat">
              <span className="nm2-stat-num">B2B</span>
              <span className="nm2-stat-label">Foco exclusivo</span>
            </div>
            <div className="nm2-stat-divider"></div>
            <div className="nm2-stat">
              <span className="nm2-stat-num">100%</span>
              <span className="nm2-stat-label">Sob medida</span>
            </div>
            <div className="nm2-stat-divider"></div>
            <div className="nm2-stat">
              <span className="nm2-stat-num">∞</span>
              <span className="nm2-stat-label">Escalabilidade</span>
            </div>
          </div>
        </div>

        {/* RIGHT: vertical timeline */}
        <div className="nm2-right">
          <div className="nm2-timeline" id="nm2Timeline">
            <div className="nm2-tl-line" id="nm2TlLine"></div>
            <div className="nm2-tl-item" data-delay="0">
              <div className="nm2-tl-node">
                <div className="nm2-tl-node-core"></div>
                <div className="nm2-tl-node-ring"></div>
              </div>
              <div className="nm2-tl-content">
                <span className="nm2-tl-step">01</span>
                <h4 className="nm2-tl-title">Diagnóstico Operacional</h4>
                <p className="nm2-tl-desc">Mapeamos seus processos internos com profundidade para entender a real dinâmica do seu negócio.</p>
              </div>
            </div>
            <div className="nm2-tl-item" data-delay="200">
              <div className="nm2-tl-node">
                <div className="nm2-tl-node-core"></div>
                <div className="nm2-tl-node-ring"></div>
              </div>
              <div className="nm2-tl-content">
                <span className="nm2-tl-step">02</span>
                <h4 className="nm2-tl-title">Arquitetura da Solução</h4>
                <p className="nm2-tl-desc">Desenhamos a solução tecnológica ideal — web, mobile ou automação — alinhada à sua metodologia.</p>
              </div>
            </div>
            <div className="nm2-tl-item" data-delay="400">
              <div className="nm2-tl-node">
                <div className="nm2-tl-node-core"></div>
                <div className="nm2-tl-node-ring"></div>
              </div>
              <div className="nm2-tl-content">
                <span className="nm2-tl-step">03</span>
                <h4 className="nm2-tl-title">Desenvolvimento & Entrega</h4>
                <p className="nm2-tl-desc">Construímos com agilidade e precisão, entregando sistemas que crescem junto com sua operação.</p>
              </div>
            </div>
            <div className="nm2-tl-item" data-delay="600">
              <div className="nm2-tl-node">
                <div className="nm2-tl-node-core"></div>
                <div className="nm2-tl-node-ring"></div>
              </div>
              <div className="nm2-tl-content">
                <span className="nm2-tl-step">04</span>
                <h4 className="nm2-tl-title">Evolução Contínua</h4>
                <p className="nm2-tl-desc">Acompanhamos sua jornada — a tecnologia evolui conforme o seu negócio se transforma.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .nmhero-section {
          position: relative;
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Dotted grid canvas */
        .nmhero-grid-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.45;
        }

        /* Corner marks */
        .nmhero-corner {
          position: absolute;
          width: 32px;
          height: 32px;
          z-index: 2;
          pointer-events: none;
        }
        .nmhero-corner--tl { top: 36px; left: 36px; border-top: 1.5px solid rgba(201,168,76,.55); border-left: 1.5px solid rgba(201,168,76,.55); }
        .nmhero-corner--tr { top: 36px; right: 36px; border-top: 1.5px solid rgba(201,168,76,.55); border-right: 1.5px solid rgba(201,168,76,.55); }
        .nmhero-corner--bl { bottom: 36px; left: 36px; border-bottom: 1.5px solid rgba(201,168,76,.55); border-left: 1.5px solid rgba(201,168,76,.55); }
        .nmhero-corner--br { bottom: 36px; right: 36px; border-bottom: 1.5px solid rgba(201,168,76,.55); border-right: 1.5px solid rgba(201,168,76,.55); }

        /* Horizontal lines */
        .nmhero-hline {
          position: absolute;
          left: 80px; right: 80px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,76,.2) 20%, rgba(201,168,76,.2) 80%, transparent);
          z-index: 2;
          pointer-events: none;
          transform: scaleX(0);
          transition: transform 1s ease-out;
        }
        .nmhero-hline--top { top: 80px; }
        .nmhero-hline--bottom { bottom: 80px; }
        .nmhero-hline.visible { transform: scaleX(1); }

        /* Watermark */
        .nmhero-watermark {
          position: absolute;
          font-size: clamp(8rem, 18vw, 16rem);
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px rgba(201,168,76,.04);
          letter-spacing: .15em;
          user-select: none;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Center content */
        .nmhero-center {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
          max-width: 900px;
          padding: 0 40px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .8s ease-out, transform .8s ease-out;
        }
        .nmhero-center.visible { opacity: 1; transform: translateY(0); }

        /* Label row */
        .nmhero-label-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nmhero-gold-line {
          display: block;
          width: 40px;
          height: 1px;
          background: #c9a84c;
          opacity: .6;
        }
        .nmhero-label {
          font-size: .65rem;
          letter-spacing: .35em;
          color: #c9a84c;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* Headline */
        .nmhero-headline {
          font-family: var(--font-serif);
          margin: 0;
          line-height: 0.95;
          letter-spacing: -.03em;
        }
        .nmhero-h-outline {
          display: block;
          font-size: clamp(2.2rem, 3.8vw, 3.6rem);
          font-weight: 300;
          color: rgba(255,255,255,0.88);
          -webkit-text-stroke: 0;
          text-stroke: 0;
        }
        .nmhero-h-solid {
          display: block;
          font-size: clamp(2.8rem, 5vw, 4.8rem);
          font-weight: 300;
          font-style: italic;
          color: #c9a84c;
          -webkit-text-stroke: 0;
          text-stroke: 0;
        }

        /* Subtitle */
        .nmhero-sub {
          font-size: 1rem;
          color: rgba(255,255,255,.35);
          letter-spacing: .08em;
          margin: 0;
          font-weight: 300;
        }

        /* Badges */
        .nmhero-badge-row {
          display: flex;
          gap: 24px;
          margin-top: 8px;
        }
        .nmhero-badge {
          font-size: .65rem;
          letter-spacing: .3em;
          color: #c9a84c;
          text-transform: uppercase;
          font-weight: 600;
          opacity: .75;
        }

        /* Side labels */
        .nmhero-side {
          position: absolute;
          font-size: .55rem;
          letter-spacing: .3em;
          color: rgba(201,168,76,.25);
          text-transform: uppercase;
          font-weight: 600;
          z-index: 2;
          pointer-events: none;
        }
        .nmhero-side--left {
          left: 20px;
          top: 50%;
          transform: translateX(-50%) translateY(-50%) rotate(-90deg);
          transform-origin: center;
        }
        .nmhero-side--right {
          right: 20px;
          top: 50%;
          transform: translateX(50%) translateY(-50%) rotate(90deg);
          transform-origin: center;
        }

        @media (max-width: 640px) {
          .nmhero-hline { left: 20px; right: 20px; }
          .nmhero-hline--top { top: 60px; }
          .nmhero-hline--bottom { bottom: 60px; }
          .nmhero-corner--tl { top: 20px; left: 20px; }
          .nmhero-corner--tr { top: 20px; right: 20px; }
          .nmhero-corner--bl { bottom: 20px; left: 20px; }
          .nmhero-corner--br { bottom: 20px; right: 20px; }
          .nmhero-side { display: none; }
          .nmhero-center { padding: 0 20px; gap: 14px; }
          .nmhero-headline { line-height: 1.05; }
          .nmhero-h-outline { font-size: clamp(1.7rem, 7.5vw, 2.2rem); }
          .nmhero-h-solid   { font-size: clamp(2rem, 9vw, 2.8rem); }
          .nmhero-sub       { font-size: .85rem; }
          .nmhero-badge-row { gap: 10px; flex-wrap: wrap; justify-content: center; }
        }

        /* SECTION 2 */
        .nm2-section {
          background: #f5f3ee;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          /* Section layout */
          .nm2-section { grid-template-columns: 1fr; min-height: unset; }

          /* LEFT column */
          .nm2-left {
            padding: 72px 28px 48px !important;
            gap: 32px !important;
          }
          .nm2-text {
            font-size: 1.05rem !important;
            line-height: 1.85 !important;
            max-width: 100% !important;
          }

          /* Stats — 3 colunas com divisores verticais */
          .nm2-stat-row {
            display: grid !important;
            grid-template-columns: 1fr auto 1fr auto 1fr !important;
            align-items: center !important;
            gap: 0 !important;
            padding: 24px 0 !important;
            border-top: 1px solid rgba(201,168,76,.15) !important;
            border-bottom: 1px solid rgba(201,168,76,.15) !important;
            margin-top: 0 !important;
          }
          .nm2-stat { align-items: center !important; text-align: center !important; }
          .nm2-stat-num { font-size: 1.55rem !important; }
          .nm2-stat-label { font-size: .6rem !important; letter-spacing: .18em !important; }
          .nm2-stat-divider {
            display: block !important;
            width: 1px !important;
            height: 36px !important;
            background: rgba(201,168,76,.25) !important;
            margin: 0 12px !important;
          }

          /* RIGHT column — Timeline */
          .nm2-right {
            padding: 48px 28px 72px !important;
            border-left: none !important;
            border-top: 1px solid rgba(201,168,76,.12) !important;
            min-height: auto !important;
          }

          /* Timeline items */
          .nm2-tl-item { gap: 20px !important; padding-bottom: 36px !important; }
          .nm2-tl-title { font-size: 1rem !important; }
          .nm2-tl-desc { font-size: .82rem !important; max-width: 100% !important; }

          /* Label row on left */
          .nm2-label-row { margin-bottom: -8px; }
        }

        .nm2-corner {
          position: absolute;
          width: 28px; height: 28px;
          pointer-events: none; z-index: 2;
        }
        .nm2-corner--tl { top: 32px; left: 32px; border-top: 1.5px solid rgba(201,168,76,.4); border-left: 1.5px solid rgba(201,168,76,.4); }
        .nm2-corner--br { bottom: 32px; right: 32px; border-bottom: 1.5px solid rgba(201,168,76,.4); border-right: 1.5px solid rgba(201,168,76,.4); }

        /* LEFT */
        .nm2-left {
          padding: 100px 60px 100px 80px;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }
        .nm2-label-row { display: flex; align-items: center; gap: 14px; }
        .nm2-gold-line { display: block; width: 40px; height: 1px; background: #c9a84c; }
        .nm2-label { font-size: .65rem; letter-spacing: .32em; color: #c9a84c; text-transform: uppercase; font-weight: 600; }
        .nm2-text {
          font-size: clamp(1.1rem, 1.6vw, 1.4rem);
          line-height: 1.9;
          color: rgba(26,26,26,.7);
          font-weight: 300;
          max-width: 520px;
          margin: 0;
        }
        .nm2-highlight { color: #1a1a1a; font-weight: 600; font-style: normal; }
        .nm2-stat-row { display: flex; align-items: center; gap: 28px; margin-top: 8px; }
        .nm2-stat { display: flex; flex-direction: column; gap: 4px; }
        .nm2-stat-num { font-size: 1.6rem; font-weight: 900; color: #1a1a1a; letter-spacing: -.04em; line-height: 1; }
        .nm2-stat-label { font-size: .65rem; letter-spacing: .2em; color: rgba(26,26,26,.45); text-transform: uppercase; font-weight: 500; }
        .nm2-stat-divider { width: 1px; height: 40px; background: rgba(201,168,76,.3); }

        /* RIGHT */
        .nm2-right {
          padding: 100px 80px 100px 60px;
          border-left: 1px solid rgba(201,168,76,.15);
          display: flex;
          align-items: center;
          min-height: 100vh;
        }
        .nm2-timeline { position: relative; display: flex; flex-direction: column; gap: 0; width: 100%; }

        /* Animated vertical line */
        .nm2-tl-line {
          position: absolute;
          left: 11px; top: 12px;
          width: 1px;
          height: 0%;
          background: linear-gradient(to bottom, #c9a84c, rgba(201,168,76,.15));
          transition: height 1.4s cubic-bezier(.25,.46,.45,.94);
          z-index: 0;
        }
        .nm2-tl-line.visible { height: calc(100% - 24px); }

        /* Timeline items */
        .nm2-tl-item {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          padding-bottom: 44px;
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: translateX(20px);
          transition: opacity .6s ease-out, transform .6s ease-out;
        }
        .nm2-tl-item:last-child { padding-bottom: 0; }
        .nm2-tl-item.visible { opacity: 1; transform: translateX(0); }

        /* Node */
        .nm2-tl-node {
          position: relative;
          width: 24px; height: 24px;
          flex-shrink: 0;
          margin-top: 4px;
          display: flex; align-items: center; justify-content: center;
        }
        .nm2-tl-node-core {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #c9a84c;
          position: relative; z-index: 2;
          transition: transform .3s ease;
        }
        .nm2-tl-item.visible .nm2-tl-node-core { animation: nm2NodePulse 2.5s ease-in-out infinite; }
        .nm2-tl-node-ring {
          position: absolute;
          width: 22px; height: 22px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,.35);
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          animation: nm2RingPulse 2.5s ease-in-out infinite;
        }
        @keyframes nm2NodePulse {
          0%,100%{ transform: scale(1); opacity: 1; }
          50%{ transform: scale(1.2); opacity: .7; }
        }
        @keyframes nm2RingPulse {
          0%,100%{ transform: translate(-50%,-50%) scale(1); opacity: .35; }
          50%{ transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
        }

        /* Content */
        .nm2-tl-content { display: flex; flex-direction: column; gap: 6px; }
        .nm2-tl-step { font-size: .6rem; letter-spacing: .3em; color: #c9a84c; font-weight: 700; text-transform: uppercase; }
        .nm2-tl-title { font-size: 1.05rem; font-family: var(--font-serif); font-weight: 700; color: #1a1a1a; margin: 0; letter-spacing: -.02em; }
        .nm2-tl-desc { font-size: .82rem; line-height: 1.75; color: rgba(26,26,26,.55); margin: 0; max-width: min(320px, 100%); }
      `}</style>
    </div>
  );
};

export default MissionPage;
