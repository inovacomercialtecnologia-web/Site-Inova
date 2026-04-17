import React from 'react';
import PageMeta from '../components/PageMeta';
import JsonLd, { service, breadcrumb } from '../components/JsonLd';
import CTABanner from '../components/CTABanner';

const AutomationsPage = () => {
  React.useEffect(() => {
    let _animId: number | null = null;
    let _resizeHandler: (() => void) | null = null;
    let _styleEl: HTMLStyleElement | null = null;
    let _observer: IntersectionObserver | null = null;
    const _timeouts: number[] = [];

    const ahero_initParticles = () => {
      const canvas = document.querySelector('.ahero-canvas') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const targets = [{"x":130,"y":170},{"x":180,"y":170},{"x":230,"y":170},{"x":230,"y":200},{"x":230,"y":230},{"x":180,"y":230},{"x":130,"y":230},{"x":130,"y":200},{"x":180,"y":200},{"x":330,"y":170},{"x":380,"y":170},{"x":430,"y":170},{"x":430,"y":200},{"x":430,"y":230},{"x":380,"y":230},{"x":330,"y":230},{"x":330,"y":200},{"x":380,"y":200},{"x":560,"y":160},{"x":620,"y":200},{"x":560,"y":240},{"x":500,"y":200},{"x":560,"y":200},{"x":715,"y":103},{"x":760,"y":103},{"x":805,"y":103},{"x":805,"y":130},{"x":805,"y":158},{"x":760,"y":158},{"x":715,"y":158},{"x":715,"y":130},{"x":760,"y":130},{"x":715,"y":243},{"x":760,"y":243},{"x":805,"y":243},{"x":805,"y":270},{"x":805,"y":298},{"x":760,"y":298},{"x":715,"y":298},{"x":715,"y":270},{"x":760,"y":270},{"x":910,"y":170},{"x":960,"y":170},{"x":1010,"y":170},{"x":1010,"y":200},{"x":1010,"y":230},{"x":960,"y":230},{"x":910,"y":230},{"x":910,"y":200},{"x":960,"y":200},{"x":255,"y":200},{"x":280,"y":200},{"x":305,"y":200},{"x":454,"y":200},{"x":478,"y":200},{"x":622,"y":200},{"x":650,"y":185},{"x":680,"y":165},{"x":710,"y":148},{"x":650,"y":215},{"x":680,"y":240},{"x":710,"y":258},{"x":860,"y":145},{"x":900,"y":165},{"x":930,"y":182},{"x":860,"y":255},{"x":900,"y":235},{"x":930,"y":218},{"x":100,"y":150},{"x":100,"y":200},{"x":100,"y":250},{"x":1060,"y":150},{"x":1080,"y":200},{"x":1060,"y":250},{"x":560,"y":100},{"x":560,"y":300},{"x":455,"y":200}];

      const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      resize();
      _resizeHandler = resize;
      window.addEventListener('resize', resize);

      const particles = targets.map((target, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        targetX: target.x,
        targetY: target.y,
        isSolder: [8, 17, 22, 31, 40, 48].includes(i),
        phase: Math.random() * Math.PI * 2,
        connections: 0
      }));

      const startTime = Date.now();
      const isMobile = window.innerWidth < 768;
      let frameCount = 0;

      const animate = () => {
        frameCount++;
        // Skip every other frame on mobile for performance
        if (isMobile && frameCount % 2 !== 0) { requestAnimationFrame(animate); return; }
        const elapsed = (Date.now() - startTime) / 1000;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const offsetX = canvas.width / 2 - 590;
        const offsetY = canvas.height / 2 - 200;

        // Reset connections count
        particles.forEach(p => p.connections = 0);

        // Update positions
        particles.forEach(p => {
          const tx = p.targetX + offsetX;
          const ty = p.targetY + offsetY;
          p.x += (tx - p.x) * 0.035;
          p.y += (ty - p.y) * 0.035;
        });

        // Draw connections
        ctx.strokeStyle = 'rgba(201, 168, 76, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].connections >= 2) continue;

          for (let j = i + 1; j < particles.length; j++) {
            if (particles[j].connections >= 2) continue;

            const p1 = particles[i];
            const p2 = particles[j];
            
            // Calculate actual drawing positions including breathing
            let x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
            if (elapsed > 2.5) {
              const osc1 = Math.sin(elapsed * (2 * Math.PI / 3) + p1.phase) * 1.5;
              x1 += osc1; y1 += osc1;
              const osc2 = Math.sin(elapsed * (2 * Math.PI / 3) + p2.phase) * 1.5;
              x2 += osc2; y2 += osc2;
            }

            const dx = x1 - x2;
            const dy = y1 - y2;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 65) {
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              p1.connections++;
              p2.connections++;
              if (p1.connections >= 2) break;
            }
          }
        }
        ctx.stroke();

        // Draw particles
        particles.forEach(p => {
          let x = p.x, y = p.y;
          if (elapsed > 2.5) {
            const osc = Math.sin(elapsed * (2 * Math.PI / 3) + p.phase) * 1.5;
            x += osc; y += osc;
          }

          if (p.isSolder) {
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(201, 168, 76, 0.25)';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#c9a84c';
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#c9a84c';
            ctx.fill();
          }
        });

        _animId = requestAnimationFrame(animate);
      };
      animate();
    };

    const ahero_initText = () => {
      const t1 = window.setTimeout(() => {
        const headline = document.querySelector('.ahero-headline') as HTMLElement;
        if (headline) {
          headline.style.opacity = '1';
          headline.style.transform = 'translateY(0)';
        }
      }, 2500);
      _timeouts.push(t1);

      const t2 = window.setTimeout(() => {
        const subtitle = document.querySelector('.ahero-subtitle') as HTMLElement;
        if (subtitle) {
          subtitle.style.opacity = '1';
          subtitle.style.transform = 'translateY(0)';
        }
      }, 3200);
      _timeouts.push(t2);
    };

    const as2_initHover = () => {
      const items = document.querySelectorAll('.as2-item');
      
      const setItemState = (item: Element, isOpen: boolean) => {
        const number = item.querySelector('.as2-number') as HTMLElement;
        const title = item.querySelector('.as2-title') as HTMLElement;
        const tag = item.querySelector('.as2-tag') as HTMLElement;
        const line = item.querySelector('.as2-line') as HTMLElement;
        const content = item.querySelector('.as2-content') as HTMLElement;

        if (isOpen) {
          if (number) number.style.opacity = '1.0';
          if (title) title.style.color = '#c9a84c';
          if (tag) tag.style.opacity = '1.0';
          if (line) line.style.width = '100%';
          if (content) {
            content.style.maxHeight = '300px';
            content.style.paddingTop = '8px';
          }
        } else {
          if (number) number.style.opacity = '';
          if (title) title.style.color = '';
          if (tag) tag.style.opacity = '';
          if (line) line.style.width = '';
          if (content) {
            content.style.maxHeight = '';
            content.style.paddingTop = '';
          }
        }
      };

      items.forEach(item => {
        item.addEventListener('mouseenter', () => {
          // Open this item
          setItemState(item, true);
          
          // Dim others and close them
          items.forEach(other => {
            if (other !== item) {
              (other as HTMLElement).style.opacity = '0.35';
              setItemState(other, false);
            }
          });
          (item as HTMLElement).style.opacity = '1';
        });

        item.addEventListener('mouseleave', () => {
          // Close this item
          setItemState(item, false);
          
          // Reset opacity for all
          items.forEach(other => {
            (other as HTMLElement).style.opacity = '1';
          });
        });
      });

      // Default open state: first item
      if (items.length > 0) {
        setItemState(items[0], true);
      }
    };

    const as2_initEntrance = () => {
      // Inject CSS for entrance animations
      _styleEl = document.createElement('style');
      _styleEl.textContent = `
        .as2-header { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .as2-header.visible { opacity: 1; transform: translateY(0); }

        .as2-item.entrance-hidden { opacity: 0; transform: translateY(30px); }
        .as2-item.entrance-visible { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      `;
      document.head.appendChild(_styleEl);

      const header = document.querySelector('.as2-header');
      const items = document.querySelectorAll('.as2-item');
      
      // Initial state
      items.forEach(item => item.classList.add('entrance-hidden'));

      _observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (header) header.classList.add('visible');

            items.forEach((item, index) => {
              let delay = 0;
              if (index === 0) delay = 200;
              if (index === 1) delay = 350;
              if (index === 2) delay = 500;

              const t1 = window.setTimeout(() => {
                item.classList.remove('entrance-hidden');
                item.classList.add('entrance-visible');
                const t2 = window.setTimeout(() => {
                  item.classList.remove('entrance-visible');
                }, 600);
                _timeouts.push(t2);
              }, delay);
              _timeouts.push(t1);
            });

            const t3 = window.setTimeout(() => {
              as2_initHover();
            }, 1100);
            _timeouts.push(t3);

            _observer?.disconnect();
          }
        });
      }, { threshold: 0.1 });

      const section = document.querySelector('.as2-section');
      if (section) _observer.observe(section);
    };

    ahero_initParticles();
    ahero_initText();
    as2_initEntrance();

    return () => {
      if (_animId) cancelAnimationFrame(_animId);
      if (_resizeHandler) window.removeEventListener('resize', _resizeHandler);
      if (_styleEl && _styleEl.parentNode) _styleEl.parentNode.removeChild(_styleEl);
      if (_observer) _observer.disconnect();
      _timeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <PageMeta title="Automações" description="Automação de processos empresariais: fluxos automáticos, integração entre sistemas e automação de marketing e vendas." />
      <JsonLd id="jsonld-service-auto" data={service('Automação de Processos Empresariais', 'Fluxos automáticos, integração entre sistemas e automação de marketing e vendas para empresas B2B.', '/solucoes/automacoes')} />
      <JsonLd id="jsonld-breadcrumb-auto" data={breadcrumb([{ name: 'Início', path: '/' }, { name: 'Soluções', path: '/portfolio' }, { name: 'Automações', path: '/solucoes/automacoes' }])} />
      {/* Hero Section */}
      <div className="ahero-wrapper">
        <div className="ahero-text-block">
          <h1 className="ahero-headline">Automa<span style={{borderBottom: '2px solid #c9a84c', paddingBottom: '4px'}}>ções</span></h1>
          <div className="ahero-divider">
            <span className="ahero-line"></span>
            <span className="ahero-tag">Inteligência Operacional</span>
            <span className="ahero-line"></span>
          </div>
          <div className="ahero-subtitle ahero-subtitle-cols">
            <div className="ahero-col-left">
              <p className="ahero-primary">Automatizamos os processos do seu negócio para eliminar tarefas manuais, reduzir erros e liberar sua equipe para o que realmente importa.</p>
            </div>
            <div className="ahero-col-divider"></div>
            <div className="ahero-col-right">
              <p className="ahero-secondary">De fluxos internos a integrações entre sistemas, conectamos tudo para que sua operação funcione de forma mais inteligente e eficiente.</p>
            </div>
          </div>
        </div>
        <canvas className="ahero-canvas"></canvas>
        <div className="ahero-fade"></div>
      </div>

      {/* Automation Types Section */}
      <section className="as2-section">
        <div className="as2-section-top-line"></div>
        <div className="as2-header">
          <div className="as2-chapter-line"></div>
          <span className="as2-label">O que automatizamos</span>
          <span className="as2-watermark">02</span>
        </div>

        <ul className="as2-list">
          <li className="as2-item" data-index="0">
            <div className="as2-item-header">
              <span className="as2-number">01</span>
              <span className="as2-title">Automação de Fluxos</span>
              <span className="as2-tag">Automatização de Processos e Tarefas Repetitivas</span>
              <span className="as2-line"></span>
            </div>
            <div className="as2-content">
              <p>Mapeamos e automatizamos os processos do seu negócio, transformando tarefas manuais e repetitivas em fluxos automáticos e inteligentes. Desde aprovações, notificações e geração de documentos até processos complexos de múltiplas etapas, criamos automações que economizam tempo, reduzem erros e escalam junto com a sua operação.</p>
            </div>
          </li>
          <li className="as2-item" data-index="1">
            <div className="as2-item-header">
              <span className="as2-number">02</span>
              <span className="as2-title">Integração entre Sistemas</span>
              <span className="as2-tag">Conexão entre Plataformas, Softwares e APIs</span>
              <span className="as2-line"></span>
            </div>
            <div className="as2-content">
              <p>Conectamos todas as ferramentas e plataformas que a sua empresa já utiliza em um único ecossistema integrado. Por meio de APIs e integrações customizadas, eliminamos o retrabalho de inserir dados manualmente em diferentes sistemas — garantindo que a informação flua de forma automática, segura e em tempo real entre todos os seus softwares.</p>
            </div>
          </li>
          <li className="as2-item" data-index="2">
            <div className="as2-item-header">
              <span className="as2-number">03</span>
              <span className="as2-title">Automação de Marketing e Vendas</span>
              <span className="as2-tag">Fluxos Automatizados Focados em Aquisição e Relacionamento com o Cliente</span>
              <span className="as2-line"></span>
            </div>
            <div className="as2-content">
              <p>Automatizamos toda a jornada do seu cliente, desde o primeiro contato até o fechamento da venda. Criamos fluxos automáticos de nutrição de leads, disparos de e-mail, mensagens personalizadas, follow-ups e muito mais — integrando suas ferramentas de marketing e CRM para que sua equipe venda mais com menos esforço manual.</p>
            </div>
          </li>
        </ul>
      </section>
      <style>{`
        .ahero-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100vh;
          padding-top: 80px;
          position: relative;
          background: #0a0a0a;
          overflow: hidden;
        }
        .ahero-text-block {
          position: relative;
          z-index: 2;
          text-align: center;
          width: 100%;
          padding: 0 80px;
          margin-bottom: 0;
        }
        .ahero-canvas {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60%;
          pointer-events: none;
          z-index: 0;
        }
        .ahero-headline {
          font-family: var(--font-serif);
          font-size: 88px;
          font-weight: 300;
          color: #ffffff;
          letter-spacing: -2px;
          line-height: 0.95;
          text-align: center;
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .ahero-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 20px auto;
          width: fit-content;
        }
        .ahero-line {
          width: 40px;
          height: 1px;
          background: #c9a84c;
          opacity: 0.6;
        }
        .ahero-tag {
          font-size: 10px;
          letter-spacing: 4px;
          color: #c9a84c;
          text-transform: uppercase;
          font-weight: 600;
        }
        .ahero-subtitle {
          text-align: center;
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
          margin-top: 24px;
        }
        .ahero-subtitle-primary {
          font-size: 18px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          line-height: 1.6;
          max-width: 560px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          padding: 0 24px;
        }
        .ahero-subtitle-primary::before,
        .ahero-subtitle-primary::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 32px;
          height: 1px;
          background: #c9a84c;
          opacity: 0.5;
          transform: translateY(-50%);
        }
        .ahero-subtitle-primary::before { left: -16px; }
        .ahero-subtitle-primary::after  { right: -16px; }
        .ahero-subtitle-secondary {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.35);
          line-height: 1.8;
          max-width: 440px;
          margin: 14px auto 0;
          text-align: center;
          letter-spacing: 0.3px;
        }
        .ahero-subtitle-cols {
          display: flex;
          align-items: center;
          gap: 32px;
          max-width: 860px;
          margin: 24px auto 0;
          text-align: left;
          position: relative;
          z-index: 2;
        }
        .ahero-col-left {
          flex: 1.4;
        }
        .ahero-primary {
          font-size: 18px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
          margin: 0;
        }
        .ahero-col-divider {
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, transparent, #c9a84c, transparent);
          flex-shrink: 0;
          align-self: center;
        }
        .ahero-col-right {
          flex: 1;
        }
        .ahero-secondary {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.35);
          line-height: 1.9;
          margin: 0;
          letter-spacing: 0.2px;
        }
        .ahero-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to bottom, transparent, #0a0a0a);
          z-index: 1;
          pointer-events: none;
        }
        .as2-section {
          background: #f5f3ee;
          padding: 100px 120px;
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
        }
        .as2-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 64px;
          position: relative;
        }
        .as2-chapter-line {
          width: 48px;
          height: 1px;
          background: #c9a84c;
          margin-bottom: 20px;
        }
        .as2-label {
          font-size: 11px;
          letter-spacing: 4px;
          color: #c9a84c;
          text-transform: uppercase;
          font-family: "Inter", sans-serif;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        .as2-watermark {
          font-size: 160px;
          font-weight: 900;
          color: #c9a84c;
          opacity: 0.04;
          position: absolute;
          top: -60px;
          left: -20px;
          font-family: "Inter", sans-serif;
          pointer-events: none;
          line-height: 1;
          z-index: 0;
        }
        .as2-list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid rgba(201,168,76,0.15);
        }
        .as2-item {
          border-bottom: 1px solid rgba(201,168,76,0.15);
          overflow: hidden;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        .as2-item-header {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 28px 0;
          position: relative;
        }
        .as2-number {
          font-size: 12px;
          font-weight: 700;
          color: #c9a84c;
          letter-spacing: 2px;
          opacity: 0.5;
          transition: opacity 0.3s ease;
          min-width: 28px;
          font-family: "Inter", sans-serif;
        }
        .as2-title {
          font-size: 28px;
          font-weight: 800;
          color: #1a1a1a;
          transition: color 0.3s ease;
          flex: 1;
          font-family: "Inter", sans-serif;
        }
        .as2-tag {
          font-size: 10px;
          letter-spacing: 2px;
          color: #c9a84c;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 0.3s ease;
          max-width: 200px;
          text-align: right;
          font-family: "Inter", sans-serif;
          font-weight: 600;
        }
        .as2-line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1px;
          width: 0;
          background: #c9a84c;
          transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .as2-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      padding 0.3s ease;
        }
        .as2-content p {
          font-size: 15px;
          color: #555;
          line-height: 1.8;
          max-width: 640px;
          padding-bottom: 32px;
          margin: 0;
          font-family: "Inter", sans-serif;
        }
        .as2-section {
          background: #f5f3ee;
          border-radius: 32px;
          margin: 0 40px 40px 40px;
          padding: 80px 100px;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 2px 0px rgba(201,168,76,0.15),
            0 32px 80px rgba(0,0,0,0.06);
          max-width: 1100px; /* Keep max-width but override margin */
          margin-left: auto;
          margin-right: auto;
        }
        .as2-section::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 24px;
          width: 32px;
          height: 32px;
          border-top: 1.5px solid #c9a84c;
          border-left: 1.5px solid #c9a84c;
          opacity: 0.5;
          border-radius: 4px 0 0 0;
        }
        .as2-section::after {
          content: '';
          position: absolute;
          bottom: 24px;
          right: 24px;
          width: 32px;
          height: 32px;
          border-bottom: 1.5px solid #c9a84c;
          border-right: 1.5px solid #c9a84c;
          opacity: 0.5;
          border-radius: 0 0 4px 0;
        }
        .as2-section-top-line {
          position: absolute;
          top: 0;
          left: 10%;
          width: 80%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            #c9a84c 30%,
            #c9a84c 70%,
            transparent 100%
          );
          opacity: 0.3;
        }

        @media (max-width: 640px) {
          .ahero-headline {
            font-size: clamp(2.8rem, 14vw, 88px);
            letter-spacing: -1px;
          }
          .ahero-text-block {
            padding: 0 24px;
          }
          .ahero-subtitle-cols {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          .ahero-col-divider {
            display: none;
          }
          .ahero-primary {
            font-size: 16px;
            text-align: center;
          }
          .ahero-secondary {
            text-align: center;
          }
          .as2-section {
            padding: 48px 24px;
            margin: 0 12px 24px;
            border-radius: 20px;
          }
          .as2-header {
            margin-bottom: 40px;
          }
          .as2-title {
            font-size: 20px;
          }
          .as2-item-header {
            flex-wrap: wrap;
            gap: 12px;
            padding: 20px 0;
          }
          .as2-tag {
            display: none;
          }
          .as2-content p {
            font-size: 14px;
            padding-bottom: 20px;
          }
          .as2-watermark {
            display: none;
          }
        }
      `}</style>

      <CTABanner
        headline="Automatize o que trava sua operação"
        description="Integrações, fluxos automáticos e APIs sob medida — elimine o retrabalho e ganhe escala sem aumentar equipe."
        buttonText="Quero automatizar"
      />
    </div>
  );
};

export default AutomationsPage;
