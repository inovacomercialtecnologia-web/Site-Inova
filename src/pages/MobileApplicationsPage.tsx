import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileApplicationsPage = () => {
  React.useEffect(() => {
    const _timeouts: number[] = [];
    const _observers: IntersectionObserver[] = [];
    const _styles: HTMLStyleElement[] = [];

    const mhero_initText = () => {
      const headline = document.querySelector('.mhero-headline') as HTMLElement;
      const subtitle = document.querySelector('.mhero-subtitle') as HTMLElement;
      const badges = document.querySelectorAll('.mhero-badge');

      if (headline) {
        headline.style.opacity = '0';
        headline.style.transform = 'translateY(20px)';
        headline.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      }
      if (subtitle) {
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(20px)';
        subtitle.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
      }
      badges.forEach((b) => {
        (b as HTMLElement).style.opacity = '0';
        (b as HTMLElement).style.transition = 'opacity 0.5s ease-out';
      });

      setTimeout(() => {
        if (headline) {
          headline.style.opacity = '1';
          headline.style.transform = 'translateY(0)';
        }
      }, 2500);

      setTimeout(() => {
        if (subtitle) {
          subtitle.style.opacity = '1';
          subtitle.style.transform = 'translateY(0)';
        }
      }, 3100);

      setTimeout(() => {
        badges.forEach((b) => {
          (b as HTMLElement).style.opacity = '0.8';
        });
      }, 3400);
    };

    const ms2_initTimeline = () => {
      const section = document.querySelector('.ms2-android');
      const line = document.querySelector('.ms2-line') as SVGLineElement;
      const arrows = document.querySelectorAll('.ms2-arrow');
      const nodes = document.querySelectorAll('.ms2-node, .ms2-node-center');
      const features = document.querySelector('.ms2-features') as HTMLElement;

      if (!section || !line) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animate line
            line.style.strokeDashoffset = '0';
            
            // Animate arrows
            arrows.forEach(a => (a as SVGTextElement).style.opacity = '1');

            // Animate nodes sequentially
            nodes.forEach((node, index) => {
              setTimeout(() => {
                node.classList.add('visible');
                // Add staggered delay to animation
                const dot = node.querySelector('circle:nth-child(2)') as SVGCircleElement;
                if(dot) dot.style.animationDelay = `${index * 0.3}s`;
              }, 500 + (index * 200));
            });

            // Animate features
            if(features) features.classList.add('visible');

            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });

      observer.observe(section);
    };

    const ms2_initEntrance = () => {
      // Inject CSS for entrance animations
      const style = document.createElement('style');
      style.textContent = `
        .ms2-diagonal-divider::after { transform: scaleX(0); transition: transform 0.8s ease-out; }
        .ms2-diagonal-divider.active::after { transform: scaleX(1); }
        
        .ms2-ios { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .ms2-ios.active { opacity: 1; transform: translateX(0); }
        
        .ms2-android { opacity: 0; transform: translateX(40px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .ms2-android.active { opacity: 1; transform: translateX(0); }
        
        .ms2-center-line { transform: translateX(-50%) scaleY(0); transform-origin: center; transition: transform 0.6s ease-out; }
        .ms2-center-line.active { transform: translateX(-50%) scaleY(1); }
        
        .ms2-header { opacity: 0; transition: opacity 0.4s ease-out; }
        .ms2-header.active { opacity: 1; }
        
        .ms2-headline { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .ms2-headline.active { opacity: 1; transform: translateY(0); }
        
        .ms2-text { opacity: 0; transition: opacity 0.6s ease-out; }
        .ms2-text.active { opacity: 1; }
        
        .ms2-feature-item { opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
        .ms2-feature-item.active { opacity: 1; transform: translateY(0); }
      `;
      document.head.appendChild(style);

      const section = document.querySelector('.ms2-section');
      const divider = document.querySelector('.ms2-diagonal-divider');
      const ios = document.querySelector('.ms2-ios');
      const android = document.querySelector('.ms2-android');
      const centerLine = document.querySelector('.ms2-center-line');
      const headers = document.querySelectorAll('.ms2-header');
      const headline = document.querySelector('.ms2-headline');
      const text = document.querySelector('.ms2-text');
      const features = document.querySelectorAll('.ms2-feature-item');

      if (!section) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 0s: Diagonal line
            if(divider) divider.classList.add('active');

            // 0.3s: Sides
            setTimeout(() => {
              if(ios) ios.classList.add('active');
              if(android) android.classList.add('active');
            }, 300);

            // 0.7s: Center line
            setTimeout(() => {
              if(centerLine) centerLine.classList.add('active');
            }, 700);

            // 0.9s: Headers
            setTimeout(() => {
              headers.forEach(h => h.classList.add('active'));
            }, 900);

            // 1.0s: Headline
            setTimeout(() => {
              if(headline) headline.classList.add('active');
            }, 1000);

            // 1.2s: Paragraph
            setTimeout(() => {
              if(text) text.classList.add('active');
            }, 1200);

            // 1.4s: Timeline
            setTimeout(() => {
              ms2_initTimeline();
            }, 1400);

            // 1.6s: Features stagger
            features.forEach((f, i) => {
              setTimeout(() => {
                f.classList.add('active');
              }, 1600 + (i * 150));
            });

            observer.disconnect();
          }
        });
      }, { threshold: 0.15 });

      observer.observe(section);
    };

    const ms3_initIllustrations = () => {
      const blocks = document.querySelectorAll('.ms3-block');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      blocks.forEach(block => observer.observe(block));
    };

    const ms3_initEntrance = () => {
      // Inject CSS for entrance animations
      const style = document.createElement('style');
      style.textContent = `
        .ms3-header { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .ms3-header.visible { opacity: 1; transform: translateY(0); }
        
        .ms3-block { opacity: 0; transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .ms3-block:nth-child(1) { transform: translateX(-60px); }
        .ms3-block:nth-child(2) { transform: translateX(60px); }
        .ms3-block:nth-child(3) { transform: translateY(50px); }
        
        .ms3-block.visible { opacity: 1; transform: translate(0, 0); }
      `;
      document.head.appendChild(style);

      const header = document.querySelector('.ms3-header');
      const blocks = document.querySelectorAll('.ms3-block');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            
            if (target.classList.contains('ms3-header')) {
              target.classList.add('visible');
            } else if (target.classList.contains('ms3-block')) {
              // Determine delay based on block index
              let delay = 0;
              if (target === blocks[1]) delay = 150;
              if (target === blocks[2]) delay = 300;

              setTimeout(() => {
                target.classList.add('visible');
                
                // Trigger SVG animation after block entrance (0.8s) + 0.3s delay
                setTimeout(() => {
                  target.classList.add('active');
                }, 1100);
              }, delay);
            }
            
            observer.unobserve(target);
          }
        });
      }, { threshold: 0.2 });

      if (header) observer.observe(header);
      blocks.forEach(block => observer.observe(block));
    };

    mhero_initText();
    ms2_initEntrance();
    ms3_initEntrance();

    return () => {
      _timeouts.forEach(t => clearTimeout(t));
      _observers.forEach(o => o.disconnect());
      _styles.forEach(s => { if (s.parentNode) s.parentNode.removeChild(s); });
    };
  }, []);

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {/* Hero Section */}
      <section className="mhero-wrapper">
        <MHeroCanvas />
        <div className="mhero-gradient"></div>
        <div className="mhero-text">
          <h1 className="mhero-headline">
            <span className="mhero-line-1">Aplicações</span>
            <span className="mhero-line-2">Mobile</span>
          </h1>
          <div className="mhero-separator"></div>
          <div className="mhero-subtitle-wrapper">
            <span className="mhero-badge mhero-badge-left">● iOS & Android</span>
            <p className="mhero-subtitle">
              Desenvolvemos aplicativos mobile completos, intuitivos e de alta performance, projetados para conectar sua empresa aos seus clientes e equipes onde quer que estejam.
            </p>
            <span className="mhero-badge mhero-badge-right">● Alta Performance</span>
          </div>
        </div>
        <style>{`
          .mhero-canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
          }
          .mhero-wrapper {
            position: relative;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #0a0a0a;
          }
          .mhero-text {
            position: relative;
            z-index: 1;
            text-align: center;
            max-width: 800px;
            margin-top: auto;
            padding-bottom: 60px;
            padding-left: 24px;
            padding-right: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .mhero-headline {
            display: flex;
            flex-direction: column;
            align-items: center;
            line-height: 0.9;
            letter-spacing: -3px;
            margin-bottom: 24px;
          }
          .mhero-line-1 {
            font-family: var(--font-serif);
            font-size: 80px;
            font-weight: 300;
            color: #ffffff;
            -webkit-text-stroke: 0;
            text-shadow:
              0 0 30px rgba(201,168,76,0.8),
              0 0 60px rgba(201,168,76,0.4),
              2px 2px 0px rgba(0,0,0,0.9);
            letter-spacing: -1px;
            line-height: 0.9;
            display: block;
            text-align: center;
            position: relative;
            z-index: 2;
          }
          .mhero-line-2 {
            font-family: var(--font-serif);
            font-size: 96px;
            font-weight: 300;
            font-style: italic;
            color: #ffffff;
          }
          .mhero-separator {
            width: 40px;
            height: 1px;
            background: #c9a84c;
            margin: 0 auto 24px;
            opacity: 0.6;
          }
          .mhero-subtitle-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
            width: 100%;
          }
          .mhero-subtitle {
            font-family: "Inter", sans-serif;
            font-size: 15px;
            color: rgba(255,255,255,0.5);
            line-height: 1.8;
            max-width: 480px;
            text-align: center;
            font-weight: 400;
          }
          .mhero-badge {
            font-family: "Inter", sans-serif;
            font-size: 12px;
            color: #c9a84c;
            letter-spacing: 2px;
            opacity: 0;
            text-transform: uppercase;
            white-space: nowrap;
            transition: opacity 0.5s ease-out;
          }
          @media (max-width: 768px) {
            .mhero-wrapper { min-height: 80vh; }
            .mhero-line-1 { font-size: 40px; letter-spacing: -1px; }
            .mhero-line-2 { font-size: 48px; letter-spacing: -1px; }
            .mhero-headline { letter-spacing: -1px; margin-bottom: 16px; }
            .mhero-text { padding-bottom: 40px; padding-left: 16px; padding-right: 16px; }
            .mhero-subtitle { font-size: 14px; max-width: 100%; }
            .mhero-subtitle-wrapper { flex-direction: column; gap: 16px; }
            .mhero-badge { display: none; }
            .ms2-diagonal-divider { height: 80px; margin-top: -80px; }
          }
          .ms2-diagonal-divider {
            width: 100%;
            height: 120px;
            background: linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 40%, transparent 100%);
            position: relative;
            overflow: hidden;
            z-index: 2;
            margin-top: -120px;
            pointer-events: none;
          }
          .ms2-diagonal-divider::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: -5%;
            width: 110%;
            height: 3px;
            background: linear-gradient(90deg,
              transparent 0%,
              #c9a84c 20%,
              #f0d080 50%,
              #c9a84c 80%,
              transparent 100%
            );
            transform: rotate(-1.5deg);
            transform-origin: left center;
          }
          .ms2-section {
            background: #ffffff;
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            position: relative;
            overflow: hidden;
          }
          .ms2-ios {
            background: #fafafa;
            padding: 80px 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            border-right: 1px solid rgba(201,168,76,0.15);
          }
          .ms2-android {
            background: #f5f3ee;
            padding: 80px 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
          }
          .ms2-center-line {
            position: absolute;
            left: 50%;
            top: 10%;
            height: 80%;
            width: 1px;
            background: linear-gradient(to bottom,
              transparent 0%,
              #c9a84c 20%,
              #c9a84c 80%,
              transparent 100%
            );
            transform: translateX(-50%);
            z-index: 1;
          }
          .ms2-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 32px;
          }
          .ms2-label {
            font-size: 11px;
            letter-spacing: 4px;
            color: #c9a84c;
            font-weight: 700;
            text-transform: uppercase;
            font-family: "Inter", sans-serif;
          }
          .ms2-logo {
            width: 48px;
            height: 48px;
            color: #c9a84c;
          }
          .ms2-headline {
            font-size: 42px;
            font-family: var(--font-serif);
            font-weight: 300;
            color: #1a1a1a;
            line-height: 1.1;
            margin-bottom: 24px;
          }
          .ms2-text {
            color: #555;
            font-size: 15px;
            line-height: 1.8;
            font-family: "Inter", sans-serif;
            max-width: 500px;
          }
          .ms2-watermark {
            font-size: 160px;
            font-weight: 900;
            color: #1a1a1a;
            opacity: 0.03;
            position: absolute;
            bottom: -20px;
            left: -10px;
            pointer-events: none;
            user-select: none;
            font-family: "Inter", sans-serif;
            line-height: 1;
          }
          .ms2-watermark-right {
            left: auto;
            right: -20px;
          }
          @media (max-width: 1024px) {
            .ms2-section {
              grid-template-columns: 1fr;
              min-height: auto;
            }
            .ms2-ios {
              border-right: none;
              border-bottom: 1px solid rgba(201,168,76,0.15);
              padding: 60px 30px;
            }
            .ms2-android {
              padding: 60px 30px;
            }
            .ms2-center-line {
              display: none;
            }
          }
          @media (max-width: 768px) {
            .ms2-section { min-height: auto; }
            .ms2-ios { padding: 48px 20px; }
            .ms2-android { padding: 48px 20px; }
            .ms2-headline { font-size: 30px; }
            .ms2-text { font-size: 14px; }
            .ms2-watermark { font-size: 100px; }
            .ms2-timeline { height: 220px !important; }
            .ms2-feature-item { font-size: 12px; }
          }
          .ms2-timeline { overflow: visible; }
          .ms2-line { stroke: #c9a84c; stroke-width: 1.5px; stroke-dasharray: 600; stroke-dashoffset: 600; transition: stroke-dashoffset 1.5s ease-out; }
          .ms2-arrow { fill: #c9a84c; font-size: 14px; text-anchor: middle; opacity: 0; transition: opacity 0.5s ease 1s; }
          .ms2-ring { fill: none; stroke: rgba(201,168,76,0.3); stroke-width: 1px; }
          .ms2-dot { fill: #c9a84c; }
          .ms2-label-top { font-size: 11px; fill: #888; text-anchor: middle; font-family: "Inter", sans-serif; }
          .ms2-label-bottom { font-size: 11px; fill: #888; text-anchor: middle; font-family: "Inter", sans-serif; }
          .ms2-active { fill: #c9a84c; font-weight: bold; }
          .ms2-ring-center { fill: none; stroke: rgba(201,168,76,0.2); stroke-width: 1px; }
          .ms2-dot-center { fill: #c9a84c; }
          .ms2-label-sub { font-size: 10px; letter-spacing: 2px; fill: #c9a84c; text-anchor: middle; font-family: "Inter", sans-serif; text-transform: uppercase; }

          .ms2-node, .ms2-node-center { opacity: 0; transform: scale(0); transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
          .ms2-node.visible, .ms2-node-center.visible { opacity: 1; transform: scale(1); }

          @keyframes ms2-pulse { 0% { r: 6; } 50% { r: 8; } 100% { r: 6; } }
          @keyframes ms2-pulse-center { 0% { r: 8; } 50% { r: 10; } 100% { r: 8; } }

          .ms2-node.visible .ms2-dot { animation: ms2-pulse 2s ease-in-out infinite; }
          .ms2-node-center.visible .ms2-dot-center { animation: ms2-pulse-center 2s ease-in-out infinite; }

          .ms2-features { margin-top: 32px; opacity: 0; transform: translateY(20px); transition: all 0.8s ease-out 1.5s; }
          .ms2-features.visible { opacity: 1; transform: translateY(0); }
          .ms2-feature-item { font-size: 13px; color: #555; margin-bottom: 8px; font-family: "Inter", sans-serif; display: flex; align-items: center; gap: 8px; }
          .ms2-feature-item span { color: #c9a84c; font-size: 16px; }
        `}</style>
      </section>

      {/* Diagonal Divider */}
      <div className="ms2-diagonal-divider"></div>

      {/* Multiplatform Section */}
      <section className="ms2-section">
        <div className="ms2-center-line"></div>
        
        {/* Left Side - iOS */}
        <div className="ms2-ios">
          <div className="ms2-watermark">iOS</div>
          <div className="ms2-header">
            <span className="ms2-label">iOS</span>
            <svg className="ms2-logo" viewBox="0 0 24 24">
              <path d="M12 2C12 2 11 4 13 4C15 4 15 2 15 2C15 2 13 2 13 2C13 2 12 2 12 2ZM13.5 5C11.5 5 10.5 6 10.5 7.5C10.5 9 12 10 13.5 10C15 10 16 9 16 7.5C16 6 15 5 13.5 5ZM10 12C10 12 9 14 11 14C13 14 13 12 13 12C13 12 11 12 11 12C11 12 10 12 10 12Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M16.5 14.5C15.5 14.5 15 15.5 15 16.5C15 17.5 16.5 18 16.5 18C16.5 18 15.5 19.5 14.5 19.5C13.5 19.5 13 18.5 12 18.5C11 18.5 10.5 19.5 9.5 19.5C8.5 19.5 7.5 18 7.5 18C7.5 18 6 15.5 6 13.5C6 11.5 7.5 10.5 8.5 10.5C9.5 10.5 10 11.5 11 11.5C12 11.5 12.5 10.5 13.5 10.5C14.5 10.5 16 11.5 16 11.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <h2 className="ms2-headline">Desenvolvimento Multiplataforma</h2>
          <p className="ms2-text">
            Nossos aplicativos são desenvolvidos para funcionar tanto no iOS quanto no Android, garantindo que o seu negócio alcance o máximo de usuários possível. Utilizamos tecnologias multiplataforma modernas que entregam qualidade, alta performance e a melhor experiência para o seu usuário em qualquer dispositivo.
          </p>
        </div>

        {/* Right Side - Android */}
        <div className="ms2-android">
          <div className="ms2-watermark ms2-watermark-right">Android</div>
          <div className="ms2-header">
            <span className="ms2-label">Android</span>
            <svg className="ms2-logo" viewBox="0 0 24 24">
              <path d="M17 5L19 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 5L5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 10V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20 10V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="6" y="5" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="9" cy="9" r="1" fill="currentColor" />
              <circle cx="15" cy="9" r="1" fill="currentColor" />
            </svg>
          </div>
          {/* Content reserved for Part 2 */}
          <svg className="ms2-timeline" width="100%" height="280">
            {/* Line */}
            <line x1="0" y1="140" x2="100%" y2="140" className="ms2-line" />
            
            {/* Arrows */}
            <text x="2%" y="145" className="ms2-arrow">◀</text>
            <text x="97%" y="145" className="ms2-arrow">▶</text>

            {/* Nodes */}
            <g className="ms2-node" style={{transformOrigin: '10% 140px'}}>
              <circle cx="10%" cy="140" r="12" className="ms2-ring" />
              <circle cx="10%" cy="140" r="6" className="ms2-dot" />
              <text x="10%" y="110" className="ms2-label-top">Conceito</text>
            </g>
            
            <g className="ms2-node" style={{transformOrigin: '27.5% 140px'}}>
              <circle cx="27.5%" cy="140" r="12" className="ms2-ring" />
              <circle cx="27.5%" cy="140" r="6" className="ms2-dot" />
              <text x="27.5%" y="170" className="ms2-label-bottom">Design</text>
            </g>

            {/* Center Node */}
            <g className="ms2-node-center" style={{transformOrigin: '50% 140px'}}>
              <circle cx="50%" cy="140" r="16" className="ms2-ring-center" />
              <circle cx="50%" cy="140" r="8" className="ms2-dot-center" />
              <text x="50%" y="110" className="ms2-label-top ms2-active">Desenvolvimento</text>
              <text x="50%" y="175" className="ms2-label-sub">iOS & Android</text>
            </g>

            <g className="ms2-node" style={{transformOrigin: '72.5% 140px'}}>
              <circle cx="72.5%" cy="140" r="12" className="ms2-ring" />
              <circle cx="72.5%" cy="140" r="6" className="ms2-dot" />
              <text x="72.5%" y="170" className="ms2-label-bottom">Testes</text>
            </g>

            <g className="ms2-node" style={{transformOrigin: '90% 140px'}}>
              <circle cx="90%" cy="140" r="12" className="ms2-ring" />
              <circle cx="90%" cy="140" r="6" className="ms2-dot" />
              <text x="90%" y="110" className="ms2-label-top">Lançamento</text>
            </g>
          </svg>

          <div className="ms2-features">
            <div className="ms2-feature-item"><span>✦</span> Qualidade nativa em ambas as plataformas</div>
            <div className="ms2-feature-item"><span>✦</span> Uma única base de código</div>
            <div className="ms2-feature-item"><span>✦</span> Lançamento simultâneo iOS e Android</div>
          </div>
        </div>
      </section>

      {/* App Types Section */}
      <section className="ms3-section">
        <div className="ms3-header">
          <div className="ms3-chapter-line"></div>
          <span className="ms3-label">Nossas Soluções Mobile</span>
          <span className="ms3-chapter-number">03</span>
        </div>

        <div className="ms3-bento">
          {/* Block 1 - App Corporativo */}
          <div className="ms3-block">
            <div className="ms3-watermark">CORP</div>
            <svg className="ms3-icon" viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 12V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="ms3-tag">Corporativo</div>
            <h3 className="ms3-title">App Corporativo</h3>
            <p className="ms3-text">
              Desenvolvemos aplicativos pensados para otimizar a operação interna da sua empresa. Controle de equipes, gestão de processos, monitoramento de indicadores, registro de atividades em campo e muito mais, tudo na palma da mão dos seus colaboradores, aumentando a produtividade e a eficiência do seu negócio onde quer que eles estejam.
            </p>
            <svg className="ms3-illustration ms3-ill-corp" viewBox="0 0 120 100">
              <rect x="20" y="40" width="15" height="40" className="ms3-bar ms3-bar-1" />
              <rect x="50" y="20" width="15" height="60" className="ms3-bar ms3-bar-2" />
              <rect x="80" y="30" width="15" height="50" className="ms3-bar ms3-bar-3" />
              <path d="M15 35 L50 15 L85 25 L105 10" className="ms3-graph-line" />
              <circle cx="50" cy="15" r="2" className="ms3-graph-dot" />
              <circle cx="85" cy="25" r="2" className="ms3-graph-dot" />
            </svg>
          </div>

          {/* Block 2 - App de Experiência do Cliente */}
          <div className="ms3-block">
            <div className="ms3-watermark">UX</div>
            <svg className="ms3-icon" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="8" y="9" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" transform="translate(0, 2)" />
            </svg>
            <div className="ms3-tag">Experiência</div>
            <h3 className="ms3-title">App de Experiência do Cliente</h3>
            <p className="ms3-text">
              Aproxime sua empresa dos seus clientes com um aplicativo exclusivo e personalizado. Desenvolvemos apps que centralizam pedidos, suporte, histórico de compras, programas de fidelidade e muito mais, criando uma experiência digital diferenciada que fortalece o relacionamento com o seu cliente e gera mais engajamento com a sua marca.
            </p>
            <svg className="ms3-illustration ms3-ill-client" viewBox="0 0 100 100">
              <rect x="30" y="10" width="40" height="70" rx="4" className="ms3-phone-outline" />
              <path d="M50 35 C50 35 45 30 40 35 C35 40 50 55 50 55 C50 55 65 40 60 35 C55 30 50 35 50 35 Z" className="ms3-heart" />
              <path d="M35 90 L37 85 L39 90 Z" className="ms3-star ms3-star-1" />
              <path d="M50 90 L52 85 L54 90 Z" className="ms3-star ms3-star-2" />
              <path d="M65 90 L67 85 L69 90 Z" className="ms3-star ms3-star-3" />
            </svg>
          </div>

          {/* Block 3 - App para Lançar no Mercado */}
          <div className="ms3-block ms3-block-panoramic">
            <div className="ms3-watermark ms3-watermark-launch">LAUNCH</div>
            <div className="ms3-panoramic-left">
              <svg className="ms3-icon" viewBox="0 0 24 24">
                <path d="M12 2.5C12 2.5 7 8 7 13C7 16 9 19 12 21C15 19 17 16 17 13C17 8 12 2.5 12 2.5Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M12 15C13.1046 15 14 14.1046 14 13C14 11.8954 13.1046 11 12 11C10.8954 11 10 11.8954 10 13C10 14.1046 10.8954 15 12 15Z" fill="currentColor" />
                <path d="M7.5 18L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16.5 18L19 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <div className="ms3-tag">Lançamento</div>
                <h3 className="ms3-title">App para Lançar no Mercado</h3>
                <svg className="ms3-illustration ms3-ill-launch" viewBox="0 0 80 80">
                  <path d="M30 50 C30 50 30 30 40 20 C50 30 50 50 50 50 L40 55 L30 50 Z" className="ms3-rocket-body" />
                  <path d="M30 50 L25 55 L30 60" className="ms3-rocket-fin-l" />
                  <path d="M50 50 L55 55 L50 60" className="ms3-rocket-fin-r" />
                  <circle cx="40" cy="35" r="3" className="ms3-rocket-window" />
                  <path d="M35 65 L35 75" className="ms3-rocket-fire" />
                  <path d="M40 65 L40 78" className="ms3-rocket-fire" />
                  <path d="M45 65 L45 75" className="ms3-rocket-fire" />
                </svg>
              </div>
            </div>
            <div className="ms3-divider"></div>
            <div className="ms3-panoramic-right">
              <p className="ms3-text">
                Tem uma ideia de aplicativo e quer transformá-la em um produto real? Desenvolvemos apps para qualquer nicho e segmento, saúde, educação, finanças, streaming, delivery, bem-estar e muito mais. Do conceito ao lançamento nas lojas, criamos soluções completas e escaláveis para quem quer empreender no mercado digital com o seu próprio aplicativo.
              </p>
            </div>
          </div>
        </div>
        <style>{`
          .ms3-section {
            background: #f5f3ee;
            padding: 80px 80px;
            position: relative;
            overflow: hidden;
          }
          .ms3-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 56px;
            position: relative;
          }
          .ms3-chapter-line {
            width: 48px;
            height: 1px;
            background: #c9a84c;
            margin-bottom: 20px;
          }
          .ms3-label {
            font-size: 11px;
            letter-spacing: 4px;
            color: #c9a84c;
            text-transform: uppercase;
            font-family: "Inter", sans-serif;
            font-weight: 700;
            position: relative;
            z-index: 1;
          }
          .ms3-chapter-number {
            font-size: 160px;
            font-weight: 900;
            color: #c9a84c;
            opacity: 0.04;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: "Inter", sans-serif;
            pointer-events: none;
            line-height: 1;
          }
          .ms3-bento {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            grid-template-rows: auto auto;
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
          }
          .ms3-block {
            background: #ffffff;
            border: 1px solid rgba(201,168,76,0.2);
            border-radius: 24px;
            padding: 44px;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            min-height: 380px;
            display: flex;
            flex-direction: column;
          }
          .ms3-block:hover {
            transform: translateY(-6px);
            border-color: rgba(201,168,76,0.7);
            box-shadow: 0 16px 48px rgba(0,0,0,0.08);
          }
          .ms3-block-panoramic {
            grid-column: 1 / -1;
            min-height: 220px;
            flex-direction: row;
            align-items: center;
            gap: 60px;
          }
          .ms3-icon {
            width: 40px;
            height: 40px;
            color: #c9a84c;
            margin-bottom: 24px;
            flex-shrink: 0;
          }
          .ms3-tag {
            font-size: 10px;
            letter-spacing: 3px;
            color: #c9a84c;
            text-transform: uppercase;
            margin-bottom: 12px;
            font-family: "Inter", sans-serif;
            font-weight: 700;
          }
          .ms3-title {
            font-size: 28px;
            font-weight: 800;
            color: #1a1a1a;
            font-family: "Inter", sans-serif;
            line-height: 1.2;
            margin-bottom: 16px;
          }
          .ms3-text {
            font-size: 14px;
            color: #666;
            line-height: 1.8;
            font-family: "Inter", sans-serif;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .ms3-watermark {
            font-size: 120px;
            font-weight: 900;
            color: #c9a84c;
            opacity: 0.04;
            position: absolute;
            bottom: -20px;
            right: -10px;
            font-family: "Inter", sans-serif;
            pointer-events: none;
            line-height: 1;
          }
          .ms3-watermark-launch {
            font-size: 100px;
            right: -20px;
            bottom: -20px;
          }
          .ms3-panoramic-left {
            width: 40%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .ms3-panoramic-right {
            width: 60%;
          }
          .ms3-divider {
            width: 3px;
            height: 60px;
            background: #c9a84c;
            opacity: 0.6;
            align-self: center;
          }
          .ms3-block-panoramic .ms3-title {
            font-size: 32px;
            margin-bottom: 0;
          }
          .ms3-block-panoramic .ms3-text {
            -webkit-line-clamp: unset;
            font-size: 15px;
          }
          @media (max-width: 1024px) {
            .ms3-section { padding: 60px 24px; }
            .ms3-bento { grid-template-columns: 1fr; }
            .ms3-block-panoramic { flex-direction: column; align-items: flex-start; gap: 32px; }
            .ms3-panoramic-left, .ms3-panoramic-right { width: 100%; }
            .ms3-divider { width: 60px; height: 3px; align-self: flex-start; }
            .ms3-illustration { display: none; }
          }
          @media (max-width: 768px) {
            .ms3-section { padding: 40px 16px; }
            .ms3-block { padding: 28px; min-height: 260px; border-radius: 16px; }
            .ms3-block-panoramic { min-height: auto; gap: 20px; }
            .ms3-block-panoramic .ms3-title { font-size: 24px; }
            .ms3-block-panoramic .ms3-text { font-size: 14px; }
            .ms3-title { font-size: 22px; }
            .ms3-text { font-size: 13px; -webkit-line-clamp: unset; }
            .ms3-watermark { font-size: 80px; }
            .ms3-watermark-launch { font-size: 60px; }
            .ms3-chapter-number { font-size: 100px; }
            .ms3-header { margin-bottom: 36px; }
          }
          .ms3-illustration {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 120px;
            height: 100px;
            opacity: 0.6;
            pointer-events: none;
          }
          .ms3-ill-client { width: 100px; height: 100px; }
          .ms3-ill-launch { 
            position: absolute;
            right: 0;
            bottom: 0;
            width: 80px; 
            height: 80px; 
            opacity: 0.6;
          }
          .ms3-panoramic-left { position: relative; }
          
          .ms3-bar, .ms3-graph-line, .ms3-graph-dot, 
          .ms3-phone-outline, .ms3-heart, .ms3-star,
          .ms3-rocket-body, .ms3-rocket-fin-l, .ms3-rocket-fin-r, .ms3-rocket-window, .ms3-rocket-fire {
            stroke: #c9a84c;
            stroke-width: 1.5px;
            fill: none;
          }
          .ms3-graph-dot { fill: #c9a84c; stroke: none; }
          .ms3-star { fill: #c9a84c; stroke: none; opacity: 0; }
          
          /* Corp Animation */
          .ms3-bar { transform-origin: bottom; transform: scaleY(0); transition: transform 1s ease-out; }
          .ms3-block.active .ms3-bar-1 { transform: scaleY(1); transition-delay: 0s; }
          .ms3-block.active .ms3-bar-2 { transform: scaleY(1); transition-delay: 0.2s; }
          .ms3-block.active .ms3-bar-3 { transform: scaleY(1); transition-delay: 0.4s; }
          
          .ms3-graph-line { stroke-dasharray: 100; stroke-dashoffset: 100; transition: stroke-dashoffset 1s ease-out 0.6s; }
          .ms3-block.active .ms3-graph-line { stroke-dashoffset: 0; }
          
          .ms3-graph-dot { opacity: 0; transition: opacity 0.5s ease 1s; }
          .ms3-block.active .ms3-graph-dot { opacity: 1; }

          /* Client Animation */
          @keyframes ms3-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
          .ms3-heart { transform-origin: center; }
          .ms3-block.active .ms3-heart { animation: ms3-pulse 1.5s ease-in-out infinite; }
          
          .ms3-block.active .ms3-star-1 { opacity: 1; transition: opacity 0.5s ease 0.2s; }
          .ms3-block.active .ms3-star-2 { opacity: 1; transition: opacity 0.5s ease 0.4s; }
          .ms3-block.active .ms3-star-3 { opacity: 1; transition: opacity 0.5s ease 0.6s; }

          /* Launch Animation */
          @keyframes ms3-float { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
          .ms3-ill-launch { transform-origin: center; }
          .ms3-block.active .ms3-ill-launch { animation: ms3-float 2s ease-in-out infinite; }

          @media (max-width: 640px) {
            .mhero-wrapper { min-height: 70vh; }
            .mhero-line-1 { font-size: clamp(2rem, 10vw, 40px); }
            .mhero-line-2 { font-size: clamp(2.4rem, 12vw, 48px); }
            .mhero-text { padding-bottom: 32px; }
            .ms2-ios { padding: 36px 16px; }
            .ms2-android { padding: 36px 16px; }
            .ms2-headline { font-size: 24px; }
            .ms2-text { font-size: 13px; max-width: 100%; }
            .ms2-watermark { font-size: 70px; }
            .ms2-label { font-size: 10px; letter-spacing: 3px; }
            .ms2-logo { width: 36px; height: 36px; }
            .ms3-section { padding: 32px 12px; }
            .ms3-block { padding: 24px; min-height: auto; }
            .ms3-title { font-size: 20px; }
            .ms3-block-panoramic .ms3-title { font-size: 20px; }
            .ms3-tag { font-size: 9px; letter-spacing: 2px; }
            .ms3-divider { width: 40px; }
          }
        `}</style>
      </section>
    </div>
  );
};

export default MobileApplicationsPage;

function MHeroCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    // Particle system configuration
    const mhero_targets = [
      {x:300,y:80},{x:380,y:75},{x:420,y:72},{x:425,y:120},{x:428,y:180},
      {x:430,y:260},{x:432,y:320},{x:415,y:330},{x:380,y:335},{x:300,y:332},
      {x:295,y:280},{x:292,y:200},{x:290,y:130},{x:355,y:85},{x:370,y:83},
      {x:385,y:85},{x:310,y:100},{x:350,y:100},{x:390,y:100},{x:415,y:100},
      {x:305,y:130},{x:420,y:130},{x:420,y:175},{x:305,y:175},{x:305,y:190},
      {x:420,y:190},{x:420,y:225},{x:305,y:225},{x:325,y:310},{x:360,y:310},
      {x:395,y:310},{x:490,y:40},{x:540,y:40},{x:590,y:40},{x:640,y:40},
      {x:645,y:100},{x:648,y:180},{x:650,y:260},{x:648,y:320},{x:640,y:335},
      {x:580,y:338},{x:520,y:335},{x:490,y:332},{x:488,y:280},{x:485,y:200},
      {x:487,y:120},{x:568,y:52},{x:502,y:65},{x:530,y:65},{x:580,y:65},
      {x:630,y:65},{x:498,y:85},{x:638,y:85},{x:638,y:165},{x:498,y:165},
      {x:520,y:185},{x:568,y:185},{x:616,y:185},{x:505,y:210},{x:635,y:210},
      {x:505,y:228},{x:635,y:228},{x:505,y:246},{x:635,y:246},{x:520,y:315},
      {x:568,y:315},{x:616,y:315},{x:635,y:315},{x:780,y:72},{x:820,y:75},
      {x:900,y:80},{x:908,y:130},{x:910,y:200},{x:912,y:280},{x:900,y:332},
      {x:820,y:335},{x:785,y:330},{x:775,y:320},{x:772,y:260},{x:770,y:180},
      {x:775,y:120},{x:815,y:85},{x:830,y:83},{x:845,y:85},{x:783,y:128},
      {x:900,y:128},{x:783,y:155},{x:900,y:155},{x:783,y:182},{x:900,y:182},
      {x:783,y:209},{x:900,y:209},{x:858,y:268},{x:875,y:255},{x:892,y:268},
      {x:875,y:281},{x:875,y:258},{x:803,y:310},{x:840,y:310},{x:877,y:310}
    ];

    const isMobile = width < 768;
    const numParticles = isMobile ? 50 : 100;
    const particles: {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      phase: number; // 0-1 for lerp
      speed: number;
      radius: number;
      offset: number; // unique phase offset for breathing
    }[] = [];

    // Initialize particles with random positions
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: Math.random() * width, // Placeholder, updated in render
        targetY: Math.random() * height, // Placeholder, updated in render
        phase: 0,
        speed: 0.035,
        radius: 2.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2
      });
    }

    let startTime = Date.now();

    const updateTargets = () => {
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) / 1000 * 1.2; // Scale factor based on screen size
      
      // Center the formation
      const formationCenterX = 600; // Approx center of the target coordinates
      const formationCenterY = 200;

      for(let i=0; i<numParticles; i++) {
        if(i < mhero_targets.length) {
          // Center and scale the targets
          const tx = (mhero_targets[i].x - formationCenterX) * scale + centerX;
          const ty = (mhero_targets[i].y - formationCenterY) * scale + centerY - 50; // -50 to move up slightly
          particles[i].targetX = tx;
          particles[i].targetY = ty;
        }
      }
    };

    const render = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      
      updateTargets(); // Update targets on resize/frame (could be optimized)

      ctx.clearRect(0, 0, width, height);
      
      // Draw connections first (behind dots)
      if (elapsed > 0.5) {
        ctx.lineWidth = 0.8;
        
        // Track connection counts per particle to limit max connections
        const connectionCounts = new Array(numParticles).fill(0);
        
        for (let i = 0; i < numParticles; i++) {
          if (connectionCounts[i] >= 3) continue; // Skip if max connections reached
          
          for (let j = i + 1; j < numParticles; j++) {
            if (connectionCounts[j] >= 3) continue; // Skip if max connections reached
            
            // Connection rule: only connect within same group
            // Group 1: 0-30, Group 2: 31-65, Group 3: 66-99
            let groupI = -1;
            if (i <= 30) groupI = 1;
            else if (i <= 65) groupI = 2;
            else groupI = 3;

            let groupJ = -1;
            if (j <= 30) groupJ = 1;
            else if (j <= 65) groupJ = 2;
            else groupJ = 3;

            if (groupI !== groupJ) continue;

            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const maxDist = isMobile ? 40 : 60;
            if (dist < maxDist) {
              const opacity = elapsed > 2.5 ? 0.5 : 0.5 * (1 - dist / maxDist);
              ctx.strokeStyle = `rgba(201, 168, 76, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
              
              connectionCounts[i]++;
              connectionCounts[j]++;
              
              if (connectionCounts[i] >= 3) break; // Break inner loop if i is full
            }
          }
        }
      }

      // Update and draw particles
      ctx.fillStyle = '#c9a84c';
      
      particles.forEach(p => {
        // Phase 1: Random drift (0-0.5s) - handled by init state
        
        // Phase 2: Move to target (0.5s-2.5s)
        if (elapsed > 0.5) {
          p.x += (p.targetX - p.x) * p.speed;
          p.y += (p.targetY - p.y) * p.speed;
        }
        
        // Phase 3: Breathing (2.5s+)
        let drawX = p.x;
        let drawY = p.y;
        
        if (elapsed > 2.5) {
          const osc = Math.sin(elapsed * (2 * Math.PI / 3) + p.offset) * 2;
          drawX += osc;
          drawY += osc;
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      _rafId = requestAnimationFrame(render);
    };

    let _rafId: number;
    render();

    return () => {
      cancelAnimationFrame(_rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="mhero-canvas" />;
}
