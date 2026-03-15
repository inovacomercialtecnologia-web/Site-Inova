import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  DollarSign, Users, BarChart2, Settings, Activity,
  ArrowUpRight, ArrowDownRight, Minus, RefreshCw,
  Zap, Target, ShieldCheck, Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Pillar = 'overview' | 'financeiro' | 'comercial' | 'operacional' | 'pessoas';
type Trend = 'up' | 'down' | 'stable';
type Status = 'green' | 'yellow' | 'red';

interface KpiCard {
  label: string;
  value: string;
  sub: string;
  trend: Trend;
  delta: string;
  status: Status;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const revenueMonths = [
  { m: 'Abr', r: 520, t: 500 },
  { m: 'Mai', r: 580, t: 540 },
  { m: 'Jun', r: 610, t: 580 },
  { m: 'Jul', r: 590, t: 620 },
  { m: 'Ago', r: 670, t: 640 },
  { m: 'Set', r: 720, t: 680 },
  { m: 'Out', r: 695, t: 710 },
  { m: 'Nov', r: 760, t: 730 },
  { m: 'Dez', r: 810, t: 760 },
  { m: 'Jan', r: 740, t: 780 },
  { m: 'Fev', r: 830, t: 800 },
  { m: 'Mar', r: 890, t: 840 },
];

const churnMonths = [3.1, 2.8, 2.6, 2.9, 2.4, 2.2, 2.0, 1.9, 2.3, 2.1, 1.8, 2.1];

const pillarHealth: { pillar: string; score: number; status: Status; delta: string }[] = [
  { pillar: 'Financeiro',   score: 84, status: 'green',  delta: '+3pp' },
  { pillar: 'Comercial',    score: 71, status: 'yellow', delta: '+1pp' },
  { pillar: 'Operacional',  score: 91, status: 'green',  delta: '+5pp' },
  { pillar: 'Pessoas',      score: 67, status: 'yellow', delta: '-4pp' },
];

const alerts = [
  { type: 'warn',    msg: 'Churn aumentou 0.3pp em Mar vs Fev — investigar segmento SMB' },
  { type: 'info',    msg: 'MRR cresceu 7.2% MoM — melhor resultado do último ano' },
  { type: 'danger',  msg: 'Runway abaixo de 12 meses — considerar captação ou corte de custo' },
  { type: 'success', msg: 'NPS atingiu 71 — Net Promoter Score histórico da empresa' },
];

const finKpis: KpiCard[] = [
  { label: 'MRR',          value: 'R$ 683k',  sub: 'Receita Recorrente Mensal',     trend: 'up',     delta: '+7.2% MoM', status: 'green' },
  { label: 'ARR',          value: 'R$ 8.2M',  sub: 'Receita Recorrente Anual',      trend: 'up',     delta: '+34% YoY',  status: 'green' },
  { label: 'Margem Bruta', value: '72%',       sub: 'Após COGS de produto',          trend: 'stable', delta: '±0pp',      status: 'green' },
  { label: 'EBITDA',       value: '18%',       sub: 'Operacional ajustado',          trend: 'up',     delta: '+2pp QoQ',  status: 'green' },
  { label: 'Burn Rate',    value: 'R$ 420k',  sub: 'Queima mensal líquida',          trend: 'down',   delta: '+8% MoM',   status: 'yellow' },
  { label: 'Runway',       value: '11 meses',  sub: 'Cash em caixa ÷ burn rate',    trend: 'down',   delta: '-2 meses',  status: 'red' },
  { label: 'LTV',          value: 'R$ 48k',   sub: 'Lifetime Value médio',           trend: 'up',     delta: '+12%',      status: 'green' },
  { label: 'LTV/CAC',      value: '15x',       sub: 'Eficiência de aquisição',       trend: 'up',     delta: '+2x',       status: 'green' },
];

const comKpis: KpiCard[] = [
  { label: 'Pipeline Total',  value: 'R$ 2.4M',  sub: 'Oportunidades ativas',         trend: 'up',     delta: '+18%',      status: 'green' },
  { label: 'Win Rate',        value: '34%',        sub: 'Oportunidades fechadas/total', trend: 'up',     delta: '+4pp',      status: 'green' },
  { label: 'CAC',             value: 'R$ 3.2k',   sub: 'Custo de aquisição de cliente',trend: 'stable', delta: '±0%',       status: 'green' },
  { label: 'NRR',             value: '108%',       sub: 'Net Revenue Retention',        trend: 'up',     delta: '+3pp',      status: 'green' },
  { label: 'Churn Rate',      value: '2.1%',       sub: 'Churn mensal de receita',      trend: 'down',   delta: '+0.3pp',    status: 'yellow' },
  { label: 'Leads / Mês',     value: '180',        sub: 'Entradas no funil',            trend: 'up',     delta: '+22%',      status: 'green' },
  { label: 'Conv. Lead→CLI',  value: '8.2%',       sub: 'Lead até cliente pago',        trend: 'up',     delta: '+1.1pp',    status: 'green' },
  { label: 'Ciclo de Venda',  value: '38 dias',    sub: 'Média lead → fechamento',      trend: 'stable', delta: '-2 dias',   status: 'green' },
];

const opsKpis: KpiCard[] = [
  { label: 'NPS',             value: '71',         sub: 'Net Promoter Score',           trend: 'up',     delta: '+6pts',     status: 'green' },
  { label: 'CSAT',            value: '4.6 / 5',    sub: 'Customer Satisfaction',        trend: 'up',     delta: '+0.2',      status: 'green' },
  { label: 'SLA Cumprido',    value: '94%',         sub: 'Tickets dentro do prazo',      trend: 'up',     delta: '+2pp',      status: 'green' },
  { label: 'Tempo Resolução', value: '4.2h',        sub: 'Média por ticket',             trend: 'up',     delta: '-1.1h',     status: 'green' },
  { label: 'Tickets / Mês',   value: '420',         sub: 'Volume total de suporte',      trend: 'down',   delta: '-8%',       status: 'green' },
  { label: 'Uptime',          value: '99.97%',      sub: 'Disponibilidade da plataforma',trend: 'stable', delta: '0 incidentes', status: 'green' },
  { label: 'Defeitos / Sprint','value': '1.4',      sub: 'Bugs por ciclo de dev',        trend: 'up',     delta: '-30%',      status: 'green' },
  { label: 'Deploy Freq.',    value: '3× / semana', sub: 'Velocidade de entrega',        trend: 'stable', delta: 'estável',   status: 'green' },
];

const peopleKpis: KpiCard[] = [
  { label: 'Headcount',       value: '148',        sub: 'Colaboradores ativos',          trend: 'up',     delta: '+12 YTD',   status: 'green' },
  { label: 'Turnover Anual',  value: '12%',        sub: 'Voluntário + involuntário',      trend: 'down',   delta: '+3pp YoY',  status: 'yellow' },
  { label: 'eNPS',            value: '52',         sub: 'Employee Net Promoter Score',   trend: 'down',   delta: '-8pts',     status: 'yellow' },
  { label: 'Vagas Abertas',   value: '8',          sub: 'Posições em recrutamento',      trend: 'stable', delta: 'estável',   status: 'yellow' },
  { label: 'Time p/ Contratar','value': '28 dias', sub: 'Média abertura → admissão',     trend: 'stable', delta: '-2 dias',   status: 'green' },
  { label: 'Absenteísmo',     value: '2.3%',       sub: 'Taxa mensal de faltas',         trend: 'stable', delta: '±0%',       status: 'green' },
  { label: 'T&D Horas/Col.',  value: '6h',         sub: 'Treinamento por colaborador',   trend: 'up',     delta: '+2h QoQ',   status: 'green' },
  { label: 'Eng. Score',      value: '74%',        sub: 'Índice de engajamento interno', trend: 'down',   delta: '-5pp',      status: 'yellow' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColor: Record<Status, { ring: string; bg: string; text: string; dot: string }> = {
  green:  { ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  yellow: { ring: 'ring-amber-400/30',   bg: 'bg-amber-400/10',   text: 'text-amber-400',   dot: 'bg-amber-400' },
  red:    { ring: 'ring-rose-500/30',    bg: 'bg-rose-500/10',    text: 'text-rose-400',    dot: 'bg-rose-400' },
};

const trendIcon = (t: Trend, good: boolean) => {
  if (t === 'up')     return good ? <ArrowUpRight size={13} className="text-emerald-400" /> : <ArrowUpRight size={13} className="text-rose-400" />;
  if (t === 'down')   return good ? <ArrowDownRight size={13} className="text-emerald-400" /> : <ArrowDownRight size={13} className="text-rose-400" />;
  return <Minus size={13} className="text-slate-400" />;
};

// KPIs where "down" is good (churn, burn, tickets, etc.)
const downIsGood = new Set(['Churn Rate', 'Burn Rate', 'Tempo Resolução', 'Tickets / Mês', 'Turnover Anual', 'Absenteísmo', 'Defeitos / Sprint', 'Vagas Abertas']);

const healthBg = (s: Status) => s === 'green' ? 'from-emerald-500' : s === 'yellow' ? 'from-amber-400' : 'from-rose-500';

// ─── Sparkline (mini line chart with SVG) ─────────────────────────────────────

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Revenue Bar Chart ────────────────────────────────────────────────────────

function RevenueChart({ data }: { data: typeof revenueMonths }) {
  const max = Math.max(...data.map(d => Math.max(d.r, d.t)));
  return (
    <div>
      <div className="flex items-end gap-1.5 h-32">
        {data.map((d, i) => (
          <div key={d.m} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full flex items-end gap-0.5 h-28">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.04, duration: 0.45, ease: 'easeOut' }}
                style={{ height: `${(d.r / max) * 100}%`, transformOrigin: 'bottom' }}
                className={`flex-1 rounded-t ${d.r >= d.t ? 'bg-emerald-500' : 'bg-amber-400'}`}
              />
              <div
                style={{ height: `${(d.t / max) * 100}%` }}
                className="w-0.5 bg-white/10 rounded-t shrink-0"
              />
            </div>
            <span className="text-[9px] text-slate-500">{d.m}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2 rounded bg-emerald-500" /><span className="text-[10px] text-slate-400">Realizado (R$k)</span></div>
        <div className="flex items-center gap-1.5"><div className="w-0.5 h-3 bg-white/20 rounded" /><span className="text-[10px] text-slate-400">Meta</span></div>
      </div>
    </div>
  );
}

// ─── Gauge ────────────────────────────────────────────────────────────────────

function Gauge({ score, status }: { score: number; status: Status }) {
  const colors: Record<Status, string> = { green: '#10b981', yellow: '#f59e0b', red: '#f43f5e' };
  const c = colors[status];
  const r = 44, cx = 52, cy = 52;
  const circ = 2 * Math.PI * r;
  const half = circ / 2;
  const fill = (score / 100) * half;

  return (
    <svg width={104} height={64} viewBox="0 0 104 64">
      {/* Track */}
      <path d={`M 8,52 A ${r},${r} 0 0 1 96,52`} fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
      {/* Fill */}
      <motion.path
        d={`M 8,52 A ${r},${r} 0 0 1 96,52`}
        fill="none"
        stroke={c}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${half} ${half}`}
        initial={{ strokeDashoffset: half }}
        animate={{ strokeDashoffset: half - fill }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <text x={cx} y={48} textAnchor="middle" fontSize="18" fontWeight="700" fill={c}>{score}</text>
    </svg>
  );
}

// ─── KPI Grid ─────────────────────────────────────────────────────────────────

function KpiGrid({ kpis }: { kpis: KpiCard[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
      {kpis.map((k, i) => {
        const sc = statusColor[k.status];
        const good = !downIsGood.has(k.label);
        return (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-[#0f1929] border border-white/5 rounded-xl p-4 ring-1 ${sc.ring} flex flex-col justify-between gap-3`}
          >
            <div className="flex items-start justify-between">
              <span className="text-slate-400 text-[11px] font-medium leading-tight">{k.label}</span>
              <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${sc.dot}`} />
            </div>
            <div>
              <p className="text-white text-xl font-bold leading-none">{k.value}</p>
              <p className="text-slate-500 text-[10px] mt-1">{k.sub}</p>
            </div>
            <div className="flex items-center gap-1">
              {trendIcon(k.trend, good)}
              <span className={`text-[10px] font-medium ${
                k.trend === 'stable' ? 'text-slate-400' :
                (k.trend === 'up' && good) || (k.trend === 'down' && !good) ? 'text-emerald-400' : 'text-rose-400'
              }`}>{k.delta}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewView() {
  const overallScore = Math.round(pillarHealth.reduce((s, p) => s + p.score, 0) / pillarHealth.length);
  const overallStatus: Status = overallScore >= 80 ? 'green' : overallScore >= 65 ? 'yellow' : 'red';

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Company Health Score */}
        <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
          <span className="text-slate-400 text-[11px] uppercase tracking-widest">Company Health Score</span>
          <Gauge score={overallScore} status={overallStatus} />
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${statusColor[overallStatus].dot} animate-pulse`} />
            <span className={`text-xs font-semibold ${statusColor[overallStatus].text}`}>
              {overallStatus === 'green' ? 'Saudável' : overallStatus === 'yellow' ? 'Atenção' : 'Crítico'}
            </span>
          </div>
          <p className="text-slate-500 text-[10px] text-center">Média ponderada dos 4 pilares · Mar/2026</p>
        </div>

        {/* Pillar scores */}
        <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 justify-center">
          <span className="text-slate-400 text-[11px] uppercase tracking-widest mb-1">Saúde por Pilar</span>
          {pillarHealth.map((p, i) => {
            const sc = statusColor[p.status];
            return (
              <div key={p.pillar} className="flex items-center gap-3">
                <span className="text-slate-400 text-xs w-24 shrink-0">{p.pillar}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.score}%` }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${healthBg(p.status)} to-transparent`}
                  />
                </div>
                <span className={`text-xs font-bold w-6 text-right ${sc.text}`}>{p.score}</span>
                <span className={`text-[10px] w-10 ${p.delta.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{p.delta}</span>
              </div>
            );
          })}
        </div>

        {/* Alerts */}
        <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
          <span className="text-slate-400 text-[11px] uppercase tracking-widest mb-1">Alertas & Insights</span>
          {alerts.map((a, i) => {
            const cfg = {
              warn:    { icon: <AlertTriangle size={12} />, cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
              info:    { icon: <TrendingUp size={12} />,    cls: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
              danger:  { icon: <AlertTriangle size={12} />, cls: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
              success: { icon: <CheckCircle2 size={12} />,  cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
            }[a.type];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-2 p-2.5 rounded-lg border text-[11px] ${cfg.cls}`}
              >
                <span className="mt-0.5 shrink-0">{cfg.icon}</span>
                <span className="leading-relaxed">{a.msg}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-sm">Evolução de MRR</h3>
            <p className="text-slate-500 text-[11px]">Abr/25 – Mar/26 · realizado vs meta</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-emerald-400 font-bold text-lg">R$ 890k</p>
              <p className="text-slate-500 text-[10px]">MRR atual</p>
            </div>
            <div className="text-right">
              <p className="text-amber-400 font-bold text-lg">+7.2%</p>
              <p className="text-slate-500 text-[10px]">vs mês anterior</p>
            </div>
          </div>
        </div>
        <RevenueChart data={revenueMonths} />
      </div>

      {/* Bottom KPIs row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'ARR', value: 'R$ 8.2M',  delta: '+34% YoY', icon: <DollarSign size={14} />, color: 'text-emerald-400' },
          { label: 'NPS', value: '71',         delta: '+6pts MoM', icon: <Heart size={14} />,      color: 'text-rose-400' },
          { label: 'Clientes Ativos', value: '342', delta: '+18 MoM', icon: <Users size={14} />,   color: 'text-blue-400' },
          { label: 'Uptime', value: '99.97%',  delta: '0 incidentes', icon: <ShieldCheck size={14} />, color: 'text-violet-400' },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="bg-[#0f1929] border border-white/5 rounded-xl p-4 flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${k.color} shrink-0`}>
              {k.icon}
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none">{k.value}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{k.label}</p>
              <p className="text-emerald-400 text-[10px]">{k.delta}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Financial View ───────────────────────────────────────────────────────────

function FinanceiroView() {
  const dre = [
    { label: 'Receita Bruta',      value: 'R$ 726k',  pct: null,   highlight: false },
    { label: '(-) Impostos',        value: '- R$ 43k', pct: '5.9%', highlight: false },
    { label: 'Receita Líquida',     value: 'R$ 683k',  pct: null,   highlight: true },
    { label: '(-) COGS',            value: '- R$ 191k',pct: '28%',  highlight: false },
    { label: 'Margem Bruta',        value: 'R$ 492k',  pct: '72%',  highlight: true },
    { label: '(-) Despesas Op.',    value: '- R$ 369k',pct: '54%',  highlight: false },
    { label: 'EBITDA',              value: 'R$ 123k',  pct: '18%',  highlight: true },
    { label: '(-) Depreciação',     value: '- R$ 12k', pct: '1.8%', highlight: false },
    { label: 'EBIT',                value: 'R$ 111k',  pct: '16.3%',highlight: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <KpiGrid kpis={finKpis.slice(0, 4)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
        {/* DRE */}
        <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">DRE Simplificado</h3>
          <p className="text-slate-500 text-[10px] mb-4">Março 2026 · Competência</p>
          <div className="flex flex-col gap-0.5">
            {dre.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-center justify-between py-2 px-3 rounded-lg ${row.highlight ? 'bg-white/5 border border-white/8' : ''}`}
              >
                <span className={`text-xs ${row.highlight ? 'text-white font-semibold' : 'text-slate-400'}`}>{row.label}</span>
                <div className="flex items-center gap-3">
                  {row.pct && <span className="text-slate-600 text-[10px]">{row.pct}</span>}
                  <span className={`text-xs font-semibold ${row.value.startsWith('-') ? 'text-rose-400' : row.highlight ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {row.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Unit economics */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">Unit Economics</h3>
            {[
              { label: 'LTV / CAC', value: '15x', bar: 100, color: 'bg-emerald-500', note: 'Excelente (> 3x)' },
              { label: 'Payback CAC', value: '6 meses', bar: 40, color: 'bg-amber-400', note: 'Bom (< 12 meses)' },
              { label: 'Gross Margin', value: '72%', bar: 72, color: 'bg-emerald-500', note: 'SaaS benchmark: 70%+' },
            ].map((u, i) => (
              <div key={u.label} className="mb-4 last:mb-0">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{u.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">{u.note}</span>
                    <span className="text-white font-bold">{u.value}</span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${u.bar}%` }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    className={`h-full rounded-full ${u.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {finKpis.slice(4).map((k, i) => {
              const sc = statusColor[k.status];
              return (
                <div key={k.label} className={`bg-[#0f1929] border border-white/5 rounded-xl p-4 ring-1 ${sc.ring}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-[11px]">{k.label}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  </div>
                  <p className="text-white font-bold text-lg">{k.value}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{k.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Comercial View ───────────────────────────────────────────────────────────

function ComercialView() {
  const funnel = [
    { stage: 'Visitantes',   v: 12400, pct: 100 },
    { stage: 'Leads',        v: 1240,  pct: 10 },
    { stage: 'MQLs',         v: 558,   pct: 45 },
    { stage: 'SQLs',         v: 180,   pct: 32.3 },
    { stage: 'Proposta',     v: 74,    pct: 41.1 },
    { stage: 'Fechado',      v: 22,    pct: 29.7 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <KpiGrid kpis={comKpis.slice(0, 4)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
        {/* Funnel */}
        <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Funil de Marketing & Vendas</h3>
          <p className="text-slate-500 text-[10px] mb-5">Março 2026 · Full-funnel conversion</p>
          <div className="flex flex-col gap-2">
            {funnel.map((f, i) => (
              <motion.div
                key={f.stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="text-slate-400 text-[11px] w-20 shrink-0">{f.stage}</span>
                <div className="flex-1">
                  <div className="h-7 bg-white/5 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.pct}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-lg flex items-center justify-end pr-2"
                    >
                      <span className="text-white text-[10px] font-bold">{f.v.toLocaleString('pt-BR')}</span>
                    </motion.div>
                  </div>
                </div>
                {i > 0 && (
                  <span className="text-amber-400 text-[10px] w-10 text-right">{f.pct.toFixed(1)}%</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Churn + NRR */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-semibold text-sm">Churn Rate — 12 meses</h3>
                <p className="text-slate-500 text-[10px]">Mensal · receita churned / MRR início</p>
              </div>
              <div className="text-right">
                <p className="text-amber-400 font-bold">2.1%</p>
                <p className="text-slate-500 text-[10px]">Mar/26</p>
              </div>
            </div>
            <Sparkline data={churnMonths} color="#f59e0b" />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Abr/25</span><span>Mar/26</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {comKpis.slice(4).map((k) => {
              const sc = statusColor[k.status];
              return (
                <div key={k.label} className={`bg-[#0f1929] border border-white/5 rounded-xl p-4 ring-1 ${sc.ring}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-[11px] leading-tight">{k.label}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  </div>
                  <p className="text-white font-bold text-base">{k.value}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5 leading-tight">{k.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Operacional View ─────────────────────────────────────────────────────────

function OperacionalView() {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <KpiGrid kpis={opsKpis} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 pb-4">
        {/* NPS breakdown */}
        <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">NPS Breakdown</h3>
          <p className="text-slate-500 text-[10px] mb-4">Net Promoter Score · Mar/26</p>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-emerald-400">71</p>
              <p className="text-slate-500 text-xs mt-1">World Class ≥ 70</p>
            </div>
          </div>
          {[
            { label: 'Promotores',  pct: 76, color: 'bg-emerald-500' },
            { label: 'Neutros',     pct: 19, color: 'bg-slate-500' },
            { label: 'Detratores',  pct: 5,  color: 'bg-rose-500' },
          ].map((n) => (
            <div key={n.label} className="mb-2">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">{n.label}</span>
                <span className="text-white font-semibold">{n.pct}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${n.pct}%` }}
                  transition={{ duration: 0.6 }}
                  className={`h-full rounded-full ${n.color}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* SLA */}
        <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">SLA & Suporte</h3>
          <p className="text-slate-500 text-[10px] mb-4">Desempenho operacional</p>
          {[
            { label: 'P1 — Crítico',    sla: '2h',   real: '1.4h',  ok: true },
            { label: 'P2 — Alto',       sla: '8h',   real: '5.1h',  ok: true },
            { label: 'P3 — Médio',      sla: '24h',  real: '18h',   ok: true },
            { label: 'P4 — Baixo',      sla: '72h',  real: '88h',   ok: false },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
            >
              <div>
                <p className="text-slate-300 text-xs font-medium">{s.label}</p>
                <p className="text-slate-500 text-[10px]">SLA: {s.sla}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${s.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{s.real}</span>
                {s.ok ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertTriangle size={14} className="text-rose-400" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Engineering */}
        <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Engenharia & Produto</h3>
          <p className="text-slate-500 text-[10px] mb-4">DORA metrics · Sprint atual</p>
          {[
            { label: 'Deploy Frequency',  value: '3×/semana',  badge: 'Elite',    color: 'text-emerald-400 bg-emerald-400/10' },
            { label: 'Lead Time',         value: '2.1 dias',    badge: 'Elite',    color: 'text-emerald-400 bg-emerald-400/10' },
            { label: 'Change Failure %',  value: '4.2%',        badge: 'Bom',      color: 'text-blue-400 bg-blue-400/10' },
            { label: 'MTTR',             value: '38 min',       badge: 'Elite',    color: 'text-emerald-400 bg-emerald-400/10' },
          ].map((d, i) => (
            <motion.div
              key={d.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
            >
              <span className="text-slate-400 text-xs">{d.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-semibold">{d.value}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${d.color}`}>{d.badge}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Pessoas View ─────────────────────────────────────────────────────────────

function PessoasView() {
  const depts = [
    { dept: 'Engenharia',  n: 52, pct: 35 },
    { dept: 'Comercial',   n: 28, pct: 19 },
    { dept: 'Customer',    n: 24, pct: 16 },
    { dept: 'Produto',     n: 18, pct: 12 },
    { dept: 'Marketing',   n: 14, pct: 9.5 },
    { dept: 'Outros',      n: 12, pct: 8.5 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <KpiGrid kpis={peopleKpis.slice(0, 4)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
        {/* Headcount by dept */}
        <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Headcount por Área</h3>
          <p className="text-slate-500 text-[10px] mb-4">148 colaboradores ativos · Mar/26</p>
          {depts.map((d, i) => (
            <motion.div
              key={d.dept}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 mb-3 last:mb-0"
            >
              <span className="text-slate-400 text-xs w-20 shrink-0">{d.dept}</span>
              <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.pct}%` }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-end pr-1.5"
                >
                  <span className="text-white text-[10px] font-bold">{d.n}</span>
                </motion.div>
              </div>
              <span className="text-slate-500 text-[10px] w-8 text-right">{d.pct}%</span>
            </motion.div>
          ))}
        </div>

        {/* People health */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#0f1929] border border-white/5 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-1">Clima Organizacional</h3>
            <p className="text-slate-500 text-[10px] mb-4">Pulse survey · Fev/26</p>
            {[
              { label: 'Satisfação Geral', score: 74 },
              { label: 'Clareza de Papel', score: 81 },
              { label: 'Relacionamento',   score: 88 },
              { label: 'Crescimento',      score: 62 },
              { label: 'Liderança',        score: 70 },
            ].map((c, i) => (
              <div key={c.label} className="mb-3 last:mb-0">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">{c.label}</span>
                  <span className={`font-semibold ${c.score >= 75 ? 'text-emerald-400' : c.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{c.score}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.score}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full ${c.score >= 75 ? 'bg-emerald-500' : c.score >= 60 ? 'bg-amber-400' : 'bg-rose-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {peopleKpis.slice(4).map((k) => {
              const sc = statusColor[k.status];
              return (
                <div key={k.label} className={`bg-[#0f1929] border border-white/5 rounded-xl p-3 ring-1 ${sc.ring}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-[10px] leading-tight">{k.label}</span>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot}`} />
                  </div>
                  <p className="text-white font-bold text-sm">{k.value}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5 leading-tight">{k.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function BIDashboard() {
  const [activePillar, setActivePillar] = useState<Pillar>('overview');

  const pillars: { id: Pillar; label: string; icon: React.ReactNode; score?: number; status?: Status }[] = [
    { id: 'overview',    label: 'Visão Geral',  icon: <Zap size={14} /> },
    { id: 'financeiro',  label: 'Financeiro',   icon: <DollarSign size={14} />, score: 84, status: 'green' },
    { id: 'comercial',   label: 'Comercial',    icon: <Target size={14} />,     score: 71, status: 'yellow' },
    { id: 'operacional', label: 'Operacional',  icon: <Settings size={14} />,   score: 91, status: 'green' },
    { id: 'pessoas',     label: 'Pessoas',      icon: <Users size={14} />,      score: 67, status: 'yellow' },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#060e1a] overflow-hidden text-white font-sans text-sm">
      {/* Header */}
      <div className="shrink-0 px-3 md:px-6 pt-5 pb-0 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <BarChart2 size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-none">Command Center</h1>
              <p className="text-slate-500 text-[10px] mt-0.5">TechGroup Brasil · CEO Dashboard · Mar/2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[11px] font-medium">Live · atualizado há 4 min</span>
            </div>
            <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <RefreshCw size={12} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Pillar tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {pillars.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePillar(p.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2.5 text-xs font-medium rounded-t-lg transition-all duration-200 border-t border-l border-r relative shrink-0 whitespace-nowrap
                ${activePillar === p.id
                  ? 'bg-[#0f1929] text-white border-white/10 border-b-[#0f1929]'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
            >
              {p.icon}
              {p.label}
              {p.status && (
                <div className={`w-1.5 h-1.5 rounded-full ${statusColor[p.status].dot}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePillar}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="flex-1 overflow-hidden flex flex-col bg-[#0f1929]"
        >
          {activePillar === 'overview'    && <OverviewView />}
          {activePillar === 'financeiro'  && <FinanceiroView />}
          {activePillar === 'comercial'   && <ComercialView />}
          {activePillar === 'operacional' && <OperacionalView />}
          {activePillar === 'pessoas'     && <PessoasView />}
        </motion.div>
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}
