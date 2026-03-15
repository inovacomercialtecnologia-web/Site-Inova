import React, { useState, useEffect, useRef } from 'react';
import {
  Home, MapPin, ClipboardList, User, Search, Star, Clock,
  Phone, MessageCircle, CheckCircle, Bike, CreditCard, Bell,
  Heart, LogOut, HelpCircle, ArrowRight, MapPinned, Award,
  ChevronRight, Shield, Gift, Trophy, Tag, Ticket, Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'inicio' | 'rastreamento' | 'pedidos' | 'perfil';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORY_GRID = [
  { label:'Restaurantes', emoji:'🍔', bg:'linear-gradient(145deg,#D91C27,#9B0E18)' },
  { label:'Farmácias',    emoji:'💊', bg:'linear-gradient(145deg,#7C3AED,#5B21B6)' },
  { label:'Corridas',     emoji:'🚗', bg:'linear-gradient(145deg,#27272A,#3F3F46)' },
  { label:'Promoções',    emoji:'🔥', bg:'linear-gradient(145deg,#D97706,#9A5500)' },
  { label:'Cupons',       emoji:'🎫', bg:'linear-gradient(145deg,#059669,#065F46)' },
  { label:'Ofertas',      emoji:'⚡', bg:'linear-gradient(145deg,#EA580C,#9A3412)' },
  { label:'Super',        emoji:'🛒', bg:'linear-gradient(145deg,#0284C7,#075985)' },
  { label:'Ver mais',     emoji:'···', bg:'linear-gradient(145deg,#2A2A2A,#1A1A1A)', dots:true },
];

const BANNERS = [
  { id:0, topLine:'100 DIAS', mainLine:'DE OFERTAS', sub:'tudo a partir de', price:'R$ 0,90', emoji:'🥟',
    bg:'linear-gradient(135deg,#EA1D2C 0%,#C41520 55%,#8B0F18 100%)' },
  { id:1, topLine:'FRETE', mainLine:'GRÁTIS', sub:'em pedidos acima de', price:'R$ 25,00', emoji:'🍕',
    bg:'linear-gradient(135deg,#059669 0%,#047857 55%,#065F46 100%)' },
  { id:2, topLine:'CASHBACK', mainLine:'5% de volta', sub:'com o', price:'Clube Pro ✨', emoji:'💰',
    bg:'linear-gradient(135deg,#D97706 0%,#B45309 55%,#92400E 100%)' },
];

const RESTAURANTS_BR = [
  { id:'r1', name:'Casa de Mainha', sub:'Brasileira', rating:4.8, time:'30–45 min', coupon:'R$ 20', emoji:'🏚', photoBg:'linear-gradient(145deg,#1A0A00,#0D0500)', status:'Fechado' },
  { id:'r2', name:'Batata Delivery', sub:'Batatas',    rating:4.9, time:'25–40 min', coupon:'R$ 6',  emoji:'🥔', photoBg:'linear-gradient(145deg,#111111,#0A0A0A)', status:'Fechado' },
  { id:'r3', name:'Pesqueiro',       sub:'Frutos do Mar', rating:4.7, time:'40–60 min', coupon:'R$ 15', emoji:'🐟', photoBg:'linear-gradient(145deg,#00150A,#000D06)', status:'Aberto' },
  { id:'r4', name:'Sabor da Vovó',   sub:'Caseira',    rating:4.6, time:'35–50 min', coupon:'',     emoji:'🍲', photoBg:'linear-gradient(145deg,#0A0510,#050208)', status:'Aberto' },
];

const RESTAURANTS_POP = [
  { id:'p1', name:"McDonald's",   sub:'Fast Food', rating:4.5, time:'20–30 min', coupon:'R$ 5',  emoji:'🍔', photoBg:'linear-gradient(145deg,#1A1000,#0D0800)', status:'Aberto' },
  { id:'p2', name:'Sushi Leblon', sub:'Japonês',   rating:4.9, time:'40–55 min', coupon:'',      emoji:'🍱', photoBg:'linear-gradient(145deg,#00100A,#00080A)', status:'Aberto' },
  { id:'p3', name:'Burger King',  sub:'Burger',    rating:4.3, time:'25–35 min', coupon:'R$ 8',  emoji:'🍟', photoBg:'linear-gradient(145deg,#1A0800,#0D0400)', status:'Aberto' },
  { id:'p4', name:'Cão Véio',     sub:'Hotdog',    rating:4.7, time:'30–45 min', coupon:'R$ 4',  emoji:'🌭', photoBg:'linear-gradient(145deg,#030A00,#010500)', status:'Aberto' },
];

const SUB_CATS = [
  { label:'Promoções',    emoji:'🎉', bg:'#EA1D2C' },
  { label:'Doces & Bolos',emoji:'🎂', bg:'#D97706' },
  { label:'Lanches',      emoji:'🍔', bg:'#E11D48' },
  { label:'Açaí',         emoji:'🫐', bg:'#7C3AED' },
  { label:'Pizza',        emoji:'🍕', bg:'#C2410C' },
];

const REWARDS = [
  { emoji:'🍕', done:true },
  { emoji:'🍔', done:true },
  { emoji:'🌭', done:false, active:true },
  { emoji:'🍣', done:false },
  { emoji:'🥇', done:false },
];

const ORDER_HISTORY = [
  { name:'Spoleto',      sub:'Italiano',   date:'08 Mar', value:67.80,  emoji:'🍝', color:'#C0392B' },
  { name:'Sushi Leblon', sub:'Japonês',    date:'05 Mar', value:124.50, emoji:'🍱', color:'#16A085' },
  { name:'Burger King',  sub:'Fast Food',  date:'01 Mar', value:39.90,  emoji:'🍟', color:'#E67E22' },
  { name:'Outback',      sub:'Americano',  date:'25 Fev', value:89.00,  emoji:'🥩', color:'#D4770C' },
  { name:"McDonald's",   sub:'Fast Food',  date:'20 Fev', value:42.30,  emoji:'🍔', color:'#F5A623' },
];

// ─── Route Map ────────────────────────────────────────────────────────────────

function RouteMap() {
  const [t, setT] = useState(0);
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const a = setInterval(() => setT(p => p >= 100 ? 0 : p + 0.4), 40);
    const b = setInterval(() => setPulse(p => (p + 1) % 100), 30);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  const prog = t / 100;
  const x = (1-prog)*(1-prog)*40 + 2*(1-prog)*prog*170 + prog*prog*300;
  const y = (1-prog)*(1-prog)*115 + 2*(1-prog)*prog*20 + prog*prog*70;
  const pr = 6 + (pulse < 50 ? pulse * 0.14 : (100-pulse) * 0.14);
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/[0.06]"
      style={{ height:160, background:'linear-gradient(160deg,#0A0A12,#120808,#0A0A0A)' }}>
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 360 160" preserveAspectRatio="none">
        {[0,1,2,3,4,5].map(i=><line key={`h${i}`} x1="0" y1={i*32} x2="360" y2={i*32} stroke="white" strokeWidth="0.8"/>)}
        {[0,1,2,3,4,5,6,7,8,9].map(i=><line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="160" stroke="white" strokeWidth="0.8"/>)}
      </svg>
      <svg className="absolute inset-0 w-full h-full opacity-[0.10]" viewBox="0 0 360 160">
        <text x="50" y="138" fill="white" fontSize="7" fontFamily="monospace">PINHEIROS</text>
        <text x="175" y="48" fill="white" fontSize="7" fontFamily="monospace">JARDINS</text>
        <text x="255" y="98" fill="white" fontSize="7" fontFamily="monospace">PAULISTA</text>
      </svg>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 160">
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EA1D2C" stopOpacity="0.9"/>
            <stop offset="70%" stopColor="#FF6B35" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.1"/>
          </linearGradient>
          <filter id="gl"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <path d="M 40 115 Q 170 20 300 70" fill="none" stroke="#FF6B35" strokeWidth="10" opacity="0.07"/>
        <path d="M 40 115 Q 170 20 300 70" fill="none" stroke="url(#rg)" strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" filter="url(#gl)"/>
        <circle cx="40" cy="115" r={pr+9} fill="none" stroke="#EA1D2C" strokeWidth="0.8" opacity="0.12"/>
        <circle cx="40" cy="115" r={pr+4} fill="none" stroke="#EA1D2C" strokeWidth="1.2" opacity="0.22"/>
        <circle cx="40" cy="115" r="6" fill="#EA1D2C" opacity="0.95"/>
        <circle cx="40" cy="115" r="3" fill="white"/>
        <circle cx="300" cy="70" r={pr+8} fill="none" stroke="#FF6B35" strokeWidth="0.8" opacity="0.13"/>
        <circle cx="300" cy="70" r={pr+3} fill="none" stroke="#FF6B35" strokeWidth="1.2" opacity="0.28"/>
        <circle cx={x} cy={y} r="13" fill="#FF6B35" opacity="0.18"/>
        <circle cx={x} cy={y} r="8" fill="#0A0A0A" stroke="#FF6B35" strokeWidth="1.5"/>
      </svg>
      <div className="absolute text-[12px] pointer-events-none"
        style={{ left:x, top:y, transform:'translate(-50%,-50%)', filter:'drop-shadow(0 0 7px #FF6B35)' }}>🛵</div>
      <div className="absolute" style={{ left:288, top:43 }}>
        <MapPin size={17} fill="#FF6B35" className="text-[#FF6B35]" style={{ filter:'drop-shadow(0 0 8px #FF6B35)' }}/>
        <div className="text-[8px] text-white/35 text-center whitespace-nowrap -ml-2.5 mt-0.5">Você</div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/75 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse"/>
        <span className="text-white text-[10px] font-bold tracking-wide">Em rota · Chega em ~20 min</span>
      </div>
    </div>
  );
}

// ─── Restaurant Card ──────────────────────────────────────────────────────────

function RestCard({ r }: { r: typeof RESTAURANTS_BR[0] }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="flex-shrink-0 w-[138px] rounded-2xl overflow-hidden border border-white/[0.06]" style={{ background:'#111' }}>
      {/* Photo */}
      <div className="relative h-[120px]" style={{ background: r.photoBg }}>
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 10px)' }}/>
        {/* Emoji */}
        <div className="absolute inset-0 flex items-center justify-center text-[44px]" style={{ filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.8))' }}>
          {r.emoji}
        </div>
        {/* Rating badge */}
        {r.status === 'Aberto' && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Star size={9} fill="#F5A623" className="text-[#F5A623]"/>
            <span className="text-white text-[10px] font-bold">{r.rating}</span>
          </div>
        )}
        {/* Heart */}
        <button onClick={() => setLiked(l => !l)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center border border-white/10"
          style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)' }}>
          <Heart size={13} fill={liked ? '#EA1D2C' : 'none'} className={liked ? 'text-[#EA1D2C]' : 'text-white/60'}/>
        </button>
        {/* Closed overlay */}
        {r.status === 'Fechado' && (
          <div className="absolute inset-0 bg-black/55 flex items-end pb-2 pl-2">
            <span className="text-white/70 text-[9px] font-bold uppercase tracking-wider">Fechado</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="px-2.5 pt-2.5 pb-2">
        <p className="text-white text-xs font-bold leading-tight truncate">{r.name}</p>
        <p className="text-white/35 text-[10px] mt-0.5">{r.sub}</p>
        <div className="flex items-center gap-1 mt-1">
          <Clock size={9} className="text-white/25"/>
          <span className="text-white/35 text-[9px]">{r.time}</span>
        </div>
        {r.coupon && (
          <div className="flex items-center gap-1 mt-1.5 bg-[#D97706]/12 border border-[#D97706]/20 rounded-lg px-2 py-1">
            <Tag size={9} className="text-[#D97706]"/>
            <span className="text-[#D97706] text-[9px] font-bold">Cupom de {r.coupon}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── InicioView ───────────────────────────────────────────────────────────────

function InicioView() {
  const [banner, setBanner] = useState(0);
  const [filterActive, setFilterActive] = useState('Restaurantes');

  useEffect(() => {
    const id = setInterval(() => setBanner(b => (b + 1) % BANNERS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const b = BANNERS[banner];

  return (
    <div className="pb-4">

      {/* ── Top bar ─────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <button className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1.5">
          <MapPin size={11} className="text-[#EA1D2C]" fill="#EA1D2C"/>
          <span className="text-white text-xs font-bold">R. das Flores, 142</span>
          <span className="text-[#EA1D2C] text-[10px] font-bold">▾</span>
        </button>
        <div className="relative">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.07]" style={{ background:'rgba(255,255,255,0.04)' }}>
            <Bell size={16} className="text-white/60"/>
          </div>
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-[#EA1D2C] border border-[#0A0A0A] flex items-center justify-center">
            <span className="text-[9px] text-white font-bold px-0.5">3</span>
          </span>
        </div>
      </div>

      {/* ── Greeting + Coupon ───────────────────── */}
      <div className="flex items-center justify-between px-4 mb-4">
        <p className="text-white font-bold text-[17px]">Olá, Rafael 👋</p>
        <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border border-[#7C3AED]/30" style={{ background:'rgba(124,58,237,0.12)' }}>
          <Ticket size={11} className="text-[#A78BFA]"/>
          <span className="text-[#A78BFA] text-[10px] font-bold">Cupons até R$ 10</span>
        </button>
      </div>

      {/* ── Category Grid 4×2 ───────────────────── */}
      <div className="grid grid-cols-4 gap-2 px-4 mb-4">
        {CATEGORY_GRID.map(cat => (
          <button key={cat.label} className="flex flex-col items-center gap-1.5 group">
            <div className="w-full aspect-square rounded-2xl flex items-center justify-center text-[24px] relative overflow-hidden transition-transform group-active:scale-95"
              style={{ background: cat.bg, boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
              {/* Sheen */}
              <div className="absolute inset-0 opacity-30" style={{ background:'linear-gradient(145deg,rgba(255,255,255,0.2) 0%,transparent 60%)' }}/>
              {(cat as any).dots
                ? <span className="text-white/70 text-[20px] font-bold leading-none mb-1">···</span>
                : <span className="relative z-10 leading-none" style={{ filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{cat.emoji}</span>
              }
            </div>
            <span className="text-white/70 text-[9.5px] font-semibold text-center leading-tight">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ── Hero Carousel ────────────────────────── */}
      <div className="mx-4 mb-4 rounded-3xl overflow-hidden relative" style={{ height:145 }}>
        <AnimatePresence mode="wait">
          <motion.div key={b.id} initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
            transition={{ duration:0.35, ease:'easeOut' }}
            className="absolute inset-0" style={{ background: b.bg }}>
            {/* Pattern */}
            <div className="absolute inset-0" style={{ background:'radial-gradient(circle at 80% 50%,rgba(255,255,255,0.12) 0%,transparent 55%)' }}/>
            <div className="absolute inset-0" style={{ backgroundImage:'repeating-linear-gradient(135deg,rgba(0,0,0,0.04) 0px,rgba(0,0,0,0.04) 1px,transparent 1px,transparent 12px)' }}/>
            {/* Content */}
            <div className="relative h-full flex items-center px-5 gap-3">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 bg-black/25 rounded-full px-2.5 py-0.5 mb-2">
                  <Flame size={9} className="text-yellow-300"/>
                  <span className="text-white/90 text-[9px] font-bold uppercase tracking-wide">Oferta limitada</span>
                </div>
                <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest leading-none">{b.topLine}</p>
                <p className="text-white font-black text-[22px] leading-tight" style={{ textShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>{b.mainLine}</p>
                <p className="text-white/60 text-[10px] mt-0.5">{b.sub}</p>
                <p className="text-white font-black text-[16px] leading-tight mt-0.5" style={{ textShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>{b.price}</p>
              </div>
              <div className="text-[70px] leading-none flex-shrink-0" style={{ filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}>
                {b.emoji}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Dots */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {BANNERS.map((_,i) => (
            <button key={i} onClick={() => setBanner(i)}
              className="transition-all rounded-full"
              style={{ width: banner === i ? 16 : 6, height:6, background: banner === i ? 'white' : 'rgba(255,255,255,0.35)' }}/>
          ))}
        </div>
      </div>

      {/* ── Filter Pills ─────────────────────────── */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
        {['Restaurantes','Farmácias','Corridas','Supermercado','Petshop'].map(f => {
          const active = filterActive === f;
          return (
            <button key={f} onClick={() => setFilterActive(f)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all border"
              style={{
                background: active ? '#EA1D2C' : 'rgba(255,255,255,0.04)',
                borderColor: active ? '#EA1D2C' : 'rgba(255,255,255,0.08)',
                color: active ? 'white' : 'rgba(255,255,255,0.5)',
                boxShadow: active ? '0 4px 16px #EA1D2C40' : 'none',
              }}>
              {f}
            </button>
          );
        })}
      </div>

      {/* ── Restaurant Section: Culinária Brasileira ── */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <p className="text-white font-bold text-[14px]">Culinária Brasileira</p>
          <button className="text-[#EA1D2C] text-[11px] font-bold flex items-center gap-0.5">
            Ver mais <ChevronRight size={12}/>
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
          {RESTAURANTS_BR.map(r => <RestCard key={r.id} r={r}/>)}
        </div>
      </div>

      {/* ── Sub-categories ───────────────────────── */}
      <div className="mb-4">
        <div className="flex gap-3 px-4 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
          {SUB_CATS.map(s => (
            <button key={s.label} className="flex-shrink-0 flex flex-col items-center gap-1.5 group">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-[26px] border border-white/[0.07] transition-transform group-active:scale-95"
                style={{ background:`${s.bg}22`, boxShadow:`0 4px 16px ${s.bg}30` }}>
                {s.emoji}
              </div>
              <span className="text-white/55 text-[9.5px] font-semibold text-center leading-tight w-16 truncate">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Mais Populares ───────────────────────── */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <p className="text-white font-bold text-[14px]">Mais populares</p>
          <button className="text-[#EA1D2C] text-[11px] font-bold flex items-center gap-0.5">
            Ver mais <ChevronRight size={12}/>
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
          {RESTAURANTS_POP.map(r => <RestCard key={r.id} r={r}/>)}
        </div>
      </div>

      {/* ── Gamification Strip ───────────────────── */}
      <div className="mx-4 rounded-3xl p-4 border border-white/[0.07]" style={{ background:'rgba(255,255,255,0.025)' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-white font-bold text-[13px] leading-tight">Ganhe descontos ao fazer pedidos</p>
            <p className="text-white/40 text-[10px] mt-0.5">Use agora 50% off · 20 dias para resgatar</p>
          </div>
          <ChevronRight size={16} className="text-white/25 flex-shrink-0 mt-0.5"/>
        </div>
        <div className="flex items-center gap-0">
          {REWARDS.map((r, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] transition-all border`}
                  style={{
                    background: r.done ? 'rgba(234,29,44,0.15)' : r.active ? 'rgba(234,29,44,0.25)' : 'rgba(255,255,255,0.04)',
                    borderColor: r.done ? '#EA1D2C40' : r.active ? '#EA1D2C60' : 'rgba(255,255,255,0.07)',
                    boxShadow: r.active ? '0 0 16px #EA1D2C50' : 'none',
                    filter: r.done || r.active ? 'none' : 'grayscale(0.8) opacity(0.4)',
                  }}>
                  {r.emoji}
                </div>
              </div>
              {i < REWARDS.length - 1 && (
                <div className="flex-1 h-px mx-0.5" style={{ background: r.done ? '#EA1D2C50' : 'rgba(255,255,255,0.08)' }}/>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-white/35 text-[10px]">3 de 5 pedidos concluídos</span>
          <span className="text-[#EA1D2C] text-[10px] font-bold">2 restantes →</span>
        </div>
      </div>

    </div>
  );
}

// ─── RastreamentoView ─────────────────────────────────────────────────────────

function RastreamentoView() {
  const steps = [
    { label:'Pedido confirmado', sub:'Recebido com sucesso', time:'20:14', done:true },
    { label:'Sendo preparado',   sub:'Na cozinha agora',     time:'20:18', done:true },
    { label:'Saiu para entrega', sub:'Carlos está a caminho',time:'20:32', done:false, active:true },
    { label:'Entregue',          sub:'Aproveite!',           time:'Prev. 20:52', done:false },
  ];
  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="pt-3 flex items-start justify-between">
        <div>
          <p className="text-white/40 text-[10px] font-medium mb-0.5 uppercase tracking-wider">McDonald's</p>
          <h2 className="text-white font-bold text-[20px] leading-none">Pedido #4821</h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border border-[#FF6B35]/25" style={{ background:'rgba(255,107,53,0.1)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse"/>
          <span className="text-[#FF6B35] text-[10px] font-bold">Em rota</span>
        </div>
      </div>
      <RouteMap/>
      <div className="rounded-3xl p-4 border border-white/[0.06]" style={{ background:'rgba(255,255,255,0.02)' }}>
        <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-4">Status do pedido</p>
        {steps.map((step, i) => {
          const col = step.done ? '#00A651' : (step as any).active ? '#FF6B35' : 'rgba(255,255,255,0.15)';
          return (
            <div key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: step.done ? '#00A651' : (step as any).active ? '#FF6B35' : 'rgba(255,255,255,0.05)',
                    boxShadow: (step as any).active ? '0 0 16px #FF6B3560' : step.done ? '0 0 10px #00A65140' : 'none',
                    border:`1px solid ${col}40` }}>
                  {step.done ? <CheckCircle size={14} className="text-white"/> : (step as any).active ? <Bike size={13} className="text-white"/> : <div className="w-2 h-2 rounded-full bg-white/20"/>}
                </div>
                {i < steps.length-1 && <div className="w-px flex-1 mt-1 mb-1 rounded-full min-h-[24px]" style={{ background: step.done ? 'linear-gradient(180deg,#00A651,#00A65140)' : 'rgba(255,255,255,0.06)' }}/>}
              </div>
              <div className="pb-5 flex-1 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold leading-none" style={{ color:col }}>{step.label}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{step.sub}</p>
                </div>
                <p className="text-white/30 text-[10px] font-medium flex-shrink-0 ml-2 mt-0.5">{step.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-3xl p-4 border border-white/[0.06]" style={{ background:'rgba(255,255,255,0.02)' }}>
        <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-3">Entregador</p>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border border-[#FF6B35]/20" style={{ background:'linear-gradient(135deg,#2A1A00,#1A1000)' }}>🧑</div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00A651] border-2 border-[#0A0A0A] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"/></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">Carlos M.</p>
            <p className="text-white/40 text-[10px]">Honda CG 160 · ABC-1234</p>
            <div className="flex items-center gap-1 mt-0.5">
              {[1,2,3,4,5].map(s=><Star key={s} size={9} fill="#F5A623" className="text-[#F5A623]"/>)}
              <span className="text-white/40 text-[9px] ml-1">4.9 · 2.847 entregas</span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center border border-[#00A651]/20" style={{ background:'rgba(0,166,81,0.08)' }}><Phone size={15} className="text-[#00A651]"/></button>
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center border border-[#FF6B35]/20" style={{ background:'rgba(255,107,53,0.08)' }}><MessageCircle size={15} className="text-[#FF6B35]"/></button>
          </div>
        </div>
      </div>
      <div className="rounded-3xl px-4 py-3.5 border border-white/[0.06] flex items-center gap-3" style={{ background:'rgba(255,255,255,0.02)' }}>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl border border-white/5 flex-shrink-0" style={{ background:'rgba(245,166,35,0.1)' }}>🍔</div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">X-Tudo + Batata Frita G</p>
          <p className="text-white/35 text-[10px]">McDonald's · 1 item</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white font-bold text-sm">R$ 48,90</p>
          <p className="text-white/30 text-[9px]">+ R$ 3,99 frete</p>
        </div>
      </div>
    </div>
  );
}

// ─── PedidosView ──────────────────────────────────────────────────────────────

function PedidosView() {
  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="pt-3">
        <h2 className="text-white font-bold text-[20px]">Meus Pedidos</h2>
        <p className="text-white/35 text-xs mt-0.5">1 pedido ativo · 5 anteriores</p>
      </div>
      <motion.div animate={{ boxShadow:['0 0 0px #EA1D2C00','0 0 24px #EA1D2C30','0 0 0px #EA1D2C00'] }}
        transition={{ repeat:Infinity, duration:2.5, ease:'easeInOut' }}
        className="rounded-3xl p-4 border border-[#EA1D2C]/25"
        style={{ background:'linear-gradient(135deg,#1C0203,#0F0101)' }}>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#EA1D2C] animate-pulse"/>
          <span className="text-[#EA1D2C] text-[10px] font-bold uppercase tracking-wider">Pedido ativo</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border border-white/5 flex-shrink-0" style={{ background:'rgba(245,166,35,0.1)' }}>🍔</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">McDonald's</p>
            <p className="text-white/50 text-xs">X-Tudo + Batata Frita G · R$ 48,90</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Bike size={11} className="text-[#FF6B35]"/>
              <p className="text-[#FF6B35] text-[10px] font-semibold">Em rota de entrega · 20:32</p>
            </div>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 text-white text-xs font-bold rounded-2xl py-3"
          style={{ background:'linear-gradient(135deg,#EA1D2C,#C41520)', boxShadow:'0 4px 16px #EA1D2C40' }}>
          Acompanhar pedido <ArrowRight size={13}/>
        </button>
      </motion.div>
      <div>
        <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-3">Histórico</p>
        <div className="space-y-2">
          {ORDER_HISTORY.map((order,i) => (
            <div key={i} className="rounded-2xl px-3 py-3 border border-white/[0.05] flex items-center gap-3" style={{ background:'rgba(255,255,255,0.02)' }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl border border-white/5 flex-shrink-0" style={{ background: order.color + '18' }}>{order.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-none mb-0.5">{order.name}</p>
                <p className="text-white/35 text-[10px]">{order.sub} · {order.date}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1,2,3,4,5].map(s=><Star key={s} size={9} fill={s<=4?'#F5A623':'rgba(255,255,255,0.1)'} className={s<=4?'text-[#F5A623]':'text-white/10'}/>)}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white text-xs font-bold mb-1">R$ {order.value.toFixed(2).replace('.',',')}</p>
                <div className="flex items-center gap-1 justify-end mb-1.5">
                  <CheckCircle size={9} className="text-[#00A651]"/>
                  <span className="text-[#00A651] text-[9px] font-semibold">Entregue</span>
                </div>
                <button className="text-[#EA1D2C] text-[9px] font-bold border border-[#EA1D2C]/25 rounded-lg px-2 py-0.5">Pedir novamente</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PerfilView ───────────────────────────────────────────────────────────────

function PerfilView() {
  const menuItems = [
    { icon:CreditCard, label:'Formas de pagamento', sub:'Visa •••• 4521' },
    { icon:Ticket,     label:'Meus cupons',          sub:'3 disponíveis' },
    { icon:Star,       label:'Minhas avaliações',    sub:'12 avaliações' },
    { icon:Bell,       label:'Notificações',          sub:'Ativadas' },
    { icon:HelpCircle, label:'Central de ajuda',      sub:'Suporte 24h' },
    { icon:LogOut,     label:'Sair', danger:true, sub:'' },
  ];
  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="pt-4 pb-2 flex flex-col items-center text-center relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(circle at 50% 0%,#EA1D2C15,transparent 55%)' }}/>
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl border border-[#EA1D2C]/20" style={{ background:'linear-gradient(135deg,#2A0505,#1A0303)', boxShadow:'0 0 40px #EA1D2C25' }}>👤</div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-xl bg-[#EA1D2C] flex items-center justify-center border-2 border-[#0A0A0A]"><Award size={12} className="text-white"/></div>
        </div>
        <p className="text-white font-bold text-lg leading-none mb-1">Rafael Mendes</p>
        <div className="flex items-center gap-1.5 bg-[#EA1D2C]/10 border border-[#EA1D2C]/20 rounded-full px-3 py-1">
          <span className="text-yellow-400 text-[10px]">👑</span>
          <span className="text-[#EA1D2C] text-[10px] font-bold">Clube iFood Pro · Ativo</span>
        </div>
      </div>
      <div className="rounded-3xl border border-white/[0.06] overflow-hidden" style={{ background:'rgba(255,255,255,0.02)' }}>
        <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
          {[{ val:'48',label:'Pedidos',icon:ClipboardList,color:'#EA1D2C'},{ val:'4',label:'Favoritos',icon:Heart,color:'#FF6B35'},{ val:'2022',label:'Membro desde',icon:Shield,color:'#00A651'}].map(s=>(
            <div key={s.label} className="flex flex-col items-center py-4 px-2">
              <s.icon size={14} style={{ color:s.color }} className="mb-1.5"/>
              <p className="text-white font-bold text-base leading-none">{s.val}</p>
              <p className="text-white/35 text-[9px] mt-0.5 text-center">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest">Endereços salvos</p>
        {[{ emoji:'🏠',label:'Casa',addr:'Rua das Flores, 142',city:'Pinheiros',color:'#EA1D2C'},{ emoji:'💼',label:'Trabalho',addr:'Av. Paulista, 1000',city:'Bela Vista',color:'#FF6B35'}].map(a=>(
          <div key={a.label} className="flex items-center gap-3 rounded-2xl px-3 py-3 border border-white/[0.05]" style={{ background:'rgba(255,255,255,0.02)' }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0" style={{ background:a.color+'18', border:`1px solid ${a.color}20` }}>{a.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold">{a.label}</p>
              <p className="text-white/40 text-[10px] truncate">{a.addr} · {a.city}</p>
            </div>
            <ChevronRight size={14} className="text-white/15 flex-shrink-0"/>
          </div>
        ))}
      </div>
      <div className="rounded-3xl p-4 relative overflow-hidden border border-[#EA1D2C]/15" style={{ background:'linear-gradient(135deg,#2A0008,#1A0005,#0F0003)' }}>
        <div className="absolute inset-0" style={{ background:'radial-gradient(circle at 80% 20%,#EA1D2C15,transparent 55%)' }}/>
        <div className="absolute right-4 top-3 text-4xl opacity-15 select-none">👑</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={13} className="text-[#EA1D2C]"/>
            <p className="text-[#EA1D2C] text-[10px] font-bold uppercase tracking-wider">Clube iFood Pro</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[{ icon:'🚚',label:'Frete grátis',sub:'ilimitado'},{ icon:'💸',label:'Cashback',sub:'5% em tudo'},{ icon:'⚡',label:'Suporte',sub:'prioritário'}].map(b=>(
              <div key={b.label} className="bg-white/5 rounded-2xl p-2 text-center">
                <div className="text-lg mb-0.5">{b.icon}</div>
                <p className="text-white text-[9px] font-bold leading-none">{b.label}</p>
                <p className="text-white/40 text-[8px]">{b.sub}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-2xl px-3 py-2">
            <p className="text-white/50 text-[10px]">✅ Ativo até 31/03/2026</p>
            <span className="text-[#EA1D2C] text-[10px] font-bold">Renovar</span>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/[0.05] overflow-hidden" style={{ background:'rgba(255,255,255,0.02)' }}>
        {menuItems.map((item,i)=>(
          <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/5 ${i<menuItems.length-1?'border-b border-white/[0.05]':''}`}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:(item as any).danger?'rgba(234,29,44,0.1)':'rgba(255,255,255,0.04)' }}>
              <item.icon size={15} style={{ color:(item as any).danger?'#EA1D2C':'rgba(255,255,255,0.4)' }}/>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium leading-none" style={{ color:(item as any).danger?'#EA1D2C':'rgba(255,255,255,0.8)' }}>{item.label}</p>
              {item.sub && <p className="text-white/25 text-[10px] mt-0.5">{item.sub}</p>}
            </div>
            {!(item as any).danger && <ChevronRight size={14} className="text-white/15 flex-shrink-0"/>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id:View; icon:React.ElementType; label:string }[] = [
  { id:'inicio',       icon:Home,         label:'Início'  },
  { id:'rastreamento', icon:MapPinned,     label:'Rastrear'},
  { id:'pedidos',      icon:ClipboardList, label:'Pedidos' },
  { id:'perfil',       icon:User,          label:'Perfil'  },
];

const ACCENT: Record<View,string> = {
  inicio:'#EA1D2C', rastreamento:'#FF6B35', pedidos:'#EA1D2C', perfil:'#EA1D2C',
};

// ─── Export ───────────────────────────────────────────────────────────────────

export default function DeliveryApp() {
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
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setScale(Math.min(1, (height-32)/720, (width-32)/360));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const accent = ACCENT[view];

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{ background:'radial-gradient(ellipse at center,#1a0303 0%,#050202 100%)' }}>

      <div className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background:`radial-gradient(circle at 50% 40%,${accent}10 0%,transparent 60%)` }}/>

      <div className="relative overflow-hidden" style={{ width: 360 * scale, height: 720 * scale, flexShrink: 0 }}>
      <div className="absolute top-0 left-0" style={{ width:360, height:720, transform:`scale(${scale})`, transformOrigin:'top left' }}>

        {/* Buttons */}
        {[{l:true,t:96,h:28},{l:true,t:144,h:48},{l:true,t:208,h:48},{l:false,t:128,h:64}].map((b,i) => (
          <div key={i} className="absolute rounded-sm" style={{ [b.l?'left':'right']:'-3px', top:b.t, width:3, height:b.h, background:'#200505' }}/>
        ))}

        {/* Frame */}
        <div className="absolute inset-0 rounded-[44px] overflow-hidden bg-[#0A0A0A]"
          style={{ border:'6px solid #1a0505', boxShadow:'0 0 0 1px rgba(255,255,255,0.05),0 40px 100px rgba(0,0,0,0.95),0 0 80px rgba(0,0,0,0.6),inset 0 0 0 1px rgba(255,255,255,0.02)' }}>

          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-3xl z-20 flex items-center justify-center gap-2" style={{ background:'#1a0505' }}>
            <div className="w-2 h-2 rounded-full" style={{ background:'#2a1010' }}/>
            <div className="w-3 h-3 rounded-full" style={{ background:'#2a1010' }}/>
          </div>

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-10 flex items-end justify-between px-7 pb-1.5 z-10">
            <span className="text-white text-[11px] font-bold">{time}</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-[2px]">
                {[3,5,7,9].map((h,i) => <div key={i} className="w-[3px] rounded-sm bg-white" style={{ height:h }}/>)}
              </div>
              <svg width="14" height="11" viewBox="0 0 14 11">
                <path d="M7 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="white"/>
                <path d="M3.5 5.5C4.8 4.2 5.8 3.5 7 3.5s2.2.7 3.5 2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M1 3C2.8 1.2 4.7 0 7 0s4.2 1.2 6 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
              <div className="flex items-center gap-px">
                <div className="w-6 h-3 rounded-sm border border-white/60 p-px"><div className="h-full w-[65%] bg-white rounded-[1px]"/></div>
                <div className="w-0.5 h-1.5 bg-white/50 rounded-r-sm"/>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 top-10 bottom-20 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
            <AnimatePresence mode="wait">
              <motion.div key={view} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.2, ease:'easeOut' }}>
                {view === 'inicio'       && <InicioView/>}
                {view === 'rastreamento' && <RastreamentoView/>}
                {view === 'pedidos'      && <PedidosView/>}
                {view === 'perfil'       && <PerfilView/>}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0 h-20 flex items-start pt-2 px-2 border-t border-white/[0.06]"
            style={{ background:'rgba(10,10,10,0.97)', backdropFilter:'blur(20px)' }}>
            {NAV_ITEMS.map(({ id, icon:Icon, label }) => {
              const active = view === id;
              const col = ACCENT[id];
              return (
                <button key={id} onClick={() => setView(id)} className="flex-1 flex flex-col items-center gap-1 pt-1 transition-all duration-200">
                  <div className="w-10 h-7 rounded-full flex items-center justify-center relative transition-all duration-200"
                    style={{ background: active ? col+'22' : 'transparent' }}>
                    {active && <div className="absolute inset-0 rounded-full" style={{ background:col+'15', filter:'blur(8px)' }}/>}
                    <Icon size={18} style={{ color: active ? col : 'rgba(255,255,255,0.25)', transition:'color 0.2s' }}/>
                  </div>
                  <span className="text-[10px] font-semibold transition-colors" style={{ color: active ? col : 'rgba(255,255,255,0.25)' }}>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/20"/>
        </div>
      </div>
      </div>
    </div>
  );
}
