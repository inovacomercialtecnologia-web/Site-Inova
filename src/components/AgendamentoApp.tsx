import React, { useState, useEffect, useRef } from 'react';
import {
  Compass, CalendarDays, BookMarked, User,
  Search, Bell, Star, ChevronRight, ChevronLeft,
  Clock, MapPin, Phone, MessageCircle, Heart,
  CheckCircle, Plus, ArrowRight, Scissors, Sparkles,
  X, ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'descobrir' | 'agenda' | 'reservas' | 'perfil';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Professional {
  id: string; name: string; specialty: string; studio: string;
  location: string; rating: number; reviews: number; priceFrom: number;
  initials: string; gradient: string; badge: string | null;
  availableToday: boolean; tags: string[];
  bio?: string;
}

interface Booking {
  id: string; professional: string; profInitials: string; profGradient: string;
  service: string; date: string; time: string; duration: number;
  price: number; status: 'confirmed' | 'pending'; location: string; countdown: string;
}

interface HistoryItem {
  id: string; professional: string; service: string; date: string;
  price: number; rating: number; profInitials: string; profGradient: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROFESSIONALS: Professional[] = [
  { id:'isabella', name:'Isabella Santos', specialty:'Cabeleireira & Colorista', studio:'Studio Bella Arte',
    location:'Jardins, SP', rating:4.9, reviews:312, priceFrom:180, initials:'IS',
    gradient:'linear-gradient(135deg,#C8956C,#7A4020)', badge:'Top Pro', availableToday:true,
    tags:['Coloração','Corte','Progressiva'],
    bio:'Especialista em coloração técnica e cortes modernos. 8 anos de experiência no Jardins.' },
  { id:'camila', name:'Camila Ferreira', specialty:'Esteticista & Dermopigm.', studio:'Espaço Bloom',
    location:'Itaim Bibi, SP', rating:4.8, reviews:198, priceFrom:250, initials:'CF',
    gradient:'linear-gradient(135deg,#E8B4B8,#C4637A)', badge:'Destaque', availableToday:false,
    tags:['Limpeza de Pele','Micropigm.','Peeling'] },
  { id:'rodrigo', name:'Rodrigo Lima', specialty:'Terapeuta & Massoterapeuta', studio:'Zen Corpo & Mente',
    location:'Moema, SP', rating:4.9, reviews:445, priceFrom:150, initials:'RL',
    gradient:'linear-gradient(135deg,#9B8EC4,#5B3B8A)', badge:'Top Pro', availableToday:true,
    tags:['Relaxante','Shiatsu','Drenagem'] },
  { id:'ana', name:'Ana Beatriz Moura', specialty:'Nail Designer', studio:'Ateliê das Unhas',
    location:'Vila Olímpia, SP', rating:4.7, reviews:267, priceFrom:90, initials:'AB',
    gradient:'linear-gradient(135deg,#F0D060,#C48010)', badge:null, availableToday:true,
    tags:['Gel','Fibra','Nail Art'] },
];

const SERVICES = [
  { id:'s1', name:'Corte Feminino',     cat:'Cabelo',   price:120, dur:60,  color:'#C8956C' },
  { id:'s2', name:'Coloração Completa', cat:'Cabelo',   price:290, dur:150, color:'#E8A040' },
  { id:'s3', name:'Progressiva',        cat:'Cabelo',   price:380, dur:180, color:'#C8956C' },
  { id:'s4', name:'Limpeza de Pele',    cat:'Estética', price:180, dur:90,  color:'#E8B4B8' },
  { id:'s5', name:'Peeling Químico',    cat:'Estética', price:320, dur:75,  color:'#E8B4B8' },
  { id:'s6', name:'Massagem Relax.',    cat:'Massagem', price:150, dur:60,  color:'#9B8EC4' },
  { id:'s7', name:'Drenagem Linfática', cat:'Massagem', price:180, dur:75,  color:'#9B8EC4' },
  { id:'s8', name:'Manicure+Pedicure',  cat:'Unhas',    price:90,  dur:90,  color:'#F0D060' },
];

const BOOKINGS: Booking[] = [
  { id:'b1', professional:'Isabella Santos', profInitials:'IS',
    profGradient:'linear-gradient(135deg,#C8956C,#7A4020)',
    service:'Coloração Completa', date:'Amanhã, 12 Mar', time:'14:30',
    duration:150, price:290, status:'confirmed',
    location:'Studio Bella Arte · Jardins', countdown:'em 22h' },
  { id:'b2', professional:'Rodrigo Lima', profInitials:'RL',
    profGradient:'linear-gradient(135deg,#9B8EC4,#5B3B8A)',
    service:'Massagem Relaxante', date:'Qui, 14 Mar', time:'10:00',
    duration:60, price:150, status:'pending',
    location:'Zen Corpo & Mente · Moema', countdown:'em 3 dias' },
];

const HISTORY: HistoryItem[] = [
  { id:'h1', professional:'Camila Ferreira',   service:'Limpeza de Pele',   date:'25 Fev 2026', price:180, rating:5, profInitials:'CF', profGradient:'linear-gradient(135deg,#E8B4B8,#C4637A)' },
  { id:'h2', professional:'Isabella Santos',   service:'Escova Progressiva', date:'10 Fev 2026', price:380, rating:5, profInitials:'IS', profGradient:'linear-gradient(135deg,#C8956C,#7A4020)' },
  { id:'h3', professional:'Ana Beatriz Moura', service:'Unhas em Gel',       date:'28 Jan 2026', price:180, rating:4, profInitials:'AB', profGradient:'linear-gradient(135deg,#F0D060,#C48010)' },
  { id:'h4', professional:'Rodrigo Lima',      service:'Shiatsu',            date:'15 Jan 2026', price:200, rating:5, profInitials:'RL', profGradient:'linear-gradient(135deg,#9B8EC4,#5B3B8A)' },
];

const BOOKED_DAYS: Record<number, 'confirmed' | 'pending' | 'multiple'> = {
  5:'confirmed', 10:'confirmed', 11:'multiple',
  12:'confirmed', 14:'pending', 18:'multiple', 22:'confirmed', 25:'pending',
};

const TIMELINE: Record<number, { time: string; type: 'booked' | 'available'; profInitials?: string; profGradient?: string; professional?: string; service?: string; dur?: number; color?: string; }[]> = {
  11: [
    { time:'09:00', type:'available' },
    { time:'10:00', type:'booked', profInitials:'RL', profGradient:'linear-gradient(135deg,#9B8EC4,#5B3B8A)', professional:'Rodrigo Lima', service:'Shiatsu', dur:90, color:'#9B8EC4' },
    { time:'11:30', type:'available' },
    { time:'14:30', type:'booked', profInitials:'IS', profGradient:'linear-gradient(135deg,#C8956C,#7A4020)', professional:'Isabella Santos', service:'Coloração', dur:150, color:'#C8956C' },
    { time:'17:00', type:'available' },
  ],
  12: [
    { time:'09:30', type:'available' },
    { time:'10:30', type:'available' },
    { time:'14:30', type:'booked', profInitials:'IS', profGradient:'linear-gradient(135deg,#C8956C,#7A4020)', professional:'Isabella Santos', service:'Coloração Completa', dur:150, color:'#C8956C' },
    { time:'17:00', type:'available' },
  ],
  14: [
    { time:'10:00', type:'booked', profInitials:'RL', profGradient:'linear-gradient(135deg,#9B8EC4,#5B3B8A)', professional:'Rodrigo Lima', service:'Massagem Relaxante', dur:60, color:'#9B8EC4' },
    { time:'11:00', type:'available' },
    { time:'14:00', type:'available' },
    { time:'16:00', type:'available' },
  ],
};

const GALLERY = [
  { label:'Coloração',  gradient:'linear-gradient(135deg,#C8956C 0%,#5A2D0C 100%)' },
  { label:'Mechas',     gradient:'linear-gradient(135deg,#F0D060 0%,#8A5A00 100%)' },
  { label:'Corte',      gradient:'linear-gradient(135deg,#E8B4B8 0%,#7A2A3A 100%)' },
  { label:'Estúdio',    gradient:'linear-gradient(135deg,#2A1A30 0%,#4A2A60 100%)' },
];

const REVIEWS = [
  { name:'Mariana C.', avatar:'M', color:'#C8956C', text:'Isabella é incrível! A coloração ficou perfeita. Ambiente super aconchegante.', rating:5, time:'3 dias' },
  { name:'Fernanda L.', avatar:'F', color:'#E8B4B8', text:'Progressiva maravilhosa, durou meses. Com certeza voltarei!', rating:5, time:'1 sem.' },
];

// ─── Calendar Helper ───────────────────────────────────────────────────────────

function getCalendarCells(year: number, month: number): (number | null)[] {
  const firstDayRaw = new Date(year, month, 1).getDay();
  const firstDay = (firstDayRaw + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
}

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DAY_LABELS = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function AvailabilityDot({ available }: { available: boolean }) {
  if (!available) return (
    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0C090E]" style={{ background:'#2A2030' }}/>
  );
  return (
    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 flex items-center justify-center">
      <motion.div className="absolute w-3.5 h-3.5 rounded-full"
        style={{ background:'rgba(74,222,128,0.35)' }}
        animate={{ scale:[1,1.9,1], opacity:[0.8,0,0.8] }}
        transition={{ duration:2.2, repeat:Infinity, ease:'easeOut' }}/>
      <div className="w-2.5 h-2.5 rounded-full relative z-10 border-2 border-[#0C090E]" style={{ background:'#4ADE80' }}/>
    </div>
  );
}

function ConfirmedBadge() {
  return (
    <div className="relative overflow-hidden inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{ background:'rgba(74,222,128,0.12)', border:'1px solid rgba(74,222,128,0.3)' }}>
      <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]"/>
      <span className="text-[#4ADE80] text-[10px] font-bold">Confirmado</span>
      <motion.div className="absolute inset-y-0 w-8 -skew-x-12"
        style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)' }}
        animate={{ x:['-200%','400%'] }}
        transition={{ duration:2.8, repeat:Infinity, repeatDelay:4, ease:'easeInOut' }}/>
    </div>
  );
}

function PendingBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{ background:'rgba(200,149,108,0.12)', border:'1px solid rgba(200,149,108,0.3)' }}>
      <motion.div className="w-1.5 h-1.5 rounded-full bg-[#C8956C]"
        animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.5, repeat:Infinity }}/>
      <span className="text-[#C8956C] text-[10px] font-bold">Aguardando</span>
    </div>
  );
}

function StarRating({ value, size = 10 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} fill={s<=value?'#F0D060':'rgba(255,255,255,0.1)'} className={s<=value?'text-[#F0D060]':'text-white/10'}/>
      ))}
    </div>
  );
}

// ─── DescubrirView ────────────────────────────────────────────────────────────

function DescubrirView({ onNav }: { onNav: (v: View) => void }) {
  const [activeTag, setActiveTag] = useState('Todos');
  const tags = ['Todos','Cabelo','Estética','Massagem','Unhas','Barba'];
  const nextBooking = BOOKINGS[0];

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-3 pb-3 relative overflow-hidden"
        style={{ background:'linear-gradient(180deg,#1a0c14 0%,#0e080c 60%,transparent 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse at 80% 0%,rgba(200,149,108,0.12) 0%,transparent 55%)' }}/>
        <div className="flex items-center justify-between mb-4 relative">
          <div>
            <p className="text-white/40 text-[10px] font-medium mb-0.5">Bem-vinda de volta 🌸</p>
            <p className="text-white font-bold text-[17px] leading-none">Ana Luiza</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/[0.08]"
              style={{ background:'rgba(255,255,255,0.04)' }}>
              <Bell size={17} className="text-white/55"/>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#C8956C] border border-[#0C090E] flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">2</span>
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-white/[0.06]"
          style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(12px)' }}>
          <Search size={15} className="text-[#C8956C] flex-shrink-0"/>
          <span className="text-white/25 text-sm">Buscar profissionais ou serviços…</span>
        </div>
      </div>

      {/* Next booking banner */}
      {nextBooking && (
        <div className="mx-4 mb-4">
          <button onClick={() => onNav('reservas')} className="w-full text-left">
            <div className="rounded-3xl p-4 border border-white/[0.07] relative overflow-hidden"
              style={{ background:'linear-gradient(135deg,#1C1218,#120D10)' }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background:'radial-gradient(circle at 90% 50%,rgba(200,149,108,0.1) 0%,transparent 55%)' }}/>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-white flex-shrink-0"
                  style={{ background: nextBooking.profGradient }}>
                  {nextBooking.profInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/40 text-[10px] mb-0.5">Próximo agendamento · {nextBooking.countdown}</p>
                  <p className="text-white font-bold text-sm truncate">{nextBooking.service}</p>
                  <p className="text-white/50 text-[10px]">{nextBooking.professional} · {nextBooking.time}</p>
                </div>
                <ArrowRight size={16} className="text-[#C8956C] flex-shrink-0"/>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Category tags */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
        {tags.map(t => {
          const active = activeTag === t;
          return (
            <button key={t} onClick={() => setActiveTag(t)}
              className="flex-shrink-0 px-3.5 py-2 rounded-full text-[11px] font-bold border transition-all"
              style={{
                background: active ? 'rgba(200,149,108,0.2)' : 'rgba(255,255,255,0.03)',
                borderColor: active ? 'rgba(200,149,108,0.45)' : 'rgba(255,255,255,0.07)',
                color: active ? '#C8956C' : 'rgba(255,255,255,0.4)',
                boxShadow: active ? '0 0 14px rgba(200,149,108,0.25)' : 'none',
              }}>
              {t}
            </button>
          );
        })}
      </div>

      {/* Featured professionals */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-bold text-[13px]">Em destaque</p>
          <button className="text-[#C8956C] text-[10px] font-bold flex items-center gap-0.5">
            Ver todos <ChevronRight size={11}/>
          </button>
        </div>
        <div className="space-y-2.5">
          {PROFESSIONALS.slice(0,3).map(p => (
            <motion.div key={p.id} whileTap={{ scale:0.98 }}
              className="flex items-center gap-3 rounded-2xl px-3.5 py-3 border border-white/[0.06] transition-all"
              style={{ background:'#141018' }}>
              {/* Avatar + availability dot */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-white"
                  style={{ background: p.gradient }}>
                  {p.initials}
                </div>
                <AvailabilityDot available={p.availableToday}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-bold text-sm truncate">{p.name}</p>
                  {p.badge && (
                    <span className="flex-shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background:'rgba(240,208,96,0.12)', color:'#F0D060', border:'1px solid rgba(240,208,96,0.25)' }}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-[10px]">{p.specialty}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <StarRating value={Math.round(p.rating)}/>
                  <span className="text-white/60 text-[10px] font-bold">{p.rating}</span>
                  <span className="text-white/20 text-[10px]">({p.reviews})</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-white/30 text-[9px]">a partir de</p>
                <p className="text-white font-bold text-sm">R$ {p.priceFrom}</p>
                <ChevronRight size={13} className="text-white/20 ml-auto mt-0.5"/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick book strip */}
      <div className="px-4">
        <p className="text-white font-bold text-[13px] mb-3">Serviços rápidos</p>
        <div className="grid grid-cols-2 gap-2">
          {SERVICES.slice(0,4).map(s => (
            <div key={s.id} className="rounded-2xl p-3 border border-white/[0.06]"
              style={{ background:'rgba(255,255,255,0.02)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 text-base"
                style={{ background:`${s.color}18` }}>
                {s.cat === 'Cabelo' ? '✂️' : s.cat === 'Estética' ? '✨' : s.cat === 'Massagem' ? '🤲' : '💅'}
              </div>
              <p className="text-white text-xs font-bold leading-tight">{s.name}</p>
              <p className="text-white/35 text-[10px] mt-0.5">{s.dur} min</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="font-bold text-xs" style={{ color:s.color }}>R$ {s.price}</span>
                <button className="text-[9px] font-bold px-2 py-0.5 rounded-lg"
                  style={{ background:`${s.color}18`, color:s.color }}>
                  Agendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AgendaView ───────────────────────────────────────────────────────────────

function AgendaView() {
  const TODAY = 11;
  const [selectedDay, setSelectedDay] = useState(TODAY);
  const [calMonth, setCalMonth] = useState(2); // março = 2 (0-indexed)
  const [calYear] = useState(2026);
  const [direction, setDirection] = useState(1);

  const cells = getCalendarCells(calYear, calMonth);
  const slots = TIMELINE[selectedDay] || [];

  const changeMonth = (d: 1 | -1) => {
    setDirection(d);
    setCalMonth(m => m + d);
  };

  return (
    <div className="px-4 pb-4">
      <div className="pt-3 flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-bold text-[20px] leading-none">Agenda</h2>
          <p className="text-white/35 text-[10px] mt-0.5">
            {Object.values(BOOKED_DAYS).length} agendamentos em {MONTH_NAMES[calMonth]}
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 border border-[#9B8EC4]/25 text-[10px] font-bold"
          style={{ background:'rgba(155,142,196,0.1)', color:'#9B8EC4' }}>
          <Plus size={12}/> Novo
        </button>
      </div>

      {/* Calendar */}
      <div className="rounded-3xl p-4 mb-4 border border-white/[0.06]" style={{ background:'#141018' }}>
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.07]"
            style={{ background:'rgba(255,255,255,0.04)' }}>
            <ChevronLeft size={14} className="text-white/50"/>
          </button>
          <p className="text-white font-bold text-sm">{MONTH_NAMES[calMonth]} {calYear}</p>
          <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.07]"
            style={{ background:'rgba(255,255,255,0.04)' }}>
            <ChevronRight size={14} className="text-white/50"/>
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center">
              <span className="text-white/25 text-[9px] font-bold">{d[0]}</span>
            </div>
          ))}
        </div>

        {/* Day cells */}
        <AnimatePresence mode="wait">
          <motion.div key={`${calYear}-${calMonth}`}
            initial={{ x: direction * 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 24, opacity: 0 }}
            transition={{ duration: 0.22, ease:'easeOut' }}
            className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`}/>;
              const isToday = day === TODAY && calMonth === 2;
              const isSelected = day === selectedDay && calMonth === 2;
              const dot = BOOKED_DAYS[day];
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <button onClick={() => setSelectedDay(day)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                    style={{
                      background: isSelected && !isToday ? 'rgba(155,142,196,0.2)' : isToday ? '#C8956C' : 'transparent',
                      border: isSelected && !isToday ? '1.5px solid rgba(155,142,196,0.5)' : 'none',
                      color: isToday ? 'white' : isSelected ? '#9B8EC4' : 'rgba(255,255,255,0.65)',
                      fontWeight: isToday || isSelected ? '800' : '500',
                      boxShadow: isToday ? '0 0 12px rgba(200,149,108,0.4)' : 'none',
                    }}>
                    {day}
                  </button>
                  {/* Status dots */}
                  <div className="flex gap-0.5 h-1.5">
                    {dot === 'confirmed' && <div className="w-1 h-1 rounded-full bg-[#4ADE80]"/>}
                    {dot === 'pending' && <div className="w-1 h-1 rounded-full bg-[#C8956C]"/>}
                    {dot === 'multiple' && (
                      <><div className="w-1 h-1 rounded-full bg-[#4ADE80]"/><div className="w-1 h-1 rounded-full bg-[#C8956C]"/></>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.06]">
          {[['#4ADE80','Confirmado'],['#C8956C','Pendente']].map(([col,lbl]) => (
            <div key={lbl} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background:col }}/>
              <span className="text-white/30 text-[9px]">{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-white font-bold text-[13px]">
          {selectedDay === TODAY ? 'Hoje, ' : ''}{selectedDay} de {MONTH_NAMES[calMonth]}
        </p>
        <span className="text-[#9B8EC4] text-[10px] font-bold">{slots.filter(s=>s.type==='booked').length} agendado(s)</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={selectedDay}
          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
          transition={{ duration:0.22 }}>
          {slots.length > 0 ? (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[36px] top-4 bottom-4 w-px" style={{ background:'rgba(255,255,255,0.06)'}}/>
              <div className="space-y-2.5">
                {slots.map((slot, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[10px] text-white/30 font-mono w-9 pt-2.5 text-right flex-shrink-0">{slot.time}</span>
                    <div className={`w-2.5 h-2.5 rounded-full border-2 mt-2.5 flex-shrink-0 z-10`}
                      style={{ background: slot.type === 'booked' ? (slot.color || '#9B8EC4') : 'transparent', borderColor: slot.type === 'booked' ? (slot.color || '#9B8EC4') : 'rgba(255,255,255,0.15)' }}/>
                    <div className="flex-1 min-w-0">
                      {slot.type === 'booked' ? (
                        <div className="rounded-2xl px-3 py-2.5 border-l-2"
                          style={{ background:'#141018', borderLeftColor: slot.color || '#9B8EC4' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[9px] text-white flex-shrink-0"
                              style={{ background: slot.profGradient }}>
                              {slot.profInitials}
                            </div>
                            <p className="text-white text-xs font-bold truncate">{slot.service}</p>
                          </div>
                          <p className="text-white/35 text-[10px]">{slot.professional} · {slot.dur} min</p>
                        </div>
                      ) : (
                        <div className="rounded-xl px-3 py-2 border border-dashed border-white/10 flex items-center gap-2">
                          <Plus size={11} className="text-white/20"/>
                          <span className="text-white/20 text-[10px] italic">Horário disponível</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center rounded-3xl border border-white/[0.05]"
              style={{ background:'rgba(255,255,255,0.02)' }}>
              <CalendarDays size={28} className="text-white/15 mb-2"/>
              <p className="text-white/30 text-sm font-semibold">Sem agendamentos</p>
              <p className="text-white/15 text-xs mt-1">Toque em + para agendar</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── ReservasView ─────────────────────────────────────────────────────────────

function ReservasView() {
  const [tab, setTab] = useState<'proximas' | 'historico'>('proximas');

  return (
    <div className="px-4 pb-4">
      <div className="pt-3 mb-4">
        <h2 className="text-white font-bold text-[20px] leading-none">Reservas</h2>
        <p className="text-white/35 text-[10px] mt-0.5">{BOOKINGS.length} próximas · {HISTORY.length} anteriores</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4 p-1 rounded-2xl border border-white/[0.06]"
        style={{ background:'rgba(255,255,255,0.02)' }}>
        {(['proximas','historico'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all"
            style={{
              background: tab===t ? 'rgba(232,180,184,0.18)' : 'transparent',
              color: tab===t ? '#E8B4B8' : 'rgba(255,255,255,0.35)',
              border: tab===t ? '1px solid rgba(232,180,184,0.3)' : '1px solid transparent',
            }}>
            {t === 'proximas' ? 'Próximas' : 'Histórico'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'proximas' && (
          <motion.div key="proximas" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            transition={{ duration:0.2 }} className="space-y-3">
            {BOOKINGS.map(b => (
              <div key={b.id} className="rounded-3xl overflow-hidden border"
                style={{
                  background: b.status==='confirmed' ? 'linear-gradient(135deg,#160E12,#0E0A0D)' : 'linear-gradient(135deg,#14100A,#0D0A06)',
                  borderColor: b.status==='confirmed' ? 'rgba(74,222,128,0.15)' : 'rgba(200,149,108,0.2)',
                }}>
                {/* Color accent bar */}
                <div className="h-0.5 w-full"
                  style={{ background: b.status==='confirmed' ? 'linear-gradient(90deg,#4ADE80,#4ADE8050)' : 'linear-gradient(90deg,#C8956C,#C8956C50)' }}/>
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-white flex-shrink-0"
                      style={{ background: b.profGradient }}>
                      {b.profInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-bold text-sm truncate">{b.service}</p>
                      </div>
                      <p className="text-white/45 text-xs">{b.professional}</p>
                    </div>
                    {b.status === 'confirmed' ? <ConfirmedBadge/> : <PendingBadge/>}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { icon:CalendarDays, val:`${b.date} · ${b.time}` },
                      { icon:Clock,        val:`${b.duration} min · R$ ${b.price}` },
                      { icon:MapPin,       val:b.location },
                      { icon:Sparkles,     val:`${b.countdown} 🕐` },
                    ].map((info, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <info.icon size={10} className="text-white/25 flex-shrink-0"/>
                        <span className="text-white/50 text-[10px] truncate">{info.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 rounded-2xl text-xs font-bold border border-white/10 text-white/50">
                      Reagendar
                    </button>
                    <button className="flex-1 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 text-white"
                      style={{ background: b.status==='confirmed' ? 'linear-gradient(135deg,#C8956C,#A06030)' : 'linear-gradient(135deg,#9B8EC4,#7B6EA4)',
                        boxShadow: b.status==='confirmed' ? '0 4px 14px rgba(200,149,108,0.3)' : '0 4px 14px rgba(155,142,196,0.3)' }}>
                      <Phone size={12}/> Contato
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'historico' && (
          <motion.div key="historico" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            transition={{ duration:0.2 }} className="space-y-2.5">
            {HISTORY.map(h => (
              <div key={h.id} className="rounded-2xl px-3.5 py-3.5 border border-white/[0.05] flex items-center gap-3"
                style={{ background:'rgba(255,255,255,0.025)' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                  style={{ background: h.profGradient }}>
                  {h.profInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-xs truncate">{h.service}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{h.professional}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <StarRating value={h.rating} size={9}/>
                    <span className="text-white/25 text-[9px]">·</span>
                    <span className="text-white/30 text-[9px]">{h.date}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-white font-bold text-xs mb-1.5">R$ {h.price}</p>
                  <button className="text-[9px] font-bold px-2.5 py-1 rounded-xl border"
                    style={{ color:'#E8B4B8', borderColor:'rgba(232,180,184,0.25)', background:'rgba(232,180,184,0.08)' }}>
                    Repetir
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PerfilView ───────────────────────────────────────────────────────────────

function PerfilView() {
  const prof = PROFESSIONALS[0];
  const [liked, setLiked] = useState(false);

  return (
    <div className="pb-4">
      {/* Banner + floating avatar */}
      <div className="relative mb-8">
        <div className="h-32 rounded-none overflow-hidden"
          style={{ background: prof.gradient, borderRadius:'0 0 0 0' }}>
          <div className="absolute inset-0" style={{ background:'radial-gradient(circle at 30% 50%,rgba(255,255,255,0.12) 0%,transparent 55%)' }}/>
          <div className="absolute inset-0" style={{ backgroundImage:'repeating-linear-gradient(135deg,rgba(0,0,0,0.05) 0px,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 14px)' }}/>
        </div>
        {/* Floating avatar */}
        <div className="absolute -bottom-7 left-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl text-white border-[3px] border-[#0C090E]"
            style={{ background: prof.gradient, boxShadow:'0 8px 24px rgba(0,0,0,0.5)' }}>
            {prof.initials}
          </div>
        </div>
        {/* Top right actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="bg-[#F0D060]/18 border border-[#F0D060]/35 rounded-full px-2.5 py-1">
            <span className="text-[#F0D060] text-[9px] font-bold">TOP PRO ★</span>
          </div>
          <button onClick={() => setLiked(l=>!l)}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/15"
            style={{ background:'rgba(0,0,0,0.4)', backdropFilter:'blur(8px)' }}>
            <Heart size={13} fill={liked?'#E8B4B8':'none'} className={liked?'text-[#E8B4B8]':'text-white/60'}/>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 mb-4">
        <p className="text-white font-bold text-lg leading-tight">{prof.name}</p>
        <p className="text-white/45 text-xs mt-0.5">{prof.specialty}</p>
        <div className="flex items-center gap-1.5 mt-1.5 mb-2">
          <MapPin size={10} className="text-white/30"/>
          <span className="text-white/35 text-[10px]">{prof.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <StarRating value={Math.round(prof.rating)}/>
            <span className="text-white font-bold text-xs ml-1">{prof.rating}</span>
            <span className="text-white/30 text-[10px]">({prof.reviews} avaliações)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AvailabilityDot available={prof.availableToday}/>
            <span className="text-[#4ADE80] text-[10px] font-semibold ml-2.5">Disponível hoje</span>
          </div>
        </div>
        {prof.bio && (
          <p className="text-white/40 text-xs mt-3 leading-relaxed">{prof.bio}</p>
        )}
        <div className="flex gap-1.5 mt-3">
          {prof.tags.map(tag => (
            <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background:'rgba(200,149,108,0.12)', color:'#C8956C', border:'1px solid rgba(200,149,108,0.2)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div className="px-4 mb-4">
        <p className="text-white font-bold text-[13px] mb-3">Galeria</p>
        <div className="grid grid-cols-2 gap-2">
          {GALLERY.map(g => (
            <div key={g.label} className="relative rounded-2xl overflow-hidden" style={{ height:76 }}>
              <div className="absolute inset-0" style={{ background: g.gradient }}/>
              <div className="absolute inset-0" style={{ backgroundImage:'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 12px)' }}/>
              <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2" style={{ background:'linear-gradient(0deg,rgba(0,0,0,0.65),transparent)' }}>
                <span className="text-white text-[10px] font-semibold">{g.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="px-4 mb-4">
        <p className="text-white font-bold text-[13px] mb-3">Serviços</p>
        <div className="rounded-3xl border border-white/[0.06] overflow-hidden" style={{ background:'#141018' }}>
          {SERVICES.slice(0,4).map((s, i) => (
            <div key={s.id} className={`flex items-center gap-3 px-4 py-3.5 ${i < 3 ? 'border-b border-white/[0.05]' : ''}`}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background:`${s.color}18` }}>
                <Scissors size={13} style={{ color:s.color }}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold">{s.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock size={9} className="text-white/25"/>
                  <span className="text-white/35 text-[9px]">{s.dur} min</span>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="font-bold text-sm" style={{ color:s.color }}>R$ {s.price}</span>
                <ChevronRight size={12} className="text-white/20"/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="px-4 mb-20">
        <p className="text-white font-bold text-[13px] mb-3">Avaliações recentes</p>
        <div className="space-y-2.5">
          {REVIEWS.map((r, i) => (
            <div key={i} className="rounded-2xl px-3.5 py-3 border border-white/[0.05]"
              style={{ background:'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                  style={{ background:`linear-gradient(135deg,${r.color},${r.color}88)` }}>
                  {r.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-bold">{r.name}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <StarRating value={r.rating} size={9}/>
                  <span className="text-white/25 text-[9px]">{r.time}</span>
                </div>
              </div>
              <p className="text-white/50 text-[10px] leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA fixo */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-10 pointer-events-none"
        style={{ maxWidth:360, margin:'0 auto' }}>
        <button className="w-full py-3.5 rounded-2xl text-white font-black text-sm pointer-events-auto flex items-center justify-center gap-2"
          style={{ background:'linear-gradient(135deg,#C8956C,#A06030)', boxShadow:'0 8px 24px rgba(200,149,108,0.45)' }}>
          <Sparkles size={15}/> Agendar Agora
        </button>
      </div>
    </div>
  );
}

// ─── Nav & Constants ──────────────────────────────────────────────────────────

const NAV_ITEMS: { id: View; icon: React.ElementType; label: string }[] = [
  { id:'descobrir', icon:Compass,      label:'Descobrir' },
  { id:'agenda',    icon:CalendarDays, label:'Agenda'    },
  { id:'reservas',  icon:BookMarked,   label:'Reservas'  },
  { id:'perfil',    icon:User,         label:'Perfil'    },
];

const ACCENT: Record<View, string> = {
  descobrir: '#C8956C',
  agenda:    '#9B8EC4',
  reservas:  '#E8B4B8',
  perfil:    '#F0D060',
};

// ─── Export ───────────────────────────────────────────────────────────────────

export default function AgendamentoApp() {
  const [view, setView] = useState<View>('descobrir');
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
      setScale(Math.min(1, (height - 32) / 720, (width - 32) / 360));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const accent = ACCENT[view];

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{ background:'radial-gradient(ellipse at 30% 20%,#1a0c14 0%,#0c090e 60%,#080509 100%)' }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background:`radial-gradient(circle at 50% 40%,${accent}12 0%,transparent 60%)` }}/>

      <div className="relative flex-shrink-0"
        style={{ width:360, height:720, transform:`scale(${scale})`, transformOrigin:'center' }}>

        {/* Side buttons */}
        {[{l:true,t:96,h:28},{l:true,t:144,h:48},{l:true,t:208,h:48},{l:false,t:128,h:64}].map((b,i) => (
          <div key={i} className="absolute rounded-sm"
            style={{ [b.l?'left':'right']:'-3px', top:b.t, width:3, height:b.h, background:'#1a0c14' }}/>
        ))}

        {/* Frame */}
        <div className="absolute inset-0 rounded-[44px] overflow-hidden"
          style={{ border:'6px solid #1a0c14', background:'#0C090E',
            boxShadow:'0 0 0 1px rgba(255,255,255,0.05),0 40px 100px rgba(0,0,0,0.95),0 0 80px rgba(0,0,0,0.7),inset 0 0 0 1px rgba(200,149,108,0.04)' }}>

          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-3xl z-20 flex items-center justify-center gap-2"
            style={{ background:'#1a0c14' }}>
            <div className="w-2 h-2 rounded-full bg-[#2a1c20]"/>
            <div className="w-3 h-3 rounded-full bg-[#2a1c20]"/>
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
                <div className="w-6 h-3 rounded-sm border border-white/60 p-px">
                  <div className="h-full w-[65%] bg-white rounded-[1px]"/>
                </div>
                <div className="w-0.5 h-1.5 bg-white/50 rounded-r-sm"/>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 top-10 bottom-20 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
            <AnimatePresence mode="wait">
              <motion.div key={view}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}
                transition={{ duration:0.2, ease:'easeOut' }}>
                {view === 'descobrir' && <DescubrirView onNav={setView}/>}
                {view === 'agenda'    && <AgendaView/>}
                {view === 'reservas'  && <ReservasView/>}
                {view === 'perfil'    && <PerfilView/>}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav with sliding indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-20 flex items-start pt-2 px-2 border-t border-white/[0.06]"
            style={{ background:'rgba(12,9,14,0.97)', backdropFilter:'blur(20px)' }}>
            {NAV_ITEMS.map(({ id, icon:Icon, label }) => {
              const active = view === id;
              const col = ACCENT[id];
              return (
                <button key={id} onClick={() => setView(id)}
                  className="flex-1 flex flex-col items-center gap-1 pt-1 relative">
                  {/* Sliding indicator */}
                  {active && (
                    <motion.div layoutId="agendamento-nav-indicator"
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                      style={{ background: col }}
                      transition={{ type:'spring', stiffness:500, damping:40 }}/>
                  )}
                  <div className="w-10 h-7 rounded-full flex items-center justify-center relative transition-all duration-200"
                    style={{ background: active ? col+'22' : 'transparent' }}>
                    {active && (
                      <div className="absolute inset-0 rounded-full" style={{ background:col+'15', filter:'blur(8px)' }}/>
                    )}
                    <Icon size={18} style={{ color: active ? col : 'rgba(255,255,255,0.25)', transition:'color 0.2s' }}/>
                  </div>
                  <span className="text-[10px] font-semibold transition-colors"
                    style={{ color: active ? col : 'rgba(255,255,255,0.25)' }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/20"/>
        </div>
      </div>
    </div>
  );
}
