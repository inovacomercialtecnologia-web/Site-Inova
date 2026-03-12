import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Dumbbell, Apple, Heart, Bell, ChevronRight,
  Plus, Check, Clock, Flame, Droplets, Moon, Weight,
  Activity, Calendar, User, TrendingUp, Play, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type View = 'inicio' | 'treinos' | 'nutricao' | 'saude';

interface Exercise { name: string; sets: number; reps: string; done: boolean }
interface Meal { name: string; kcal: number; time: string; done: boolean; icon: string }

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXERCISES_DATA: Exercise[] = [
  { name: 'Supino Reto',    sets: 4, reps: '12',   done: true  },
  { name: 'Crucifixo',      sets: 3, reps: '15',   done: true  },
  { name: 'Tríceps Corda',  sets: 4, reps: '12',   done: false },
  { name: 'Mergulho',       sets: 3, reps: 'falha', done: false },
  { name: 'Extensão',       sets: 3, reps: '15',   done: false },
];

const MEALS_DATA: Meal[] = [
  { name: 'Café da manhã', kcal: 480, time: '07:30', done: true,  icon: '☕' },
  { name: 'Almoço',        kcal: 720, time: '12:15', done: true,  icon: '🍽️' },
  { name: 'Lanche',        kcal: 240, time: '16:00', done: true,  icon: '🍎' },
  { name: 'Jantar',        kcal: 400, time: '20:00', done: false, icon: '🥗' },
];

const WEEK_ACTIVITY = [45, 0, 62, 38, 55, 0, 45]; // min por dia seg-dom
const WEEK_DAYS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

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
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function BPMPulse() {
  const path = "M0,20 L10,20 L15,5 L20,35 L25,20 L30,20 L35,10 L40,30 L45,20 L60,20";
  return (
    <svg viewBox="0 0 60 40" className="w-full h-6" preserveAspectRatio="none">
      <path d={path} fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Sub-views ────────────────────────────────────────────────────────────────

function InicioView() {
  return (
    <div className="px-4 pb-4 space-y-4">
      {/* Greeting */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-white/50 text-xs">Quarta-feira, 11 Mar</p>
          <h2 className="text-white font-bold text-lg leading-tight">Bom dia, Rafael! 👋</h2>
        </div>
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
            <Bell size={16} className="text-[#22C55E]" />
          </div>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-400 border border-[#0A0A14]" />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-3 py-2">
        <span className="text-lg">🔥</span>
        <div>
          <p className="text-white text-xs font-semibold">12 dias consecutivos</p>
          <p className="text-white/40 text-[10px]">Continue assim! Meta: 30 dias</p>
        </div>
        <div className="ml-auto">
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#F97316] rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
      </div>

      {/* Progress Rings */}
      <div className="bg-[#13131F] rounded-3xl p-4">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Hoje</p>
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center gap-2">
            <CircleProgress value={7240} max={10000} size={72} stroke={6} color="#22C55E">
              <span className="text-[10px] font-bold text-white">72%</span>
            </CircleProgress>
            <p className="text-white/60 text-[10px]">Passos</p>
            <p className="text-white text-xs font-bold">7.240</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircleProgress value={1840} max={2200} size={72} stroke={6} color="#F97316">
              <span className="text-[10px] font-bold text-white">84%</span>
            </CircleProgress>
            <p className="text-white/60 text-[10px]">Calorias</p>
            <p className="text-white text-xs font-bold">1.840</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircleProgress value={6} max={8} size={72} stroke={6} color="#3B82F6">
              <span className="text-[10px] font-bold text-white">75%</span>
            </CircleProgress>
            <p className="text-white/60 text-[10px]">Água</p>
            <p className="text-white text-xs font-bold">6 / 8</p>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Moon, label: 'Sono', value: '7h32', sub: '+12min meta', color: '#8B5CF6' },
          { icon: Activity, label: 'IMC', value: '22.8', sub: 'Peso ideal', color: '#22C55E' },
          { icon: Heart, label: 'BPM', value: '68', sub: 'Em repouso', color: '#EF4444' },
          { icon: Weight, label: 'Peso', value: '78kg', sub: '-0.5 essa sem.', color: '#F59E0B' },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="bg-[#13131F] rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: color + '20' }}>
                <Icon size={13} style={{ color }} />
              </div>
              <span className="text-white/50 text-xs">{label}</span>
            </div>
            <p className="text-white font-bold text-lg leading-none">{value}</p>
            <p className="text-white/40 text-[10px] mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Treino do dia */}
      <div className="bg-gradient-to-r from-[#1A1A2E] to-[#16213E] rounded-2xl p-4 border border-[#3B82F6]/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#F97316] flex items-center justify-center flex-shrink-0">
          <Dumbbell size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/50 text-[10px] uppercase tracking-wider">Treino de hoje</p>
          <p className="text-white font-semibold text-sm">Peito & Tríceps</p>
          <p className="text-white/40 text-[10px]">5 exercícios · 45min</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          <ChevronRight size={14} className="text-white/60" />
        </div>
      </div>

      {/* Próxima consulta */}
      <div className="bg-[#13131F] rounded-2xl p-3 border border-white/5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center flex-shrink-0">
          <Calendar size={15} className="text-[#3B82F6]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold">Dr. Marcos Lima</p>
          <p className="text-white/40 text-[10px]">Cardiologia · Sex, 14 Mar · 14:00</p>
        </div>
        <span className="text-[10px] font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-full">Em 3 dias</span>
      </div>
    </div>
  );
}

function TreinosView() {
  const [exercises, setExercises] = useState(EXERCISES_DATA);
  const maxMin = Math.max(...WEEK_ACTIVITY);

  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-white font-bold text-lg">Treinos</h2>
        <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">Esta semana</span>
      </div>

      {/* Weekly chart */}
      <div className="bg-[#13131F] rounded-3xl p-4">
        <div className="flex items-end justify-between gap-1.5 h-16">
          {WEEK_ACTIVITY.map((min, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full rounded-t-lg transition-all" style={{
                height: `${min ? (min / maxMin) * 52 : 4}px`,
                background: i === 4 ? '#F97316' : min ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.05)',
              }} />
              <span className="text-white/40 text-[9px]">{WEEK_DAYS[i]}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div className="text-center">
            <p className="text-white font-bold text-sm">4</p>
            <p className="text-white/40 text-[10px]">treinos</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-sm">245<span className="text-xs font-normal text-white/40">min</span></p>
            <p className="text-white/40 text-[10px]">total</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-sm">1.840<span className="text-xs font-normal text-white/40">kcal</span></p>
            <p className="text-white/40 text-[10px]">queimadas</p>
          </div>
        </div>
      </div>

      {/* Treino ativo */}
      <div className="rounded-3xl p-4 bg-gradient-to-br from-[#431407] via-[#7C2D12] to-[#1C0A03] border border-[#F97316]/20">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[#F97316] text-[10px] font-bold uppercase tracking-wider">Treino de hoje</p>
            <p className="text-white font-bold text-base mt-0.5">Peito & Tríceps</p>
          </div>
          <span className="text-[10px] font-bold bg-[#F97316]/20 text-[#F97316] px-2 py-0.5 rounded-full">45 min</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          {[
            { icon: Flame, val: '320 kcal' },
            { icon: Dumbbell, val: '5 exercícios' },
          ].map(({ icon: Icon, val }) => (
            <div key={val} className="flex items-center gap-1.5 bg-black/20 rounded-xl px-3 py-1.5">
              <Icon size={11} className="text-[#F97316]" />
              <span className="text-white/70 text-[10px]">{val}</span>
            </div>
          ))}
        </div>
        <button className="w-full flex items-center justify-center gap-2 bg-[#F97316] text-white text-sm font-bold rounded-2xl py-2.5">
          <Play size={14} fill="white" />
          Iniciar Treino
        </button>
      </div>

      {/* Exercise list */}
      <div className="space-y-2">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Exercícios</p>
        {exercises.map((ex, i) => (
          <motion.div key={ex.name} layout
            className={`flex items-center gap-3 bg-[#13131F] rounded-2xl px-3 py-3 border transition-colors ${ex.done ? 'border-[#22C55E]/20' : 'border-white/5'}`}>
            <button
              onClick={() => setExercises(prev => prev.map((e, j) => j === i ? { ...e, done: !e.done } : e))}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${ex.done ? 'bg-[#22C55E] border-[#22C55E]' : 'border-white/20'}`}>
              {ex.done && <Check size={12} className="text-white" strokeWidth={3} />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${ex.done ? 'text-white/40 line-through' : 'text-white'}`}>{ex.name}</p>
            </div>
            <span className="text-white/40 text-xs flex-shrink-0">{ex.sets}×{ex.reps}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NutricaoView() {
  const total = MEALS_DATA.reduce((s, m) => s + (m.done ? m.kcal : 0), 0);
  const meta = 2200;
  const macros = [
    { label: 'Proteína', value: 142, max: 165, unit: 'g', color: '#3B82F6' },
    { label: 'Carbo',    value: 198, max: 250, unit: 'g', color: '#F97316' },
    { label: 'Gordura',  value: 61,  max: 73,  unit: 'g', color: '#A855F7' },
  ];

  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-white font-bold text-lg">Nutrição</h2>
        <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">Quarta, 11 Mar</span>
      </div>

      {/* Calorie ring */}
      <div className="bg-[#13131F] rounded-3xl p-4 flex flex-col items-center">
        <CircleProgress value={total} max={meta} size={120} stroke={10} color="#A855F7">
          <div className="text-center">
            <p className="text-white font-bold text-xl leading-none">{total.toLocaleString('pt-BR')}</p>
            <p className="text-white/40 text-[10px]">kcal</p>
          </div>
        </CircleProgress>
        <p className="text-white/40 text-xs mt-3">Meta: {meta.toLocaleString('pt-BR')} kcal · Restam {(meta - total).toLocaleString('pt-BR')}</p>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-2">
        {macros.map(m => (
          <div key={m.label} className="bg-[#13131F] rounded-2xl p-3 border border-white/5">
            <div className="w-6 h-1.5 rounded-full mb-2" style={{ background: m.color + '40' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${(m.value/m.max)*100}%`, background: m.color }} />
            </div>
            <p className="text-white font-bold text-sm">{m.value}<span className="text-xs font-normal text-white/40">{m.unit}</span></p>
            <p className="text-white/40 text-[10px] mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Meals */}
      <div className="space-y-2">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Refeições</p>
        {MEALS_DATA.map(meal => (
          <div key={meal.name} className={`flex items-center gap-3 bg-[#13131F] rounded-2xl px-3 py-3 border ${meal.done ? 'border-[#A855F7]/15' : 'border-white/5'}`}>
            <span className="text-lg flex-shrink-0">{meal.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${meal.done ? 'text-white/60' : 'text-white'}`}>{meal.name}</p>
              <p className="text-white/30 text-[10px]">{meal.time}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white/60 text-xs font-semibold">{meal.kcal} kcal</p>
              {meal.done
                ? <span className="text-[10px] text-[#22C55E]">✓ Registrado</span>
                : <span className="text-[10px] text-white/30">pendente</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Add button */}
      <button className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 text-white/40 text-sm rounded-2xl py-3 hover:border-white/30 hover:text-white/60 transition-colors">
        <Plus size={15} />
        Adicionar alimento
      </button>
    </div>
  );
}

function ConsultasView() {
  const bpData = [78, 80, 76, 79, 75, 77, 76];

  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-white font-bold text-lg">Saúde</h2>
        <button className="w-8 h-8 rounded-full bg-[#3B82F6]/15 flex items-center justify-center">
          <Plus size={15} className="text-[#3B82F6]" />
        </button>
      </div>

      {/* Próxima consulta */}
      <div className="bg-gradient-to-br from-[#1E3A5F] to-[#0F1E35] rounded-3xl p-4 border border-[#3B82F6]/25">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-[#3B82F6] flex items-center justify-center">
            <Calendar size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[#60A5FA] text-[10px] font-bold uppercase tracking-wider">Próxima consulta</p>
            <p className="text-white text-xs font-semibold">Em 3 dias</p>
          </div>
        </div>
        <p className="text-white font-bold text-base">Dr. Marcos Lima</p>
        <p className="text-white/60 text-xs mt-0.5">Cardiologia</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1.5 bg-black/20 rounded-xl px-3 py-1.5 flex-1">
            <Calendar size={11} className="text-white/50" />
            <span className="text-white/70 text-[10px]">Sex, 14 Mar</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 rounded-xl px-3 py-1.5 flex-1">
            <Clock size={11} className="text-white/50" />
            <span className="text-white/70 text-[10px]">14:00</span>
          </div>
        </div>
        <button className="w-full mt-3 bg-[#3B82F6] text-white text-xs font-bold rounded-xl py-2">
          Ver Detalhes
        </button>
      </div>

      {/* Vitais */}
      <div className="space-y-3">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Métricas Vitais</p>

        {/* Pressão */}
        <div className="bg-[#13131F] rounded-2xl p-3 border border-white/5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Pressão Arterial</p>
              <p className="text-white font-bold text-xl leading-none mt-0.5">118<span className="text-white/40 text-sm font-normal">/76</span></p>
              <p className="text-white/30 text-[10px]">mmHg · Ótimo</p>
            </div>
            <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">Normal</span>
          </div>
          <svg viewBox={`0 0 ${bpData.length * 10} 40`} className="w-full h-8" preserveAspectRatio="none">
            <polyline
              points={bpData.map((v, i) => `${i * 10 + 5},${40 - ((v - 70) / 15) * 30}`).join(' ')}
              fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* BPM */}
        <div className="bg-[#13131F] rounded-2xl p-3 border border-white/5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Frequência Cardíaca</p>
              <p className="text-white font-bold text-xl leading-none mt-0.5">68<span className="text-white/40 text-sm font-normal"> bpm</span></p>
              <p className="text-white/30 text-[10px]">Em repouso · Ótimo</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <Heart size={12} className="text-red-400" fill="#f87171" />
            </div>
          </div>
          <BPMPulse />
        </div>
      </div>

      {/* Histórico */}
      <div className="space-y-2">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Histórico</p>
        {[
          { esp: 'Clínico Geral',  dr: 'Dra. Ana Costa',    date: '15 Fev 2026', status: 'Concluída' },
          { esp: 'Dermatologia',   dr: 'Dr. Paulo Souza',   date: '02 Jan 2026', status: 'Concluída' },
          { esp: 'Oftalmologia',   dr: 'Dra. Lúcia Mendes', date: '10 Nov 2025', status: 'Concluída' },
        ].map((c, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#13131F] rounded-2xl px-3 py-3 border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
              <User size={13} className="text-[#3B82F6]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold">{c.esp}</p>
              <p className="text-white/40 text-[10px]">{c.dr} · {c.date}</p>
            </div>
            <span className="text-[10px] text-[#22C55E] flex-shrink-0">✓</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: View; icon: React.ElementType; label: string }[] = [
  { id: 'inicio',   icon: Home,     label: 'Início'   },
  { id: 'treinos',  icon: Dumbbell, label: 'Treinos'  },
  { id: 'nutricao', icon: Apple,    label: 'Nutrição' },
  { id: 'saude',    icon: Heart,    label: 'Saúde'    },
];

const ACCENT: Record<View, string> = {
  inicio:   '#22C55E',
  treinos:  '#F97316',
  nutricao: '#A855F7',
  saude:    '#3B82F6',
};

// ─── Export ───────────────────────────────────────────────────────────────────

export default function SaudeApp() {
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
      style={{ background: 'radial-gradient(ellipse at center, #0d1f12 0%, #050508 100%)' }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${accent}18 0%, transparent 65%)`, transition: 'background 0.5s ease' }} />

      {/* Phone frame */}
      <div className="relative flex-shrink-0" style={{ width: 360, height: 720, transform: `scale(${scale})`, transformOrigin: 'center' }}>

        {/* Side buttons */}
        <div className="absolute left-[-3px] top-24 w-1 h-8 bg-[#1a1a2e] rounded-l-sm" />
        <div className="absolute left-[-3px] top-36 w-1 h-12 bg-[#1a1a2e] rounded-l-sm" />
        <div className="absolute left-[-3px] top-52 w-1 h-12 bg-[#1a1a2e] rounded-l-sm" />
        <div className="absolute right-[-3px] top-32 w-1 h-16 bg-[#1a1a2e] rounded-r-sm" />

        {/* Phone shell */}
        <div className="absolute inset-0 rounded-[44px] border-[6px] border-[#1a1a2e] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_32px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(0,0,0,0.5)] overflow-hidden bg-[#0A0A14]">

          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a2e] rounded-b-3xl z-20 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
            <div className="w-3 h-3 rounded-full bg-[#2a2a3e]" />
          </div>

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-10 flex items-end justify-between px-7 pb-1.5 z-10">
            <span className="text-white text-[11px] font-semibold">{time}</span>
            <div className="flex items-center gap-1.5">
              {/* Signal */}
              <div className="flex items-end gap-[2px]">
                {[3,5,7,9].map((h,i) => <div key={i} className="w-[3px] rounded-sm bg-white" style={{ height: h }} />)}
              </div>
              {/* WiFi */}
              <svg width="14" height="11" viewBox="0 0 14 11">
                <path d="M7 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="white"/>
                <path d="M3.5 5.5C4.8 4.2 5.8 3.5 7 3.5s2.2.7 3.5 2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M1 3C2.8 1.2 4.7 0 7 0s4.2 1.2 6 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
              {/* Battery */}
              <div className="flex items-center gap-px">
                <div className="w-6 h-3 rounded-sm border border-white/60 p-px">
                  <div className="h-full w-[75%] bg-white rounded-[1px]" />
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
                {view === 'inicio'   && <InicioView />}
                {view === 'treinos'  && <TreinosView />}
                {view === 'nutricao' && <NutricaoView />}
                {view === 'saude'    && <ConsultasView />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0D0D1A]/95 backdrop-blur-sm border-t border-white/5 flex items-start pt-2 px-2">
            {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
              const active = view === id;
              const col = ACCENT[id];
              return (
                <button key={id} onClick={() => setView(id)}
                  className="flex-1 flex flex-col items-center gap-1 pt-1 transition-all">
                  <div className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${active ? 'bg-opacity-20' : ''}`}
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
  );
}
