import React, { useState } from 'react';
import {
  ArrowRight, X,
  BarChart3, Users, TrendingUp, ShoppingBag, LayoutDashboard, BookOpen, Building2,
  Heart, Wallet, Truck, GraduationCap, Briefcase, Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FinancialERP from '../components/FinancialERP';
import CRMSystem from '../components/CRMSystem';
import BIDashboard from '../components/BIDashboard';
import EcommerceAdmin from '../components/EcommerceAdmin';
import ClientPortal from '../components/ClientPortal';
import LMSPlatform from '../components/LMSPlatform';
import IntranetCorporativa from '../components/IntranetCorporativa';
import SaudeApp from '../components/SaudeApp';
import FinancasApp from '../components/FinancasApp';
import DeliveryApp from '../components/DeliveryApp';
import EducacaoApp from '../components/EducacaoApp';
import GestaoApp from '../components/GestaoApp';
import AgendamentoApp from '../components/AgendamentoApp';

// ─── Types ───────────────────────────────────────────────────────────────────

type ProjectItem = {
  id: string;
  title: string;
  desc: string;
  tag: string;
  icon: React.ElementType;
  accent: string;
  tech?: string[];
  bgGradient?: string;
};

type ModalConfig = {
  component: React.ReactNode;
  bgStyle?: string;
  wrapperClass?: string;
  skipScale?: boolean; // mobile apps self-scale internally — skip outer transform
};

// ─── Data ────────────────────────────────────────────────────────────────────

const WEB_ITEMS: ProjectItem[] = [
  {
    id: 'erp', title: 'ERP Inteligente', tag: 'Gestão', icon: BarChart3, accent: '#4FA3E0',
    desc: 'Gestão financeira e operacional centralizada com fluxos de aprovação e relatórios em tempo real.',
    tech: ['React', 'TypeScript', 'PostgreSQL'],
  },
  {
    id: 'crm', title: 'CRM', tag: 'Vendas', icon: Users, accent: '#7C6AF7',
    desc: 'Pipeline de vendas, histórico de relacionamento e automação de follow-ups por etapa.',
    tech: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 'bi', title: 'Dashboard de BI', tag: 'Análise', icon: TrendingUp, accent: '#00C896',
    desc: 'Indicadores em tempo real, analytics multidimensional e relatórios exportáveis por setor.',
    tech: ['React', 'D3.js', 'Python'],
  },
  {
    id: 'ecommerce', title: 'E-commerce Admin', tag: 'Comércio', icon: ShoppingBag, accent: '#F97316',
    desc: 'Gestão de loja, pedidos, estoque e painel de performance de vendas com integrações de pagamento.',
    tech: ['React', 'Stripe', 'AWS'],
  },
  {
    id: 'portal', title: 'Portal do Cliente', tag: 'Portal', icon: LayoutDashboard, accent: '#EC4899',
    desc: 'Área logada com projetos ativos, faturas, contratos e canal de comunicação direta.',
    tech: ['React', 'Auth0', 'GraphQL'],
  },
  {
    id: 'lms', title: 'LMS', tag: 'Educação', icon: BookOpen, accent: '#FBBF24',
    desc: 'Plataforma de cursos, trilhas de aprendizagem e acompanhamento de progresso individual.',
    tech: ['React', 'Video.js', 'Node.js'],
  },
  {
    id: 'intranet', title: 'Intranet Corporativa', tag: 'Corporativo', icon: Building2, accent: '#60A5FA',
    desc: 'Comunicação interna, gestão de documentos e base de conhecimento centralizada por área.',
    tech: ['React', 'SharePoint', 'Teams'],
  },
];

const MOBILE_ITEMS: ProjectItem[] = [
  {
    id: 'saude', title: 'Saúde & Bem-estar', tag: 'Health', icon: Heart, accent: '#EF4444',
    desc: 'Treinos, consultas e hábitos com monitoramento contínuo e alertas inteligentes.',
    bgGradient: 'linear-gradient(135deg, #1f0505 0%, #2d1010 60%, #1a1a2e 100%)',
  },
  {
    id: 'financas', title: 'Finanças Pessoais', tag: 'Fintech', icon: Wallet, accent: '#10B981',
    desc: 'Gastos, investimentos e metas financeiras com análise automática de padrões.',
    bgGradient: 'linear-gradient(135deg, #031a0a 0%, #062d18 60%, #020d06 100%)',
  },
  {
    id: 'delivery', title: 'Delivery & Logística', tag: 'Logística', icon: Truck, accent: '#EA1D2C',
    desc: 'Rastreamento de pedidos em tempo real, histórico e avaliações de entregadores.',
    bgGradient: 'linear-gradient(135deg, #1f0303 0%, #2d0808 60%, #0a0303 100%)',
  },
  {
    id: 'educacao', title: 'Educação', tag: 'EdTech', icon: GraduationCap, accent: '#8B5CF6',
    desc: 'Cursos, videoaulas, exercícios e certificados em plataforma mobile-first.',
    bgGradient: 'linear-gradient(135deg, #0d0c1f 0%, #1e1850 60%, #070615 100%)',
  },
  {
    id: 'gestao', title: 'Gestão Corporativa', tag: 'Corporativo', icon: Briefcase, accent: '#3B82F6',
    desc: 'Equipes, tarefas em campo, aprovações e geolocalização de colaboradores.',
    bgGradient: 'linear-gradient(135deg, #050a14 0%, #0d1830 60%, #020508 100%)',
  },
  {
    id: 'agendamento', title: 'Agendamento', tag: 'Serviços', icon: Calendar, accent: '#DB2777',
    desc: 'Reservas, serviços, calendário compartilhado e confirmações automáticas.',
    bgGradient: 'linear-gradient(135deg, #1a0c14 0%, #2d1220 60%, #0c090e 100%)',
  },
];

const MODAL_CONFIGS: Record<string, ModalConfig> = {
  erp:        { component: <FinancialERP />,        wrapperClass: 'bg-white' },
  crm:        { component: <CRMSystem /> },
  bi:         { component: <BIDashboard /> },
  ecommerce:  { component: <EcommerceAdmin /> },
  portal:     { component: <ClientPortal /> },
  lms:        { component: <LMSPlatform /> },
  intranet:   { component: <IntranetCorporativa /> },
  saude:      { component: <SaudeApp />,             skipScale: true },
  financas:   { component: <FinancasApp />,          skipScale: true },
  delivery:   { component: <DeliveryApp />,          bgStyle: 'radial-gradient(ellipse at center, #1a0303 0%, #050202 100%)', skipScale: true },
  educacao:   { component: <EducacaoApp />,          bgStyle: 'radial-gradient(ellipse at center, #0d0c1f 0%, #050508 100%)', skipScale: true },
  gestao:     { component: <GestaoApp />,            bgStyle: 'radial-gradient(ellipse at center, #050a14 0%, #020508 100%)', skipScale: true },
  agendamento:{ component: <AgendamentoApp />,       bgStyle: 'radial-gradient(ellipse at 30% 20%, #1a0c14 0%, #0c090e 60%, #080509 100%)', skipScale: true },
};

// ─── Web Card ─────────────────────────────────────────────────────────────────

function WebCard({ item, index, onClick }: { item: ProjectItem; index: number; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative rounded-2xl border border-white/[0.06] hover:border-[#C9A84C]/[0.22] cursor-pointer flex flex-col h-full overflow-hidden transition-colors duration-300"
      style={{ background: 'rgba(255,255,255,0.018)' }}
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.accent}0d 0%, transparent 65%)` }}
      />

      <div className="relative p-6 flex flex-col h-full">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${item.accent}1a` }}
            >
              <Icon size={16} style={{ color: item.accent }} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: item.accent }}
            >
              {item.tag}
            </span>
          </div>
          <span
            className="text-[30px] font-bold leading-none select-none tabular-nums"
            style={{ color: 'rgba(255,255,255,0.04)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-white text-lg font-serif font-light mb-2.5 transition-colors duration-300 group-hover:text-[#C9A84C]"
        >
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm font-light leading-relaxed flex-grow" style={{ color: 'rgba(255,255,255,0.44)' }}>
          {item.desc}
        </p>

        {/* Tech stack */}
        {item.tech && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {item.tech.map(t => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.32)' }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-5 pt-5 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-[#C9A84C] text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ver Preview
          </span>
          <ArrowRight
            size={14}
            className="text-[#C9A84C] group-hover:translate-x-1 transition-transform duration-300"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────

function MobileCard({ item, index, onClick }: { item: ProjectItem; index: number; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative rounded-2xl border border-white/[0.06] hover:border-[#C9A84C]/[0.22] cursor-pointer flex flex-col overflow-hidden transition-colors duration-300"
      style={{ background: 'rgba(255,255,255,0.018)' }}
    >
      {/* App thumbnail */}
      <div className="relative h-36 overflow-hidden" style={{ background: item.bgGradient }}>
        {/* Simulated UI lines */}
        <div className="absolute top-4 left-4 right-10 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.14)' }} />
        <div className="absolute top-8 left-4 w-20 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="absolute top-11 left-4 w-28 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div
          className="absolute bottom-4 left-4 right-4 h-7 rounded-xl"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}
        />

        {/* Center icon */}
        <div
          className="absolute top-1/2 right-6 -translate-y-1/2 w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: `${item.accent}28` }}
        >
          <Icon size={18} style={{ color: item.accent }} />
        </div>

        {/* Index */}
        <span
          className="absolute top-3 left-4 text-[30px] font-bold leading-none select-none tabular-nums"
          style={{ color: 'rgba(255,255,255,0.07)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Hover inner glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${item.accent}12 0%, transparent 70%)` }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: item.accent }}
          >
            {item.tag}
          </span>
        </div>

        <h3 className="text-white text-base font-serif font-light mb-2 transition-colors duration-300 group-hover:text-[#C9A84C]">
          {item.title}
        </h3>

        <p className="text-sm font-light leading-relaxed flex-grow" style={{ color: 'rgba(255,255,255,0.44)' }}>
          {item.desc}
        </p>

        <div
          className="mt-4 pt-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-[#C9A84C] text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ver Preview
          </span>
          <ArrowRight
            size={14}
            className="text-[#C9A84C] group-hover:translate-x-1 transition-transform duration-300"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Hero Dot Pattern ─────────────────────────────────────────────────────────

function buildHeroDots(): { x: number; y: number; r: number; op: number; pulse?: boolean }[] {
  const dots: { x: number; y: number; r: number; op: number; pulse?: boolean }[] = [];

  const ln = (x1: number, y1: number, x2: number, y2: number, r = 1.6, op = 0.5, step = 14) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const n = Math.max(1, Math.round(len / step));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      dots.push({ x: x1 + dx * t, y: y1 + dy * t, r, op });
    }
  };

  // ── Browser window ───────────────────────────────────────────────────────
  const bx = 15, by = 28, bw = 252, bh = 156, bar = 22;

  ln(bx,      by,      bx + bw, by,      1.8, 0.52);  // top
  ln(bx + bw, by,      bx + bw, by + bh, 1.8, 0.52);  // right
  ln(bx,      by + bh, bx + bw, by + bh, 1.8, 0.52);  // bottom
  ln(bx,      by,      bx,      by + bh, 1.8, 0.52);  // left
  ln(bx,      by + bar, bx + bw, by + bar, 1.3, 0.26); // title bar divider

  // Traffic lights
  dots.push({ x: bx + 14, y: by + 11, r: 3.8, op: 0.78, pulse: true });
  dots.push({ x: bx + 27, y: by + 11, r: 3.8, op: 0.55 });
  dots.push({ x: bx + 40, y: by + 11, r: 3.8, op: 0.34 });

  // URL bar
  ln(bx + 58, by + 9, bx + bw - 16, by + 9, 1, 0.11, 10);

  // Inner content — faint horizontal rows (UI skeleton)
  [[by + bar + 20, 0.10], [by + bar + 46, 0.09], [by + bar + 72, 0.08], [by + bar + 100, 0.07]].forEach(([y, op]) => {
    ln(bx + 16, y as number, bx + bw - 22, y as number, 1, op as number, 13);
    ln(bx + 16, (y as number) + 11, bx + bw / 2, (y as number) + 11, 1, (op as number) * 0.7, 13);
  });

  // ── Mobile phone (overlapping right edge of browser) ─────────────────────
  const px = 228, py = 16, pw = 80, ph = 168, cr = 10;

  ln(px + cr, py,      px + pw - cr, py,      1.9, 0.72); // top
  ln(px + pw, py + cr, px + pw,      py + ph - cr, 1.9, 0.72); // right
  ln(px + cr, py + ph, px + pw - cr, py + ph, 1.9, 0.72); // bottom
  ln(px,      py + cr, px,           py + ph - cr, 1.9, 0.72); // left

  // Rounded corners (diagonal approximation)
  dots.push({ x: px + cr - 6,      y: py + cr - 6,      r: 1.5, op: 0.60 });
  dots.push({ x: px + pw - cr + 6, y: py + cr - 6,      r: 1.5, op: 0.60 });
  dots.push({ x: px + cr - 6,      y: py + ph - cr + 6, r: 1.5, op: 0.60 });
  dots.push({ x: px + pw - cr + 6, y: py + ph - cr + 6, r: 1.5, op: 0.60 });

  // Notch
  ln(px + pw / 2 - 10, py + 9, px + pw / 2 + 10, py + 9, 1.4, 0.52, 8);

  // Home indicator
  ln(px + pw / 2 - 14, py + ph - 9, px + pw / 2 + 14, py + ph - 9, 1.4, 0.50, 9);

  // Phone inner rows
  [py + 30, py + 56, py + 82, py + 108, py + 132].forEach(y => {
    ln(px + 10, y, px + pw - 10, y, 0.9, 0.09, 11);
  });

  // ── Scattered ambient dots (top-right area) ──────────────────────────────
  const ambient = [
    [340, 20], [355, 48], [368, 30], [350, 80], [375, 100],
    [360, 140], [345, 168], [380, 60], [372, 120], [358, 190],
  ];
  ambient.forEach(([x, y]) => {
    dots.push({ x: x as number, y: y as number, r: 1.2, op: 0.18 });
  });

  return dots;
}

const HERO_DOTS = buildHeroDots();

function HeroPattern() {
  return (
    <motion.svg
      viewBox="0 0 400 220"
      width="400"
      height="220"
      className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block select-none"
      style={{ opacity: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.9 }}
      transition={{ delay: 0.5, duration: 1.0 }}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Left-fade mask so pattern blends into the text */}
        <linearGradient id="phFadeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="white" stopOpacity="0" />
          <stop offset="22%"  stopColor="white" stopOpacity="1" />
          <stop offset="88%"  stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.4" />
        </linearGradient>
        <mask id="phFadeMask">
          <rect width="400" height="220" fill="url(#phFadeGrad)" />
        </mask>
      </defs>

      {/* Wipe reveal: clip sweeps left → right on mount */}
      <motion.g
        mask="url(#phFadeMask)"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ delay: 0.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {HERO_DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#C9A84C" opacity={d.op} />
        ))}

        {/* Pulsing dot — traffic light 1 */}
        <motion.circle
          cx={HERO_DOTS[0].x} cy={HERO_DOTS[0].y} r={6}
          fill="#C9A84C"
          initial={{ opacity: 0.18, scale: 1 }}
          animate={{ opacity: 0, scale: 2.4 }}
          transition={{ delay: 2.0, duration: 1.6, repeat: Infinity, repeatDelay: 3 }}
          style={{ transformOrigin: `${HERO_DOTS[0].x}px ${HERO_DOTS[0].y}px` }}
        />
      </motion.g>
    </motion.svg>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ number, label, title, count }: {
  number: string; label: string; title: string; count: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-end gap-6 mb-14 pb-8"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <span
        className="text-[40px] sm:text-[56px] md:text-[88px] font-bold leading-none select-none flex-shrink-0"
        style={{ color: 'rgba(255,255,255,0.04)' }}
      >
        {number}
      </span>
      <div className="flex-1 pb-1">
        <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.28em] block mb-1.5">
          {label}
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-light text-white">{title}</h2>
      </div>
      <div className="pb-1 text-right flex-shrink-0">
        <span className="text-[38px] font-light font-serif leading-none" style={{ color: 'rgba(255,255,255,0.18)' }}>
          {String(count).padStart(2, '0')}
        </span>
        <span className="block text-[9px] uppercase tracking-[0.22em] mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
          sistemas
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PortfolioPage = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  const activeConfig = activeModal ? MODAL_CONFIGS[activeModal] : null;

  return (
    <div className="bg-[#080808] text-white min-h-screen">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.4) 50%, transparent 100%)' }}
        />
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 65%)' }}
        />

        {/* Dot pattern — browser + phone silhouette */}
        <HeroPattern />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.6em] mb-6 block">
              INOVA SYSTEMS SOLUTIONS — PORTFÓLIO
            </span>
            <h1
              className="font-serif font-light tracking-tighter leading-[0.93] mb-10"
              style={{ fontSize: 'clamp(44px, 8vw, 96px)' }}
            >
              Cada projeto aqui<br />
              começou pelo{' '}
              <span className="italic" style={{ color: 'rgba(255,255,255,0.32)' }}>processo.</span>
            </h1>
            <p className="font-light leading-relaxed max-w-lg" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.48)' }}>
              Web, Mobile, Automação e IA — desenvolvidos sob medida para a realidade de cada negócio.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── Sections ───────────────────────────────────────────────────────── */}
      <section className="pb-32 px-6" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto">

          {/* Web Section */}
          <div className="pt-24">
            <SectionHeader
              number="01"
              label="Interfaces Web"
              title="Sistemas para negócios"
              count={WEB_ITEMS.length}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {WEB_ITEMS.map((item, i) => (
                <WebCard key={item.id} item={item} index={i} onClick={() => openModal(item.id)} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-24" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />

          {/* Mobile Section */}
          <div>
            <SectionHeader
              number="02"
              label="Interfaces Mobile"
              title="Apps por segmento"
              count={MOBILE_ITEMS.length}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {MOBILE_ITEMS.map((item, i) => (
                <MobileCard key={item.id} item={item} index={i} onClick={() => openModal(item.id)} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Unified Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeConfig && (
          <motion.div
            key={activeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4 md:p-8"
            style={{ background: activeConfig.bgStyle || 'rgba(0,0,0,0.95)' }}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#C9A84C]/20 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all duration-200"
            >
              <X size={20} />
            </button>

            {/* Content frame */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`w-full max-w-[1400px] h-[85vh] md:h-[90vh] rounded-2xl shadow-2xl relative ${activeConfig.skipScale ? 'overflow-hidden' : 'overflow-auto'} ${activeConfig.wrapperClass || ''}`}
            >
              {/* Web apps: min-width so they render at readable size and scroll horizontally.
                  Mobile apps (skipScale): self-scale internally — no min-width needed. */}
              <div className={activeConfig.skipScale ? 'h-full' : 'min-w-[900px] h-full'}>
                {activeConfig.component}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PortfolioPage;
