import React, { useState, useEffect, useRef } from 'react';
import {
  Compass, BookOpen, Play, User, Search, Bell, Star,
  ChevronRight, ChevronDown, Check, Lock, SkipBack, SkipForward,
  Volume2, Maximize, Award, Download, Shield, HelpCircle,
  LogOut, Plus, MessageCircle, ThumbsUp, Pause, ArrowLeft,
  Bookmark, Flame, Clock, Zap, Trophy, Target,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'inicio' | 'meus-cursos' | 'player' | 'perfil';
type CourseTab = 'andamento' | 'concluidos' | 'salvos';
type PlayerTab = 'conteudo' | 'notas' | 'discussao';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id:'todos',      label:'Todos',     emoji:'✨', color:'#6366F1' },
  { id:'dev',        label:'Dev',       emoji:'💻', color:'#6366F1' },
  { id:'dados',      label:'Dados & IA',emoji:'🤖', color:'#8B5CF6' },
  { id:'design',     label:'Design',    emoji:'🎨', color:'#EC4899' },
  { id:'negocios',   label:'Negócios',  emoji:'📊', color:'#F59E0B' },
  { id:'marketing',  label:'Marketing', emoji:'📣', color:'#10B981' },
  { id:'devops',     label:'DevOps',    emoji:'⚙️', color:'#3B82F6' },
];

const FEATURED = [
  { id:'f1', title:'React & TypeScript Completo', instructor:'Lucas Tavares', badge:'🔥 Mais vendido',
    rating:4.9, students:'32.5k', emoji:'⚛️', accent:'#6366F1',
    bg:'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)' },
  { id:'f2', title:'Machine Learning na Prática', instructor:'Ana Lima', badge:'⚡ Trending',
    rating:4.9, students:'12.4k', emoji:'🤖', accent:'#8B5CF6',
    bg:'linear-gradient(135deg,#1a0533 0%,#4c0099 50%,#1a0533 100%)' },
  { id:'f3', title:'Product Management Completo', instructor:'Sofia Ribeiro', badge:'✨ Novo',
    rating:4.8, students:'21.3k', emoji:'📊', accent:'#3B82F6',
    bg:'linear-gradient(135deg,#0c1a3a 0%,#1e3a6e 50%,#0c1a3a 100%)' },
];

const DISCOVER_GRID = [
  { id:'d1', title:'Next.js 14 App Router', instructor:'Pedro Costa', rating:4.8, emoji:'▲', accent:'#6366F1', tag:'NOVO', progress:0 },
  { id:'d2', title:'Python para Ciência de Dados', instructor:'Maria Santos', rating:4.7, emoji:'🐍', accent:'#8B5CF6', tag:'POPULAR', progress:45 },
  { id:'d3', title:'Figma UI/UX Avançado', instructor:'Julia Nunes', rating:4.9, emoji:'🎨', accent:'#EC4899', tag:'TOP', progress:0 },
  { id:'d4', title:'AWS Cloud Practitioner', instructor:'Bruno Lima', rating:4.6, emoji:'☁️', accent:'#3B82F6', tag:'NOVO', progress:0 },
];

const MY_COURSES = [
  { id:'c1', title:'React & TypeScript Completo', instructor:'Lucas Tavares', progress:68,
    done:34, total:50, accent:'#6366F1', emoji:'⚛️', module:'Módulo 3', lastLesson:'Custom hooks: criação e composição', timeLeft:'14h restantes' },
  { id:'c2', title:'Node.js na Prática', instructor:'Carlos Melo', progress:23,
    done:7, total:30, accent:'#10B981', emoji:'🟢', module:'Módulo 2', lastLesson:'GraphQL com Apollo Server', timeLeft:'25h restantes' },
  { id:'c3', title:'Figma Masterclass', instructor:'Julia Nunes', progress:100,
    done:28, total:28, accent:'#EC4899', emoji:'🎨', module:'Concluído', lastLesson:'Concluído', completedAt:'28 Fev 2026', certificate:true },
];

const CONTINUE_WATCHING = MY_COURSES.slice(0,2);

const PLAYER_COURSE = {
  title:'React & TypeScript Completo',
  currentModule:'Módulo 3 — Hooks Avançados & Performance',
  currentLesson:'Custom hooks: criação e composição',
  duration:'52:00', emoji:'⚛️', accent:'#6366F1',
};

const PLAYER_MODULES = [
  { id:'m1', title:'Fundamentos React', done:5, total:5, completed:true, isOpen:false,
    lessons:[
      { id:'l1',title:'Introdução ao React 18',dur:'12:00',watched:true },
      { id:'l2',title:'JSX e componentes',dur:'18:30',watched:true },
      { id:'l3',title:'Props e composição',dur:'22:15',watched:true },
      { id:'l4',title:'Estado com useState',dur:'28:00',watched:true },
      { id:'l5',title:'Ciclo de vida com useEffect',dur:'24:45',watched:true },
    ]},
  { id:'m2', title:'TypeScript Avançado', done:4, total:4, completed:true, isOpen:false,
    lessons:[
      { id:'l6',title:'Tipos primitivos e interfaces',dur:'20:00',watched:true },
      { id:'l7',title:'Generics na prática',dur:'25:30',watched:true },
      { id:'l8',title:'Utility Types',dur:'19:45',watched:true },
      { id:'l9',title:'Tipagem de componentes React',dur:'22:00',watched:true },
    ]},
  { id:'m3', title:'Hooks Avançados & Performance', done:2, total:4, completed:false, isOpen:true,
    lessons:[
      { id:'l10',title:'useCallback e useMemo',dur:'30:00',watched:true },
      { id:'l11',title:'useRef e DOM manipulation',dur:'25:00',watched:true },
      { id:'l12',title:'Custom hooks: criação e composição',dur:'52:00',watched:false,active:true },
      { id:'l13',title:'React.memo e otimizações',dur:'38:00',watched:false },
    ]},
  { id:'m4', title:'Projeto Final: SaaS App', done:0, total:4, completed:false, locked:true, isOpen:false,
    lessons:[
      { id:'l14',title:'Arquitetura do projeto',dur:'45:00',watched:false },
      { id:'l15',title:'Autenticação com NextAuth',dur:'52:00',watched:false },
      { id:'l16',title:'Dashboard e métricas',dur:'60:00',watched:false },
      { id:'l17',title:'Deploy e CI/CD',dur:'35:00',watched:false },
    ]},
];

const SAVED_NOTES = [
  { time:'08:15', text:'useCallback só vale a pena quando a função é passada como prop para componentes memorizados.' },
  { time:'14:42', text:'useMemo para valores computacionalmente caros. Cuidado com over-optimization.' },
];

const DISCUSSION = [
  { name:'Thiago R.', avatar:'T', color:'#6366F1', text:'Ótima aula! A analogia com o "cache" ajudou muito a entender o useCallback.', likes:12, time:'2h' },
  { name:'Fernanda L.', avatar:'F', color:'#EC4899', text:'Tinha dúvida sobre quando usar useMemo vs useCallback, agora ficou claro!', likes:8, time:'5h' },
];

const BADGES = [
  { id:'b1', label:'Primeira Aula',  icon:'🎯', color:'#6366F1', earned:true,  earnedAt:'Jan 2026' },
  { id:'b2', label:'Maratonista',    icon:'🏃', color:'#8B5CF6', earned:true,  earnedAt:'Fev 2026' },
  { id:'b3', label:'7 Dias Seguidos',icon:'🔥', color:'#F59E0B', earned:true,  earnedAt:'Mar 2026' },
  { id:'b4', label:'1° Certificado', icon:'🏆', color:'#D4AF37', earned:true,  earnedAt:'Fev 2026' },
  { id:'b5', label:'Noturno',        icon:'🦉', color:'#3B82F6', earned:true,  earnedAt:'Mar 2026' },
  { id:'b6', label:'100 Aulas',      icon:'💯', color:'#10B981', earned:false },
  { id:'b7', label:'Mestre React',   icon:'⚛️', color:'#6366F1', earned:false },
  { id:'b8', label:'Top 1%',         icon:'👑', color:'#D4AF37', earned:false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ProgressBar({ value, color = '#6366F1', className = '' }: { value: number; color?: string; className?: string }) {
  return (
    <div className={`w-full h-1 rounded-full overflow-hidden bg-white/8 ${className}`}>
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width:`${Math.min(100, value)}%`, background: color }}/>
    </div>
  );
}

function CircleProgress({ value, size = 72, stroke = 6, color = '#6366F1', children }: {
  value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition:'stroke-dashoffset 1s ease', filter:`drop-shadow(0 0 6px ${color}60)` }}/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={10} fill={s <= Math.round(value) ? '#FBBF24' : 'rgba(255,255,255,0.1)'}
          className={s <= Math.round(value) ? 'text-[#FBBF24]' : 'text-white/10'}/>
      ))}
    </div>
  );
}

function BadgeCard({ badge }: { badge: typeof BADGES[0] }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[26px] relative border transition-all"
        style={{
          background: badge.earned ? `${badge.color}18` : 'rgba(255,255,255,0.03)',
          borderColor: badge.earned ? `${badge.color}35` : 'rgba(255,255,255,0.06)',
          filter: badge.earned ? 'none' : 'grayscale(1)',
          opacity: badge.earned ? 1 : 0.4,
        }}>
        {badge.icon}
        {!badge.earned && (
          <div className="absolute inset-0 rounded-2xl flex items-end justify-end p-1">
            <Lock size={9} className="text-white/40"/>
          </div>
        )}
      </div>
      <span className="text-[9px] font-semibold text-center leading-tight"
        style={{ color: badge.earned ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)' }}>
        {badge.label}
      </span>
      {badge.earned && badge.earnedAt && (
        <span className="text-[8px]" style={{ color: badge.color }}>
          {badge.earnedAt}
        </span>
      )}
    </div>
  );
}

function ModuleAccordion({ mod, isOpen, onToggle }: {
  mod: typeof PLAYER_MODULES[0]; isOpen: boolean; onToggle: () => void;
}) {
  const allDone = mod.completed;
  const isLocked = (mod as any).locked;

  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.05]" style={{ background:'rgba(255,255,255,0.02)' }}>
      <button onClick={!isLocked ? onToggle : undefined}
        className="w-full flex items-center gap-3 px-3.5 py-3 text-left">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: allDone ? '#10B981' + '20' : isLocked ? 'rgba(255,255,255,0.04)' : '#6366F1' + '18' }}>
          {allDone
            ? <Check size={13} className="text-[#10B981]"/>
            : isLocked
              ? <Lock size={12} className="text-white/25"/>
              : <Play size={11} className="text-[#6366F1]"/>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold leading-none truncate" style={{ color: isLocked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.85)' }}>
            {mod.title}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: allDone ? '#10B981' : 'rgba(255,255,255,0.3)' }}>
            {allDone ? `✓ Concluído · ${mod.total} aulas` : isLocked ? 'Desbloqueado com progressão' : `${mod.done}/${mod.total} aulas`}
          </p>
        </div>
        {!isLocked && (
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} className="text-white/30 flex-shrink-0"/>
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && !isLocked && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.2 }} className="overflow-hidden">
            <div className="pb-2 space-y-0.5">
              {mod.lessons.map(l => {
                const isActive = (l as any).active;
                return (
                  <div key={l.id} className="flex items-center gap-3 mx-2 px-2.5 py-2 rounded-xl transition-colors"
                    style={{ background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent', borderLeft: isActive ? '2px solid #6366F1' : '2px solid transparent' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: l.watched ? '#10B981' + '20' : isActive ? '#6366F120' : 'rgba(255,255,255,0.04)' }}>
                      {l.watched
                        ? <Check size={11} className="text-[#10B981]"/>
                        : isActive
                          ? <Play size={10} className="text-[#6366F1]" fill="#6366F1"/>
                          : <div className="w-1.5 h-1.5 rounded-full bg-white/20"/>}
                    </div>
                    <p className="flex-1 text-[11px] truncate font-medium"
                      style={{ color: l.watched ? 'rgba(255,255,255,0.35)' : isActive ? 'white' : 'rgba(255,255,255,0.6)' }}>
                      {l.title}
                    </p>
                    <span className="text-[9px] flex-shrink-0" style={{ color:'rgba(255,255,255,0.25)' }}>{l.dur}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── InicioView ───────────────────────────────────────────────────────────────

function InicioView({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [banner, setBanner] = useState(0);
  const [activeCat, setActiveCat] = useState('todos');

  useEffect(() => {
    const id = setInterval(() => setBanner(b => (b + 1) % FEATURED.length), 4000);
    return () => clearInterval(id);
  }, []);

  const f = FEATURED[banner];

  return (
    <div className="pb-4">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-base border border-[#6366F1]/30"
            style={{ background:'linear-gradient(135deg,#312e81,#1e1b4b)' }}>
            C
          </div>
          <div>
            <p className="text-white font-bold text-[13px] leading-none">Olá, Carlos 👋</p>
            <p className="text-white/35 text-[10px] mt-0.5">Onde você quer chegar hoje?</p>
          </div>
        </div>
        <div className="relative">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.07]" style={{ background:'rgba(255,255,255,0.04)' }}>
            <Bell size={16} className="text-white/60"/>
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#EA1D2C] border border-[#07080F] flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">3</span>
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mx-4 mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/[0.06]" style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(12px)' }}>
        <Search size={15} className="text-[#6366F1] flex-shrink-0"/>
        <span className="text-white/30 text-sm">Buscar cursos, professores…</span>
      </div>

      {/* Hero Carousel */}
      <div className="mx-4 mb-4 rounded-3xl overflow-hidden relative" style={{ height:148 }}>
        <AnimatePresence mode="wait">
          <motion.div key={f.id} initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
            transition={{ duration:0.35, ease:'easeOut' }}
            className="absolute inset-0" style={{ background: f.bg }}>
            <div className="absolute inset-0" style={{ background:'radial-gradient(circle at 80% 40%,rgba(255,255,255,0.08) 0%,transparent 55%)' }}/>
            <div className="absolute inset-0" style={{ backgroundImage:'repeating-linear-gradient(135deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 16px)' }}/>
            <div className="relative h-full flex items-center px-5 gap-3">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 bg-black/25 rounded-full px-2.5 py-0.5 mb-2">
                  <span className="text-white/90 text-[9px] font-bold">{f.badge}</span>
                </div>
                <p className="text-white font-black text-[17px] leading-snug" style={{ textShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>{f.title}</p>
                <p className="text-white/55 text-[10px] mt-0.5">{f.instructor}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <StarRating value={f.rating}/>
                  <span className="text-white/60 text-[10px] font-bold">{f.rating}</span>
                  <span className="text-white/25 text-[10px]">·</span>
                  <span className="text-white/40 text-[10px]">{f.students} alunos</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="text-[52px] leading-none" style={{ filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }}>{f.emoji}</div>
                <button className="text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/25" style={{ background:`${f.accent}30` }}>
                  Ver curso →
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {FEATURED.map((_,i) => (
            <button key={i} onClick={() => setBanner(i)} className="rounded-full transition-all"
              style={{ width: banner===i?16:6, height:6, background: banner===i?'white':'rgba(255,255,255,0.3)' }}/>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest px-4 mb-2.5">Explorar por área</p>
        <div className="flex gap-2 px-4 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
          {CATEGORIES.map(c => {
            const active = activeCat === c.id;
            return (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold border transition-all"
                style={{
                  background: active ? `${c.color}25` : 'rgba(255,255,255,0.04)',
                  borderColor: active ? `${c.color}50` : 'rgba(255,255,255,0.07)',
                  color: active ? 'white' : 'rgba(255,255,255,0.45)',
                  boxShadow: active ? `0 4px 14px ${c.color}35` : 'none',
                }}>
                <span className="text-sm leading-none">{c.emoji}</span>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discover Grid */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-bold text-[13px]">Cursos em destaque</p>
          <button className="text-[#6366F1] text-[10px] font-bold flex items-center gap-0.5">Ver todos <ChevronRight size={11}/></button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {DISCOVER_GRID.map(c => (
            <div key={c.id} className="rounded-2xl overflow-hidden border border-white/[0.06]" style={{ background:'#131627' }}>
              {/* Thumbnail */}
              <div className="h-[82px] relative flex items-center justify-center"
                style={{ background:`linear-gradient(135deg,${c.accent}18,${c.accent}08)` }}>
                <span className="text-[42px]" style={{ filter:`drop-shadow(0 4px 12px ${c.accent}60)` }}>{c.emoji}</span>
                <span className="absolute top-2 right-2 text-[8px] font-black px-1.5 py-0.5 rounded-full"
                  style={{ background:`${c.accent}30`, color:c.accent, border:`1px solid ${c.accent}40` }}>
                  {c.tag}
                </span>
                {c.progress > 0 && <div className="absolute bottom-0 left-0 right-0"><ProgressBar value={c.progress} color={c.accent}/></div>}
              </div>
              <div className="px-2.5 py-2.5">
                <p className="text-white text-[11px] font-bold leading-snug line-clamp-2 mb-1">{c.title}</p>
                <p className="text-white/35 text-[9px] mb-1.5">{c.instructor}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={9} fill="#FBBF24" className="text-[#FBBF24]"/>
                    <span className="text-white/60 text-[9px] font-bold">{c.rating}</span>
                  </div>
                  <button className="text-[9px] font-bold px-2 py-1 rounded-lg"
                    style={{ background:`${c.accent}20`, color:c.accent }}>
                    {c.progress > 0 ? 'Continuar' : 'Acessar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue watching */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-bold text-[13px]">Continuar de onde parou</p>
        </div>
        <div className="space-y-2.5">
          {CONTINUE_WATCHING.map(c => (
            <div key={c.id} className="flex items-center gap-3 rounded-2xl px-3 py-3 border border-white/[0.05]" style={{ background:'#131627' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border border-white/5"
                style={{ background:`${c.accent}18` }}>
                {c.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{c.title}</p>
                <p className="text-white/35 text-[10px] mt-0.5 truncate">{c.module} · {c.lastLesson}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <ProgressBar value={c.progress} color={c.accent} className="flex-1"/>
                  <span className="text-[9px] font-bold flex-shrink-0" style={{ color:c.accent }}>{c.progress}%</span>
                </div>
              </div>
              <button onClick={() => onNavigate('player')}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:`${c.accent}25`, border:`1px solid ${c.accent}40` }}>
                <Play size={14} style={{ color:c.accent }} fill={c.accent}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MeusCursosView ───────────────────────────────────────────────────────────

function MeusCursosView({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [tab, setTab] = useState<CourseTab>('andamento');
  const [showCert, setShowCert] = useState(false);

  return (
    <div className="px-4 pb-4">
      <div className="pt-3 flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-[20px]">Meus Cursos</h2>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.07]" style={{ background:'rgba(255,255,255,0.04)' }}>
          <Search size={15} className="text-white/40"/>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon:'📚', val:'3', label:'Cursos', color:'#8B5CF6' },
          { icon:'⏱️', val:'47h', label:'Assistidas', color:'#3B82F6' },
          { icon:'🔥', val:'5 dias', label:'Seguidos', color:'#F59E0B' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl py-3 px-2 flex flex-col items-center border border-white/[0.06]" style={{ background:'#131627' }}>
            <span className="text-lg mb-1">{s.icon}</span>
            <p className="text-white font-bold text-sm leading-none" style={{ color:s.color }}>{s.val}</p>
            <p className="text-white/35 text-[9px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1.5 mb-4 p-1 rounded-2xl border border-white/[0.06]" style={{ background:'rgba(255,255,255,0.02)' }}>
        {(['andamento','concluidos','salvos'] as CourseTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl text-[11px] font-bold capitalize transition-all"
            style={{
              background: tab === t ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: tab === t ? '#8B5CF6' : 'rgba(255,255,255,0.35)',
              border: tab === t ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
            }}>
            {t === 'andamento' ? 'Em andamento' : t === 'concluidos' ? 'Concluídos' : 'Salvos'}
          </button>
        ))}
      </div>

      {/* Course list */}
      {tab === 'andamento' && (
        <div className="space-y-3">
          {MY_COURSES.filter(c => !c.certificate).map(c => (
            <div key={c.id} className="rounded-3xl overflow-hidden border border-white/[0.06]"
              style={{ background:'#131627', borderLeft:`3px solid ${c.accent}` }}>
              <div className="h-1 w-full" style={{ background:`linear-gradient(90deg,${c.accent},${c.accent}40)` }}/>
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border border-white/5"
                    style={{ background:`${c.accent}18` }}>{c.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm leading-tight">{c.title}</p>
                    <p className="text-white/35 text-[10px] mt-0.5">{c.instructor}</p>
                  </div>
                </div>
                <p className="text-white/30 text-[10px] italic mb-2 truncate">↩ {c.lastLesson}</p>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/40 text-[10px]">{c.done} de {c.total} aulas</span>
                  <span className="text-[10px] font-bold" style={{ color:c.accent }}>{c.progress}%</span>
                </div>
                <ProgressBar value={c.progress} color={c.accent} className="mb-3"/>
                <button onClick={() => onNavigate('player')}
                  className="w-full py-2.5 rounded-2xl text-white text-xs font-bold"
                  style={{ background:`linear-gradient(135deg,${c.accent},${c.accent}CC)`, boxShadow:`0 4px 14px ${c.accent}35` }}>
                  Continuar →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'concluidos' && (
        <div>
          {MY_COURSES.filter(c => c.certificate).map(c => (
            <div key={c.id} className="rounded-3xl overflow-hidden border border-[#10B981]/25" style={{ background:'#131627' }}>
              <div className="h-1 w-full" style={{ background:'linear-gradient(90deg,#10B981,#10B98140)' }}/>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border border-[#10B981]/20"
                    style={{ background:'rgba(16,185,129,0.1)' }}>{c.emoji}</div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{c.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Check size={10} className="text-[#10B981]"/>
                      <p className="text-[#10B981] text-[10px] font-semibold">Concluído · {c.completedAt}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowCert(true)}
                  className="w-full py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-[#D4AF37]/30"
                  style={{ background:'rgba(212,175,55,0.08)', color:'#D4AF37' }}>
                  <Award size={13}/> Ver Certificado
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'salvos' && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-3 border border-white/5" style={{ background:'rgba(255,255,255,0.03)' }}>
            <Bookmark size={28} className="text-white/20"/>
          </div>
          <p className="text-white/40 text-sm font-semibold">Nenhum curso salvo</p>
          <p className="text-white/20 text-xs mt-1">Explore cursos e salve os favoritos</p>
        </div>
      )}

      {/* Certificate overlay */}
      <AnimatePresence>
        {showCert && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCert(false)}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              className="mx-6 rounded-3xl p-6 border text-center"
              style={{ background:'linear-gradient(135deg,#1a1200,#0a0800)', borderColor:'rgba(212,175,55,0.4)',
                boxShadow:'0 0 60px rgba(212,175,55,0.2)' }}>
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">Certificado de Conclusão</p>
              <p className="text-white font-bold text-lg leading-tight mb-1">Carlos Henrique</p>
              <p className="text-white/40 text-xs mb-3">concluiu com êxito o curso</p>
              <p className="text-white font-bold text-sm mb-1">Figma Masterclass</p>
              <p className="text-white/30 text-[10px]">28 horas · 28 aulas · Fevereiro 2026</p>
              <div className="mt-4 pt-4 border-t border-[#D4AF37]/15">
                <p className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-wider">Julia Nunes · Instrutora</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PlayerView ───────────────────────────────────────────────────────────────

function PlayerView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [tab, setTab] = useState<PlayerTab>('conteudo');
  const [openMod, setOpenMod] = useState<string>('m3');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setProgress(p => p >= 100 ? 0 : p + 0.2), 200);
    return () => clearInterval(id);
  }, [isPlaying]);

  const totalSec = 52 * 60;
  const elapsed = Math.floor((progress / 100) * totalSec);
  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="flex flex-col" style={{ height:'100%' }}>

      {/* Player */}
      <div className="relative flex-shrink-0" style={{ height:200, background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-15 text-[80px]" style={{ filter:'blur(8px)' }}>⚛️</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[52px]" style={{ filter:'drop-shadow(0 4px 24px rgba(99,102,241,0.7))' }}>⚛️</span>
        </div>
        {/* Controls */}
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <SkipBack size={18} className="text-white"/>
          </button>
          <button onClick={() => setIsPlaying(p => !p)}
            className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/30"
            style={{ background:'rgba(99,102,241,0.7)', backdropFilter:'blur(12px)', boxShadow:'0 0 30px rgba(99,102,241,0.5)' }}>
            {isPlaying
              ? <Pause size={22} className="text-white" fill="white"/>
              : <Play size={22} className="text-white" fill="white"/>}
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <SkipForward size={18} className="text-white"/>
          </button>
        </div>
        {/* Time */}
        <div className="absolute bottom-8 right-3 text-white/60 text-[10px] font-bold">{fmt(elapsed)} / {PLAYER_COURSE.duration}</div>
        {/* Progress */}
        <div className="absolute bottom-5 left-3 right-3">
          <div className="w-full h-1 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full rounded-full transition-none" style={{ width:`${progress}%`, background:'linear-gradient(90deg,#6366F1,#8B5CF6)' }}/>
          </div>
        </div>
        {/* Top controls */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <button className="w-7 h-7 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <ArrowLeft size={13} className="text-white/70"/>
          </button>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button className="w-7 h-7 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Volume2 size={12} className="text-white/70"/>
          </button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Maximize size={12} className="text-white/70"/>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth:'none' }}>

        {/* Lesson info */}
        <div>
          <p className="text-white font-bold text-[14px] leading-snug">{PLAYER_COURSE.currentLesson}</p>
          <p className="text-white/35 text-[10px] mt-0.5">{PLAYER_COURSE.currentModule}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-[#6366F1]/15 text-[#6366F1] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#6366F1]/25">52 min</span>
            <span className="bg-white/5 text-white/40 text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/8">Intermediário</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06]">
          {(['conteudo','notas','discussao'] as PlayerTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2 text-[11px] font-bold capitalize transition-all border-b-2 -mb-px"
              style={{ borderBottomColor: tab===t ? '#6366F1' : 'transparent', color: tab===t ? '#6366F1' : 'rgba(255,255,255,0.3)' }}>
              {t === 'conteudo' ? 'Conteúdo' : t === 'notas' ? 'Notas' : 'Discussão'}
            </button>
          ))}
        </div>

        {/* Tab: Conteúdo */}
        {tab === 'conteudo' && (
          <div className="space-y-2 pb-4">
            {PLAYER_MODULES.map(mod => (
              <ModuleAccordion key={mod.id} mod={mod} isOpen={openMod === mod.id}
                onToggle={() => setOpenMod(o => o === mod.id ? '' : mod.id)}/>
            ))}
          </div>
        )}

        {/* Tab: Notas */}
        {tab === 'notas' && (
          <div className="space-y-3 pb-4">
            <div className="rounded-2xl overflow-hidden border border-white/[0.06]" style={{ background:'rgba(255,255,255,0.03)' }}>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                className="w-full bg-transparent px-3 pt-3 text-white/70 text-xs resize-none outline-none placeholder-white/20"
                placeholder={`Adicione uma nota nesta aula (${fmt(elapsed)})…`}/>
              <div className="flex items-center justify-end px-3 pb-2.5">
                <button className="text-[10px] font-bold px-3 py-1.5 rounded-xl" style={{ background:'rgba(99,102,241,0.2)', color:'#6366F1' }}>
                  Salvar nota
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {SAVED_NOTES.map((n,i) => (
                <div key={i} className="rounded-2xl px-3 py-3 border border-white/[0.05]" style={{ background:'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <button className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background:'rgba(99,102,241,0.15)', color:'#6366F1' }}>
                      ⏱ {n.time}
                    </button>
                  </div>
                  <p className="text-white/55 text-[11px] leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Discussão */}
        {tab === 'discussao' && (
          <div className="space-y-3 pb-4">
            {DISCUSSION.map((d,i) => (
              <div key={i} className="rounded-2xl px-3 py-3 border border-white/[0.05]" style={{ background:'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,${d.color},${d.color}AA)` }}>{d.avatar}</div>
                  <div className="flex-1">
                    <p className="text-white text-[11px] font-bold">{d.name}</p>
                  </div>
                  <span className="text-white/25 text-[9px]">{d.time} atrás</span>
                </div>
                <p className="text-white/55 text-[11px] leading-relaxed mb-2">{d.text}</p>
                <div className="flex items-center gap-1.5">
                  <ThumbsUp size={11} className="text-white/25"/>
                  <span className="text-white/30 text-[10px]">{d.likes}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PerfilView ───────────────────────────────────────────────────────────────

function PerfilView() {
  const menuItems = [
    { icon:User,       label:'Editar Perfil',        sub:'Carlos Henrique' },
    { icon:Bell,       label:'Notificações',          sub:'Ativadas' },
    { icon:Download,   label:'Downloads offline',     sub:'2 cursos baixados' },
    { icon:Shield,     label:'Privacidade',           sub:'Dados e segurança' },
    { icon:HelpCircle, label:'Suporte',               sub:'Chat 24h' },
    { icon:LogOut,     label:'Sair', danger:true,     sub:'' },
  ];

  return (
    <div className="px-4 pb-4 space-y-4">

      {/* Hero */}
      <div className="pt-4 pb-2 flex flex-col items-center text-center relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(circle at 50% 10%,rgba(212,175,55,0.12),transparent 55%)' }}/>
        <div className="relative mb-3">
          <CircleProgress value={68} size={88} stroke={3} color="#D4AF37">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white border border-[#D4AF37]/20"
              style={{ background:'linear-gradient(135deg,#1a1200,#0a0800)', boxShadow:'0 0 30px rgba(212,175,55,0.25)' }}>
              C
            </div>
          </CircleProgress>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-xl bg-[#D4AF37] flex items-center justify-center border-2 border-[#07080F]">
            <Trophy size={12} className="text-white"/>
          </div>
        </div>
        <p className="text-white font-bold text-lg leading-none mb-0.5">Carlos Henrique</p>
        <p className="text-white/35 text-[10px] mb-2">Membro desde Jan 2026</p>
        <div className="flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-3 py-1">
          <span className="text-[10px]">✨</span>
          <span className="text-[#D4AF37] text-[10px] font-bold">Plano Pro · Ativo</span>
        </div>
      </div>

      {/* Stats 2x2 */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon:'📚', val:'3', label:'Cursos', color:'#8B5CF6' },
          { icon:'⏱️', val:'47h', label:'Assistidas', color:'#3B82F6' },
          { icon:'🏆', val:'1', label:'Certificado', color:'#D4AF37' },
          { icon:'🔥', val:'5 dias', label:'Sequência atual', color:'#F59E0B' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3.5 border border-white/[0.06] flex items-center gap-3" style={{ background:'#131627' }}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="font-bold text-[15px] leading-none" style={{ color:s.color }}>{s.val}</p>
              <p className="text-white/35 text-[9px] mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overall progress + streak */}
      <div className="rounded-3xl p-4 border border-white/[0.06] flex items-center gap-4" style={{ background:'#131627' }}>
        <CircleProgress value={68} size={64} stroke={5} color="#D4AF37">
          <span className="text-white font-black text-[13px]">68%</span>
        </CircleProgress>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">Progresso geral</p>
          <p className="text-white/35 text-[10px] mt-0.5 leading-relaxed">34 de 50 aulas no curso principal</p>
          <div className="flex items-center gap-1.5 mt-2">
            {['Seg','Ter','Qua','Qui','Sex','Sab','Dom'].map((d,i) => (
              <div key={d} className="flex flex-col items-center gap-0.5">
                <div className="w-4 h-4 rounded-full" style={{ background: i < 5 ? '#D4AF37' : 'rgba(255,255,255,0.08)' }}/>
                <span className="text-[7px] text-white/25">{d[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-bold text-[13px]">Conquistas</p>
          <span className="text-[#D4AF37] text-[10px] font-bold">5/8 desbloqueadas</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {BADGES.map(b => <BadgeCard key={b.id} badge={b}/>)}
        </div>
      </div>

      {/* Subscription */}
      <div className="rounded-3xl p-4 relative overflow-hidden border border-[#D4AF37]/20" style={{ background:'linear-gradient(135deg,#1a1200,#0f0d00,#0a0800)' }}>
        <div className="absolute inset-0" style={{ background:'radial-gradient(circle at 80% 20%,rgba(212,175,55,0.12),transparent 55%)' }}/>
        <div className="absolute right-4 top-3 text-4xl opacity-10 select-none">✨</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Award size={13} className="text-[#D4AF37]"/>
            <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">Plano Pro</p>
            <span className="ml-auto bg-[#10B981]/15 text-[#10B981] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#10B981]/25">Ativo</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {['♾️ Acesso ilimitado','⬇️ Downloads','🏆 Certificados','⚡ Suporte prioritário'].map(f => (
              <p key={f} className="text-white/55 text-[10px]">{f}</p>
            ))}
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-2xl px-3 py-2">
            <p className="text-white/35 text-[10px]">Próxima cobrança: 11 Abr 2026 · R$ 89,90/mês</p>
          </div>
          <button className="mt-2 w-full py-2 rounded-2xl text-[10px] font-bold border border-[#D4AF37]/25 text-[#D4AF37]">
            Gerenciar assinatura
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="rounded-3xl border border-white/[0.05] overflow-hidden" style={{ background:'rgba(255,255,255,0.02)' }}>
        {menuItems.map((item,i) => (
          <button key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/5 ${i < menuItems.length-1 ? 'border-b border-white/[0.05]' : ''}`}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background:(item as any).danger?'rgba(239,68,68,0.1)':'rgba(255,255,255,0.04)' }}>
              <item.icon size={15} style={{ color:(item as any).danger?'#EF4444':'rgba(255,255,255,0.4)' }}/>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium" style={{ color:(item as any).danger?'#EF4444':'rgba(255,255,255,0.8)' }}>{item.label}</p>
              {item.sub && <p className="text-white/25 text-[10px] mt-0.5">{item.sub}</p>}
            </div>
            {!(item as any).danger && <ChevronRight size={14} className="text-white/15"/>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Nav & Constants ──────────────────────────────────────────────────────────

const NAV_ITEMS: { id: View; icon: React.ElementType; label: string }[] = [
  { id:'inicio',      icon:Compass,   label:'Descobrir'  },
  { id:'meus-cursos', icon:BookOpen,  label:'Cursos'     },
  { id:'player',      icon:Play,      label:'Player'     },
  { id:'perfil',      icon:User,      label:'Perfil'     },
];

const ACCENT: Record<View, string> = {
  inicio:       '#6366F1',
  'meus-cursos':'#8B5CF6',
  player:       '#3B82F6',
  perfil:       '#D4AF37',
};

// ─── Export ───────────────────────────────────────────────────────────────────

export default function EducacaoApp() {
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
      style={{ background:'radial-gradient(ellipse at center,#0d0c1f 0%,#050508 100%)' }}>

      <div className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background:`radial-gradient(circle at 50% 40%,${accent}12 0%,transparent 60%)` }}/>

      <div className="relative overflow-hidden" style={{ width: 360 * scale, height: 720 * scale, flexShrink: 0 }}>
      <div className="absolute top-0 left-0" style={{ width:360, height:720, transform:`scale(${scale})`, transformOrigin:'top left' }}>

        {/* Side buttons */}
        {[{l:true,t:96,h:28},{l:true,t:144,h:48},{l:true,t:208,h:48},{l:false,t:128,h:64}].map((b,i) => (
          <div key={i} className="absolute rounded-sm" style={{ [b.l?'left':'right']:'-3px', top:b.t, width:3, height:b.h, background:'#1a1a2e' }}/>
        ))}

        {/* Frame */}
        <div className="absolute inset-0 rounded-[44px] overflow-hidden"
          style={{ border:'6px solid #1a1a2e', background:'#07080F',
            boxShadow:'0 0 0 1px rgba(255,255,255,0.05),0 40px 100px rgba(0,0,0,0.95),0 0 80px rgba(0,0,0,0.6),inset 0 0 0 1px rgba(255,255,255,0.02)' }}>

          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-3xl z-20 flex items-center justify-center gap-2"
            style={{ background:'#1a1a2e' }}>
            <div className="w-2 h-2 rounded-full bg-[#2a2a40]"/>
            <div className="w-3 h-3 rounded-full bg-[#2a2a40]"/>
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
          <div className={`absolute left-0 right-0 bottom-20 overflow-y-auto ${view === 'player' ? 'top-10 overflow-hidden' : 'top-10'}`}
            style={{ scrollbarWidth:'none' }}>
            <AnimatePresence mode="wait">
              <motion.div key={view} className="h-full"
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                transition={{ duration:0.2, ease:'easeOut' }}>
                {view === 'inicio'      && <InicioView onNavigate={setView}/>}
                {view === 'meus-cursos' && <MeusCursosView onNavigate={setView}/>}
                {view === 'player'      && <PlayerView/>}
                {view === 'perfil'      && <PerfilView/>}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0 h-20 flex items-start pt-2 px-2 border-t border-white/[0.06]"
            style={{ background:'rgba(7,8,15,0.97)', backdropFilter:'blur(20px)' }}>
            {NAV_ITEMS.map(({ id, icon:Icon, label }) => {
              const active = view === id;
              const col = ACCENT[id];
              return (
                <button key={id} onClick={() => setView(id)} className="flex-1 flex flex-col items-center gap-1 pt-1">
                  <div className="w-10 h-7 rounded-full flex items-center justify-center relative transition-all duration-200"
                    style={{ background: active ? col+'22' : 'transparent' }}>
                    {active && <div className="absolute inset-0 rounded-full" style={{ background:col+'15', filter:'blur(8px)' }}/>}
                    <Icon size={18} style={{ color: active ? col : 'rgba(255,255,255,0.25)' }}/>
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: active ? col : 'rgba(255,255,255,0.25)' }}>{label}</span>
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
