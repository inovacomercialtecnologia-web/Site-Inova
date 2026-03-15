import React, { useEffect } from 'react';

const PhilosophyPage = () => {
  useEffect(() => {
    const canvas = document.getElementById('nfhero-grid') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const drawGrid = () => {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          const GAP = window.innerWidth < 768 ? 32 : 56;
          const cols = Math.ceil(canvas.width / GAP);
          const rows = Math.ceil(canvas.height / GAP);
          const cx = canvas.width / 2, cy = canvas.height / 2;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
              const x = i * GAP, y = j * GAP;
              const dist = Math.sqrt(Math.pow(x-cx,2)+Math.pow(y-cy,2));
              const maxDist = Math.sqrt(cx*cx+cy*cy);
              const alpha = Math.max(0.03, 0.22*(1-dist/maxDist));
              ctx.beginPath();
              ctx.arc(x, y, 1.2, 0, Math.PI*2);
              ctx.fillStyle = `rgba(201,168,76,${alpha})`;
              ctx.fill();
            }
          }
        };
        drawGrid();
        window.addEventListener('resize', drawGrid);

        const t1 = setTimeout(() => {
          document.querySelectorAll('.nfhero-hline').forEach(el => el.classList.add('visible'));
        }, 400);
        const t2 = setTimeout(() => {
          const c = document.querySelector('.nfhero-center');
          if (c) c.classList.add('visible');
        }, 700);

        // Section 2 scroll reveal
        const section2 = document.getElementById('filosofiaS2');
        const reveals = section2 ? section2.querySelectorAll('.nf2-reveal') : [];
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              const delay = parseInt(el.dataset.delay || '0');
              setTimeout(() => el.classList.add('visible'), delay);
              observer.unobserve(el);
            }
          });
        }, { threshold: 0.15 });
        reveals.forEach(el => observer.observe(el));

        return () => {
          window.removeEventListener('resize', drawGrid);
          reveals.forEach(el => observer.unobserve(el));
          observer.disconnect();
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    }
  }, []);

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {/* Hero Section */}
      <section className="nfhero-section" id="filosofiaHero">
        <canvas id="nfhero-grid" className="nfhero-grid-canvas"></canvas>

        <span className="nfhero-corner nfhero-corner--tl"></span>
        <span className="nfhero-corner nfhero-corner--tr"></span>
        <span className="nfhero-corner nfhero-corner--bl"></span>
        <span className="nfhero-corner nfhero-corner--br"></span>

        <span className="nfhero-hline nfhero-hline--top"></span>
        <span className="nfhero-hline nfhero-hline--bottom"></span>

        <span className="nfhero-watermark">FILOSOFIA</span>

        <div className="nfhero-center">
          <div className="nfhero-label-row">
            <span className="nfhero-gold-line"></span>
            <span className="nfhero-label">Quem Somos / A Filosofia</span>
            <span className="nfhero-gold-line"></span>
          </div>
          <h1 className="nfhero-headline">
            <span className="nfhero-h-line1">A Filosofia</span>
            <span className="nfhero-h-line2">Do Pensamento ao Resultado</span>
          </h1>
          <div className="nfhero-badge-row">
            <span className="nfhero-badge">• Propósito</span>
            <span className="nfhero-badge">• Método</span>
            <span className="nfhero-badge">• Resultado</span>
          </div>
        </div>

        <span className="nfhero-side nfhero-side--left">INOVA SYSTEMS SOLUTIONS</span>
        <span className="nfhero-side nfhero-side--right">EST. 2024</span>
      </section>

      {/* Philosophy Content Section */}
      <section className="nf2-section" id="filosofiaS2">
        <span className="nf2-corner nf2-corner--tl"></span>
        <span className="nf2-corner nf2-corner--br"></span>
        <span className="nf2-watermark">01</span>

        <div className="nf2-inner">
          {/* Lead text */}
          <div className="nf2-lead-block nf2-reveal" data-delay="0">
            <span className="nf2-gold-line"></span>
            <p className="nf2-lead">Entendemos que a tecnologia é apenas o estágio final de um ciclo de clareza empresarial. Para nós, a construção de um sistema segue uma ordem natural que começa na sua liderança:</p>
          </div>

          {/* Quote phrases — each reveals independently */}
          <div className="nf2-quote-block">
            <div className="nf2-phrase nf2-reveal" data-delay="0">
              <span className="nf2-phrase-num">01</span>
              <p className="nf2-phrase-text">Tudo começa na <strong>sua mente.</strong></p>
              <span className="nf2-arrow">→</span>
              <p className="nf2-phrase-sub">O que você acredita vira cultura.</p>
            </div>
            <div className="nf2-phrase nf2-reveal" data-delay="150">
              <span className="nf2-phrase-num">02</span>
              <p className="nf2-phrase-text">O que você cultiva vira <strong>método.</strong></p>
              <span className="nf2-arrow">→</span>
              <p className="nf2-phrase-sub">O que você metodiza vira processo.</p>
            </div>
            <div className="nf2-phrase nf2-reveal" data-delay="300">
              <span className="nf2-phrase-num">03</span>
              <p className="nf2-phrase-text">O que você processa vira <strong>dado.</strong></p>
              <span className="nf2-arrow">→</span>
              <p className="nf2-phrase-sub">E dado nas mãos certas vira decisão.</p>
            </div>
            <div className="nf2-phrase nf2-reveal nf2-phrase--final" data-delay="450">
              <span className="nf2-phrase-num">04</span>
              <p className="nf2-phrase-text">Decisão certa vira <strong className="nf2-gold">resultado.</strong></p>
              <span className="nf2-arrow nf2-arrow--gold">→</span>
              <p className="nf2-phrase-sub">Este é o ciclo que construímos com você.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .nfhero-section {
          position: relative;
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .nfhero-grid-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none; z-index: 0; opacity: 0.45;
        }
        .nfhero-corner { position: absolute; width: 32px; height: 32px; z-index: 2; pointer-events: none; }
        .nfhero-corner--tl { top: 36px; left: 36px; border-top: 1.5px solid rgba(201,168,76,.55); border-left: 1.5px solid rgba(201,168,76,.55); }
        .nfhero-corner--tr { top: 36px; right: 36px; border-top: 1.5px solid rgba(201,168,76,.55); border-right: 1.5px solid rgba(201,168,76,.55); }
        .nfhero-corner--bl { bottom: 36px; left: 36px; border-bottom: 1.5px solid rgba(201,168,76,.55); border-left: 1.5px solid rgba(201,168,76,.55); }
        .nfhero-corner--br { bottom: 36px; right: 36px; border-bottom: 1.5px solid rgba(201,168,76,.55); border-right: 1.5px solid rgba(201,168,76,.55); }
        .nfhero-hline {
          position: absolute; left: 80px; right: 80px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,76,.2) 20%, rgba(201,168,76,.2) 80%, transparent);
          z-index: 2; pointer-events: none;
          transform: scaleX(0); transition: transform 1s ease-out;
        }
        .nfhero-hline--top { top: 80px; }
        .nfhero-hline--bottom { bottom: 80px; }
        .nfhero-hline.visible { transform: scaleX(1); }
        .nfhero-watermark {
          position: absolute;
          font-size: clamp(8rem, 18vw, 16rem);
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px rgba(201,168,76,.04);
          letter-spacing: .15em;
          user-select: none; pointer-events: none; z-index: 0;
          white-space: nowrap;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
        .nfhero-center {
          position: relative; z-index: 3;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 24px;
          max-width: 900px; padding: 0 40px;
          opacity: 0; transform: translateY(24px);
          transition: opacity .8s ease-out, transform .8s ease-out;
        }
        .nfhero-center.visible { opacity: 1; transform: translateY(0); }
        .nfhero-label-row { display: flex; align-items: center; gap: 16px; }
        .nfhero-gold-line { display: block; width: 40px; height: 1px; background: #c9a84c; opacity: .6; }
        .nfhero-label { font-size: .65rem; letter-spacing: .35em; color: #c9a84c; text-transform: uppercase; font-weight: 600; }
        .nfhero-headline { font-family: var(--font-serif); margin: 0; line-height: .95; letter-spacing: -.03em; }
        .nfhero-h-line1 {
          display: block;
          font-size: clamp(2.2rem, 3.8vw, 3.6rem);
          font-weight: 300;
          color: rgba(255,255,255,0.88);
        }
        .nfhero-h-line2 {
          display: block;
          font-size: clamp(2.8rem, 5vw, 4.8rem);
          font-weight: 300;
          font-style: italic;
          color: #c9a84c;
        }
        .nfhero-badge-row { display: flex; gap: 24px; margin-top: 8px; }
        .nfhero-badge { font-size: .65rem; letter-spacing: .3em; color: #c9a84c; text-transform: uppercase; font-weight: 600; opacity: .75; }
        .nfhero-side {
          position: absolute;
          font-size: .55rem; letter-spacing: .3em;
          color: rgba(201,168,76,.25); text-transform: uppercase; font-weight: 600;
          z-index: 2; pointer-events: none;
        }
        .nfhero-side--left { left: 20px; top: 50%; transform: translateX(-50%) translateY(-50%) rotate(-90deg); transform-origin: center; }
        .nfhero-side--right { right: 20px; top: 50%; transform: translateX(50%) translateY(-50%) rotate(90deg); transform-origin: center; }

        @media (max-width: 640px) {
          .nfhero-hline { left: 20px; right: 20px; }
          .nfhero-hline--top { top: 60px; }
          .nfhero-hline--bottom { bottom: 60px; }
          .nfhero-corner--tl { top: 20px; left: 20px; }
          .nfhero-corner--tr { top: 20px; right: 20px; }
          .nfhero-corner--bl { bottom: 20px; left: 20px; }
          .nfhero-corner--br { bottom: 20px; right: 20px; }
          .nfhero-side { display: none; }
          .nfhero-center { padding: 0 20px; gap: 14px; }
          .nfhero-headline { line-height: 1.05; }
          .nfhero-h-line1 { font-size: clamp(1.7rem, 7.5vw, 2.2rem); }
          .nfhero-h-line2 { font-size: clamp(2rem, 9vw, 2.8rem); }
          .nfhero-badge-row { gap: 10px; flex-wrap: wrap; justify-content: center; }
        }

        /* SECTION 2 */
        .nf2-section {
          background: #f5f3ee;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 120px 80px;
        }
        @media (max-width: 768px) {
          .nf2-section { padding: 72px 24px; min-height: unset; }
          .nf2-inner { gap: 40px; }
          .nf2-lead { font-size: .95rem !important; line-height: 1.85 !important; }

          /* Grid:
             col 1  | col 2
             ───────────────────────────────
             [num]  | [texto principal    ]
             [   ]  | [        →          ]
             [   ]  | [subtexto           ]
          */
          .nf2-phrase {
            display: grid;
            grid-template-columns: 32px 1fr;
            grid-template-rows: auto auto auto;
            column-gap: 14px;
            row-gap: 0;
            padding: 28px 0;
            align-items: start;
          }

          /* Número — fica à esquerda abrangendo as 3 linhas */
          .nf2-phrase-num {
            grid-row: 1 / span 3;
            grid-column: 1;
            align-self: start;
            padding-top: 3px;
          }

          /* Texto principal — linha 1, com respiro embaixo */
          .nf2-phrase-text {
            grid-row: 1;
            grid-column: 2;
            text-align: left;
            font-size: 1.05rem !important;
            line-height: 1.4;
            padding-bottom: 12px;
          }

          /* Seta — linha 2, ↓ via conteúdo CSS (sem rotate) */
          .nf2-arrow {
            display: block;
            grid-row: 2;
            grid-column: 2;
            text-align: center;
            font-size: 0 !important;
            color: transparent;
            padding: 0;
            margin: 0;
            transform: none !important;
          }
          .nf2-arrow::after {
            content: '↓';
            font-size: 1rem;
            color: rgba(26,26,26,.28);
            display: block;
            transition: color .3s;
          }
          .nf2-phrase--final .nf2-arrow::after { color: #c9a84c; }
          .nf2-phrase:hover .nf2-arrow::after { color: #c9a84c; }

          /* Subtexto — linha 3, com respiro em cima */
          .nf2-phrase-sub {
            grid-row: 3;
            grid-column: 2;
            text-align: left;
            font-size: .85rem !important;
            line-height: 1.7;
            padding-top: 16px;
          }
        }
        .nf2-corner { position: absolute; width: 28px; height: 28px; pointer-events: none; z-index: 2; }
        .nf2-corner--tl { top: 32px; left: 32px; border-top: 1.5px solid rgba(201,168,76,.4); border-left: 1.5px solid rgba(201,168,76,.4); }
        .nf2-corner--br { bottom: 32px; right: 32px; border-bottom: 1.5px solid rgba(201,168,76,.4); border-right: 1.5px solid rgba(201,168,76,.4); }
        .nf2-watermark {
          position: absolute;
          font-size: clamp(12rem, 28vw, 22rem);
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px rgba(201,168,76,.05);
          right: -2rem; bottom: -3rem;
          user-select: none; pointer-events: none; z-index: 0;
          line-height: 1;
        }
        .nf2-inner {
          position: relative; z-index: 2;
          max-width: 900px; width: 100%;
          display: flex; flex-direction: column; gap: 64px;
        }

        /* Lead */
        .nf2-lead-block { display: flex; align-items: flex-start; gap: 24px; }
        .nf2-gold-line { display: block; width: 3px; min-height: 100%; background: #c9a84c; flex-shrink: 0; border-radius: 2px; align-self: stretch; }
        .nf2-lead {
          font-size: 1.05rem; line-height: 1.85;
          color: rgba(26,26,26,.6); font-weight: 300; margin: 0;
        }

        /* Quote phrases */
        .nf2-quote-block {
          display: flex; flex-direction: column;
          border-top: 1px solid rgba(201,168,76,.2);
        }
        .nf2-phrase {
          display: grid;
          grid-template-columns: 36px 1fr 32px 1fr;
          align-items: center;
          gap: 20px;
          padding: 28px 0;
          border-bottom: 1px solid rgba(201,168,76,.12);
          transition: background .3s ease;
        }
        .nf2-phrase:hover { background: rgba(201,168,76,.03); }
        .nf2-phrase--final { border-bottom: none; }
        .nf2-phrase-num {
          font-size: .6rem; letter-spacing: .25em;
          color: #c9a84c; font-weight: 700; text-transform: uppercase;
        }
        .nf2-phrase-text {
          font-family: var(--font-serif);
          font-size: clamp(1.1rem, 1.8vw, 1.5rem);
          font-weight: 400; color: #1a1a1a;
          margin: 0; letter-spacing: -.02em; line-height: 1.3;
        }
        .nf2-phrase-text strong { font-weight: 900; color: #1a1a1a; }
        .nf2-gold { color: #c9a84c !important; }
        .nf2-arrow {
          font-size: 1.1rem; color: rgba(26,26,26,.2);
          text-align: center; display: block;
          transition: color .3s, transform .3s;
        }
        .nf2-arrow--gold { color: #c9a84c; }
        .nf2-phrase:hover .nf2-arrow { color: #c9a84c; transform: translateX(4px); }
        .nf2-phrase-sub {
          font-size: .85rem; line-height: 1.7;
          color: rgba(26,26,26,.45); font-weight: 300;
          margin: 0; font-style: italic;
        }

        /* Reveal animation */
        .nf2-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .7s ease-out, transform .7s ease-out;
        }
        .nf2-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          /* Hero adjustments for very small screens */
          .nfhero-center { padding: 0 16px; gap: 12px; }
          .nfhero-h-line1 { font-size: clamp(1.4rem, 7vw, 1.7rem); }
          .nfhero-h-line2 { font-size: clamp(1.6rem, 8vw, 2rem); }
          .nfhero-badge-row { gap: 8px; }
          .nfhero-badge     { font-size: .55rem; letter-spacing: .2em; }
          .nfhero-label     { font-size: .55rem; letter-spacing: .25em; }
          .nfhero-gold-line { width: 24px; }

          /* Section 2 adjustments */
          .nf2-section { padding: 48px 16px; }
          .nf2-inner { gap: 32px; }
          .nf2-lead { font-size: .88rem !important; line-height: 1.75 !important; }
          .nf2-lead-block { gap: 16px; }

          .nf2-phrase {
            grid-template-columns: 28px 1fr !important;
            column-gap: 10px !important;
            padding: 22px 0 !important;
          }
          .nf2-phrase-text {
            font-size: .95rem !important;
            padding-bottom: 8px !important;
          }
          .nf2-phrase-sub {
            font-size: .78rem !important;
            padding-top: 10px !important;
          }
          .nf2-phrase-num { font-size: .55rem !important; }

          .nf2-corner--tl { top: 16px; left: 16px; }
          .nf2-corner--br { bottom: 16px; right: 16px; }
        }
      `}</style>
    </div>
  );
};

export default PhilosophyPage;
