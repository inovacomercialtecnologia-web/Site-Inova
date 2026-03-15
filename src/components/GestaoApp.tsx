import React, { useState, useEffect, useRef } from 'react';
import {
  Map, Users, ClipboardList, BarChart3,
  Bell, Phone, MessageCircle, Clock,
  ChevronRight, ChevronDown, Filter, Search,
  Zap, Activity, Shield, Award, Navigation,
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown,
  MapPin, UserCheck, MoreVertical, Plus, ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'campo' | 'equipe' | 'tarefas' | 'metricas';
type StatusType = 'field' | 'paused' | 'delayed' | 'offline';
type PriorityType = 'urgent' | 'high' | 'normal';
type TaskStatus = 'delayed' | 'progress' | 'pending' | 'done';

interface TeamMember {
  id: string; name: string; short: string; role: string;
  initials: string; status: StatusType; task: string;
  taskTime: string; color: string;
}

interface Task {
  id: string; title: string; client: string; address: string;
  techId: string | null; priority: PriorityType;
  status: TaskStatus; deadline: string; sla: string;
}

interface MapPin { id: string; x: number; y: number; status: StatusType; label: string; }

// ─── Data ─────────────────────────────────────────────────────────────────────

const TEAM: TeamMember[] = [
  { id:'m1', name:'Carlos Eduardo Souza',  short:'Carlos E.',  role:'Supervisor de Campo',   initials:'CE', status:'field',   task:'Inspeção elétrica — Zona Norte',      taskTime:'1h 20min', color:'#1A6FE8' },
  { id:'m2', name:'Ana Beatriz Ferreira',  short:'Ana B.',     role:'Técnica de Campo Sr.',  initials:'AB', status:'field',   task:'Manutenção preventiva — Guarulhos',    taskTime:'45min',    color:'#10B981' },
  { id:'m3', name:'Roberto Nascimento',    short:'Roberto N.', role:'Técnico de Campo',      initials:'RN', status:'paused',  task:'Almoço · retorno 13:30',               taskTime:'28min',    color:'#F59E0B' },
  { id:'m4', name:'Juliana Costa Lima',    short:'Juliana C.', role:'Coordenadora Operac.',  initials:'JC', status:'field',   task:'Vistoria pós-obra — Santo André',      taskTime:'2h 05min', color:'#8B5CF6' },
  { id:'m5', name:'Marcos Henrique Dias',  short:'Marcos H.',  role:'Técnico de Campo',      initials:'MH', status:'delayed', task:'Instalação fotovoltaica — ATRASO',     taskTime:'3h 40min', color:'#EF4444' },
  { id:'m6', name:'Priscila Alves Santos', short:'Priscila A.',role:'Técnica de Campo',      initials:'PA', status:'field',   task:'Troca de medidor — Osasco',            taskTime:'1h 10min', color:'#1A6FE8' },
  { id:'m7', name:'Diego Fernandes',       short:'Diego F.',   role:'Técnico Especialista',  initials:'DF', status:'field',   task:'Comissionamento sistema UPS',          taskTime:'55min',    color:'#06B6D4' },
  { id:'m8', name:'Fernanda Rocha',        short:'Fernanda R.',role:'Técnica de Campo Jr.',  initials:'FR', status:'field',   task:'Diagnóstico falha rede elétrica',      taskTime:'30min',    color:'#10B981' },
  { id:'m9', name:'Paulo Sergio Moraes',   short:'Paulo S.',   role:'Técnico de Campo Sr.',  initials:'PS', status:'offline', task:'Turno encerrado',                      taskTime:'—',        color:'#4B5563' },
];

const TASKS: Task[] = [
  { id:'t1', title:'Falha no painel elétrico principal',   client:'Cond. Edifício Nobre',       address:'R. Oscar Freire, 1200 — Jardins',       techId:'m5', priority:'urgent', status:'delayed',  deadline:'há 1h20min', sla:'ATRASADO' },
  { id:'t2', title:'Instalação sistema fotovoltaico',      client:'Metalúrgica Aço Sul',         address:'Av. Industrial, 450 — Santo André',     techId:'m4', priority:'high',   status:'progress', deadline:'em 2h15min', sla:'OK' },
  { id:'t3', title:'Manutenção preventiva geradores',      client:'Hospital São Camilo',         address:'Av. Paulista, 200 — Bela Vista',         techId:'m2', priority:'high',   status:'progress', deadline:'em 45min',   sla:'RISCO' },
  { id:'t4', title:'Reconfiguração firewall industrial',   client:'Automação CNC Metalflex',     address:'Av. Nações Unidas, 17891 — VNS',        techId:null, priority:'urgent', status:'pending',  deadline:'16h30',      sla:'RISCO' },
  { id:'t5', title:'Vistoria pós-instalação UPS',          client:'Data Center Tier III Nuvem', address:'Rod. Anhanguera, km 23 — Caieiras',     techId:'m7', priority:'normal',  status:'progress', deadline:'em 3h',      sla:'OK' },
  { id:'t6', title:'Troca de medidor trifásico',           client:'Ind. Têxtil Fiação SP',       address:'R. das Indústrias, 780 — Osasco',       techId:'m6', priority:'normal',  status:'progress', deadline:'em 4h30min', sla:'OK' },
  { id:'t7', title:'Inspeção SPDA cobertura',              client:'Colégio Dom Pedro II',        address:'R. Vergueiro, 600 — Liberdade',          techId:'m1', priority:'normal',  status:'pending',  deadline:'15h00',      sla:'OK' },
  { id:'t8', title:'Diagnóstico falha rede cabeada',       client:'Escritório Contábil Andrade', address:'Av. Rebouças, 3500 — Pinheiros',         techId:'m8', priority:'high',   status:'progress', deadline:'em 1h',      sla:'OK' },
];

const MAP_PINS: MapPin[] = [
  { id:'m1', x:238, y:52,  status:'field',   label:'Carlos E.' },
  { id:'m2', x:175, y:92,  status:'field',   label:'Ana B.'    },
  { id:'m3', x:122, y:138, status:'paused',  label:'Roberto N.'},
  { id:'m4', x:290, y:132, status:'field',   label:'Juliana C.'},
  { id:'m5', x:70,  y:77,  status:'delayed', label:'Marcos H.' },
  { id:'m6', x:148, y:52,  status:'field',   label:'Priscila A.'},
  { id:'m7', x:265, y:82,  status:'field',   label:'Diego F.'  },
  { id:'m8', x:196, y:152, status:'field',   label:'Fernanda R.'},
];

const WEEK_BARS = [
  { day:'Seg', done:38, total:42 },
  { day:'Ter', done:41, total:44 },
  { day:'Qua', done:35, total:40 },
  { day:'Qui', done:42, total:46 },
  { day:'Sex', done:34, total:41 },
  { day:'Sáb', done:12, total:14 },
  { day:'Dom', done:0,  total:0  },
];

const PERFORMERS = [
  { name:'Ana Beatriz',   initials:'AB', tasks:12, sla:'100%', color:'#10B981' },
  { name:'Juliana Costa', initials:'JC', tasks:11, sla:'97%',  color:'#8B5CF6' },
  { name:'Carlos Souza',  initials:'CE', tasks:10, sla:'95%',  color:'#1A6FE8' },
];

// ─── Utils ────────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<StatusType, string> = {
  field:   '#10B981',
  paused:  '#F59E0B',
  delayed: '#EF4444',
  offline: '#4B5563',
};

const STATUS_LABEL: Record<StatusType, string> = {
  field:   'Em campo',
  paused:  'Em pausa',
  delayed: 'Atrasado',
  offline: 'Offline',
};

const PRIORITY_COLOR: Record<PriorityType, string> = {
  urgent: '#EF4444',
  high:   '#F97316',
  normal: '#4B5563',
};

const PRIORITY_LABEL: Record<PriorityType, string> = {
  urgent: 'Urgente',
  high:   'Alta',
  normal: 'Normal',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CircleProgress({ value, size = 72, stroke = 6, color = '#1A6FE8', children }: {
  value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition:'stroke-dashoffset 1s ease', filter:`drop-shadow(0 0 5px ${color}60)` }}/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function LivePulse({ color, speed = 2.5 }: { color: string; speed?: number }) {
  return (
    <div className="absolute inset-0 rounded-full pointer-events-none" style={{ overflow:'visible' }}>
      {[0,1].map(i => (
        <motion.div key={i} className="absolute inset-0 rounded-full"
          style={{ background: color + '50' }}
          animate={{ scale:[1,1.8+i*0.4,1.8+i*0.4], opacity:[0.6,0,0] }}
          transition={{ duration: speed, repeat:Infinity, delay: i * (speed/2), ease:'easeOut' }}/>
      ))}
    </div>
  );
}

// ─── FieldMap ─────────────────────────────────────────────────────────────────

function FieldMap() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/[0.06]"
      style={{ height: 210, background: 'linear-gradient(160deg,#050A14 0%,#0B1626 50%,#070D1A 100%)' }}>

      {/* Hex grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.045]" viewBox="0 0 360 210" preserveAspectRatio="none">
        {/* Horizontal lines */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={`h${i}`} x1="0" y1={i*30} x2="360" y2={i*30} stroke="white" strokeWidth="0.6"/>
        ))}
        {/* Diagonal NW-SE */}
        {[-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9].map(i => (
          <line key={`d1${i}`} x1={i*50} y1="0" x2={i*50+210} y2="210" stroke="white" strokeWidth="0.6"/>
        ))}
        {/* Diagonal NE-SW */}
        {[-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9].map(i => (
          <line key={`d2${i}`} x1={i*50+210} y1="0" x2={i*50} y2="210" stroke="white" strokeWidth="0.6"/>
        ))}
      </svg>

      {/* Sector labels */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 210">
        {[
          { x:170, y:22,  label:'ZONA NORTE' },
          { x:15,  y:105, label:'ZONA OESTE' },
          { x:295, y:105, label:'ZONA LESTE' },
          { x:160, y:195, label:'ZONA SUL'   },
        ].map(s => (
          <text key={s.label} x={s.x} y={s.y} fill="rgba(255,255,255,0.07)" fontSize="7.5"
            fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="2">
            {s.label}
          </text>
        ))}
        {/* Sector divider lines */}
        <line x1="180" y1="0" x2="180" y2="210" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 6"/>
        <line x1="0" y1="105" x2="360" y2="105" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 6"/>
      </svg>

      {/* Incident radius overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 210">
        <motion.circle cx="70" cy="77" r="32" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.2)"
          strokeWidth="1" strokeDasharray="3 4"
          animate={{ r:[28,34,28], opacity:[0.8,0.4,0.8] }}
          transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}/>
      </svg>

      {/* Pins */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 210">
        {MAP_PINS.map((pin, i) => {
          const col = STATUS_COLOR[pin.status];
          const isDelayed = pin.status === 'delayed';
          return (
            <g key={pin.id}>
              {/* Halo — animated */}
              <motion.circle cx={pin.x} cy={pin.y} r={isDelayed ? 13 : 11}
                fill="none" stroke={col} strokeWidth="1.5" opacity="0"
                animate={{ r:[isDelayed?13:11, isDelayed?22:19], opacity:[0.7, 0] }}
                transition={{ duration: isDelayed ? 1.0 : 2.4, repeat:Infinity, delay: i * 0.3, ease:'easeOut' }}/>
              {/* Outer ring */}
              <circle cx={pin.x} cy={pin.y} r="9" fill={col + '25'} stroke={col} strokeWidth="1.5"/>
              {/* Inner dot */}
              <circle cx={pin.x} cy={pin.y} r="4.5" fill={col}
                style={{ filter:`drop-shadow(0 0 5px ${col})` }}/>
              {/* Initials */}
              <text x={pin.x} y={pin.y + 1.5} fill="white" fontSize="5" fontWeight="bold"
                textAnchor="middle" dominantBaseline="middle" style={{ fontFamily:'system-ui' }}>
                {pin.id === 'm5' ? '!' : ''}
              </text>
              {/* Name label */}
              <text x={pin.x} y={pin.y + 17} fill="rgba(255,255,255,0.5)" fontSize="6.5"
                textAnchor="middle" fontFamily="monospace">
                {pin.label.split(' ')[0]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Top overlay */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"/>
          <span className="text-white text-[10px] font-bold font-mono">9 ATIVOS · AO VIVO</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#EF4444]/15 border border-[#EF4444]/30 backdrop-blur-md rounded-full px-2.5 py-1.5">
          <AlertTriangle size={10} className="text-[#EF4444]"/>
          <span className="text-[#EF4444] text-[10px] font-bold">1 ALERTA</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        {([['field','#10B981','Em campo'],['paused','#F59E0B','Em pausa'],['delayed','#EF4444','Atrasado']] as [StatusType, string, string][]).map(([,col,lbl]) => (
          <div key={lbl} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:col }}/>
            <span className="text-[8px] font-mono" style={{ color:'rgba(255,255,255,0.4)' }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CampoView ────────────────────────────────────────────────────────────────

function CampoView() {
  const activeCount = TEAM.filter(m => m.status === 'field').length;
  const incidentMember = TEAM.find(m => m.status === 'delayed')!;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <div>
          <p className="text-white/35 text-[10px] font-mono uppercase tracking-widest">Operação em Tempo Real</p>
          <h2 className="text-white font-bold text-[18px] leading-tight">Visão de Campo</h2>
        </div>
        <div className="relative">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.07]" style={{ background:'rgba(255,255,255,0.04)' }}>
            <Bell size={16} className="text-white/60"/>
          </div>
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#EF4444] border border-[#050A14] rounded-full flex items-center justify-center">
            <span className="text-[9px] text-white font-bold px-0.5">2</span>
          </span>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-2 px-4 mb-4">
        {[
          { val:'9/12', label:'Ativos',    color:'#10B981', icon:UserCheck },
          { val:'87%',  label:'SLA OK',    color:'#1A6FE8', icon:Shield },
          { val:'34',   label:'Concluídas',color:'#06B6D4', icon:CheckCircle },
          { val:'1',    label:'Alertas',   color:'#EF4444', icon:AlertTriangle },
        ].map(k => (
          <div key={k.label} className="rounded-2xl py-2.5 px-2 flex flex-col items-center border border-white/[0.06]" style={{ background:'rgba(255,255,255,0.03)' }}>
            <k.icon size={12} style={{ color:k.color }} className="mb-1"/>
            <p className="font-black text-[14px] leading-none" style={{ color:k.color }}>{k.val}</p>
            <p className="text-white/30 text-[8.5px] mt-0.5 text-center font-mono">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="px-4 mb-4">
        <FieldMap/>
      </div>

      {/* Alert card */}
      <div className="mx-4 mb-4">
        <motion.div animate={{ boxShadow:['0 0 0px #EF444400','0 0 20px #EF444430','0 0 0px #EF444400'] }}
          transition={{ repeat:Infinity, duration:2, ease:'easeInOut' }}
          className="rounded-2xl p-3.5 border border-[#EF4444]/25" style={{ background:'linear-gradient(135deg,#1A0505,#0F0202)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse"/>
            <span className="text-[#EF4444] text-[9px] font-bold uppercase tracking-widest font-mono">Alerta operacional</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 border border-[#EF4444]/20"
              style={{ background:'rgba(239,68,68,0.1)', color:'#EF4444' }}>
              {incidentMember.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{incidentMember.name}</p>
              <p className="text-[#EF4444] text-[10px] font-semibold">Atrasado {incidentMember.taskTime} · {incidentMember.task.split('—')[0].trim()}</p>
            </div>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#EF4444]/20 flex-shrink-0" style={{ background:'rgba(239,68,68,0.1)' }}>
              <Phone size={14} className="text-[#EF4444]"/>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Nearby field agents */}
      <div className="px-4">
        <p className="text-white/35 text-[9px] font-mono font-bold uppercase tracking-widest mb-2.5">Técnicos em campo agora</p>
        <div className="space-y-2">
          {TEAM.filter(m => m.status === 'field').slice(0,3).map(m => (
            <div key={m.id} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 border border-white/[0.05]" style={{ background:'rgba(255,255,255,0.025)' }}>
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white border border-white/5"
                  style={{ background:`${m.color}22` }}>{m.initials}</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-[#050A14]" style={{ background:STATUS_COLOR[m.status] }}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{m.short}</p>
                <p className="text-white/35 text-[9px] truncate">{m.task}</p>
              </div>
              <span className="text-[9px] font-mono text-white/25 flex-shrink-0">{m.taskTime}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EquipeView ───────────────────────────────────────────────────────────────

function EquipeView() {
  const [filter, setFilter] = useState<StatusType | 'all'>('all');

  const counts = {
    all:     TEAM.length,
    field:   TEAM.filter(m => m.status === 'field').length,
    paused:  TEAM.filter(m => m.status === 'paused').length,
    delayed: TEAM.filter(m => m.status === 'delayed').length,
    offline: TEAM.filter(m => m.status === 'offline').length,
  };

  const filtered = filter === 'all' ? TEAM : TEAM.filter(m => m.status === filter);

  const FILTERS = [
    { id:'all' as const,     label:`Todos ${counts.all}`,      color:'#1A6FE8' },
    { id:'field' as const,   label:`Campo ${counts.field}`,    color:'#10B981' },
    { id:'paused' as const,  label:`Pausa ${counts.paused}`,   color:'#F59E0B' },
    { id:'delayed' as const, label:`Atraso ${counts.delayed}`, color:'#EF4444' },
    { id:'offline' as const, label:`Offline ${counts.offline}`,color:'#4B5563' },
  ];

  return (
    <div className="px-4 pb-4">
      <div className="pt-3 flex items-center justify-between mb-3">
        <div>
          <h2 className="text-white font-bold text-[20px] leading-none">Equipe</h2>
          <p className="text-white/35 text-[10px] font-mono mt-0.5">{counts.field} DE {counts.all} EM CAMPO</p>
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.07]" style={{ background:'rgba(255,255,255,0.04)' }}>
          <Search size={15} className="text-white/40"/>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
        {FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold border font-mono transition-all"
              style={{
                background: active ? `${f.color}22` : 'rgba(255,255,255,0.03)',
                borderColor: active ? `${f.color}50` : 'rgba(255,255,255,0.07)',
                color: active ? 'white' : 'rgba(255,255,255,0.35)',
                boxShadow: active ? `0 0 12px ${f.color}30` : 'none',
              }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Member cards */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-2.5">
          {filtered.map(m => {
            const col = STATUS_COLOR[m.status];
            const isDelayed = m.status === 'delayed';
            const isOffline = m.status === 'offline';
            return (
              <motion.div key={m.id} layout
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.2 }}
                className="rounded-3xl p-3.5 border transition-all"
                style={{
                  background: isDelayed ? 'linear-gradient(135deg,#150303,#0A0101)' : 'rgba(255,255,255,0.025)',
                  borderColor: isDelayed ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)',
                  borderLeft: `3px solid ${col}`,
                }}>
                <div className="flex items-center gap-3">
                  {/* Avatar with status ring */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-white border border-white/5"
                      style={{ background:`${m.color}20` }}>
                      {m.initials}
                    </div>
                    {/* Status ring dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#050A14] flex items-center justify-center"
                      style={{ background: col }}>
                      {isDelayed && (
                        <motion.div className="w-full h-full rounded-full" style={{ background: col }}
                          animate={{ opacity:[1,0.3,1] }} transition={{ duration:0.8, repeat:Infinity }}/>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white font-bold text-sm truncate">{m.name.split(' ').slice(0,2).join(' ')}</p>
                      {isDelayed && (
                        <span className="flex-shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded-full font-mono" style={{ background:'rgba(239,68,68,0.15)', color:'#EF4444', border:'1px solid rgba(239,68,68,0.3)' }}>
                          ATRASADO
                        </span>
                      )}
                    </div>
                    <p className="text-white/35 text-[10px]">{m.role}</p>
                    <p className="text-[10px] mt-1 truncate" style={{ color: isOffline ? 'rgba(255,255,255,0.2)' : isDelayed ? '#EF4444' : 'rgba(255,255,255,0.55)' }}>
                      {m.task}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col }}/>
                      <span className="text-[9px] font-mono" style={{ color: col }}>{STATUS_LABEL[m.status]}</span>
                      {!isOffline && (
                        <>
                          <span className="text-white/15 text-[9px]">·</span>
                          <Clock size={9} className="text-white/25"/>
                          <span className="text-white/25 text-[9px] font-mono">{m.taskTime}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {!isOffline && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button className="w-8 h-8 rounded-xl flex items-center justify-center border border-[#10B981]/20" style={{ background:'rgba(16,185,129,0.08)' }}>
                        <Phone size={13} className="text-[#10B981]"/>
                      </button>
                      <button className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.07]" style={{ background:'rgba(255,255,255,0.04)' }}>
                        <MessageCircle size={13} className="text-white/40"/>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}

// ─── TarefasView ──────────────────────────────────────────────────────────────

function TarefasView() {
  const [filterP, setFilterP] = useState<PriorityType | 'all'>('all');

  const visible = filterP === 'all' ? TASKS : TASKS.filter(t => t.priority === filterP);
  const urgent  = visible.filter(t => t.priority === 'urgent');
  const high    = visible.filter(t => t.priority === 'high');
  const normal  = visible.filter(t => t.priority === 'normal');

  const getTech = (id: string | null) => id ? TEAM.find(m => m.id === id) : null;

  const TaskCard = ({ t }: { t: Task }) => {
    const tech = getTech(t.techId);
    const pc = PRIORITY_COLOR[t.priority];
    const isDelayed = t.status === 'delayed';
    const isRisk = t.sla === 'RISCO';
    return (
      <motion.div layout initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
        transition={{ duration:0.2 }}
        className="rounded-2xl overflow-hidden border flex"
        style={{
          background: isDelayed ? 'linear-gradient(135deg,#150303,#0A0202)' : 'rgba(255,255,255,0.025)',
          borderColor: isDelayed ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.05)',
        }}>
        {/* Priority bar */}
        <div className="w-1 flex-shrink-0 rounded-l-2xl" style={{ background: pc }}/>
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold leading-snug">{t.title}</p>
              <p className="text-white/40 text-[10px] mt-0.5 truncate">{t.client}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
              {isDelayed && (
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full font-mono" style={{ background:'rgba(239,68,68,0.15)', color:'#EF4444', border:'1px solid rgba(239,68,68,0.25)' }}>
                  ATRASADO
                </span>
              )}
              {isRisk && !isDelayed && (
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full font-mono" style={{ background:'rgba(245,158,11,0.12)', color:'#F59E0B', border:'1px solid rgba(245,158,11,0.25)' }}>
                  RISCO
                </span>
              )}
              {!isDelayed && !isRisk && (
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full font-mono" style={{ background:'rgba(16,185,129,0.1)', color:'#10B981', border:'1px solid rgba(16,185,129,0.2)' }}>
                  SLA OK
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={9} className="text-white/25 flex-shrink-0"/>
            <p className="text-white/30 text-[9px] truncate font-mono">{t.address}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tech ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[8px] text-white"
                    style={{ background: `${tech.color}30` }}>{tech.initials}</div>
                  <span className="text-white/40 text-[9px]">{tech.short}</span>
                </div>
              ) : (
                <span className="text-[9px] text-[#F59E0B] font-bold">Sem responsável</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={9} className={isDelayed ? 'text-[#EF4444]' : isRisk ? 'text-[#F59E0B]' : 'text-white/25'}/>
              <span className="text-[9px] font-mono font-bold" style={{ color: isDelayed ? '#EF4444' : isRisk ? '#F59E0B' : 'rgba(255,255,255,0.3)' }}>
                {t.deadline}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="px-4 pb-4">
      <div className="pt-3 flex items-center justify-between mb-3">
        <div>
          <h2 className="text-white font-bold text-[20px] leading-none">Tarefas</h2>
          <p className="text-white/35 text-[10px] font-mono mt-0.5">{TASKS.filter(t=>t.status!=='done').length} ABERTAS · {TASKS.filter(t=>t.status==='delayed').length} ATRASADAS</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 border border-[#1A6FE8]/25 text-[10px] font-bold" style={{ background:'rgba(26,111,232,0.1)', color:'#1A6FE8' }}>
          <Plus size={12}/> Nova
        </button>
      </div>

      {/* Priority filters */}
      <div className="flex gap-2 mb-4">
        {([
          { id:'all' as const, label:'Todas', color:'#1A6FE8', count: TASKS.length },
          { id:'urgent' as const, label:'Urgente', color:'#EF4444', count: TASKS.filter(t=>t.priority==='urgent').length },
          { id:'high' as const, label:'Alta', color:'#F97316', count: TASKS.filter(t=>t.priority==='high').length },
          { id:'normal' as const, label:'Normal', color:'#4B5563', count: TASKS.filter(t=>t.priority==='normal').length },
        ]).map(f => {
          const active = filterP === f.id;
          return (
            <button key={f.id} onClick={() => setFilterP(f.id)}
              className="flex-1 py-2 rounded-xl text-[10px] font-bold border font-mono transition-all"
              style={{
                background: active ? `${f.color}20` : 'rgba(255,255,255,0.03)',
                borderColor: active ? `${f.color}40` : 'rgba(255,255,255,0.06)',
                color: active ? 'white' : 'rgba(255,255,255,0.3)',
              }}>
              {f.label}
              <span className="block font-black" style={{ color: f.color }}>{f.count}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-0">
          {urgent.length > 0 && (
            <div key="urgent-group" className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#EF4444]"/>
                <p className="text-[#EF4444] text-[9px] font-bold uppercase tracking-widest font-mono">Urgente · {urgent.length}</p>
              </div>
              <div className="space-y-2">{urgent.map(t => <TaskCard key={t.id} t={t}/>)}</div>
            </div>
          )}
          {high.length > 0 && (
            <div key="high-group" className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#F97316]"/>
                <p className="text-[#F97316] text-[9px] font-bold uppercase tracking-widest font-mono">Alta prioridade · {high.length}</p>
              </div>
              <div className="space-y-2">{high.map(t => <TaskCard key={t.id} t={t}/>)}</div>
            </div>
          )}
          {normal.length > 0 && (
            <div key="normal-group" className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#4B5563]"/>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest font-mono">Normal · {normal.length}</p>
              </div>
              <div className="space-y-2">{normal.map(t => <TaskCard key={t.id} t={t}/>)}</div>
            </div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}

// ─── MetricasView ─────────────────────────────────────────────────────────────

function MetricasView() {
  const maxBar = Math.max(...WEEK_BARS.map(b => b.total || 1));

  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="pt-3">
        <h2 className="text-white font-bold text-[20px] leading-none">Métricas</h2>
        <p className="text-white/35 text-[10px] font-mono mt-0.5">SEMANA DE 10 A 16 MAR · 2026</p>
      </div>

      {/* KPI Cards 2x2 */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { val:'87%',   label:'SLA Cumprido',         sub:'+3% vs semana ant.',  color:'#1A6FE8', icon:Shield,     up:true },
          { val:'2h14',  label:'Tempo Médio Atend.',    sub:'−12min vs semana ant.',color:'#10B981', icon:Clock,      up:true },
          { val:'34/41', label:'Tarefas Hoje',          sub:'83% de conclusão',   color:'#06B6D4', icon:CheckCircle,up:true },
          { val:'9/12',  label:'Equipes Ativas',        sub:'3 offline hoje',     color:'#F97316', icon:Users,      up:false },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-3.5 border border-white/[0.06]" style={{ background:'#0B1220' }}>
            <div className="flex items-center justify-between mb-2">
              <k.icon size={13} style={{ color:k.color }}/>
              <div className="flex items-center gap-1">
                {k.up ? <TrendingUp size={10} className="text-[#10B981]"/> : <TrendingDown size={10} className="text-[#EF4444]"/>}
                <span className="text-[9px] font-mono" style={{ color: k.up ? '#10B981' : '#EF4444' }}>{k.sub.split(' ')[0]}</span>
              </div>
            </div>
            <p className="font-black text-[20px] leading-none" style={{ color:k.color }}>{k.val}</p>
            <p className="text-white/35 text-[10px] mt-1">{k.label}</p>
            <p className="text-white/20 text-[9px] font-mono mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* SLA Gauge */}
      <div className="rounded-3xl p-4 border border-white/[0.06] flex items-center gap-5" style={{ background:'#0B1220' }}>
        <CircleProgress value={87} size={80} stroke={7} color="#1A6FE8">
          <div className="text-center">
            <p className="text-white font-black text-[16px] leading-none">87%</p>
            <p className="text-white/30 text-[8px] font-mono">SLA</p>
          </div>
        </CircleProgress>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Cumprimento de SLA</p>
          <p className="text-white/35 text-[10px] mt-0.5 leading-relaxed">35 de 41 tarefas dentro do prazo esta semana</p>
          <div className="flex items-center gap-3 mt-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#10B981]"/>
              <span className="text-[9px] font-mono text-white/40">No prazo: 35</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#EF4444]"/>
              <span className="text-[9px] font-mono text-white/40">Atrasadas: 6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="rounded-3xl p-4 border border-white/[0.06]" style={{ background:'#0B1220' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-bold text-[13px]">Tarefas por dia</p>
          <span className="text-[#06B6D4] text-[10px] font-bold font-mono">Esta semana</span>
        </div>
        <div className="flex items-end gap-2" style={{ height:80 }}>
          {WEEK_BARS.map((b, i) => {
            const isToday = i === 4;
            const pct = b.total > 0 ? (b.done / b.total) * 100 : 0;
            const barH = b.total > 0 ? (b.total / maxBar) * 72 : 0;
            const doneH = b.total > 0 ? (b.done / maxBar) * 72 : 0;
            return (
              <div key={b.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative rounded-t-lg overflow-hidden" style={{ height: barH || 4, minHeight:4 }}>
                  {/* Total bar bg */}
                  <div className="absolute inset-0 rounded-t-lg" style={{ background:'rgba(255,255,255,0.05)' }}/>
                  {/* Done bar */}
                  <div className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all"
                    style={{ height:`${doneH}px`, background: isToday ? 'linear-gradient(180deg,#2B84FF,#1A6FE8)' : 'rgba(255,255,255,0.15)',
                      boxShadow: isToday ? '0 0 12px #1A6FE860' : 'none' }}/>
                </div>
                <span className="text-[9px] font-mono" style={{ color: isToday ? '#1A6FE8' : 'rgba(255,255,255,0.25)' }}>{b.day}</span>
                {b.total > 0 && <span className="text-[8px] font-mono text-white/20">{b.done}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top performers */}
      <div className="rounded-3xl p-4 border border-white/[0.06]" style={{ background:'#0B1220' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-bold text-[13px]">Top Performers</p>
          <span className="text-[#06B6D4] text-[10px] font-bold font-mono">Semana</span>
        </div>
        <div className="space-y-3">
          {PERFORMERS.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0"
                style={{ background: i === 0 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)', color: i === 0 ? '#D4AF37' : 'rgba(255,255,255,0.4)' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                style={{ background:`${p.color}22` }}>{p.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{p.name}</p>
                <p className="text-white/30 text-[9px] font-mono">{p.tasks} tarefas · SLA {p.sla}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-black text-sm" style={{ color:p.color }}>{p.tasks}</p>
                <p className="text-white/25 text-[8px] font-mono">tasks</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity log */}
      <div className="rounded-3xl p-4 border border-white/[0.06]" style={{ background:'#0B1220' }}>
        <p className="text-white font-bold text-[13px] mb-3">Atividade recente</p>
        <div className="space-y-2.5">
          {[
            { icon:'✅', text:'Ana B. concluiu manutenção em Guarulhos', time:'12:48', color:'#10B981' },
            { icon:'⚠️', text:'Marcos H. com atraso na Zona Oeste',      time:'12:22', color:'#EF4444' },
            { icon:'🔔', text:'Nova OS atribuída a Diego F.',              time:'11:55', color:'#1A6FE8' },
            { icon:'📍', text:'Juliana C. chegou ao local — Santo André', time:'11:30', color:'#06B6D4' },
          ].map((a,i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                style={{ background:`${a.color}15` }}>{a.icon}</div>
              <p className="flex-1 text-white/50 text-[10px] leading-snug">{a.text}</p>
              <span className="text-[9px] font-mono text-white/20 flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: View; icon: React.ElementType; label: string }[] = [
  { id:'campo',    icon:Map,           label:'Campo'    },
  { id:'equipe',   icon:Users,         label:'Equipe'   },
  { id:'tarefas',  icon:ClipboardList, label:'Tarefas'  },
  { id:'metricas', icon:BarChart3,     label:'Métricas' },
];

const ACCENT: Record<View, string> = {
  campo:    '#1A6FE8',
  equipe:   '#10B981',
  tarefas:  '#F97316',
  metricas: '#06B6D4',
};

// ─── Export ───────────────────────────────────────────────────────────────────

export default function GestaoApp() {
  const [view, setView] = useState<View>('campo');
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
      style={{ background: 'radial-gradient(ellipse at center, #050A14 0%, #020508 100%)' }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(circle at 50% 40%, ${accent}10 0%, transparent 60%)` }}/>

      <div className="relative overflow-hidden" style={{ width: 360 * scale, height: 720 * scale, flexShrink: 0 }}>
      <div className="absolute top-0 left-0" style={{ width: 360, height: 720, transform: `scale(${scale})`, transformOrigin: 'top left' }}>

        {/* Side buttons */}
        {[{l:true,t:96,h:28},{l:true,t:144,h:48},{l:true,t:208,h:48},{l:false,t:128,h:64}].map((b, i) => (
          <div key={i} className="absolute rounded-sm" style={{ [b.l?'left':'right']:'-3px', top:b.t, width:3, height:b.h, background:'#050A14' }}/>
        ))}

        {/* Frame */}
        <div className="absolute inset-0 rounded-[44px] overflow-hidden"
          style={{ border: '6px solid #0B1525', background: '#050A14',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 40px 100px rgba(0,0,0,0.95), 0 0 80px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(26,111,232,0.05)' }}>

          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-3xl z-20 flex items-center justify-center gap-2"
            style={{ background: '#0B1525' }}>
            <div className="w-2 h-2 rounded-full bg-[#1a2535]"/>
            <div className="w-3 h-3 rounded-full bg-[#1a2535]"/>
          </div>

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-10 flex items-end justify-between px-7 pb-1.5 z-10">
            <span className="text-white text-[11px] font-bold font-mono">{time}</span>
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
              <motion.div key={view}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}
                transition={{ duration:0.2, ease:'easeOut' }}>
                {view === 'campo'    && <CampoView/>}
                {view === 'equipe'   && <EquipeView/>}
                {view === 'tarefas'  && <TarefasView/>}
                {view === 'metricas' && <MetricasView/>}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0 h-20 flex items-start pt-2 px-2 border-t border-white/[0.06]"
            style={{ background: 'rgba(5,10,20,0.97)', backdropFilter: 'blur(20px)' }}>
            {NAV_ITEMS.map(({ id, icon:Icon, label }) => {
              const active = view === id;
              const col = ACCENT[id];
              return (
                <button key={id} onClick={() => setView(id)} className="flex-1 flex flex-col items-center gap-1 pt-1 transition-all">
                  <div className="w-10 h-7 rounded-full flex items-center justify-center relative"
                    style={{ background: active ? col+'22' : 'transparent' }}>
                    {active && <div className="absolute inset-0 rounded-full" style={{ background:col+'15', filter:'blur(8px)' }}/>}
                    <Icon size={18} style={{ color: active ? col : 'rgba(255,255,255,0.25)', transition:'color 0.2s' }}/>
                  </div>
                  <span className="text-[10px] font-semibold font-mono transition-colors"
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
    </div>
  );
}
