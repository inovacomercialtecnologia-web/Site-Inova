import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────
interface CaseData {
  num: string;
  tag: string;
  segment: string;
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
  accent: string;
  heroBg: string;
  problem: string;
  built: string[];
  results: { value: string; label: string }[];
  stack: string[];
  HeroSvg: React.FC<{ accent: string }>;
}

// ─── Hero SVGs — one per case type ───────────────────────────────────────
const RouteSvg: React.FC<{ accent: string }> = ({ accent }) => (
  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 220">
    <circle cx="60"  cy="110" r="10" fill={accent} opacity="0.25" />
    <circle cx="180" cy="70"  r="10" fill={accent} opacity="0.25" />
    <circle cx="280" cy="140" r="10" fill={accent} opacity="0.25" />
    <circle cx="370" cy="90"  r="10" fill={accent} opacity="0.25" />
    <circle cx="60"  cy="110" r="22" fill="none" stroke={accent} strokeWidth="1" opacity="0.12" />
    <circle cx="180" cy="70"  r="22" fill="none" stroke={accent} strokeWidth="1" opacity="0.12" />
    <circle cx="280" cy="140" r="22" fill="none" stroke={accent} strokeWidth="1" opacity="0.12" />
    <circle cx="370" cy="90"  r="22" fill="none" stroke={accent} strokeWidth="1" opacity="0.12" />
    <path d="M70 110 L170 70" stroke={accent} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.30" />
    <path d="M190 70 L268 138" stroke={accent} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.30" />
    <path d="M292 138 L358 92" stroke={accent} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.30" />
    <path d="M0 160 Q100 120 200 160 Q300 200 400 150" stroke={accent} strokeWidth="0.8" fill="none" opacity="0.08" />
    <path d="M0 180 Q120 140 240 175 Q320 195 400 170" stroke={accent} strokeWidth="0.8" fill="none" opacity="0.06" />
  </svg>
);

const MobileSvg: React.FC<{ accent: string }> = ({ accent }) => (
  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 220">
    <rect x="150" y="20" width="100" height="180" rx="16" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.20" />
    <rect x="158" y="36" width="84"  height="148" rx="8"  fill={accent} opacity="0.06" />
    <circle cx="200" cy="190" r="7" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.25" />
    <path d="M 168 27 L 232 27" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.18" />
    <path d="M130 80 Q150 50 170 80" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.22" strokeLinecap="round" />
    <path d="M112 65 Q150 25 188 65" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.14" strokeLinecap="round" />
    <path d="M230 80 Q250 50 270 80" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.22" strokeLinecap="round" />
    <path d="M212 65 Q250 25 288 65" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.14" strokeLinecap="round" />
  </svg>
);

const FlowSvg: React.FC<{ accent: string }> = ({ accent }) => (
  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 220">
    <rect x="30"  y="90" width="70" height="40" rx="8" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.22" />
    <rect x="165" y="90" width="70" height="40" rx="8" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.22" />
    <rect x="300" y="90" width="70" height="40" rx="8" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.22" />
    <rect x="165" y="20" width="70" height="40" rx="8" fill="none" stroke={accent} strokeWidth="1.0" opacity="0.14" />
    <rect x="165" y="160" width="70" height="40" rx="8" fill="none" stroke={accent} strokeWidth="1.0" opacity="0.14" />
    <line x1="100" y1="110" x2="165" y2="110" stroke={accent} strokeWidth="1.5" opacity="0.35" markerEnd="url(#arr)" />
    <line x1="235" y1="110" x2="300" y2="110" stroke={accent} strokeWidth="1.5" opacity="0.35" />
    <line x1="200" y1="60"  x2="200" y2="90"  stroke={accent} strokeWidth="1.0" opacity="0.20" />
    <line x1="200" y1="130" x2="200" y2="160" stroke={accent} strokeWidth="1.0" opacity="0.20" />
    <circle cx="118" cy="110" r="4" fill={accent} opacity="0.35" />
    <circle cx="286" cy="110" r="4" fill={accent} opacity="0.35" />
  </svg>
);

const NeuralSvg: React.FC<{ accent: string }> = ({ accent }) => {
  const L = [[60,70],[60,110],[60,150]];
  const M = [[180,50],[180,85],[180,120],[180,155],[180,190]];
  const R = [[300,80],[300,130],[300,175]];
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 220">
      {L.map(([lx,ly],i) => M.map(([mx,my],j) => (
        <line key={`lm${i}${j}`} x1={lx} y1={ly} x2={mx} y2={my} stroke={accent} strokeWidth="0.8" opacity="0.10" />
      )))}
      {M.map(([mx,my],i) => R.map(([rx,ry],j) => (
        <line key={`mr${i}${j}`} x1={mx} y1={my} x2={rx} y2={ry} stroke={accent} strokeWidth="0.8" opacity="0.10" />
      )))}
      {L.map(([x,y],i) => <circle key={`l${i}`} cx={x} cy={y} r="7" fill={accent} opacity="0.28" />)}
      {M.map(([x,y],i) => <circle key={`m${i}`} cx={x} cy={y} r="7" fill={accent} opacity="0.22" />)}
      {R.map(([x,y],i) => <circle key={`r${i}`} cx={x} cy={y} r="7" fill={accent} opacity="0.28" />)}
    </svg>
  );
};

const SystemSvg: React.FC<{ accent: string }> = ({ accent }) => (
  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 220">
    <circle cx="200" cy="110" r="90"  fill="none" stroke={accent} strokeWidth="0.8" opacity="0.08" />
    <circle cx="200" cy="110" r="62"  fill="none" stroke={accent} strokeWidth="0.8" opacity="0.12" />
    <circle cx="200" cy="110" r="36"  fill="none" stroke={accent} strokeWidth="1"   opacity="0.18" />
    <circle cx="200" cy="110" r="14"  fill={accent} opacity="0.20" />
    {[0,60,120,180,240,300].map((deg,i) => {
      const r = 90, rad = (deg * Math.PI) / 180;
      const x2 = 200 + r * Math.cos(rad), y2 = 110 + r * Math.sin(rad);
      return <line key={i} x1="200" y1="110" x2={x2} y2={y2} stroke={accent} strokeWidth="0.8" opacity="0.10" />;
    })}
    {[0,60,120,180,240,300].map((deg,i) => {
      const r = 90, rad = (deg * Math.PI) / 180;
      const x = 200 + r * Math.cos(rad), y = 110 + r * Math.sin(rad);
      return <circle key={i} cx={x} cy={y} r="8" fill={accent} opacity="0.22" />;
    })}
  </svg>
);

// ─── Case data ────────────────────────────────────────────────────────────
const CASES: CaseData[] = [
  {
    num: "01", tag: "APLICAÇÃO WEB", segment: "LOGÍSTICA & DISTRIBUIÇÃO",
    title: "Sistema de Gestão de Rotas e Entregas",
    metric: "68%", metricLabel: "Redução de retrabalho operacional",
    description: "Operação com mais de 40 motoristas gerenciada via WhatsApp e planilha. Mapeamos, estruturamos e centralizamos tudo em tempo real.",
    accent: "#1A6FE8", heroBg: "radial-gradient(ellipse at 30% 50%, rgba(26,111,232,0.22) 0%, #070710 70%)",
    problem: "Uma distribuidora com mais de 40 motoristas gerenciava toda a operação de rotas e entregas via grupos de WhatsApp e planilhas compartilhadas. Sem visibilidade em tempo real, sem histórico de ocorrências e sem rastreamento de carga — o gestor só sabia da situação quando o problema já tinha acontecido.",
    built: ["Painel web de gestão de rotas com mapa em tempo real","App mobile para motoristas com ordens de entrega digitais","Histórico completo de ocorrências com foto e geolocalização","Dashboard de KPIs operacionais por motorista e por rota","Integração com o sistema de estoque já existente"],
    results: [{ value: "68%", label: "Menos retrabalho" },{ value: "100%", label: "Visibilidade em tempo real" },{ value: "2 sem.", label: "Implantação" }],
    stack: ["React","Node.js","PostgreSQL","AWS","WebSocket"], HeroSvg: RouteSvg
  },
  {
    num: "02", tag: "APP MOBILE", segment: "SERVIÇOS & MANUTENÇÃO",
    title: "App de Ordens de Serviço em Campo",
    metric: "3×", metricLabel: "Mais ordens concluídas por técnico/dia",
    description: "Técnicos de campo sem acesso às ordens, dependendo de ligações e papéis impressos. Atrasos, perda de histórico e retrabalho diário.",
    accent: "#10B981", heroBg: "radial-gradient(ellipse at 70% 40%, rgba(16,185,129,0.20) 0%, #050F0A 70%)",
    problem: "Empresa de manutenção com 25 técnicos em campo. As ordens de serviço chegavam por ligação ou papel impresso. Sem registro de histórico por equipamento, sem foto de evidência e sem assinatura digital do cliente — toda a operação dependia da memória da equipe.",
    built: ["App mobile com lista de ordens por técnico e por região","Checklist digital de execução com campos personalizados","Registro fotográfico e assinatura digital do cliente na tela","Histórico completo por equipamento e por cliente","Painel web de gestão e despacho de ordens para o gestor"],
    results: [{ value: "3×", label: "Mais ordens/dia" },{ value: "0", label: "Papéis no processo" },{ value: "98%", label: "Satisfação da equipe" }],
    stack: ["React Native","Node.js","Firebase","PostgreSQL"], HeroSvg: MobileSvg
  },
  {
    num: "03", tag: "AUTOMAÇÃO", segment: "CONTABILIDADE & FINANCEIRO",
    title: "Automação de Conciliação Financeira",
    metric: "140h", metricLabel: "Economizadas por mês pela equipe",
    description: "Importação manual de dados entre três sistemas diferentes consumindo horas da equipe todo mês e gerando erros de digitação.",
    accent: "#F97316", heroBg: "radial-gradient(ellipse at 50% 25%, rgba(249,115,22,0.20) 0%, #0F0800 70%)",
    problem: "Um escritório contábil com 18 clientes realizava a importação de dados manualmente entre três sistemas: ERP, planilhas de controle e sistema contábil. O processo consumia mais de 140 horas mensais da equipe e ainda gerava erros frequentes por digitação incorreta.",
    built: ["Robô de coleta automática de dados nos três sistemas","Regras de conciliação configuráveis por cliente","Log de erros com notificação automática para o responsável","Dashboard de status de importação em tempo real","Zero alteração nos sistemas já existentes"],
    results: [{ value: "140h", label: "Economizadas/mês" },{ value: "0", label: "Erros de importação" },{ value: "3", label: "Sistemas integrados" }],
    stack: ["Python","N8N","PostgreSQL","API REST"], HeroSvg: FlowSvg
  },
  {
    num: "04", tag: "IA APLICADA", segment: "COMERCIAL & ATENDIMENTO",
    title: "IA de Triagem e Qualificação de Leads",
    metric: "4×", metricLabel: "Mais rápido no primeiro atendimento",
    description: "Time comercial sobrecarregado respondendo manualmente cada lead sem critério de prioridade. Leads quentes perdendo interesse por demora.",
    accent: "#8B5CF6", heroBg: "radial-gradient(ellipse at 20% 60%, rgba(139,92,246,0.22) 0%, #08050F 70%)",
    problem: "Empresa com alto volume de leads diários no WhatsApp e site. O time comercial respondia manualmente todos os contatos, sem critério de priorização. Leads com alta intenção de compra aguardavam horas por uma resposta — e muitos desistiram no meio do processo.",
    built: ["IA de triagem automática com classificação por intenção","Resposta inicial personalizada em menos de 3 segundos","Qualificação via fluxo conversacional inteligente","Encaminhamento automático para o vendedor correto","Painel de métricas de atendimento e conversão"],
    results: [{ value: "4×", label: "Mais rápido" },{ value: "82%", label: "Qualificação automática" },{ value: "24/7", label: "Em operação" }],
    stack: ["Python","OpenAI API","Node.js","PostgreSQL","WhatsApp API"], HeroSvg: NeuralSvg
  },
  {
    num: "05", tag: "PROJETO COMPLETO", segment: "INDÚSTRIA & MANUFATURA",
    title: "Plataforma Operacional Integrada",
    metric: "5 meses", metricLabel: "Para retorno sobre o investimento",
    description: "Operação industrial com processos desconectados: chão de fábrica no papel, gestão no Excel e comercial em sistema separado.",
    accent: "#D4AF37", heroBg: "radial-gradient(ellipse at 75% 30%, rgba(212,175,55,0.20) 0%, #0A0800 70%)",
    problem: "Uma indústria de médio porte com três áreas completamente desconectadas: o chão de fábrica operava no papel, a gestão usava Excel e o setor comercial tinha um sistema próprio que não conversava com nenhum dos dois. Nenhum dado era compartilhado em tempo real e a diretoria tomava decisões com informações de dias atrás.",
    built: ["Sistema web para gestão de produção e estoque","App mobile para operadores do chão de fábrica","Automação de sincronização entre os três setores","Dashboard executivo com indicadores em tempo real","Integração com o sistema comercial já existente"],
    results: [{ value: "5 meses", label: "Para ROI" },{ value: "4", label: "Sistemas integrados" },{ value: "100%", label: "Operação digitalizada" }],
    stack: ["React","React Native","Python","Node.js","PostgreSQL","AWS"], HeroSvg: SystemSvg
  },
];

// ─── Case Modal ───────────────────────────────────────────────────────────
function CaseModal({ c, onClose }: { c: CaseData; onClose: () => void }) {
  const E = [0.22, 1, 0.36, 1] as const;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-2 sm:p-4 md:p-6"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.5, ease: E }}
        className="w-full md:max-w-3xl max-h-[92dvh] md:max-h-[88vh] overflow-y-auto
                   rounded-t-3xl md:rounded-3xl bg-[#080808]
                   border border-white/[0.07]
                   shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
        onClick={e => e.stopPropagation()}
        style={{ scrollbarWidth: 'none' }}
      >
        {/* ── Hero area ── */}
        <div className="relative h-[200px] md:h-[240px] overflow-hidden rounded-t-3xl md:rounded-t-3xl flex-shrink-0"
          style={{ background: c.heroBg }}>
          <c.HeroSvg accent={c.accent} />

          {/* Case number watermark */}
          <span className="absolute bottom-0 right-4 font-serif font-black leading-none text-white select-none"
            style={{ fontSize: 'clamp(4rem, 12vw, 7rem)', opacity: 0.06 }}>{c.num}</span>

          {/* Close button */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20
                       flex items-center justify-center transition-colors duration-200 z-10">
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Header content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8
                          bg-gradient-to-t from-[#080808] to-transparent">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-2"
              style={{ color: c.accent }}>
              {c.tag} · {c.segment}
            </p>
            <h2 className="text-xl md:text-2xl font-serif font-light text-white tracking-tight leading-tight">
              {c.title}
            </h2>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-4 sm:p-6 md:p-8">

          {/* Main metric */}
          <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/[0.06]">
            <span className="font-black leading-none"
              style={{ fontSize: 'clamp(3rem,8vw,4.5rem)', color: c.accent }}>
              {c.metric}
            </span>
            <p className="text-white/50 text-sm font-light mb-2 leading-tight">{c.metricLabel}</p>
          </div>

          {/* O Problema */}
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: c.accent }}>O Problema</p>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
              {c.problem}
            </p>
          </div>

          {/* O que foi construído */}
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4"
              style={{ color: c.accent }}>O que foi construído</p>
            <ul className="space-y-2.5">
              {c.built.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-light">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: c.accent }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Resultados */}
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4"
              style={{ color: c.accent }}>Resultados</p>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {c.results.map((r, i) => (
                <div key={i} className="rounded-xl p-4 border border-white/[0.06]"
                  style={{ background: `${c.accent}08` }}>
                  <p className="font-black text-base md:text-2xl leading-none mb-1.5"
                    style={{ color: c.accent }}>{r.value}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider font-medium">{r.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: c.accent }}>Stack tecnológica</p>
            <div className="flex flex-wrap gap-2">
              {c.stack.map((s, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full border text-xs font-medium text-white/60"
                  style={{ borderColor: `${c.accent}30`, background: `${c.accent}08` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link to="/contato-quiz" onClick={onClose}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl
                       font-semibold text-sm uppercase tracking-[0.18em] text-black
                       hover:brightness-110 transition-all duration-300
                       shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.accent}CC)` }}>
            Quero uma solução como essa
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────
const E = [0.22, 1, 0.36, 1] as const;

export default function CasesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center start'] });
  const numY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  return (
    <section ref={sectionRef} className="bg-[#000000] relative z-20 overflow-hidden">

      {/* ══════════════════════════════════════
          EDITORIAL HEADER
      ══════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        {/* Top rule */}
        <motion.div initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.2, ease: E }}
          style={{ transformOrigin: 'left' }}
          className="h-px bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />

        <div className="py-12 md:py-28 lg:py-32 flex gap-6 md:gap-16 items-start relative">

          {/* Section number column */}
          <div className="hidden lg:flex flex-col items-center gap-4 pt-3 flex-shrink-0 w-20">
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: E, delay: 0.1 }}
              className="font-serif font-black leading-none text-[#D4AF37]/20 select-none"
              style={{ fontSize: '5rem' }}>04</motion.span>
            <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
              viewport={{ once: true }} transition={{ duration: 1.0, ease: E, delay: 0.2 }}
              style={{ transformOrigin: 'top' }}
              className="w-px h-28 bg-gradient-to-b from-[#D4AF37]/30 to-transparent" />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <motion.p initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: E }}
              className="text-[#D4AF37] text-[11px] md:text-[10px] font-semibold uppercase
                         tracking-[0.38em] mb-10 flex items-center gap-4">
              <span className="inline-block w-8 h-px bg-[#D4AF37]/50 flex-shrink-0" />
              ONDE O PROCESSO VIRA SISTEMA E SISTEMA VIRA RESULTADO
            </motion.p>

            <div className="overflow-hidden mb-1">
              <motion.h2 initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.9, ease: E }}
                className="font-serif font-light text-white tracking-tight leading-[0.92] block"
                style={{ fontSize: 'clamp(1.8rem, 6vw, 6.2rem)' }}>
                Cada projeto começa
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-2">
              <motion.h2 initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.9, ease: E, delay: 0.1 }}
                className="font-serif font-light text-white tracking-tight leading-[0.92] block"
                style={{ fontSize: 'clamp(1.8rem, 6vw, 6.2rem)' }}>
                pelo processo.
              </motion.h2>
            </div>

            <motion.p initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: E, delay: 0.22 }}
              className="font-serif font-light tracking-tight leading-tight
                         bg-gradient-to-r from-[#D4AF37] to-[#FDE047] bg-clip-text text-transparent"
              style={{ fontSize: 'clamp(1.1rem, 3.2vw, 3rem)', marginTop: '0.5em' }}>
              Tecnologia construída sob medida.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: E, delay: 0.36 }}
              className="text-gray-400 font-light text-base md:text-lg leading-relaxed mt-8 max-w-xl">
              Não existe sistema igual. Cada solução nasce do processo real do negócio.
            </motion.p>
          </div>

          {/* Watermark parallax */}
          <motion.div style={{ y: numY }} aria-hidden
            className="absolute right-0 top-0 pointer-events-none select-none hidden xl:block">
            <span className="font-serif font-black text-white"
              style={{ fontSize: 'clamp(180px, 18vw, 260px)', opacity: 0.030, lineHeight: 1 }}>
              04
            </span>
          </motion.div>
        </div>

        {/* Bottom rule */}
        <motion.div initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.2, ease: E, delay: 0.3 }}
          style={{ transformOrigin: 'right' }}
          className="h-px bg-gradient-to-l from-[#D4AF37] via-[#D4AF37]/40 to-transparent" />
      </div>

      {/* ══════════════════════════════════════
          CASES GRID
      ══════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {CASES.map((c, i) => {
            const spanClass = i >= 3 && CASES.length === 5
              ? (i === 3 ? 'lg:col-start-1 lg:col-span-1 lg:translate-x-1/2'
                         : 'lg:col-start-2 lg:col-span-1 lg:translate-x-1/2')
              : '';
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.85, ease: E, delay: (i % 3) * 0.1 }}
                className={`group cursor-pointer ${spanClass}`}
                onClick={() => setSelected(i)}
              >
                <div className="h-full flex flex-col rounded-2xl overflow-hidden
                                border border-white/[0.06]
                                bg-[radial-gradient(ellipse_at_top_left,_#141414,_#050505)]
                                transition-all duration-500
                                hover:-translate-y-1.5
                                hover:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5)]"
                  style={{ borderLeftWidth: 3, borderLeftColor: `${c.accent}55` }}
                  onMouseEnter={e => (e.currentTarget.style.borderLeftColor = c.accent)}
                  onMouseLeave={e => (e.currentTarget.style.borderLeftColor = `${c.accent}55`)}
                >
                  {/* Top accent line */}
                  <div className="h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(to right, ${c.accent}80, transparent)` }} />

                  <div className="flex flex-col flex-grow p-5 md:p-8">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.accent }} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: `${c.accent}AA` }}>
                        {c.tag} · {c.segment}
                      </span>
                    </div>

                    <h3 className="text-white text-xl md:text-[1.35rem] font-serif font-normal
                                   tracking-tight leading-snug mb-5 transition-colors duration-500
                                   group-hover:text-white/90">
                      {c.title}
                    </h3>

                    <div className="mb-5 pb-5 border-b border-white/[0.06]">
                      <span className="font-black block mb-1 leading-none"
                        style={{ fontSize: 'clamp(2.2rem,4vw,3rem)', color: c.accent }}>
                        {c.metric}
                      </span>
                      <p className="text-[11px] font-bold uppercase tracking-[0.25em]"
                        style={{ color: `${c.accent}70` }}>
                        {c.metricLabel}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed flex-grow font-light mb-7">
                      {c.description}
                    </p>

                    <div className="flex items-center gap-2 mt-auto text-[10px] font-bold uppercase
                                    tracking-[0.22em] text-gray-400 group-hover:text-white/60
                                    transition-colors duration-500">
                      Ver case completo
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════
          MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {selected !== null && selected < CASES.length && (
          <CaseModal c={CASES[selected]} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
