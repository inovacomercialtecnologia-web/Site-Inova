import React, { useState } from 'react';
import {
  LayoutDashboard, Gift, Star, BookOpen, User,
  Bell, Lock, Zap, Crown, TrendingUp, Calendar,
  Download, Shield, Phone, Play, FileText,
  BarChart2, Tag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type View = 'inicio' | 'beneficios' | 'clube' | 'conteudo' | 'conta';

// ─── Config ───────────────────────────────────────────────────────────────────

const TIERS = [
  { name: 'Bronze',   min: 0,    max: 1000,  color: '#B45309' },
  { name: 'Prata',    min: 1000, max: 3000,  color: '#6B7280' },
  { name: 'Ouro',     min: 3000, max: 6000,  color: '#D97706' },
  { name: 'Diamante', min: 6000, max: 10000, color: '#3B82F6' },
];

const USER = {
  name: 'João Mendes',
  company: 'BRFlex Comércio',
  tier: 'Ouro',
  points: 4820,
  nextTier: 'Diamante',
  nextPoints: 6000,
  avatar: 'JM',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const activities = [
  { type: 'points',  text: '+280 pts — Compra #NF-04821',             time: 'Hoje, 09:30',   pts: '+280' },
  { type: 'content', text: 'Relatório de Mercado Q1 2026 acessado',   time: 'Ontem, 14:15',  pts: '+50'  },
  { type: 'event',   text: 'Presença confirmada: Webinar Tendências', time: '08 Mar, 10:00', pts: null   },
  { type: 'redeem',  text: 'Resgate: Cashback R$120 em crédito',      time: '05 Mar, 16:40', pts: '-800' },
  { type: 'points',  text: '+340 pts — Compra #NF-04798',             time: '01 Mar, 11:20', pts: '+340' },
  { type: 'points',  text: '+150 pts — Indicação aprovada',           time: '22 Fev, 09:00', pts: '+150' },
];

const benefits = [
  { id: 'b1', Icon: BarChart2, title: 'Cashback 3%',                desc: 'Percentual de cashback em todas as compras, convertido em crédito para próximos pedidos.', tier: 'Ouro',     locked: false },
  { id: 'b2', Icon: Phone,     title: 'Suporte Prioritário 24h',    desc: 'Canal exclusivo com equipe dedicada via WhatsApp e ramal direto, sem fila de espera.',    tier: 'Prata',    locked: false },
  { id: 'b3', Icon: Tag,       title: '15% em linha premium',       desc: 'Desconto exclusivo aplicado automaticamente em toda a linha Premium Meridian.',            tier: 'Ouro',     locked: false },
  { id: 'b4', Icon: User,      title: 'Gerente de conta dedicado',  desc: 'Relacionamento exclusivo com um gerente especializado no seu segmento de negócio.',        tier: 'Ouro',     locked: false },
  { id: 'b5', Icon: Zap,       title: 'Acesso antecipado',          desc: 'Conheça e encomende novos produtos 30 dias antes do lançamento oficial ao mercado.',       tier: 'Ouro',     locked: false },
  { id: 'b6', Icon: Gift,      title: 'Presente de aniversário',    desc: 'Kit corporativo personalizado enviado no aniversário da empresa todo ano.',                 tier: 'Prata',    locked: false },
  { id: 'b7', Icon: Crown,     title: 'Mesa VIP em eventos',        desc: 'Lugar reservado e exclusivo em todos os eventos presenciais e feiras Meridian.',           tier: 'Diamante', locked: true  },
  { id: 'b8', Icon: Shield,    title: 'Seguro de estoque gratuito', desc: 'Cobertura de até R$50.000 em estoque da linha Meridian sem custo adicional.',             tier: 'Diamante', locked: true  },
];

const rewards = [
  { id: 'r1', title: 'Cashback R$50',        pts: 400,  icon: '💸', enough: true  },
  { id: 'r2', title: 'Frete grátis 3×',      pts: 250,  icon: '🚚', enough: true  },
  { id: 'r3', title: 'Desconto 10% pedido',  pts: 600,  icon: '🏷️', enough: true  },
  { id: 'r4', title: 'Consultoria gratuita', pts: 1500, icon: '🎯', enough: true  },
  { id: 'r5', title: 'Kit premium Meridian', pts: 3000, icon: '🎁', enough: false },
  { id: 'r6', title: 'Convenção 2026',       pts: 8000, icon: '✈️', enough: false },
];

const contentItems = [
  { id: 'c1', type: 'Relatório', title: 'Mercado Atacadista Q1 2026',     desc: 'Análise completa com tendências e oportunidades para o trimestre.',       duration: '32 págs', gradient: 'from-blue-600 to-indigo-700',   locked: false, isNew: true  },
  { id: 'c2', type: 'Webinar',   title: 'Tendências de Consumo 2026',     desc: 'Palestra ao vivo com especialistas. Gravação disponível para membros.',   duration: '48 min',  gradient: 'from-violet-600 to-purple-700', locked: false, isNew: false },
  { id: 'c3', type: 'Guia',      title: 'Como precificar na crise',        desc: 'Metodologia prática com planilhas e exemplos do segmento atacadista.',    duration: '18 págs', gradient: 'from-emerald-500 to-teal-600',  locked: false, isNew: false },
  { id: 'c4', type: 'Webinar',   title: 'Gestão de estoque avançada',     desc: 'Curva ABC, ponto de pedido e giro de estoque na prática.',                duration: '62 min',  gradient: 'from-amber-500 to-orange-600',  locked: false, isNew: false },
  { id: 'c5', type: 'Relatório', title: 'Cenário Econômico Brasil 2026',  desc: 'Projeções macroeconômicas e impacto direto no varejo e atacado.',         duration: '54 págs', gradient: 'from-rose-500 to-pink-600',     locked: true,  isNew: false },
  { id: 'c6', type: 'Case',      title: 'Case: BRFlex cresceu 43% MoM',  desc: 'Como um cliente cresceu usando compras programadas e cashback Meridian.',  duration: '12 págs', gradient: 'from-sky-500 to-cyan-600',      locked: false, isNew: false },
];

const transactions = [
  { id: '#NF-04821', date: 'Hoje',    value: 9340,  pts: 280, status: 'Faturado' },
  { id: '#NF-04798', date: '01 Mar',  value: 11200, pts: 340, status: 'Entregue' },
  { id: '#NF-04761', date: '18 Fev',  value: 7650,  pts: 230, status: 'Entregue' },
  { id: '#NF-04720', date: '05 Fev',  value: 14800, pts: 444, status: 'Entregue' },
  { id: '#NF-04688', date: '22 Jan',  value: 6200,  pts: 186, status: 'Entregue' },
];

const docs = [
  { name: 'Contrato Comercial 2026',     type: 'PDF',  size: '2,4 MB', date: 'Jan 2026' },
  { name: 'Proposta Parceria Ouro',      type: 'PDF',  size: '1,1 MB', date: 'Dez 2025' },
  { name: 'Tabela de Preços Q1 2026',    type: 'XLSX', size: '890 KB', date: 'Mar 2026' },
  { name: 'NF Dezembro 2025',            type: 'XML',  size: '48 KB',  date: 'Dez 2025' },
  { name: 'Política de Cashback',        type: 'PDF',  size: '320 KB', date: 'Jan 2026' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const fmtPts = (n: number) => n.toLocaleString('pt-BR') + ' pts';

function TierBadge({ tier, large = false }: { tier: string; large?: boolean }) {
  const t = TIERS.find(t => t.name === tier)!;
  const emoji = { Bronze: '🥉', Prata: '🥈', Ouro: '🥇', Diamante: '💎' }[tier] ?? '';
  if (large) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black border border-white/10"
        style={{ background: `${t.color}20`, color: t.color }}>
        <span>{emoji}</span>{tier}
      </div>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: `${t.color}20`, color: t.color }}>
      {emoji} {tier}
    </span>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────

function InicioView() {
  const progress = ((USER.points - 3000) / (6000 - 3000)) * 100;

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

      {/* Welcome banner */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1208 0%, #2d1f00 60%, #1a1208 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 80% 50%, rgba(245,158,11,0.12) 0%, transparent 65%)' }} />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-amber-400/60 text-[10px] font-semibold mb-0.5 uppercase tracking-widest">Bem-vindo de volta,</p>
              <h2 className="text-white font-black text-xl">{USER.name}</h2>
              <p className="text-white/40 text-xs">{USER.company}</p>
            </div>
            <TierBadge tier={USER.tier} large />
          </div>

          <div className="bg-black/25 rounded-xl p-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-amber-400/60 text-[9px] font-semibold uppercase tracking-widest mb-1">Saldo de pontos</p>
                <p className="text-white font-black text-3xl leading-none">{fmtPts(USER.points)}</p>
              </div>
              <div className="text-right">
                <p className="text-white/30 text-[9px]">Próximo nível</p>
                <p className="text-blue-400 font-bold text-xs">💎 Diamante</p>
                <p className="text-white/30 text-[9px]">faltam {fmtPts(USER.nextPoints - USER.points)}</p>
              </div>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #D97706, #FCD34D)' }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-amber-500/50 text-[9px]">🥇 Ouro — 3.000</span>
              <span className="text-blue-400/50 text-[9px]">💎 Diamante — 6.000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Benefícios ativos',   value: '6',       sub: 'de 8 disponíveis',       color: '#F59E0B' },
          { label: 'Compras no mês',      value: fmt(9340), sub: '+280 pts ganhos',          color: '#10B981' },
          { label: 'Conteúdos novos',     value: '3',       sub: 'adicionados essa semana',  color: '#60A5FA' },
          { label: 'Próx. evento',        value: '12 Mar',  sub: 'Webinar Tendências 2026',  color: '#A78BFA' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl border border-white/5 p-4" style={{ background: '#16161F' }}>
            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wide mb-2">{s.label}</p>
            <p className="font-black text-xl leading-none mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-white/30 text-[10px]">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Activity feed */}
        <div className="md:col-span-2 rounded-2xl border border-white/5 p-5" style={{ background: '#16161F' }}>
          <h3 className="text-white/50 font-bold text-[10px] mb-4 uppercase tracking-widest">Atividade recente</h3>
          <div className="flex flex-col gap-3.5">
            {activities.map((a, i) => {
              const Icon = a.type === 'points' ? TrendingUp : a.type === 'content' ? FileText : a.type === 'event' ? Calendar : Gift;
              const clr = a.type === 'points' ? '#10B981' : a.type === 'content' ? '#60A5FA' : a.type === 'event' ? '#A78BFA' : '#F59E0B';
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${clr}18` }}>
                    <Icon size={12} style={{ color: clr }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-xs font-medium truncate">{a.text}</p>
                    <p className="text-white/25 text-[10px]">{a.time}</p>
                  </div>
                  {a.pts && (
                    <span className={`text-xs font-bold shrink-0 ${a.pts.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {a.pts}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Next event */}
        <div className="rounded-2xl border border-white/5 p-5 flex flex-col" style={{ background: '#16161F' }}>
          <h3 className="text-white/50 font-bold text-[10px] mb-4 uppercase tracking-widest">Próximo evento</h3>
          <div className="flex-1 flex flex-col">
            <div className="h-20 rounded-xl overflow-hidden mb-3 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #312e81, #4c1d95)' }}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Play size={16} className="text-white ml-0.5" />
              </div>
            </div>
            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wide mb-1">Webinar · 12 Mar, 19h</p>
            <p className="text-white font-bold text-sm mb-1 leading-tight">Tendências de Consumo 2026</p>
            <p className="text-white/35 text-[10px] leading-relaxed flex-1 mb-3">
              Com Ana Barros, especialista em varejo e comportamento do consumidor.
            </p>
            <button className="w-full py-2 rounded-xl text-xs font-bold border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 transition-colors"
              style={{ background: 'rgba(245,158,11,0.06)' }}>
              Confirmar presença →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BeneficiosView() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="mb-5">
        <h2 className="text-white font-black text-base mb-1">Seus benefícios</h2>
        <p className="text-white/35 text-xs">
          Como membro <span className="text-amber-400 font-bold">🥇 Ouro</span>, você tem acesso a 6 de 8 benefícios disponíveis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {benefits.map((b) => (
          <motion.div key={b.id} layout
            onClick={() => !b.locked && setActiveId(activeId === b.id ? null : b.id)}
            className={`rounded-2xl border p-4 transition-all duration-200
              ${b.locked
                ? 'border-white/[0.04] opacity-45 cursor-not-allowed'
                : activeId === b.id
                  ? 'border-amber-500/30 cursor-pointer'
                  : 'border-white/5 cursor-pointer hover:border-white/10'}`}
            style={{ background: activeId === b.id ? 'rgba(245,158,11,0.06)' : '#16161F' }}>
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                ${b.locked ? 'bg-white/5' : 'bg-amber-500/10'}`}>
                {b.locked
                  ? <Lock size={13} className="text-white/20" />
                  : <b.Icon size={13} className="text-amber-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className={`font-bold text-xs ${b.locked ? 'text-white/25' : 'text-white'}`}>{b.title}</p>
                  {b.locked
                    ? <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-400/70">💎 Diamante</span>
                    : <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400">✓ Ativo</span>}
                </div>
                <p className={`text-[11px] leading-relaxed ${b.locked ? 'text-white/15' : 'text-white/45'}`}>{b.desc}</p>
              </div>
            </div>

            <AnimatePresence>
              {activeId === b.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="pt-3 mt-3 border-t border-white/5">
                    <button className="w-full py-2 rounded-xl text-xs font-bold bg-amber-500 text-stone-900 hover:bg-amber-400 transition-colors">
                      Acionar benefício →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ClubeView() {
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const currentTierIdx = TIERS.findIndex(t => t.name === USER.tier);

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
      {/* Tier ladder */}
      <div className="rounded-2xl border border-white/5 p-5" style={{ background: '#16161F' }}>
        <h3 className="text-white/50 font-bold text-[10px] mb-5 uppercase tracking-widest">Seu nível no clube</h3>
        <div className="flex items-center overflow-x-auto">
          {TIERS.map((t, i) => {
            const isCurrent = i === currentTierIdx;
            const isPast = i < currentTierIdx;
            return (
              <React.Fragment key={t.name}>
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center text-base
                    ${isCurrent ? 'shadow-lg' : ''}`}
                    style={{
                      borderColor: isCurrent ? t.color : isPast ? '#10B981' : 'rgba(255,255,255,0.08)',
                      background: isCurrent ? `${t.color}18` : isPast ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                    }}>
                    {isPast ? '✓' : { Bronze: '🥉', Prata: '🥈', Ouro: '🥇', Diamante: '💎' }[t.name]}
                  </div>
                  <p className="text-[10px] font-bold" style={{ color: isCurrent ? t.color : isPast ? '#10B981' : 'rgba(255,255,255,0.25)' }}>
                    {t.name}
                  </p>
                  <p className="text-[9px] text-white/20">{t.min.toLocaleString()} pts</p>
                </div>
                {i < TIERS.length - 1 && (
                  <div className="h-0.5 flex-1 mx-3 rounded-full"
                    style={{ background: isPast ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* How to earn */}
        <div className="rounded-2xl border border-white/5 p-5" style={{ background: '#16161F' }}>
          <h3 className="text-white/50 font-bold text-[10px] mb-4 uppercase tracking-widest">Como ganhar pontos</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: '🛒', label: 'Compras na Meridian',    pts: '3 pts / R$100'      },
              { icon: '👥', label: 'Indicação aprovada',     pts: '150 pts / indicação' },
              { icon: '📋', label: 'Pesquisa de satisfação', pts: '30 pts / resposta'   },
              { icon: '📅', label: 'Participar de eventos',  pts: '80 pts / evento'     },
              { icon: '📖', label: 'Acessar conteúdo',       pts: '50 pts / material'   },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-base w-7 text-center shrink-0">{item.icon}</span>
                <p className="text-white/50 text-xs flex-1">{item.label}</p>
                <span className="text-amber-400 text-[11px] font-bold shrink-0">{item.pts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards catalog */}
        <div className="rounded-2xl border border-white/5 p-5" style={{ background: '#16161F' }}>
          <h3 className="text-white/50 font-bold text-[10px] mb-4 uppercase tracking-widest">Resgatar pontos</h3>
          <div className="flex flex-col gap-2">
            {rewards.map((r) => {
              const canRedeem = r.enough && USER.points >= r.pts;
              return (
                <div key={r.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all
                    ${canRedeem ? 'border-white/5 hover:border-amber-500/20' : 'border-white/[0.03] opacity-40'}`}
                  style={{ background: canRedeem ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <span className="text-lg shrink-0">{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold">{r.title}</p>
                    <p className="text-amber-400/60 text-[10px] font-bold">{r.pts.toLocaleString()} pts</p>
                  </div>
                  {canRedeem ? (
                    <button
                      onClick={() => { setRedeeming(r.id); setTimeout(() => setRedeeming(null), 1800); }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all shrink-0
                        ${redeeming === r.id ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}>
                      {redeeming === r.id ? '✓ Resgatado!' : 'Resgatar'}
                    </button>
                  ) : (
                    <span className="text-[9px] text-white/20 shrink-0">
                      {USER.points < r.pts ? `faltam ${(r.pts - USER.points).toLocaleString()}` : 'Esgotado'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConteudoView() {
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Relatório', 'Webinar', 'Guia', 'Case'];
  const filtered = filter === 'Todos' ? contentItems : contentItems.filter(c => c.type === filter);

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white font-black text-base mb-0.5">Conteúdo exclusivo</h2>
          <p className="text-white/35 text-xs">Materiais curados para membros do clube.</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all
                ${filter === f ? 'bg-amber-500 text-stone-900' : 'text-white/35 hover:text-white hover:bg-white/5'}`}
              style={filter !== f ? { background: 'rgba(255,255,255,0.04)' } : {}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <div key={item.id}
            className={`rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10 ${item.locked ? 'opacity-60' : ''}`}
            style={{ background: '#16161F' }}>
            <div className={`h-24 bg-gradient-to-br ${item.gradient} relative flex items-center justify-center`}>
              {item.locked ? (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1.5">
                  <Lock size={18} className="text-white/70" />
                  <span className="text-white/60 text-[10px] font-bold">💎 Exclusivo Diamante</span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {item.type === 'Webinar'
                    ? <Play size={15} className="text-white ml-0.5" />
                    : <FileText size={15} className="text-white" />}
                </div>
              )}
              {item.isNew && !item.locked && (
                <span className="absolute top-2.5 right-2.5 bg-amber-400 text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  NOVO
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-white/25 font-semibold uppercase">{item.type}</span>
                <span className="text-white/15">·</span>
                <span className="text-[10px] text-white/25">{item.duration}</span>
              </div>
              <p className="text-white font-bold text-sm mb-1 leading-tight">{item.title}</p>
              <p className="text-white/40 text-[11px] leading-relaxed mb-3">{item.desc}</p>
              <button
                className={`w-full py-2 rounded-xl text-[11px] font-bold transition-all
                  ${item.locked ? 'bg-white/[0.03] text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-amber-400 hover:bg-amber-500/10'}`}
                style={!item.locked ? { background: 'rgba(255,255,255,0.04)' } : {}}>
                {item.locked ? 'Conteúdo bloqueado' : item.type === 'Webinar' ? 'Assistir →' : 'Acessar →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContaView() {
  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company info */}
        <div className="rounded-2xl border border-white/5 p-5" style={{ background: '#16161F' }}>
          <h3 className="text-white/50 font-bold text-[10px] mb-4 uppercase tracking-widest">Dados da empresa</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Razão social', value: 'BRFlex Comércio e Importação Ltda' },
              { label: 'CNPJ',         value: '23.456.789/0000-00' },
              { label: 'Segmento',     value: 'Atacado e Distribuição' },
              { label: 'Cidade / UF',  value: 'Campinas / SP' },
              { label: 'Membro desde', value: 'Março de 2023' },
              { label: 'Contato',      value: 'joao.mendes@brflex.exemplo' },
            ].map((f, i) => (
              <div key={i} className="flex justify-between items-start gap-4">
                <span className="text-white/25 text-[11px] shrink-0">{f.label}</span>
                <span className="text-white/65 text-[11px] font-semibold text-right">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="rounded-2xl border border-white/5 p-5" style={{ background: '#16161F' }}>
          <h3 className="text-white/50 font-bold text-[10px] mb-4 uppercase tracking-widest">Documentos</h3>
          <div className="flex flex-col gap-1.5">
            {docs.map((d, i) => (
              <div key={i}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors group cursor-pointer">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black shrink-0
                  ${d.type === 'PDF' ? 'bg-rose-500/12 text-rose-400' : d.type === 'XLSX' ? 'bg-emerald-500/12 text-emerald-400' : 'bg-blue-500/12 text-blue-400'}`}>
                  {d.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 text-[11px] font-semibold truncate">{d.name}</p>
                  <p className="text-white/25 text-[10px]">{d.date} · {d.size}</p>
                </div>
                <Download size={12} className="text-white/15 group-hover:text-amber-400 transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div className="rounded-2xl border border-white/5 p-5" style={{ background: '#16161F' }}>
        <h3 className="text-white/50 font-bold text-[10px] mb-4 uppercase tracking-widest">Histórico de compras</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Pedido', 'Data', 'Valor', 'Pontos', 'Status'].map(h => (
                  <th key={h} className="text-left text-[10px] text-white/25 font-semibold uppercase pb-2.5 pr-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-5 text-amber-400/80 text-xs font-mono font-bold">{t.id}</td>
                  <td className="py-3 pr-5 text-white/40 text-xs">{t.date}</td>
                  <td className="py-3 pr-5 text-white text-xs font-bold">{fmt(t.value)}</td>
                  <td className="py-3 pr-5 text-emerald-400 text-xs font-bold">+{t.pts}</td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                      ${t.status === 'Entregue' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function ClientPortal() {
  const [view, setView] = useState<View>('inicio');

  const navItems: { view: View; Icon: React.ElementType; label: string }[] = [
    { view: 'inicio',     Icon: LayoutDashboard, label: 'Início'      },
    { view: 'beneficios', Icon: Gift,             label: 'Benefícios'  },
    { view: 'clube',      Icon: Star,             label: 'Clube'       },
    { view: 'conteudo',   Icon: BookOpen,         label: 'Conteúdo'    },
    { view: 'conta',      Icon: User,             label: 'Minha conta' },
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden font-sans text-sm" style={{ background: '#0B0B10' }}>
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/[0.06]"
        style={{ background: '#111118' }}>
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
            <span className="text-white text-[11px] font-black">M</span>
          </div>
          <div>
            <p className="text-white font-bold text-xs leading-none">Meridian</p>
            <p className="text-white/25 text-[9px]">Club Vantage</p>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <button className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
            <Bell size={13} className="text-white/35" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
              style={{ background: 'rgba(217,119,6,0.2)', color: '#F59E0B' }}>
              {USER.avatar}
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-[11px] font-semibold leading-none">{USER.name}</p>
              <p className="text-white/30 text-[9px]">{USER.company}</p>
            </div>
            <TierBadge tier={USER.tier} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex w-44 shrink-0 border-r border-white/[0.06] flex-col py-4 px-3"
          style={{ background: '#0F0F15' }}>
          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map(n => (
              <button key={n.view} onClick={() => setView(n.view)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-left transition-all
                  ${view === n.view ? 'font-bold' : 'text-white/35 hover:text-white/60 hover:bg-white/[0.04]'}`}
                style={view === n.view ? { background: 'rgba(217,119,6,0.1)', color: '#F59E0B' } : {}}>
                <n.Icon size={13} />
                {n.label}
              </button>
            ))}
          </nav>

          {/* Points mini */}
          <div className="border-t border-white/5 pt-3 px-1">
            <p className="text-white/20 text-[9px] uppercase tracking-widest mb-1">Meus pontos</p>
            <p className="font-black text-base leading-none" style={{ color: '#F59E0B' }}>{fmtPts(USER.points)}</p>
            <p className="text-white/20 text-[9px] mt-0.5">{fmtPts(USER.nextPoints - USER.points)} p/ 💎</p>
          </div>
        </div>

        {/* Main */}
        <AnimatePresence mode="wait">
          <motion.div key={view}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col overflow-hidden">
            {view === 'inicio'     && <InicioView />}
            {view === 'beneficios' && <BeneficiosView />}
            {view === 'clube'      && <ClubeView />}
            {view === 'conteudo'   && <ConteudoView />}
            {view === 'conta'      && <ContaView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
