import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Percent, Wallet,
  Search, ChevronRight, ArrowUpRight, ArrowDownRight, X,
  AlertCircle, Check, Clock, TrendingUp, Zap,
  ShoppingCart, ArrowLeft, Plus, Minus, Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type View         = 'overview' | 'vendedores' | 'comissoes' | 'liquidacoes';
type SellerStatus = 'Ativo' | 'Pendente' | 'Suspenso';
type SellerTier   = 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
type PayoutStatus = 'Pendente' | 'Processando' | 'Concluído' | 'Falha';

interface Seller {
  id: string; name: string; store: string;
  tier: SellerTier; gmv: number; gmvDelta: number;
  commission: number; products: number; rating: number;
  status: SellerStatus; joinDate: string; category: string;
}

interface Payout {
  id: string; sellerId: string; sellerName: string; store: string;
  gross: number; commission: number; net: number;
  status: PayoutStatus; date: string;
}

interface CommissionRule { category: string; baseRate: number }

// ─── Data ─────────────────────────────────────────────────────────────────────

const SELLERS: Seller[] = [
  { id:'s01', name:'Rafael Motta',       store:'TechZone',       tier:'Diamante', gmv:284000, gmvDelta:18.4,  commission:9,  products:342,  rating:4.9, status:'Ativo',    joinDate:'Jan 2023', category:'Eletrônicos' },
  { id:'s02', name:'Camila Rocha',       store:'FashionHub',     tier:'Ouro',     gmv:198500, gmvDelta:7.2,   commission:16, products:891,  rating:4.8, status:'Ativo',    joinDate:'Mar 2023', category:'Moda' },
  { id:'s03', name:'Diego Ferreira',     store:'CasaDecor',      tier:'Prata',    gmv:142300, gmvDelta:-3.1,  commission:14, products:215,  rating:4.6, status:'Ativo',    joinDate:'Jun 2023', category:'Casa & Deco' },
  { id:'s04', name:'Beatriz Lima',       store:'BeautyPro',      tier:'Ouro',     gmv:167800, gmvDelta:22.7,  commission:14, products:456,  rating:4.9, status:'Ativo',    joinDate:'Fev 2023', category:'Beleza' },
  { id:'s05', name:'Lucas Andrade',      store:'SportWorld',     tier:'Prata',    gmv:98400,  gmvDelta:5.9,   commission:11, products:178,  rating:4.5, status:'Ativo',    joinDate:'Ago 2023', category:'Esportes' },
  { id:'s06', name:'Mariana Torres',     store:'KidsZone',       tier:'Bronze',   gmv:54200,  gmvDelta:12.3,  commission:13, products:234,  rating:4.7, status:'Ativo',    joinDate:'Nov 2023', category:'Infantil' },
  { id:'s07', name:'Thiago Neves',       store:'AutoParts BR',   tier:'Prata',    gmv:119600, gmvDelta:-8.4,  commission:10, products:89,   rating:4.3, status:'Ativo',    joinDate:'Abr 2023', category:'Automotivo' },
  { id:'s08', name:'Fernanda Costa',     store:'GourmetBox',     tier:'Ouro',     gmv:145900, gmvDelta:14.1,  commission:11, products:312,  rating:4.8, status:'Ativo',    joinDate:'Jan 2023', category:'Alimentos' },
  { id:'s09', name:'Pedro Santos',       store:'GameVault',      tier:'Bronze',   gmv:41800,  gmvDelta:-1.7,  commission:12, products:67,   rating:4.4, status:'Pendente', joinDate:'Dez 2023', category:'Games' },
  { id:'s10', name:'Amanda Figueiredo',  store:'PetShop Plus',   tier:'Prata',    gmv:87300,  gmvDelta:9.8,   commission:12, products:198,  rating:4.6, status:'Ativo',    joinDate:'Jul 2023', category:'Pet' },
  { id:'s11', name:'Rodrigo Alves',      store:'FerramentasMax', tier:'Bronze',   gmv:32100,  gmvDelta:-15.2, commission:9,  products:44,   rating:3.9, status:'Suspenso', joinDate:'Set 2023', category:'Ferramentas' },
  { id:'s12', name:'Juliana Pinto',      store:'EduBooks',       tier:'Diamante', gmv:221400, gmvDelta:31.5,  commission:7,  products:1240, rating:4.9, status:'Ativo',    joinDate:'Fev 2023', category:'Livros' },
];

const PAYOUTS: Payout[] = [
  { id:'p01', sellerId:'s01', sellerName:'Rafael Motta',      store:'TechZone',       gross:284000, commission:25560, net:258440, status:'Concluído',   date:'01/03/2026' },
  { id:'p02', sellerId:'s12', sellerName:'Juliana Pinto',     store:'EduBooks',       gross:221400, commission:15498, net:205902, status:'Concluído',   date:'01/03/2026' },
  { id:'p03', sellerId:'s02', sellerName:'Camila Rocha',      store:'FashionHub',     gross:198500, commission:31760, net:166740, status:'Processando', date:'05/03/2026' },
  { id:'p04', sellerId:'s04', sellerName:'Beatriz Lima',      store:'BeautyPro',      gross:167800, commission:23492, net:144308, status:'Processando', date:'05/03/2026' },
  { id:'p05', sellerId:'s08', sellerName:'Fernanda Costa',    store:'GourmetBox',     gross:145900, commission:16049, net:129851, status:'Pendente',    date:'10/03/2026' },
  { id:'p06', sellerId:'s03', sellerName:'Diego Ferreira',    store:'CasaDecor',      gross:142300, commission:19922, net:122378, status:'Pendente',    date:'10/03/2026' },
  { id:'p07', sellerId:'s07', sellerName:'Thiago Neves',      store:'AutoParts BR',   gross:119600, commission:11960, net:107640, status:'Pendente',    date:'10/03/2026' },
  { id:'p08', sellerId:'s05', sellerName:'Lucas Andrade',     store:'SportWorld',     gross:98400,  commission:10824, net:87576,  status:'Pendente',    date:'10/03/2026' },
  { id:'p09', sellerId:'s10', sellerName:'Amanda Figueiredo', store:'PetShop Plus',   gross:87300,  commission:10476, net:76824,  status:'Pendente',    date:'10/03/2026' },
  { id:'p10', sellerId:'s11', sellerName:'Rodrigo Alves',     store:'FerramentasMax', gross:32100,  commission:2889,  net:29211,  status:'Falha',       date:'01/03/2026' },
];

const COMMISSION_RULES: CommissionRule[] = [
  { category:'Eletrônicos', baseRate:12 }, { category:'Moda',       baseRate:18 },
  { category:'Casa & Deco', baseRate:15 }, { category:'Beleza',     baseRate:16 },
  { category:'Esportes',    baseRate:13 }, { category:'Infantil',   baseRate:14 },
  { category:'Automotivo',  baseRate:11 }, { category:'Alimentos',  baseRate:12 },
  { category:'Games',       baseRate:13 }, { category:'Pet',        baseRate:13 },
  { category:'Ferramentas', baseRate:10 }, { category:'Livros',     baseRate:9  },
];

const TIER_DISCOUNTS: Record<SellerTier, number> = {
  Bronze: 0, Prata: -1, Ouro: -2, Diamante: -3,
};

const GMV_DAILY = [
  { day:'Seg', value:48200 }, { day:'Ter', value:52800 }, { day:'Qua', value:61400 },
  { day:'Qui', value:45900 }, { day:'Sex', value:78300 }, { day:'Sáb', value:89100 },
  { day:'Dom', value:67500 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtBRL(v: number) {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `R$${(v / 1_000).toFixed(0)}K`;
  return `R$${v}`;
}

function fmtBRLFull(v: number) {
  return `R$ ${v.toLocaleString('pt-BR')}`;
}

// ─── Color maps ───────────────────────────────────────────────────────────────

const TIER_C: Record<SellerTier, { bg: string; text: string; border: string }> = {
  Bronze:   { bg:'rgba(180,120,60,0.15)',  text:'#cd7f32', border:'rgba(180,120,60,0.35)' },
  Prata:    { bg:'rgba(160,160,180,0.15)', text:'#a8a9ad', border:'rgba(160,160,180,0.35)' },
  Ouro:     { bg:'rgba(212,175,55,0.15)',  text:'#d4af37', border:'rgba(212,175,55,0.35)' },
  Diamante: { bg:'rgba(79,110,247,0.15)',  text:'#818cf8', border:'rgba(79,110,247,0.35)' },
};

const STATUS_C: Record<SellerStatus, { dot: string; label: string }> = {
  Ativo:    { dot:'#22c55e', label:'rgba(34,197,94,0.75)' },
  Pendente: { dot:'#f59e0b', label:'rgba(245,158,11,0.75)' },
  Suspenso: { dot:'#ef4444', label:'rgba(239,68,68,0.75)' },
};

const PAYOUT_C: Record<PayoutStatus, { Icon: React.ElementType; bg: string; text: string; border: string }> = {
  Pendente:    { Icon: Clock,        bg:'rgba(245,158,11,0.1)', text:'#f59e0b', border:'rgba(245,158,11,0.2)' },
  Processando: { Icon: Zap,          bg:'rgba(6,182,212,0.1)',  text:'#06b6d4', border:'rgba(6,182,212,0.2)'  },
  Concluído:   { Icon: Check,        bg:'rgba(34,197,94,0.1)',  text:'#22c55e', border:'rgba(34,197,94,0.2)'  },
  Falha:       { Icon: AlertCircle,  bg:'rgba(239,68,68,0.1)',  text:'#ef4444', border:'rgba(239,68,68,0.2)'  },
};

// ─── Atoms ────────────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: SellerTier }) {
  const c = TIER_C[tier];
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {tier}
    </span>
  );
}

function StatusDot({ status }: { status: SellerStatus }) {
  const c = STATUS_C[status];
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
      <span className="text-xs font-medium" style={{ color: c.label }}>{status}</span>
    </div>
  );
}

function PayoutBadge({ status }: { status: PayoutStatus }) {
  const { Icon, bg, text, border } = PAYOUT_C[status];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
      style={{ background: bg, color: text, border: `1px solid ${border}` }}>
      <Icon size={10} />{status}
    </span>
  );
}

function Delta({ value }: { value: number }) {
  const pos = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${pos ? 'text-emerald-400' : 'text-red-400'}`}>
      {pos ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function Avatar({ name, tier }: { name: string; tier: SellerTier }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const c = TIER_C[tier];
  return (
    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {initials}
    </div>
  );
}

// ─── GMV Chart (SVG) ──────────────────────────────────────────────────────────

function GMVChart() {
  const max   = Math.max(...GMV_DAILY.map(d => d.value));
  const W     = 400;
  const H     = 96;
  const LH    = 20;
  const cols  = GMV_DAILY.length;
  const colW  = W / cols;
  const barW  = colW * 0.52;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + LH}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="nexumBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F6EF7" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#4F6EF7" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="nexumBarPeak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
          <stop offset="100%" stopColor="#4F6EF7" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* grid lines */}
      {[0.25, 0.5, 0.75, 1].map(p => (
        <line key={p} x1={0} y1={H * (1 - p)} x2={W} y2={H * (1 - p)}
          stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      ))}
      {GMV_DAILY.map((d, i) => {
        const barH   = (d.value / max) * H;
        const x      = i * colW + (colW - barW) / 2;
        const y      = H - barH;
        const isPeak = d.value === max;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={3}
              fill={isPeak ? 'url(#nexumBarPeak)' : 'url(#nexumBar)'} />
            {isPeak && (
              <text x={x + barW / 2} y={y - 5} textAnchor="middle"
                fontSize={8} fill="#06b6d4" fontFamily="system-ui" fontWeight="700">
                {fmtBRL(d.value)}
              </text>
            )}
            <text x={x + barW / 2} y={H + LH - 2} textAnchor="middle"
              fontSize={9} fill="rgba(255,255,255,0.22)" fontFamily="system-ui">
              {d.day}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Seller Drawer ────────────────────────────────────────────────────────────

function SellerDrawer({ seller, onClose }: { seller: Seller; onClose: () => void }) {
  const history = PAYOUTS.filter(p => p.sellerId === seller.id);
  const tc = TIER_C[seller.tier];

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type:'spring', damping:30, stiffness:280 }}
      className="absolute top-0 right-0 bottom-0 flex flex-col z-20 border-l overflow-hidden"
      style={{ width:340, background:'#0E1318', borderColor:'rgba(255,255,255,0.06)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0"
        style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <p className="text-white font-bold text-sm">Vendedor</p>
        <button onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors">
          <X size={14} className="text-white/40" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth:'none' }}>

        {/* Identity */}
        <div className="px-6 py-5 border-b" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shrink-0"
              style={{ background:tc.bg, color:tc.text, border:`1px solid ${tc.border}` }}>
              {seller.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">{seller.name}</p>
              <p className="text-white/35 text-xs mt-0.5">{seller.store}</p>
            </div>
            <TierBadge tier={seller.tier} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 text-xs font-bold">★ {seller.rating}</span>
            <StatusDot status={seller.status} />
            <span className="text-white/20 text-[10px] ml-auto">Desde {seller.joinDate}</span>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-px" style={{ background:'rgba(255,255,255,0.04)' }}>
          {[
            { label:'GMV / mês',   value:fmtBRL(seller.gmv),             extra:<Delta value={seller.gmvDelta} /> },
            { label:'Comissão ef.', value:`${seller.commission}%`,        extra:<span className="text-white/25 text-[10px]">este mês</span> },
            { label:'Produtos',    value:seller.products.toLocaleString(), extra:<span className="text-white/25 text-[10px]">ativos</span> },
            { label:'Categoria',   value:seller.category,                 extra:null },
          ].map((k, i) => (
            <div key={i} className="px-4 py-4 flex flex-col gap-1.5" style={{ background:'#0E1318' }}>
              <p className="text-white/25 text-[9px] font-bold uppercase tracking-widest">{k.label}</p>
              <p className="text-white font-black text-xl font-mono leading-none">{k.value}</p>
              {k.extra}
            </div>
          ))}
        </div>

        {/* Payout history */}
        <div className="px-6 py-5">
          <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-3">Histórico de Liquidações</p>
          {history.length === 0 ? (
            <p className="text-white/20 text-xs">Nenhum registro encontrado.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map(p => (
                <div key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.05)' }}>
                  <div>
                    <p className="text-white/65 text-xs font-mono font-bold">{fmtBRLFull(p.net)}</p>
                    <p className="text-white/25 text-[10px] mt-0.5">{p.date}</p>
                  </div>
                  <PayoutBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewView({ onSellerSelect }: { onSellerSelect: (s: Seller) => void }) {
  const totalGMV     = SELLERS.reduce((s, v) => s + v.gmv, 0);
  const totalComm    = PAYOUTS.reduce((s, p) => s + p.commission, 0);
  const activeCount  = SELLERS.filter(s => s.status === 'Ativo').length;
  const avgComm      = (SELLERS.reduce((s, v) => s + v.commission, 0) / SELLERS.length).toFixed(1);
  const pending      = PAYOUTS.filter(p => p.status === 'Pendente');
  const pendingValue = pending.reduce((s, p) => s + p.net, 0);
  const topSellers   = [...SELLERS].sort((a, b) => b.gmv - a.gmv).slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-6" style={{ scrollbarWidth:'none' }}>

      {/* Status strip */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-6 border"
        style={{ background:'rgba(245,158,11,0.05)', borderColor:'rgba(245,158,11,0.18)' }}>
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <p className="text-amber-400/75 text-xs font-medium">
          Próxima liquidação em lote: <strong className="text-amber-400 font-bold">3 dias</strong>
          {' '}— {pending.length} vendedores · {fmtBRL(pendingValue)} a processar
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'GMV do Mês',          value:fmtBRL(totalGMV),  sub:'+14.2%', pos:true  },
          { label:'Comissões a Receber', value:fmtBRL(totalComm), sub:'+11.8%', pos:true  },
          { label:'Vendedores Ativos',   value:String(activeCount), sub:'1 pendente de aprovação', pos:null },
          { label:'Comissão Média',      value:`${avgComm}%`,     sub:'taxa líquida efetiva',      pos:null },
        ].map((k, i) => (
          <div key={i} className="p-5 rounded-2xl border flex flex-col gap-2"
            style={{ background:'#131920', borderColor:'rgba(255,255,255,0.05)' }}>
            <p className="text-white/25 text-[9px] font-bold uppercase tracking-widest">{k.label}</p>
            <p className="text-white font-black text-3xl font-mono leading-none">{k.value}</p>
            <p className={`text-[10px] font-semibold ${k.pos === true ? 'text-emerald-400' : 'text-white/25'}`}>
              {k.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Content columns */}
      <div className="grid gap-4" style={{ gridTemplateColumns:'3fr 2fr' }}>

        {/* Left */}
        <div className="flex flex-col gap-4">
          {/* Chart */}
          <div className="p-5 rounded-2xl border" style={{ background:'#131920', borderColor:'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-semibold text-sm">GMV Diário</p>
              <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest">últimos 7 dias</span>
            </div>
            <GMVChart />
          </div>

          {/* Top sellers */}
          <div className="p-5 rounded-2xl border" style={{ background:'#131920', borderColor:'rgba(255,255,255,0.05)' }}>
            <p className="text-white font-semibold text-sm mb-1">Top Vendedores</p>
            <p className="text-white/25 text-[10px] mb-4">por volume GMV este mês</p>
            <div>
              {topSellers.map((s, i) => (
                <div key={s.id} onClick={() => onSellerSelect(s)}
                  className="flex items-center gap-3 py-3 -mx-5 px-5 hover:bg-white/[0.02] cursor-pointer transition-colors group border-b last:border-0"
                  style={{ borderColor:'rgba(255,255,255,0.04)' }}>
                  <span className="text-white/12 font-mono font-black text-sm w-4 shrink-0 text-right" style={{ color:'rgba(255,255,255,0.12)' }}>{i + 1}</span>
                  <Avatar name={s.name} tier={s.tier} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/75 text-xs font-semibold truncate group-hover:text-white transition-colors">{s.store}</p>
                    <p className="text-white/25 text-[10px] truncate">{s.name}</p>
                  </div>
                  <TierBadge tier={s.tier} />
                  <p className="text-white font-mono font-black text-sm w-16 text-right">{fmtBRL(s.gmv)}</p>
                  <Delta value={s.gmvDelta} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          {/* Pending payouts */}
          <div className="p-5 rounded-2xl border" style={{ background:'#131920', borderColor:'rgba(255,255,255,0.05)' }}>
            <p className="text-white font-semibold text-sm mb-4">Liquidações Pendentes</p>
            <div>
              {pending.map(p => (
                <div key={p.id} className="flex items-center justify-between py-3 border-b last:border-0"
                  style={{ borderColor:'rgba(255,255,255,0.04)' }}>
                  <div>
                    <p className="text-white/70 text-xs font-semibold">{p.store}</p>
                    <p className="text-white/25 text-[10px]">{p.date}</p>
                  </div>
                  <p className="text-white/80 font-mono font-black text-sm">{fmtBRL(p.net)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="p-5 rounded-2xl border" style={{ background:'#131920', borderColor:'rgba(255,255,255,0.05)' }}>
            <p className="text-white font-semibold text-sm mb-4">Alertas</p>
            <div className="flex flex-col gap-4">
              {[
                { color:'#ef4444', title:'Rodrigo Alves — liquidação com falha', sub:'Verificar dados bancários do vendedor' },
                { color:'#f59e0b', title:'Pedro Santos — aprovação pendente', sub:'Documentação enviada há 5 dias' },
                { color:'#4F6EF7', title:'Juliana Pinto — GMV +31.5%', sub:'Elegível para upgrade de tier' },
              ].map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-0.5 rounded-full shrink-0 mt-0.5" style={{ background:a.color, minHeight:32 }} />
                  <div>
                    <p className="text-white/70 text-[11px] font-semibold leading-tight">{a.title}</p>
                    <p className="text-white/25 text-[10px] mt-0.5">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Vendedores ───────────────────────────────────────────────────────────────

function VendedoresView({ onSellerSelect }: { onSellerSelect: (s: Seller) => void }) {
  const [search,      setSearch]      = useState('');
  const [statusF,     setStatusF]     = useState('Todos');
  const [tierF,       setTierF]       = useState('Todos');

  const statuses = ['Todos', 'Ativo', 'Pendente', 'Suspenso'];
  const tiers    = ['Todos', 'Bronze', 'Prata', 'Ouro', 'Diamante'];

  const filtered = SELLERS.filter(s => {
    const q = search.toLowerCase();
    return (
      (s.name.toLowerCase().includes(q) || s.store.toLowerCase().includes(q)) &&
      (statusF === 'Todos' || s.status === statusF) &&
      (tierF   === 'Todos' || s.tier   === tierF)
    );
  });

  const cols = '2fr 1fr 1.2fr 80px 80px 1fr 56px';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b shrink-0"
        style={{ background:'#080C10', borderColor:'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 flex-1"
          style={{ background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)' }}>
          <Search size={12} className="text-white/20 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar vendedor ou loja..."
            className="flex-1 bg-transparent text-xs text-white/70 outline-none placeholder:text-white/20" />
        </div>

        <div className="flex items-center gap-px p-1 rounded-xl border"
          style={{ background:'#131920', borderColor:'rgba(255,255,255,0.06)' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusF(s)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={{ background:statusF === s ? '#4F6EF7' : 'transparent', color:statusF === s ? '#fff' : 'rgba(255,255,255,0.3)' }}>
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-px p-1 rounded-xl border"
          style={{ background:'#131920', borderColor:'rgba(255,255,255,0.06)' }}>
          {tiers.map(t => (
            <button key={t} onClick={() => setTierF(t)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={{ background:tierF === t ? '#4F6EF7' : 'transparent', color:tierF === t ? '#fff' : 'rgba(255,255,255,0.3)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table head */}
      <div className="grid items-center px-6 py-2.5 shrink-0"
        style={{ gridTemplateColumns:cols, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'#0E1318' }}>
        {['Vendedor','Tier','GMV / Mês','Comissão','Produtos','Status',''].map(h => (
          <p key={h} className="text-white/20 text-[9px] font-bold uppercase tracking-widest">{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth:'none' }}>
        {filtered.map((s, i) => (
          <div key={s.id} onClick={() => onSellerSelect(s)}
            className="grid items-center px-6 py-3.5 border-b cursor-pointer hover:bg-white/[0.018] transition-colors group"
            style={{
              gridTemplateColumns: cols,
              borderColor: 'rgba(255,255,255,0.03)',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.009)',
            }}>
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={s.name} tier={s.tier} />
              <div className="min-w-0">
                <p className="text-white/80 text-xs font-semibold truncate group-hover:text-white transition-colors">{s.store}</p>
                <p className="text-white/25 text-[10px] truncate">{s.name}</p>
              </div>
            </div>
            <TierBadge tier={s.tier} />
            <div>
              <p className="text-white/85 text-sm font-mono font-black">{fmtBRL(s.gmv)}</p>
              <Delta value={s.gmvDelta} />
            </div>
            <p className="text-white/65 text-sm font-mono font-bold">{s.commission}%</p>
            <p className="text-white/45 text-sm font-mono">{s.products}</p>
            <StatusDot status={s.status} />
            <button className="flex items-center gap-0.5 text-white/20 hover:text-indigo-400 text-[10px] font-bold transition-colors">
              Ver<ChevronRight size={10} />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <p className="text-white/20 text-sm">Nenhum vendedor encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Comissões ────────────────────────────────────────────────────────────────

function ComissoesView() {
  const [mode, setMode] = useState<'padrao' | 'personalizada'>('padrao');
  const tiers: SellerTier[] = ['Bronze', 'Prata', 'Ouro', 'Diamante'];

  return (
    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-6" style={{ scrollbarWidth:'none' }}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-sm">Rules Engine de Comissões</h2>
          <p className="text-white/25 text-[10px] mt-0.5">Taxas calculadas por categoria × tier do vendedor</p>
        </div>
        <div className="flex items-center gap-px p-1 rounded-xl border"
          style={{ background:'#131920', borderColor:'rgba(255,255,255,0.06)' }}>
          {(['padrao','personalizada'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={{ background:mode===m ? '#4F6EF7' : 'transparent', color:mode===m ? '#fff' : 'rgba(255,255,255,0.35)' }}>
              {m === 'padrao' ? 'Regras Padrão' : 'Personalizadas'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'padrao' ? (
        <>
          {/* Tier discount cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {tiers.map(tier => {
              const disc = TIER_DISCOUNTS[tier];
              const c    = TIER_C[tier];
              return (
                <div key={tier} className="p-5 rounded-2xl border"
                  style={{ background:'#131920', borderColor:`${c.border}` }}>
                  <TierBadge tier={tier} />
                  <p className="font-black text-3xl font-mono mt-4 leading-none"
                    style={{ color: disc < 0 ? c.text : 'rgba(255,255,255,0.4)' }}>
                    {disc === 0 ? '+0%' : `${disc}%`}
                  </p>
                  <p className="text-white/25 text-[10px] mt-1.5">desconto sobre taxa base</p>
                </div>
              );
            })}
          </div>

          {/* Matrix */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
            {/* Head */}
            <div className="grid px-5 py-3 border-b"
              style={{ gridTemplateColumns:'1fr repeat(4, 90px)', background:'#0E1318', borderColor:'rgba(255,255,255,0.06)' }}>
              <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">Categoria</p>
              {tiers.map(t => (
                <p key={t} className="text-[9px] font-bold uppercase tracking-widest text-right"
                  style={{ color:TIER_C[t].text }}>{t}</p>
              ))}
            </div>

            {COMMISSION_RULES.map((rule, i) => {
              const rates = tiers.map(t => rule.baseRate + TIER_DISCOUNTS[t]);
              const min   = Math.min(...rates);
              return (
                <div key={rule.category} className="grid items-center px-5 py-3.5 border-b last:border-0"
                  style={{
                    gridTemplateColumns: '1fr repeat(4, 90px)',
                    borderColor: 'rgba(255,255,255,0.04)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}>
                  <div>
                    <p className="text-white/70 text-xs font-semibold">{rule.category}</p>
                    <p className="text-white/25 text-[10px]">Base {rule.baseRate}%</p>
                  </div>
                  {tiers.map((tier, ti) => {
                    const eff  = rates[ti];
                    const best = eff === min;
                    return (
                      <p key={tier} className="text-right font-mono font-black text-sm"
                        style={{ color: best ? TIER_C[tier].text : 'rgba(255,255,255,0.45)' }}>
                        {eff}%
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Personalized */
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
          <div className="grid px-5 py-3 border-b"
            style={{ gridTemplateColumns:'2fr 1fr 1fr 2fr', background:'#0E1318', borderColor:'rgba(255,255,255,0.06)' }}>
            {['Vendedor','Taxa Padrão','Taxa Customizada','Motivo'].map(h => (
              <p key={h} className="text-white/20 text-[9px] font-bold uppercase tracking-widest">{h}</p>
            ))}
          </div>
          {[
            { store:'TechZone',   std:'12%', custom:'9%',  reason:'Contrato especial — alto volume garantido' },
            { store:'EduBooks',   std:'9%',  custom:'7%',  reason:'Parceria estratégica com editoras' },
            { store:'FashionHub', std:'18%', custom:'16%', reason:'Meta de GMV atingida — Q4 2025' },
          ].map((r, i) => (
            <div key={i} className="grid items-center px-5 py-4 border-b last:border-0"
              style={{ gridTemplateColumns:'2fr 1fr 1fr 2fr', borderColor:'rgba(255,255,255,0.04)' }}>
              <div>
                <p className="text-white/75 text-xs font-semibold">{r.store}</p>
                <p className="text-white/25 text-[10px]">Regra personalizada</p>
              </div>
              <p className="text-white/30 text-sm font-mono">{r.std}</p>
              <p className="text-indigo-400 text-sm font-mono font-black">{r.custom}</p>
              <p className="text-white/30 text-xs">{r.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Liquidações ──────────────────────────────────────────────────────────────

function LiquidacoesView() {
  const [modal,    setModal]    = useState(false);
  const [success,  setSuccess]  = useState(false);
  const pending      = PAYOUTS.filter(p => p.status === 'Pendente');
  const pendingTotal = pending.reduce((s, p) => s + p.net, 0);
  const cols = '2fr 1fr 1fr 1fr 1fr 1fr';

  const handleConfirm = () => {
    setSuccess(true);
    setTimeout(() => { setModal(false); setSuccess(false); }, 1600);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0"
        style={{ background:'#080C10', borderColor:'rgba(255,255,255,0.05)' }}>
        <div>
          <p className="text-white font-bold text-sm">Liquidações</p>
          <p className="text-white/25 text-[10px]">Ciclo atual · Março 2026</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
          style={{ background:'linear-gradient(135deg, #4F6EF7, #06b6d4)' }}>
          <Zap size={12} />Processar Lote ({pending.length})
        </button>
      </div>

      {/* Head */}
      <div className="grid px-6 py-2.5 shrink-0"
        style={{ gridTemplateColumns:cols, background:'#0E1318', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        {['Vendedor','Bruto','Comissão','Líquido','Status','Data'].map(h => (
          <p key={h} className="text-white/20 text-[9px] font-bold uppercase tracking-widest">{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth:'none' }}>
        {PAYOUTS.map((p, i) => {
          const s = SELLERS.find(v => v.id === p.sellerId)!;
          return (
            <div key={p.id} className="grid items-center px-6 py-4 border-b"
              style={{
                gridTemplateColumns: cols,
                borderColor: 'rgba(255,255,255,0.03)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.009)',
              }}>
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={p.sellerName} tier={s.tier} />
                <div className="min-w-0">
                  <p className="text-white/80 text-xs font-semibold truncate">{p.store}</p>
                  <p className="text-white/25 text-[10px] truncate">{p.sellerName}</p>
                </div>
              </div>
              <p className="text-white/45 text-sm font-mono">{fmtBRL(p.gross)}</p>
              <p className="text-red-400/60 text-sm font-mono">−{fmtBRL(p.commission)}</p>
              <p className="text-white/85 text-sm font-mono font-black">{fmtBRL(p.net)}</p>
              <PayoutBadge status={p.status} />
              <p className="text-white/25 text-xs font-mono">{p.date}</p>
            </div>
          );
        })}
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)' }}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              transition={{ type:'spring', damping:25, stiffness:300 }}
              className="p-8 rounded-3xl border max-w-sm w-full mx-4"
              style={{ background:'#131920', borderColor:'rgba(255,255,255,0.08)' }}>

              {success ? (
                <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
                  className="flex flex-col items-center gap-3 py-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background:'rgba(34,197,94,0.15)' }}>
                    <Check size={24} className="text-emerald-400" />
                  </div>
                  <p className="text-white font-black text-base">Lote processado!</p>
                  <p className="text-white/35 text-sm text-center">{pending.length} liquidações enviadas para processamento.</p>
                </motion.div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background:'rgba(79,110,247,0.12)' }}>
                    <Zap size={20} className="text-indigo-400" />
                  </div>
                  <h3 className="text-white font-black text-base mb-2">Processar Lote de Liquidações</h3>
                  <p className="text-white/40 text-sm mb-6">
                    {pending.length} vendedores serão liquidados no valor total de{' '}
                    <strong className="text-white">{fmtBRLFull(pendingTotal)}</strong>.
                    Esta ação não pode ser desfeita.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setModal(false)}
                      className="flex-1 py-3 rounded-xl border text-white/45 text-sm font-semibold hover:text-white/80 transition-all"
                      style={{ borderColor:'rgba(255,255,255,0.08)' }}>
                      Cancelar
                    </button>
                    <button onClick={handleConfirm}
                      className="flex-1 py-3 rounded-xl text-white text-sm font-black transition-all hover:opacity-90"
                      style={{ background:'linear-gradient(135deg, #4F6EF7, #06b6d4)' }}>
                      Confirmar
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV: { view: View; Icon: React.ElementType; label: string }[] = [
  { view:'overview',    Icon:LayoutDashboard, label:'Overview'    },
  { view:'vendedores',  Icon:Users,           label:'Vendedores'  },
  { view:'comissoes',   Icon:Percent,         label:'Comissões'   },
  { view:'liquidacoes', Icon:Wallet,          label:'Liquidações' },
];

function Sidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <div className="flex flex-col shrink-0 border-r"
      style={{ width:216, background:'#0E1318', borderColor:'rgba(255,255,255,0.05)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b shrink-0"
        style={{ borderColor:'rgba(255,255,255,0.05)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background:'linear-gradient(135deg, #4F6EF7, #06b6d4)' }}>
          <TrendingUp size={14} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black text-sm leading-none">Nexum</p>
          <p className="text-white/20 text-[9px] leading-none mt-0.5 uppercase tracking-wider">Marketplace Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {NAV.map(({ view: v, Icon, label }) => {
          const active = view === v;
          return (
            <button key={v} onClick={() => setView(v)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-full transition-all"
              style={{
                background: active ? 'rgba(79,110,247,0.12)' : 'transparent',
                color:      active ? '#818cf8' : 'rgba(255,255,255,0.32)',
              }}>
              <Icon size={15} />
              <span className="text-xs font-semibold">{label}</span>
              {active && (
                <span className="ml-auto w-1 h-4 rounded-full shrink-0"
                  style={{ background:'#4F6EF7' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
            style={{ background:'linear-gradient(135deg, #4F6EF7, #06b6d4)' }}>
            AN
          </div>
          <div className="min-w-0">
            <p className="text-white/65 text-[11px] font-semibold truncate">Admin Nexum</p>
            <p className="text-white/25 text-[9px] truncate">admin@nexum.exemplo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Market Data ─────────────────────────────────────────────────────────────

type AppMode     = 'admin' | 'market';
type MarketScreen = 'listing' | 'detail' | 'cart';

interface MarketProduct {
  id: string; name: string; price: number; originalPrice?: number;
  seller: string; sellerTier: SellerTier; category: string;
  rating: number; reviews: number; gradient: string;
  description: string; badge?: string; specs: string[];
}

interface CartItem { product: MarketProduct; qty: number }

const MARKET_PRODUCTS: MarketProduct[] = [
  { id:'mp01', name:'Headphone Pro X1',            price:899,  originalPrice:1199, seller:'TechZone',       sellerTier:'Diamante', category:'Eletrônicos', rating:4.8, reviews:1243, badge:'Mais Vendido',
    gradient:'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)',
    description:'Som premium com cancelamento de ruído ativo, 40h de bateria e conexão aptX HD.',
    specs:['Cancelamento ativo de ruído','40h de autonomia','Bluetooth 5.3','Microfone duplo'] },
  { id:'mp02', name:'Jaqueta Trench Coat Clássica', price:349,                     seller:'FashionHub',     sellerTier:'Ouro',     category:'Moda',        rating:4.7, reviews:892,  badge:'Novo',
    gradient:'linear-gradient(135deg,#831843 0%,#be185d 50%,#db2777 100%)',
    description:'Gabardine impermeável, forro acetinado e corte estruturado. Do P ao GG.',
    specs:['Gabardine impermeável','Forro acetinado','Cinto removível','P ao GG'] },
  { id:'mp03', name:'Kit Especiarias Artesanais',  price:189,                     seller:'GourmetBox',     sellerTier:'Ouro',     category:'Alimentos',   rating:4.9, reviews:2108,
    gradient:'linear-gradient(135deg,#78350f 0%,#b45309 50%,#d97706 100%)',
    description:'12 especiarias de origem controlada, sem conservantes. Blend exclusivo de chef.',
    specs:['12 especiarias','Origem controlada','Sem conservantes','Embalagem sustentável'] },
  { id:'mp04', name:'Sérum Vitamina C 30ml',       price:249,                     seller:'BeautyPro',      sellerTier:'Ouro',     category:'Beleza',      rating:4.9, reviews:3450, badge:'Top Avaliado',
    gradient:'linear-gradient(135deg,#4a044e 0%,#86198f 50%,#a21caf 100%)',
    description:'20% de Vitamina C pura, ácido ferúlico e vitamina E. Combate manchas em 28 dias.',
    specs:['20% Vitamina C','Ácido ferúlico','Vitamina E','Dermat. testado'] },
  { id:'mp05', name:'Tênis Runner Ultra 2.0',      price:590,  originalPrice:720,  seller:'SportWorld',     sellerTier:'Prata',    category:'Esportes',    rating:4.6, reviews:678,
    gradient:'linear-gradient(135deg,#0c4a6e 0%,#0369a1 50%,#0ea5e9 100%)',
    description:'Amortecimento reactivo e solado antiderrapante carbono. Para corridas e treinos.',
    specs:['Espuma reactiva','Solado carbono','Upper respirável','265g'] },
  { id:'mp06', name:'Kit Montessori Criativo',     price:149,                     seller:'KidsZone',       sellerTier:'Bronze',   category:'Infantil',    rating:4.8, reviews:1102,
    gradient:'linear-gradient(135deg,#064e3b 0%,#059669 50%,#10b981 100%)',
    description:'48 peças em madeira certificada para coordenação e criatividade. 3–8 anos.',
    specs:['48 peças madeira','Cert. INMETRO','Tintas atóxicas','3 a 8 anos'] },
  { id:'mp07', name:'Câmera de Ré HD Wireless',    price:320,                     seller:'AutoParts BR',   sellerTier:'Prata',    category:'Automotivo',  rating:4.4, reviews:334,
    gradient:'linear-gradient(135deg,#1c1917 0%,#44403c 50%,#78716c 100%)',
    description:'1080p, 170°, visão noturna e transmissão WiFi para Android/iOS.',
    specs:['1080p full HD','Ângulo 170°','Visão noturna','WiFi sem fio'] },
  { id:'mp08', name:'Cama Ortopédica Pet M',       price:220,                     seller:'PetShop Plus',   sellerTier:'Prata',    category:'Pet',         rating:4.7, reviews:889,
    gradient:'linear-gradient(135deg,#134e4a 0%,#0d9488 50%,#14b8a6 100%)',
    description:'Espuma viscoelástica ortopédica, capa removível e lavável. Até 15kg.',
    specs:['Viscoelástica','Capa lavável','Até 15kg','60×45cm'] },
  { id:'mp09', name:'Pack Bestsellers 2025',       price:199,                     seller:'EduBooks',       sellerTier:'Diamante', category:'Livros',      rating:4.9, reviews:4210, badge:'Exclusivo',
    gradient:'linear-gradient(135deg,#2e1065 0%,#6d28d9 50%,#7c3aed 100%)',
    description:'Curadoria dos 5 títulos mais vendidos em gestão, tech e comportamento. Ed. especial.',
    specs:['5 títulos','Edição especial','Marca-páginas','Caixa presente'] },
  { id:'mp10', name:'Furadeira de Impacto 800W',  price:480,  originalPrice:599,  seller:'FerramentasMax', sellerTier:'Bronze',   category:'Ferramentas', rating:4.3, reviews:178,
    gradient:'linear-gradient(135deg,#431407 0%,#c2410c 50%,#ea580c 100%)',
    description:'800W, mandril 13mm, 2 velocidades reversíveis e maleta de transporte.',
    specs:['800W','Mandril 13mm','2 velocidades','Maleta inclusa'] },
];

const MARKET_CATS = ['Todos','Eletrônicos','Moda','Beleza','Esportes','Alimentos','Infantil','Livros','Pet','Automotivo','Ferramentas'];

// ─── Market Components ────────────────────────────────────────────────────────

function MarketNavbar({ cartCount, cartTotal, onCart, onHome }: {
  cartCount: number; cartTotal: number; onCart: () => void; onHome: () => void;
}) {
  return (
    <div className="shrink-0 flex items-center gap-4 px-6 border-b"
      style={{ background:'#080C10', borderColor:'rgba(255,255,255,0.07)', height:52 }}>

      {/* Brand */}
      <button onClick={onHome} className="flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background:'linear-gradient(135deg,#4F6EF7,#06b6d4)' }}>
          <TrendingUp size={12} className="text-white" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-white font-black text-sm tracking-tight">Nexum</span>
          <span className="text-white/25 font-medium text-[10px] tracking-[0.2em] uppercase">Market</span>
        </div>
      </button>

      <div className="w-px h-4 shrink-0" style={{ background:'rgba(255,255,255,0.1)' }} />

      {/* Search */}
      <div className="flex-1 flex items-center gap-2.5 px-4 py-2 rounded-xl"
        style={{ background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.07)' }}>
        <Search size={12} className="text-white/25 shrink-0" />
        <span className="text-white/18 text-[13px] flex-1" style={{ color:'rgba(255,255,255,0.2)' }}>
          Buscar produtos, lojas e categorias
        </span>
        <span className="text-[9px] font-mono text-white/15 border border-white/10 rounded px-1.5 py-0.5 shrink-0">⌘K</span>
      </div>

      {/* Cart */}
      <button onClick={onCart}
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all shrink-0"
        style={{
          background: cartCount > 0 ? 'rgba(79,110,247,0.14)' : 'rgba(255,255,255,0.055)',
          border: `1px solid ${cartCount > 0 ? 'rgba(79,110,247,0.35)' : 'rgba(255,255,255,0.07)'}`,
        }}>
        <div className="relative">
          <ShoppingCart size={14} style={{ color: cartCount > 0 ? '#818cf8' : 'rgba(255,255,255,0.45)' }} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white"
              style={{ background:'#4F6EF7' }}>{cartCount}</span>
          )}
        </div>
        {cartCount > 0
          ? <span className="text-indigo-400 text-xs font-bold">R${cartTotal.toLocaleString('pt-BR',{minimumFractionDigits:0})}</span>
          : <span className="text-xs font-semibold" style={{ color:'rgba(255,255,255,0.35)' }}>Carrinho</span>
        }
      </button>
    </div>
  );
}

// Hero featured card
function MarketHeroCard({ product, onSelect, onAddCart }: {
  product: MarketProduct; onSelect: () => void; onAddCart: () => void;
}) {
  return (
    <div onClick={onSelect}
      className="rounded-3xl overflow-hidden cursor-pointer group transition-all hover:shadow-2xl"
      style={{ background:'#fff', boxShadow:'0 2px 20px rgba(0,0,0,0.07)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'42% 1fr' }}>
        {/* Gradient side */}
        <div className="relative overflow-hidden" style={{ height:188, background: product.gradient }}>
          <div className="absolute -bottom-14 -right-14 w-52 h-52 rounded-full" style={{ background:'rgba(255,255,255,0.08)' }} />
          <div className="absolute top-8 right-8 w-24 h-24 rounded-full"        style={{ background:'rgba(255,255,255,0.05)' }} />
          <div className="absolute -top-6 left-8 w-16 h-16 rounded-full"        style={{ background:'rgba(255,255,255,0.06)' }} />
          <div className="absolute inset-0"
            style={{ background:'linear-gradient(135deg, rgba(0,0,0,0.04) 0%, transparent 50%, rgba(0,0,0,0.18) 100%)' }} />
          {product.badge && (
            <span className="absolute top-4 left-4 text-[9px] font-black px-2.5 py-1 rounded-full"
              style={{ background:'rgba(255,255,255,0.92)', color:'#0A0A0A', backdropFilter:'blur(4px)' }}>
              {product.badge}
            </span>
          )}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background:'rgba(0,0,0,0.38)', backdropFilter:'blur(8px)' }}>
            <span className="text-yellow-300 text-[11px]">★</span>
            <span className="text-white text-[11px] font-bold">{product.rating}</span>
            <span className="text-white/40 text-[9px]">({product.reviews.toLocaleString('pt-BR')})</span>
          </div>
        </div>
        {/* Info side */}
        <div className="flex flex-col justify-between px-7 py-6 border-l" style={{ borderColor:'#F0F0F5' }}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                style={{ background:TIER_C[product.sellerTier].bg, color:TIER_C[product.sellerTier].text }}>
                {product.sellerTier}
              </span>
              <span className="text-[#9CA3AF] text-[11px] font-medium">{product.seller}</span>
              <span className="text-[#D1D5DB] text-[10px] mx-1">·</span>
              <span className="text-[#9CA3AF] text-[10px]">{product.category}</span>
            </div>
            <h2 className="text-[#0A0A0A] font-black text-xl leading-tight mb-2">{product.name}</h2>
            <p className="text-[#7B7B8D] text-xs leading-relaxed line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-[#0A0A0A] font-black text-2xl font-mono leading-none">
                R${product.price.toLocaleString('pt-BR')}
              </p>
              {product.originalPrice && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[#C4C4CE] text-xs line-through font-mono">R${product.originalPrice.toLocaleString('pt-BR')}</p>
                  <span className="text-emerald-500 text-[9px] font-black">
                    -{Math.round((1-product.price/product.originalPrice)*100)}%
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); onAddCart(); }}
                className="px-4 py-2.5 rounded-xl text-xs font-black text-white transition-all hover:opacity-90"
                style={{ background:'linear-gradient(135deg,#4F6EF7,#6366f1)' }}>
                + Adicionar
              </button>
              <button onClick={e => { e.stopPropagation(); onSelect(); }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all hover:border-indigo-400/40 hover:text-indigo-500"
                style={{ borderColor:'#E8E8EF', color:'#7B7B8D' }}>
                Ver produto →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product grid card
function MarketProductCard({ product, onSelect, onAddCart, inCart }: {
  product: MarketProduct; onSelect: () => void; onAddCart: () => void; inCart: boolean;
}) {
  return (
    <div onClick={onSelect}
      className="rounded-2xl overflow-hidden cursor-pointer group transition-all"
      style={{ background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.04)' }}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height:192, background: product.gradient }}>
        {/* Geometric decor */}
        <div className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full" style={{ background:'rgba(255,255,255,0.07)' }} />
        <div className="absolute top-5 right-5 w-18 h-18 rounded-full"          style={{ background:'rgba(255,255,255,0.05)', width:72, height:72 }} />
        <div className="absolute -top-5 left-5 w-14 h-14 rounded-full"          style={{ background:'rgba(255,255,255,0.06)' }} />
        {/* Bottom overlay */}
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.3) 100%)' }} />
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[9px] font-black px-2 py-0.5 rounded-full"
            style={{ background:'rgba(255,255,255,0.92)', color:'#0A0A0A' }}>
            {product.badge}
          </span>
        )}
        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-0.5 rounded-full"
          style={{ background:'rgba(0,0,0,0.36)', backdropFilter:'blur(6px)' }}>
          <span className="text-yellow-300 text-[10px]">★</span>
          <span className="text-white text-[10px] font-bold">{product.rating}</span>
        </div>
        {/* Hover CTA — slides up inside image */}
        <div className="absolute bottom-0 left-0 right-0 p-3 transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0">
          <button onClick={e => { e.stopPropagation(); onAddCart(); }}
            className="w-full py-2.5 rounded-xl text-[11px] font-black text-white"
            style={{
              background: inCart ? 'rgba(34,197,94,0.92)' : 'rgba(79,110,247,0.95)',
              backdropFilter: 'blur(4px)',
            }}>
            {inCart ? '✓ No carrinho' : '+ Adicionar ao carrinho'}
          </button>
        </div>
      </div>
      {/* Info strip */}
      <div className="px-4 pt-3.5 pb-4">
        <p className="text-[#0A0A0A] font-semibold text-[13px] leading-snug mb-2.5 line-clamp-1">{product.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0"
              style={{ background:TIER_C[product.sellerTier].bg, color:TIER_C[product.sellerTier].text }}>
              {product.sellerTier}
            </span>
            <span className="text-[#9CA3AF] text-[10px] truncate">{product.seller}</span>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[#0A0A0A] font-black text-[15px] font-mono leading-none">
              R${product.price.toLocaleString('pt-BR')}
            </p>
            {product.originalPrice && (
              <p className="text-[#C4C4CE] text-[9px] line-through font-mono leading-none mt-0.5">
                R${product.originalPrice.toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketListing({ onSelect, cart, onAddCart }: {
  onSelect: (p: MarketProduct) => void;
  cart: CartItem[];
  onAddCart: (p: MarketProduct) => void;
}) {
  const [cat, setCat] = useState('Todos');
  const filtered    = cat === 'Todos' ? MARKET_PRODUCTS : MARKET_PRODUCTS.filter(p => p.category === cat);
  const featured    = MARKET_PRODUCTS.find(p => p.badge) ?? MARKET_PRODUCTS[0];
  const gridProds   = filtered.filter(p => p.id !== featured.id);
  const showHero    = cat === 'Todos';

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background:'#F7F8FA' }}>
      {/* Category strip */}
      <div className="shrink-0 flex items-center gap-2 px-6 py-2.5 border-b overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth:'none', background:'#fff', borderColor:'#EBEBF0' }}>
        {MARKET_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shrink-0"
            style={{
              background: cat === c ? '#0A0A0A' : '#F4F4F7',
              color:      cat === c ? '#fff'    : '#7B7B8D',
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden px-6 py-6" style={{ scrollbarWidth:'none' }}>

        {/* Hero */}
        {showHero && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#0A0A0A] font-black text-sm">Destaque da semana</p>
              <p className="text-[#B0B0BC] text-[10px] font-medium">Mar 2026</p>
            </div>
            <MarketHeroCard
              product={featured}
              onSelect={() => onSelect(featured)}
              onAddCart={() => onAddCart(featured)} />
          </div>
        )}

        {/* Section heading */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[#0A0A0A] font-black text-sm">
            {cat === 'Todos' ? 'Todos os produtos' : cat}
          </p>
          <p className="text-[#B0B0BC] text-[10px] font-medium">
            {(showHero ? gridProds : filtered).length} produtos
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4">
          {(showHero ? gridProds : filtered).map(p => {
            const card = <MarketProductCard
              product={p}
              onSelect={() => onSelect(p)}
              onAddCart={() => onAddCart(p)}
              inCart={!!cart.find(i => i.product.id === p.id)} />;
            return <React.Fragment key={p.id}>{card}</React.Fragment>;
          })}
        </div>
      </div>
    </div>
  );
}

function MarketDetail({ product, cart, onBack, onAddCart, onCart }: {
  product: MarketProduct; cart: CartItem[];
  onBack: () => void; onAddCart: (p: MarketProduct) => void; onCart: () => void;
}) {
  const [qty,    setQty]    = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const inCart = cart.find(i => i.product.id === product.id);

  const REVIEWS = [
    { name:'Fernanda M.', rating:5, date:'08/03/2026', text:'Produto incrível, superou todas as expectativas. Entrega rápida e embalagem impecável!' },
    { name:'Carlos A.',   rating:5, date:'05/03/2026', text:'Qualidade premium, valeu cada centavo. Recomendo para quem busca o melhor.' },
    { name:'Juliana R.',  rating:4, date:'02/03/2026', text:'Muito bom, atendeu ao esperado. Só achei a embalagem um pouco simples para o preço.' },
  ];
  const opacities = [1.0, 0.62, 0.42];

  return (
    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth:'none', background:'#F7F8FA' }}>

      {/* Hero gradient — full width, cinematic */}
      <div className="relative w-full overflow-hidden" style={{ height:260, background: product.gradient }}>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full" style={{ background:'rgba(255,255,255,0.07)' }} />
        <div className="absolute top-10 right-32 w-28 h-28 rounded-full"       style={{ background:'rgba(255,255,255,0.05)' }} />
        <div className="absolute -top-8 left-24 w-36 h-36 rounded-full"        style={{ background:'rgba(255,255,255,0.045)' }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full -translate-x-1/2 translate-y-1/2" style={{ background:'rgba(255,255,255,0.04)' }} />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 40%, rgba(0,0,0,0.62) 100%)' }} />
        {/* Back */}
        <button onClick={onBack}
          className="absolute top-5 left-5 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white/80 hover:text-white text-xs font-bold transition-all"
          style={{ background:'rgba(0,0,0,0.38)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.14)' }}>
          <ArrowLeft size={13} />Voltar
        </button>
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-5 right-5 text-[9px] font-black px-2.5 py-1 rounded-full"
            style={{ background:'rgba(255,255,255,0.92)', color:'#0A0A0A' }}>
            {product.badge}
          </span>
        )}
        {/* Product title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-6">
          <p className="text-white/45 text-[10px] font-bold uppercase tracking-widest mb-1">{product.category}</p>
          <h1 className="text-white font-black text-2xl leading-tight" style={{ letterSpacing:'-0.01em' }}>{product.name}</h1>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-7">
        <div className="grid gap-8" style={{ gridTemplateColumns:'1fr 296px' }}>

          {/* Left */}
          <div className="flex flex-col gap-6">
            {/* Thumbnails */}
            <div className="flex gap-2.5">
              {opacities.map((op, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{
                    width:72, height:50,
                    background: product.gradient, opacity: op,
                    outline: activeImg === i ? '2px solid #4F6EF7' : '2px solid transparent',
                    outlineOffset: 2,
                  }} />
              ))}
            </div>

            {/* Description */}
            <div className="rounded-2xl p-5 border" style={{ background:'#fff', borderColor:'#EBEBF0' }}>
              <p className="text-[#0A0A0A] font-bold text-sm mb-2.5">Sobre o produto</p>
              <p className="text-[#7B7B8D] text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Specs grid */}
            <div className="rounded-2xl p-5 border" style={{ background:'#fff', borderColor:'#EBEBF0' }}>
              <p className="text-[#0A0A0A] font-bold text-sm mb-3">Especificações</p>
              <div className="grid grid-cols-2 gap-2">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background:'#F7F8FA' }}>
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background:'rgba(79,110,247,0.1)' }}>
                      <Check size={10} className="text-indigo-500" />
                    </div>
                    <p className="text-[#374151] text-[11px] font-medium">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#0A0A0A] font-bold text-sm">Avaliações dos clientes</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="text-sm" style={{ color: i <= Math.floor(product.rating) ? '#FBBF24' : '#E5E7EB' }}>★</span>
                    ))}
                  </div>
                  <span className="text-[#0A0A0A] font-bold text-sm">{product.rating}</span>
                  <span className="text-[#9CA3AF] text-xs">({product.reviews.toLocaleString('pt-BR')})</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {REVIEWS.map((r, i) => (
                  <div key={i} className="p-4 rounded-2xl border" style={{ background:'#fff', borderColor:'#EBEBF0' }}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                          style={{ background:'linear-gradient(135deg,#4F6EF7,#06b6d4)' }}>
                          {r.name[0]}
                        </div>
                        <div>
                          <p className="text-[#0A0A0A] text-xs font-semibold">{r.name}</p>
                          <p className="text-[#B0B0BC] text-[9px]">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className="text-[11px]" style={{ color: s <= r.rating ? '#FBBF24' : '#E5E7EB' }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[#7B7B8D] text-xs leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — purchase panel */}
          <div className="flex flex-col gap-3">
            {/* Price card */}
            <div className="rounded-2xl p-5 border" style={{ background:'#fff', borderColor:'#EBEBF0' }}>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[#0A0A0A] font-black text-3xl font-mono leading-none">
                  R${product.price.toLocaleString('pt-BR')}
                </p>
                {product.originalPrice && (
                  <p className="text-[#C4C4CE] text-sm line-through font-mono">R${product.originalPrice.toLocaleString('pt-BR')}</p>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-emerald-500 text-[11px] font-black mb-3">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% de desconto
                </p>
              )}
              {/* Star row */}
              <div className="flex items-center gap-1.5 pb-4 mb-4 border-b" style={{ borderColor:'#F0F0F5' }}>
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{ color: i <= Math.floor(product.rating) ? '#FBBF24' : '#E5E7EB' }}>★</span>
                  ))}
                </div>
                <span className="text-[#B0B0BC] text-xs ml-0.5">{product.rating} · {product.reviews.toLocaleString('pt-BR')} avaliações</span>
              </div>

              {/* Qty */}
              <p className="text-[#B0B0BC] text-[9px] font-bold uppercase tracking-widest mb-2">Quantidade</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2.5 border rounded-xl px-3 py-2" style={{ borderColor:'#EBEBF0' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-[#B0B0BC] hover:text-[#0A0A0A] transition-colors">
                    <Minus size={13} />
                  </button>
                  <span className="text-[#0A0A0A] font-black text-sm w-5 text-center font-mono">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="text-[#B0B0BC] hover:text-[#0A0A0A] transition-colors">
                    <Plus size={13} />
                  </button>
                </div>
                <p className="text-[#22c55e] text-xs font-semibold">Em estoque</p>
              </div>

              {/* CTA */}
              <button onClick={() => { onAddCart(product); onCart(); }}
                className="w-full py-3.5 rounded-xl text-white font-black text-sm transition-all hover:opacity-90 mb-2"
                style={{ background:'linear-gradient(135deg,#4F6EF7,#6366f1)' }}>
                {inCart ? '→ Ver carrinho' : '+ Adicionar ao carrinho'}
              </button>
              <button className="w-full py-3 rounded-xl border text-xs font-semibold transition-all"
                style={{ borderColor:'#EBEBF0', color:'#9CA3AF' }}>
                ♡ Salvar na lista de desejos
              </button>
            </div>

            {/* Seller */}
            <div className="rounded-2xl p-4 border" style={{ background:'#fff', borderColor:'#EBEBF0' }}>
              <p className="text-[#B0B0BC] text-[9px] font-bold uppercase tracking-widest mb-3">Vendido por</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                  style={{ background:TIER_C[product.sellerTier].bg, color:TIER_C[product.sellerTier].text }}>
                  {product.seller.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[#0A0A0A] text-sm font-bold leading-tight">{product.seller}</p>
                  <TierBadge tier={product.sellerTier} />
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="rounded-2xl p-4 border" style={{ background:'#fff', borderColor:'#EBEBF0' }}>
              {[
                { icon:'📦', text:'Frete grátis em pedidos acima de R$500' },
                { icon:'↩', text:'Devolução grátis em até 30 dias' },
                { icon:'🔒', text:'Compra 100% segura e garantida' },
              ].map((g, i) => (
                <div key={i} className={`flex items-center gap-3 ${i < 2 ? 'pb-3 mb-3 border-b' : ''}`}
                  style={{ borderColor:'#F5F5F8' }}>
                  <span className="text-base shrink-0">{g.icon}</span>
                  <p className="text-[#7B7B8D] text-[11px] leading-snug">{g.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketCart({ cart, onUpdateQty, onRemove, onBack }: {
  cart: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
}) {
  const [success,  setSuccess]  = useState(false);
  const [orderNum] = useState(() => Math.floor(10000 + Math.random() * 90000));
  const subtotal   = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const frete      = subtotal >= 500 ? 0 : 29.90;
  const total      = subtotal + frete;
  const progress   = Math.min(subtotal / 500 * 100, 100);

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5" style={{ background:'#F7F8FA' }}>
        <motion.div initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ type:'spring', damping:14, stiffness:180 }}
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
          style={{ background:'linear-gradient(135deg,#4F6EF7,#06b6d4)', boxShadow:'0 16px 48px rgba(79,110,247,0.35)' }}>
          <Check size={34} className="text-white" strokeWidth={2.5} />
        </motion.div>
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          className="text-center">
          <p className="text-[#0A0A0A] font-black text-2xl mb-1" style={{ letterSpacing:'-0.02em' }}>Pedido confirmado!</p>
          <p className="text-[#7B7B8D] text-sm mt-1">
            Pedido <strong className="text-[#0A0A0A] font-mono">#{orderNum}</strong>
          </p>
          <p className="text-[#B0B0BC] text-xs mt-0.5">Entrega estimada: 3–5 dias úteis</p>
        </motion.div>
        <motion.button initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.42 }}
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
          style={{ background:'linear-gradient(135deg,#4F6EF7,#6366f1)' }}>
          Continuar comprando
        </motion.button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4" style={{ background:'#F7F8FA' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background:'#EBEBF0' }}>
          <Package size={28} style={{ color:'#C4C4CE' }} />
        </div>
        <div className="text-center">
          <p className="text-[#0A0A0A] font-bold text-sm">Seu carrinho está vazio</p>
          <p className="text-[#B0B0BC] text-xs mt-0.5">Explore nossos produtos</p>
        </div>
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background:'linear-gradient(135deg,#4F6EF7,#6366f1)' }}>
          Ver produtos
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth:'none', background:'#F7F8FA' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b"
        style={{ background:'#fff', borderColor:'#EBEBF0' }}>
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-[#7B7B8D] hover:text-[#0A0A0A] text-xs font-semibold transition-colors">
          <ArrowLeft size={13} />Continuar comprando
        </button>
        <p className="text-[#0A0A0A] font-bold text-sm">
          Carrinho <span className="text-[#B0B0BC] font-normal">({cart.length})</span>
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Free shipping progress */}
        {subtotal < 500 && (
          <div className="mb-5 p-4 rounded-2xl border" style={{ background:'#fff', borderColor:'#EBEBF0' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#0A0A0A] text-xs font-semibold">Frete grátis</p>
              <p className="text-[#4F6EF7] text-xs font-bold">
                faltam R${(500 - subtotal).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'#F0F0F5' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width:`${progress}%`, background:'linear-gradient(90deg,#4F6EF7,#06b6d4)' }} />
            </div>
          </div>
        )}

        <div className="grid gap-5" style={{ gridTemplateColumns:'1fr 300px' }}>
          {/* Items */}
          <div className="flex flex-col gap-3">
            {cart.map(({ product: p, qty }) => (
              <div key={p.id} className="flex gap-4 p-4 rounded-2xl border transition-all"
                style={{ background:'#fff', borderColor:'#EBEBF0' }}>
                {/* Gradient thumbnail */}
                <div className="w-16 h-16 rounded-xl shrink-0 overflow-hidden" style={{ background: p.gradient }}>
                  <div className="w-full h-full" style={{ background:'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 60%)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#0A0A0A] text-xs font-semibold leading-tight truncate">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background:TIER_C[p.sellerTier].bg, color:TIER_C[p.sellerTier].text }}>
                      {p.sellerTier}
                    </span>
                    <span className="text-[#B0B0BC] text-[10px] truncate">{p.seller}</span>
                  </div>
                  <p className="text-[#0A0A0A] font-black text-sm font-mono mt-1.5">
                    R${(p.price * qty).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <button onClick={() => onRemove(p.id)}
                    className="text-[#E0E0E8] hover:text-red-400 transition-colors p-0.5">
                    <X size={13} />
                  </button>
                  <div className="flex items-center gap-1.5 border rounded-xl px-2 py-1.5"
                    style={{ borderColor:'#EBEBF0' }}>
                    <button onClick={() => onUpdateQty(p.id, Math.max(1, qty - 1))}
                      className="text-[#B0B0BC] hover:text-[#0A0A0A] transition-colors">
                      <Minus size={10} />
                    </button>
                    <span className="text-[#0A0A0A] font-bold text-xs w-4 text-center font-mono">{qty}</span>
                    <button onClick={() => onUpdateQty(p.id, qty + 1)}
                      className="text-[#B0B0BC] hover:text-[#0A0A0A] transition-colors">
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-3 h-fit">
            <div className="p-5 rounded-2xl border" style={{ background:'#fff', borderColor:'#EBEBF0' }}>
              <p className="text-[#0A0A0A] font-bold text-sm mb-4">Resumo</p>
              <div className="flex flex-col gap-2.5 pb-4 mb-4 border-b" style={{ borderColor:'#F0F0F5' }}>
                <div className="flex justify-between text-xs">
                  <span className="text-[#7B7B8D]">Subtotal ({cart.reduce((s,i)=>s+i.qty,0)} itens)</span>
                  <span className="text-[#0A0A0A] font-mono font-semibold">R${subtotal.toLocaleString('pt-BR',{minimumFractionDigits:2})}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#7B7B8D]">Frete</span>
                  <span className={`font-semibold ${frete === 0 ? 'text-emerald-500' : 'font-mono text-[#0A0A0A]'}`}>
                    {frete === 0 ? '🎉 Grátis' : `R$${frete.toFixed(2).replace('.',',')}`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-5">
                <span className="text-[#0A0A0A] font-bold text-sm">Total</span>
                <span className="text-[#0A0A0A] font-black text-xl font-mono">R${total.toLocaleString('pt-BR',{minimumFractionDigits:2})}</span>
              </div>
              <button onClick={() => setSuccess(true)}
                className="w-full py-3.5 rounded-xl text-white text-sm font-black transition-all hover:opacity-90"
                style={{ background:'linear-gradient(135deg,#4F6EF7,#6366f1)' }}>
                Finalizar pedido
              </button>
            </div>
            <div className="p-4 rounded-2xl border" style={{ background:'#fff', borderColor:'#EBEBF0' }}>
              {['🔒 Pagamento seguro','↩ Devolução grátis em 30 dias','📦 Rastreio em tempo real'].map((t,i) => (
                <p key={i} className={`text-[#9CA3AF] text-[10px] ${i < 2 ? 'mb-2' : ''}`}>{t}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Market Root ──────────────────────────────────────────────────────────────

function MarketMode() {
  const [screen,  setScreen]  = useState<MarketScreen>('listing');
  const [product, setProduct] = useState<MarketProduct | null>(null);
  const [cart,    setCart]    = useState<CartItem[]>([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = (p: MarketProduct) => {
    setCart(c => {
      const ex = c.find(i => i.product.id === p.id);
      return ex ? c.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { product: p, qty: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => setCart(c => c.map(i => i.product.id === id ? { ...i, qty } : i));
  const removeItem = (id: string) => setCart(c => c.filter(i => i.product.id !== id));

  const goHome = () => { setScreen('listing'); setProduct(null); };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <MarketNavbar cartCount={cartCount} cartTotal={cartTotal} onCart={() => setScreen('cart')} onHome={goHome} />
      <AnimatePresence mode="wait">
        <motion.div key={screen} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.15 }} className="flex-1 flex flex-col overflow-hidden">
          {screen === 'listing' && (
            <MarketListing
              onSelect={p => { setProduct(p); setScreen('detail'); }}
              cart={cart} onAddCart={addToCart} />
          )}
          {screen === 'detail' && product && (
            <MarketDetail product={product} cart={cart}
              onBack={() => setScreen('listing')} onAddCart={addToCart} onCart={() => setScreen('cart')} />
          )}
          {screen === 'cart' && (
            <MarketCart cart={cart} onUpdateQty={updateQty} onRemove={removeItem} onBack={goHome} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function MarketplaceAdmin() {
  const [appMode,        setAppMode]        = useState<AppMode>('admin');
  const [view,           setView]           = useState<View>('overview');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const selectSeller = (s: Seller) => {
    setSelectedSeller(s);
    if (view !== 'vendedores') setView('vendedores');
  };

  const changeView = (v: View) => { setView(v); setSelectedSeller(null); };

  const PAGE_TITLES: Record<View, string> = {
    overview:'Overview', vendedores:'Vendedores', comissoes:'Comissões', liquidacoes:'Liquidações',
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden"
      style={{ background:'#080C10', fontFamily:'system-ui, -apple-system, sans-serif' }}>

      {/* Mode toggle strip */}
      <div className="flex items-center justify-center gap-1 shrink-0 border-b py-2"
        style={{ background:'#080C10', borderColor:'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-px p-1 rounded-xl border"
          style={{ background:'#131920', borderColor:'rgba(255,255,255,0.07)' }}>
          {([
            { mode:'admin'  as AppMode, label:'⚙ Admin',              },
            { mode:'market' as AppMode, label:'🛍 Vitrine do Comprador' },
          ]).map(({ mode, label }) => (
            <button key={mode} onClick={() => setAppMode(mode)}
              className="px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all"
              style={{
                background: appMode === mode ? '#4F6EF7' : 'transparent',
                color:      appMode === mode ? '#fff'    : 'rgba(255,255,255,0.35)',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {appMode === 'admin' ? (
          <motion.div key="admin" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.18 }} className="flex-1 flex overflow-hidden">
            <Sidebar view={view} setView={changeView} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center px-6 py-4 border-b shrink-0"
                style={{ background:'#080C10', borderColor:'rgba(255,255,255,0.05)' }}>
                <div>
                  <h1 className="text-white font-black text-base">{PAGE_TITLES[view]}</h1>
                  <p className="text-white/20 text-[10px]">Março 2026</p>
                </div>
              </div>
              <div className="flex-1 flex overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div key={view} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                    transition={{ duration:0.14 }} className="flex-1 flex flex-col overflow-hidden">
                    {view === 'overview'    && <OverviewView    onSellerSelect={selectSeller} />}
                    {view === 'vendedores'  && <VendedoresView  onSellerSelect={setSelectedSeller} />}
                    {view === 'comissoes'   && <ComissoesView />}
                    {view === 'liquidacoes' && <LiquidacoesView />}
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                  {selectedSeller && (
                    <SellerDrawer seller={selectedSeller} onClose={() => setSelectedSeller(null)} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="market" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.18 }} className="flex-1 flex overflow-hidden">
            <MarketMode />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
