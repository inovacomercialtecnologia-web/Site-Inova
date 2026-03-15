import React, { useState, useEffect, useRef } from 'react';
import {
  Home, PieChart, TrendingUp, CreditCard,
  Bell, ChevronRight, Plus, ArrowUpRight, ArrowDownLeft,
  ShoppingBag, Car, Heart, Gamepad2, House, Wallet,
  Bitcoin, BarChart3, DollarSign, Eye, EyeOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type View = 'inicio' | 'gastos' | 'investimentos' | 'cartoes';

interface Transaction {
  id: string; label: string; category: string; icon: string;
  amount: number; date: string; type: 'income' | 'expense';
}

interface Asset {
  name: string; ticker: string; value: number;
  return: string; positive: boolean; color: string; icon: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const TRANSACTIONS: Transaction[] = [
  { id:'t1', label:'iFood',         category:'Alimentação',  icon:'🍔', amount: -87.50,  date:'Hoje',   type:'expense' },
  { id:'t2', label:'Salário Inova', category:'Receita',      icon:'💼', amount: 8200.00, date:'05 Mar', type:'income'  },
  { id:'t3', label:'Netflix',       category:'Assinaturas',  icon:'🎬', amount: -45.90,  date:'04 Mar', type:'expense' },
  { id:'t4', label:'Uber',          category:'Transporte',   icon:'🚗', amount: -32.40,  date:'03 Mar', type:'expense' },
  { id:'t5', label:'Farmácia',      category:'Saúde',        icon:'💊', amount: -124.00, date:'02 Mar', type:'expense' },
];

const WEEK_INCOME  = [980,  0,    1200, 600, 8200, 0,   0];
const WEEK_EXPENSE = [340,  120,  560,  280, 420,  890, 180];
const WEEK_DAYS    = ['S','T','Q','Q','S','S','D'];

const CATEGORIES = [
  { label:'Moradia',      icon: House,      amount: 1800, pct: 41, color: '#059669' },
  { label:'Alimentação',  icon: ShoppingBag,amount: 1240, pct: 28, color: '#F97316' },
  { label:'Lazer',        icon: Gamepad2,   amount: 560,  pct: 13, color: '#D4AF37' },
  { label:'Saúde',        icon: Heart,      amount: 400,  pct:  9, color: '#22C55E' },
  { label:'Transporte',   icon: Car,        amount: 380,  pct:  9, color: '#F59E0B' },
];

const ALLOC = [
  { label:'Renda Fixa', pct: 45, color: '#D4AF37' },
  { label:'Ações',      pct: 30, color: '#22C55E' },
  { label:'FIIs',       pct: 15, color: '#F59E0B' },
  { label:'Cripto',     pct: 10, color: '#059669' },
];

const ASSETS: Asset[] = [
  { name:'Tesouro Selic 2029', ticker:'SELIC', value: 30700, return:'+10,5% a.a.', positive:true,  color:'#D4AF37', icon:'🏛️' },
  { name:'Petrobras',          ticker:'PETR4', value: 20400, return:'+18,2% 12m',  positive:true,  color:'#22C55E', icon:'📈' },
  { name:'HGLG11',             ticker:'FII',   value: 10200, return:'+9,8% a.a.',  positive:true,  color:'#F59E0B', icon:'🏢' },
  { name:'Bitcoin',            ticker:'BTC',   value:  7120, return:'+41,3% 12m',  positive:true,  color:'#059669', icon:'₿'  },
];

const CARD_EXPENSES = [
  { label:'Spotify',    cat:'Assinaturas', icon:'🎵', amount: -21.90, date:'Hoje'   },
  { label:'Amazon',     cat:'Compras',     icon:'📦', amount:-189.90, date:'08 Mar' },
  { label:'Shell',      cat:'Transporte',  icon:'⛽', amount: -95.00, date:'07 Mar' },
  { label:'Rappi',      cat:'Alimentação', icon:'🛵', amount: -64.80, date:'06 Mar' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CircleProgress({ value, max, size, stroke, color, children }: {
  value: number; max: number; size: number; stroke: number; color: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function DonutChart({ segments, size }: { segments: typeof ALLOC; size: number }) {
  const cx = size / 2, cy = size / 2, r = size * 0.36, stroke = size * 0.14;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset}
            strokeLinecap="butt" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

// ─── Sub-views ────────────────────────────────────────────────────────────────

function InicioView() {
  const [hidden, setHidden] = useState(false);
  const maxInc = Math.max(...WEEK_INCOME);
  const maxExp = Math.max(...WEEK_EXPENSE);
  const barMax = Math.max(maxInc, maxExp);

  return (
    <div className="px-4 pb-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#22C55E]/20 flex items-center justify-center text-sm font-bold text-[#22C55E]">R</div>
          <div>
            <p className="text-white/50 text-[10px]">Bom dia 👋</p>
            <p className="text-white font-bold text-sm leading-tight">Rafael Mendes</p>
          </div>
        </div>
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
            <Bell size={16} className="text-white/50" />
          </div>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] border border-[#040D06]" />
        </div>
      </div>

      {/* Balance card */}
      <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #071A09, #0D2B10, #102D13)' }}>
        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 80% 20%, #22C55E20 0%, transparent 60%)' }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/50 text-xs">Saldo disponível</p>
            <button onClick={() => setHidden(h => !h)} className="text-white/30 hover:text-white/60 transition-colors">
              {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-white font-bold text-3xl leading-none mb-3">
            {hidden ? '•••••••' : 'R$ 24.850'}
            <span className="text-white/40 text-sm font-normal">,00</span>
          </p>
          <div className="inline-flex items-center gap-1.5 bg-[#22C55E]/20 border border-[#22C55E]/30 rounded-full px-3 py-1 mb-4">
            <ArrowUpRight size={11} className="text-[#22C55E]" />
            <span className="text-[#22C55E] text-[10px] font-bold">+8,4% este mês</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowDownLeft size={12} className="text-[#22C55E]" />
                <span className="text-white/50 text-[10px]">Receitas</span>
              </div>
              <p className="text-white font-bold text-sm">{hidden ? '•••••' : 'R$ 8.200'}</p>
            </div>
            <div className="bg-black/20 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowUpRight size={12} className="text-[#EF4444]" />
                <span className="text-white/50 text-[10px]">Despesas</span>
              </div>
              <p className="text-white font-bold text-sm">{hidden ? '•••••' : 'R$ 4.380'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="bg-[#091409] rounded-3xl p-4 border border-white/5">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">Esta semana</p>
        <div className="flex items-end justify-between gap-1 h-20">
          {WEEK_DAYS.map((day, i) => {
            const inc = (WEEK_INCOME[i] / barMax) * 64;
            const exp = (WEEK_EXPENSE[i] / barMax) * 64;
            const isToday = i === 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-[2px] items-end justify-center" style={{ height: 64 }}>
                  {inc > 0 && <div className="flex-1 rounded-t-sm" style={{ height: inc, background: isToday ? '#22C55E' : '#22C55E40' }} />}
                  {exp > 0 && <div className="flex-1 rounded-t-sm" style={{ height: exp, background: isToday ? '#EF4444' : '#EF444440' }} />}
                  {inc === 0 && exp === 0 && <div className="flex-1 rounded-t-sm" style={{ height: 3, background: 'rgba(255,255,255,0.05)' }} />}
                </div>
                <span className={`text-[9px] ${isToday ? 'text-white font-bold' : 'text-white/30'}`}>{day}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#22C55E]" /><span className="text-white/50 text-[10px]">Receitas</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#EF4444]" /><span className="text-white/50 text-[10px]">Despesas</span></div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Recentes</p>
          <button className="text-[#22C55E] text-[10px] font-semibold">Ver todas</button>
        </div>
        <div className="space-y-2">
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} className="flex items-center gap-3 bg-[#091409] rounded-2xl px-3 py-2.5 border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-base flex-shrink-0">{tx.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{tx.label}</p>
                <p className="text-white/30 text-[10px]">{tx.category} · {tx.date}</p>
              </div>
              <p className={`text-xs font-bold flex-shrink-0 ${tx.type === 'income' ? 'text-[#22C55E]' : 'text-white/70'}`}>
                {tx.type === 'income' ? '+' : ''}{fmtBRL(Math.abs(tx.amount))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GastosView() {
  const total = 4380, meta = 5500;
  const histMonths = [
    { month: 'Jan', val: 3820 },
    { month: 'Fev', val: 4150 },
    { month: 'Mar', val: 4380 },
  ];
  const histMax = Math.max(...histMonths.map(m => m.val));

  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-white font-bold text-lg">Gastos</h2>
        <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">Março 2026</span>
      </div>

      {/* Donut */}
      <div className="bg-[#091409] rounded-3xl p-4 border border-white/5 flex flex-col items-center">
        <CircleProgress value={total} max={meta} size={120} stroke={12} color="#EF4444">
          <div className="text-center">
            <p className="text-white font-bold text-lg leading-none">{Math.round((total/meta)*100)}%</p>
            <p className="text-white/40 text-[9px] mt-0.5">do limite</p>
          </div>
        </CircleProgress>
        <div className="flex items-center gap-4 mt-3">
          <div className="text-center">
            <p className="text-[#EF4444] font-bold text-base">{fmtBRL(total)}</p>
            <p className="text-white/30 text-[10px]">gastos</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-white/60 font-bold text-base">{fmtBRL(meta - total)}</p>
            <p className="text-white/30 text-[10px]">restam</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Por categoria</p>
        {CATEGORIES.map(cat => (
          <div key={cat.label} className="bg-[#091409] rounded-2xl px-3 py-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cat.color + '20' }}>
                <cat.icon size={13} style={{ color: cat.color }} />
              </div>
              <span className="text-white text-xs font-medium flex-1">{cat.label}</span>
              <span className="text-white/60 text-xs font-bold">{fmtBRL(cat.amount)}</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.pct}%`, background: cat.color }} />
            </div>
            <p className="text-white/30 text-[10px] mt-1">{cat.pct}% do total</p>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="bg-[#091409] rounded-3xl p-4 border border-white/5">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">Histórico mensal</p>
        <div className="flex items-end gap-4 h-16">
          {histMonths.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
              <p className="text-white/60 text-[10px] font-semibold">{fmtBRL(m.val).replace('R$\xa0','R$ ')}</p>
              <div className="w-full rounded-t-lg" style={{ height: `${(m.val / histMax) * 44}px`, background: m.month === 'Mar' ? '#EF4444' : '#EF444430' }} />
              <span className="text-white/40 text-[10px]">{m.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InvestimentosView() {
  const total = 68420;
  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-white font-bold text-lg">Investimentos</h2>
        <button className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
          <Plus size={15} className="text-[#D4AF37]" />
        </button>
      </div>

      {/* Patrimônio */}
      <div className="rounded-3xl p-5 relative overflow-hidden border border-[#D4AF37]/20"
        style={{ background: 'linear-gradient(135deg, #181200, #251C00, #1A1500)' }}>
        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 80% 20%, #D4AF3720 0%, transparent 60%)' }} />
        <div className="relative">
          <p className="text-white/50 text-xs mb-1">Patrimônio total</p>
          <p className="text-white font-bold text-3xl leading-none mb-2">R$ 68.420<span className="text-white/40 text-sm font-normal">,00</span></p>
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/25 rounded-full px-3 py-1">
            <ArrowUpRight size={11} className="text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-[10px] font-bold">+14,2% nos últimos 12 meses</span>
          </div>
        </div>
      </div>

      {/* Allocation donut */}
      <div className="bg-[#091409] rounded-3xl p-4 border border-white/5">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">Alocação</p>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <DonutChart segments={ALLOC} size={100} />
          </div>
          <div className="flex-1 space-y-2">
            {ALLOC.map(seg => (
              <div key={seg.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                  <span className="text-white/60 text-[11px]">{seg.label}</span>
                </div>
                <span className="text-white text-[11px] font-bold">{seg.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assets */}
      <div className="space-y-2">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Ativos</p>
        {ASSETS.map(asset => (
          <div key={asset.ticker} className="bg-[#091409] rounded-2xl px-3 py-3 border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl text-base flex items-center justify-center flex-shrink-0" style={{ background: asset.color + '15' }}>
              {asset.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{asset.name}</p>
              <p className="text-white/30 text-[10px]">{asset.ticker}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white text-xs font-bold">{fmtBRL(asset.value)}</p>
              <p className="text-[10px] font-semibold" style={{ color: asset.color }}>{asset.return}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartoesView() {
  const limitTotal = 12000, limitUsed = 3800;
  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-white font-bold text-lg">Cartões</h2>
        <button className="w-8 h-8 rounded-full bg-[#059669]/15 flex items-center justify-center">
          <Plus size={15} className="text-[#059669]" />
        </button>
      </div>

      {/* Credit card visual */}
      <div className="rounded-3xl p-5 relative overflow-hidden h-44"
        style={{ background: 'linear-gradient(135deg, #061A0C, #0D2E15, #0A2010)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(5,150,105,0.25) 0%, transparent 60%)' }} />
        {/* Card chip */}
        <div className="absolute top-5 left-5 w-8 h-6 rounded bg-[#F59E0B]/80 border border-[#F59E0B] flex items-center justify-center">
          <div className="w-5 h-4 border-2 border-[#F59E0B]/40 rounded-sm" />
        </div>
        <div className="absolute top-5 right-5">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-[#EF4444]/80" />
            <div className="w-6 h-6 rounded-full bg-[#F97316]/80" />
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-white/70 text-xs tracking-[0.2em] mb-1">•••• •••• •••• 4821</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/40 text-[8px] uppercase tracking-wider">Titular</p>
              <p className="text-white text-xs font-semibold">RAFAEL MENDES</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-[8px] uppercase tracking-wider">Validade</p>
              <p className="text-white text-xs font-semibold">03/29</p>
            </div>
          </div>
        </div>
        <div className="absolute top-16 left-5">
          <p className="text-white/40 text-[9px] uppercase tracking-wider">Nubank Platinum</p>
        </div>
      </div>

      {/* Limit bar */}
      <div className="bg-[#091409] rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/50 text-xs">Limite disponível</p>
          <p className="text-white text-xs font-bold">{fmtBRL(limitTotal - limitUsed)}</p>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full bg-[#059669] transition-all duration-700" style={{ width: `${(limitUsed/limitTotal)*100}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-[10px]">Usado: {fmtBRL(limitUsed)}</p>
          <p className="text-white/30 text-[10px]">Limite: {fmtBRL(limitTotal)}</p>
        </div>
      </div>

      {/* Faturas */}
      <div className="space-y-2">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Próximas faturas</p>
        {[
          { bank:'Nubank',    amount: 2340, due:'15 Mar', urgent:true  },
          { bank:'Itaú Visa', amount: 1180, due:'22 Mar', urgent:false },
        ].map(f => (
          <div key={f.bank} className={`flex items-center gap-3 rounded-2xl px-3 py-3 border ${f.urgent ? 'bg-[#EF4444]/5 border-[#EF4444]/20' : 'bg-[#091409] border-white/5'}`}>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.urgent ? 'bg-[#EF4444]' : 'bg-white/20'}`} />
            <div className="flex-1">
              <p className="text-white text-xs font-semibold">{f.bank}</p>
              <p className="text-white/30 text-[10px]">Vence {f.due}</p>
            </div>
            <p className={`text-xs font-bold ${f.urgent ? 'text-[#EF4444]' : 'text-white/60'}`}>{fmtBRL(f.amount)}</p>
          </div>
        ))}
      </div>

      {/* Card transactions */}
      <div className="space-y-2">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Na fatura</p>
        {CARD_EXPENSES.map((tx, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#091409] rounded-2xl px-3 py-2.5 border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-sm flex-shrink-0">{tx.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{tx.label}</p>
              <p className="text-white/30 text-[10px]">{tx.cat} · {tx.date}</p>
            </div>
            <p className="text-white/70 text-xs font-bold flex-shrink-0">{fmtBRL(Math.abs(tx.amount))}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: View; icon: React.ElementType; label: string }[] = [
  { id: 'inicio',        icon: Home,        label: 'Início'  },
  { id: 'gastos',        icon: PieChart,    label: 'Gastos'  },
  { id: 'investimentos', icon: TrendingUp,  label: 'Invest.' },
  { id: 'cartoes',       icon: CreditCard,  label: 'Cartões' },
];

const ACCENT: Record<View, string> = {
  inicio:        '#22C55E',
  gastos:        '#EF4444',
  investimentos: '#D4AF37',
  cartoes:       '#059669',
};

// ─── Export ───────────────────────────────────────────────────────────────────

export default function FinancasApp() {
  const [view, setView] = useState<View>('inicio');
  const [time, setTime] = useState('09:41');
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const scaleH = (height - 32) / 720;
      const scaleW = (width - 32) / 360;
      setScale(Math.min(1, scaleH, scaleW));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const accent = ACCENT[view];

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #071409 0%, #020503 100%)' }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${accent}15 0%, transparent 65%)`, transition: 'background 0.5s ease' }} />

      {/* Phone frame */}
      <div className="relative overflow-hidden" style={{ width: 360 * scale, height: 720 * scale, flexShrink: 0 }}>
      <div className="absolute top-0 left-0" style={{ width: 360, height: 720, transform: `scale(${scale})`, transformOrigin: 'top left' }}>

        {/* Side buttons */}
        <div className="absolute left-[-3px] top-24 w-1 h-8 bg-[#1a1a2e] rounded-l-sm" />
        <div className="absolute left-[-3px] top-36 w-1 h-12 bg-[#1a1a2e] rounded-l-sm" />
        <div className="absolute left-[-3px] top-52 w-1 h-12 bg-[#1a1a2e] rounded-l-sm" />
        <div className="absolute right-[-3px] top-32 w-1 h-16 bg-[#1a1a2e] rounded-r-sm" />

        {/* Phone shell */}
        <div className="absolute inset-0 rounded-[44px] border-[6px] border-[#1a1a2e] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_32px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(0,0,0,0.5)] overflow-hidden bg-[#040D06]">

          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a2e] rounded-b-3xl z-20 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
            <div className="w-3 h-3 rounded-full bg-[#2a2a3e]" />
          </div>

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-10 flex items-end justify-between px-7 pb-1.5 z-10">
            <span className="text-white text-[11px] font-semibold">{time}</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-[2px]">
                {[3,5,7,9].map((h,i) => <div key={i} className="w-[3px] rounded-sm bg-white" style={{ height: h }} />)}
              </div>
              <svg width="14" height="11" viewBox="0 0 14 11">
                <path d="M7 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="white"/>
                <path d="M3.5 5.5C4.8 4.2 5.8 3.5 7 3.5s2.2.7 3.5 2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M1 3C2.8 1.2 4.7 0 7 0s4.2 1.2 6 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
              <div className="flex items-center gap-px">
                <div className="w-6 h-3 rounded-sm border border-white/60 p-px">
                  <div className="h-full w-[80%] bg-white rounded-[1px]" />
                </div>
                <div className="w-0.5 h-1.5 bg-white/50 rounded-r-sm" />
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="absolute inset-0 top-10 bottom-20 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <AnimatePresence mode="wait">
              <motion.div key={view}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}>
                {view === 'inicio'        && <InicioView />}
                {view === 'gastos'        && <GastosView />}
                {view === 'investimentos' && <InvestimentosView />}
                {view === 'cartoes'       && <CartoesView />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#040D06]/95 backdrop-blur-sm border-t border-white/5 flex items-start pt-2 px-2">
            {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
              const active = view === id;
              const col = ACCENT[id];
              return (
                <button key={id} onClick={() => setView(id)}
                  className="flex-1 flex flex-col items-center gap-1 pt-1 transition-all">
                  <div className="w-10 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{ background: active ? col + '22' : 'transparent' }}>
                    <Icon size={18} style={{ color: active ? col : 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }} />
                  </div>
                  <span className="text-[10px] font-medium transition-colors" style={{ color: active ? col : 'rgba(255,255,255,0.3)' }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
      </div>
    </div>
  );
}
