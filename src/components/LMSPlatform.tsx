import React, { useState, useEffect } from 'react';
import {
  Play, Plus, ArrowLeft, Pause, ChevronRight,
  BookOpen, Check, Info, Clock, Users, Award,
  SkipForward, SkipBack, Volume2, Maximize,
  X, Search, Bell, Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = 'browse' | 'detail' | 'player';
type Level  = 'Iniciante' | 'Intermediário' | 'Avançado';

interface Lesson { title: string; duration: string; free?: boolean }
interface Mod    { title: string; lessons: Lesson[] }
interface Course {
  id: string; title: string; subtitle?: string;
  instructor: string; instructorRole: string;
  duration: string; level: Level; category: string;
  rating: number; reviewCount: number; enrolled: number;
  progress?: number; gradient: string; accent: string;
  description: string; modules: Mod[]; tags: string[];
  isNew?: boolean; isTrending?: boolean; isFeatured?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COURSES: Course[] = [
  {
    id:'c01', title:'React & TypeScript Completo', subtitle:'Do iniciante ao deploy em produção',
    instructor:'Lucas Tavares', instructorRole:'Senior Engineer · ex-Google',
    duration:'48h', level:'Avançado', category:'Desenvolvimento Web',
    rating:4.9, reviewCount:8412, enrolled:32500, progress:68,
    gradient:'from-[#0f0c29] via-[#302b63] to-[#24243e]', accent:'#7c6cfc', isFeatured:true,
    description:'Domine React 19, TypeScript, Hooks avançados, Zustand, React Query, testes com Vitest e deploy com CI/CD. Projeto final: SaaS completo do zero ao ar.',
    tags:['React 19','TypeScript','Hooks','Testing','CI/CD'],
    modules:[
      { title:'Módulo 1 — Fundamentos React', lessons:[
        { title:'Introdução ao React 19 e ecossistema moderno', duration:'18min', free:true },
        { title:'JSX, componentes funcionais e props', duration:'22min', free:true },
        { title:'Estado com useState e ciclo de vida', duration:'35min' },
        { title:'Eventos, formulários e controlled components', duration:'28min' },
        { title:'Renderização condicional e listas', duration:'24min' },
      ]},
      { title:'Módulo 2 — TypeScript Avançado', lessons:[
        { title:'Interfaces, types e quando usar cada um', duration:'30min' },
        { title:'Generics, utility types e mapped types', duration:'42min' },
        { title:'Discriminated unions e type narrowing', duration:'38min' },
        { title:'Tipando hooks, context e eventos', duration:'33min' },
      ]},
      { title:'Módulo 3 — Hooks Avançados & Performance', lessons:[
        { title:'useReducer e padrões de estado complexo', duration:'45min' },
        { title:'useCallback, useMemo e React.memo', duration:'40min' },
        { title:'Custom hooks: criação e composição', duration:'52min' },
        { title:'Concurrent: useTransition e useDeferredValue', duration:'38min' },
      ]},
      { title:'Módulo 4 — Projeto Final: SaaS', lessons:[
        { title:'Arquitetura e estrutura de pastas escalável', duration:'25min' },
        { title:'Autenticação com JWT e refresh tokens', duration:'55min' },
        { title:'Dashboard com Recharts e React Query', duration:'60min' },
        { title:'Deploy com Vercel e CI/CD via GitHub Actions', duration:'40min' },
      ]},
    ],
  },
  {
    id:'c02', title:'Node.js na Prática', instructor:'Mariana Costa',
    instructorRole:'Backend Lead · Nubank', duration:'32h', level:'Intermediário',
    category:'Desenvolvimento Web', rating:4.8, reviewCount:5230, enrolled:19800, progress:23,
    gradient:'from-[#134e5e] via-[#1a7a6e] to-[#0f4c3c]', accent:'#3ecf8e',
    description:'APIs REST e GraphQL com Node.js, Fastify, Prisma ORM, autenticação JWT e deploy em produção.',
    tags:['Node.js','Fastify','Prisma','GraphQL'],
    modules:[
      { title:'Módulo 1 — Fundamentos Node', lessons:[
        { title:'Event loop e arquitetura assíncrona', duration:'25min', free:true },
        { title:'Modules: CommonJS vs ESM', duration:'18min' },
        { title:'HTTP nativo e Fastify', duration:'35min' },
      ]},
      { title:'Módulo 2 — APIs Avançadas', lessons:[
        { title:'REST com validação Zod', duration:'40min' },
        { title:'GraphQL com Apollo Server', duration:'55min' },
        { title:'Autenticação JWT + Refresh Token', duration:'48min' },
      ]},
    ],
  },
  {
    id:'c03', title:'Python para Dados', instructor:'Diego Faria',
    instructorRole:'Data Scientist · iFood', duration:'40h', level:'Intermediário',
    category:'Dados & IA', rating:4.7, reviewCount:6150, enrolled:24100, progress:5,
    gradient:'from-[#4a1942] via-[#7b2d8b] to-[#c9184a]', accent:'#f72585',
    description:'Pandas, NumPy, Matplotlib e análise exploratória com datasets reais do mercado brasileiro.',
    tags:['Python','Pandas','NumPy','Visualização'],
    modules:[
      { title:'Módulo 1 — Python Essencial', lessons:[
        { title:'Configurando ambiente com Conda', duration:'15min', free:true },
        { title:'Estruturas de dados e comprehensions', duration:'30min' },
      ]},
      { title:'Módulo 2 — Pandas Avançado', lessons:[
        { title:'DataFrames: leitura, filtros e agrupamentos', duration:'50min' },
        { title:'Merge, join e reshape de dados', duration:'45min' },
      ]},
    ],
  },
  {
    id:'c04', title:'Machine Learning Aplicado', instructor:'Ana Beatriz Lima',
    instructorRole:'ML Engineer · Mercado Livre', duration:'56h', level:'Avançado',
    category:'Dados & IA', rating:4.9, reviewCount:3890, enrolled:12400, isTrending:true,
    gradient:'from-[#1a0533] via-[#3d0066] to-[#6600cc]', accent:'#a855f7',
    description:'Regressão, classificação, redes neurais, NLP e deploy de modelos em produção com FastAPI e Docker.',
    tags:['Sklearn','PyTorch','NLP','Deploy'],
    modules:[
      { title:'Módulo 1 — ML Clássico', lessons:[
        { title:'Regressão linear e logística', duration:'45min', free:true },
        { title:'Árvores de decisão e Random Forest', duration:'55min' },
      ]},
      { title:'Módulo 2 — Deep Learning', lessons:[
        { title:'Redes neurais com PyTorch', duration:'65min' },
        { title:'Transformers e NLP moderno', duration:'80min' },
      ]},
    ],
  },
  {
    id:'c05', title:'Figma Masterclass', instructor:'Camila Duarte',
    instructorRole:'Product Designer · Nubank', duration:'24h', level:'Iniciante',
    category:'Design & UX', rating:4.8, reviewCount:9200, enrolled:38700, isNew:true,
    gradient:'from-[#1a0000] via-[#7f1d1d] to-[#dc2626]', accent:'#f87171',
    description:'Auto-layout, variants, protótipos interativos, design tokens e handoff completo para devs.',
    tags:['Figma','Prototipagem','Design System','Handoff'],
    modules:[
      { title:'Módulo 1 — Fundamentos', lessons:[
        { title:'Interface e fluxo de trabalho', duration:'20min', free:true },
        { title:'Auto-layout na prática', duration:'35min' },
      ]},
    ],
  },
  {
    id:'c06', title:'DevOps & CI/CD', instructor:'Thiago Costa',
    instructorRole:'DevOps Engineer · Stone', duration:'38h', level:'Avançado',
    category:'DevOps', rating:4.9, reviewCount:4400, enrolled:14200, isTrending:true,
    gradient:'from-[#0a2614] via-[#14532d] to-[#166534]', accent:'#4ade80',
    description:'Docker, Kubernetes, GitHub Actions, Terraform e monitoramento com Prometheus e Grafana.',
    tags:['Docker','Kubernetes','GitHub Actions','Terraform'],
    modules:[
      { title:'Módulo 1 — Containers', lessons:[
        { title:'Docker: conceitos e primeiros containers', duration:'35min', free:true },
        { title:'Docker Compose para ambientes locais', duration:'40min' },
        { title:'Kubernetes: pods, services e deployments', duration:'60min' },
      ]},
    ],
  },
  {
    id:'c07', title:'Product Management', instructor:'Sofia Ribeiro',
    instructorRole:'Head of Product · Totvs', duration:'28h', level:'Intermediário',
    category:'Gestão & Produto', rating:4.8, reviewCount:5600, enrolled:21300, isTrending:true,
    gradient:'from-[#0c1a3a] via-[#1e3a6e] to-[#1d4ed8]', accent:'#60a5fa',
    description:'Discovery, roadmap, OKRs, frameworks de priorização e comunicação com stakeholders.',
    tags:['Discovery','OKRs','Roadmap','Métricas'],
    modules:[
      { title:'Módulo 1 — Fundamentos de PM', lessons:[
        { title:'O papel do PM em times ágeis', duration:'25min', free:true },
        { title:'Discovery e validação de hipóteses', duration:'40min' },
      ]},
    ],
  },
  {
    id:'c08', title:'UI/UX Design System', instructor:'Pedro Almeida',
    instructorRole:'Design Lead · Creditas', duration:'36h', level:'Intermediário',
    category:'Design & UX', rating:4.7, reviewCount:4100, enrolled:15600, isNew:true,
    gradient:'from-[#2d0047] via-[#5b21b6] to-[#7c3aed]', accent:'#c4b5fd',
    description:'Crie e documente um design system do zero: tokens, componentes, acessibilidade e Storybook.',
    tags:['Design System','Storybook','Acessibilidade','Tokens'],
    modules:[
      { title:'Módulo 1 — Fundamentos', lessons:[
        { title:'O que é e por que Design System', duration:'22min', free:true },
        { title:'Auditoria de interfaces existentes', duration:'30min' },
      ]},
    ],
  },
  {
    id:'c09', title:'SQL & Bancos de Dados', instructor:'Isabela Nunes',
    instructorRole:'DBA Sênior · Itaú', duration:'22h', level:'Iniciante',
    category:'Desenvolvimento Web', rating:4.7, reviewCount:7800, enrolled:29400, isNew:true,
    gradient:'from-[#003333] via-[#006666] to-[#0891b2]', accent:'#22d3ee',
    description:'SQL do básico ao avançado, modelagem relacional, índices, otimização de queries e MongoDB.',
    tags:['SQL','PostgreSQL','Otimização','MongoDB'],
    modules:[
      { title:'Módulo 1 — SQL Essencial', lessons:[
        { title:'SELECT, WHERE e ORDER BY', duration:'20min', free:true },
        { title:'JOINs na prática', duration:'35min' },
      ]},
    ],
  },
  {
    id:'c10', title:'Soft Skills para Tech', instructor:'Diego Ferreira',
    instructorRole:'Tech Lead Coach', duration:'16h', level:'Iniciante',
    category:'Soft Skills', rating:4.7, reviewCount:4800, enrolled:18500,
    gradient:'from-[#3d1a00] via-[#92400e] to-[#d97706]', accent:'#fbbf24',
    description:'Comunicação técnica, resolução de conflitos, storytelling com dados e gestão de tempo.',
    tags:['Comunicação','Conflitos','Storytelling','Negociação'],
    modules:[
      { title:'Módulo 1 — Comunicação', lessons:[
        { title:'Comunicação não-violenta no trabalho', duration:'28min', free:true },
        { title:'Como dar e receber feedback', duration:'32min' },
      ]},
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtN = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n);

function LevelPill({ level }: { level: Level }) {
  const cfg: Record<Level, string> = {
    Iniciante:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Intermediário:'bg-amber-500/15   text-amber-400   border-amber-500/20',
    Avançado:     'bg-red-500/15     text-red-400     border-red-500/20',
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${cfg[level]}`}>{level}</span>
  );
}

// ─── Course Thumbnail Card ────────────────────────────────────────────────────

function Card({ course, onSelect, onPlay }: {
  course: Course; onSelect: (c: Course) => void; onPlay: (c: Course) => void;
}) {
  return (
    <div className="group shrink-0 cursor-pointer" style={{ width: 210 }} onClick={() => onSelect(course)}>
      {/* 16:9 thumbnail */}
      <div className={`relative w-full rounded-xl overflow-hidden bg-gradient-to-br ${course.gradient}`}
        style={{ aspectRatio: '16/9' }}>

        {/* Shine overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 25% 30%, rgba(255,255,255,0.18) 0%, transparent 55%)' }} />

        {/* Category icon — visible when not hovered */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25 group-hover:opacity-0 transition-opacity duration-300">
          <BookOpen size={28} className="text-white" />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex flex-col justify-between p-3">
          {/* Top badges */}
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {course.isNew      && <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide">Novo</span>}
            {course.isTrending && <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide">Em Alta</span>}
          </div>

          {/* Center: play button */}
          <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); onPlay(course); }}
              className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-200">
              <Play size={18} className="text-black fill-black ml-0.5" />
            </button>
          </div>

          {/* Bottom actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(course); }}
              className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-[10px] font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors">
              <Info size={9} />Detalhes
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center transition-colors">
              <Plus size={12} className="text-white" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/15">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${course.progress}%` }} />
          </div>
        )}
      </div>

      {/* Meta below card */}
      <div className="mt-2 px-0.5">
        <p className="text-white/80 text-[12px] font-semibold leading-snug line-clamp-1 group-hover:text-white transition-colors duration-200">{course.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-yellow-400 text-[11px]">★ {course.rating}</span>
          <span className="text-white/25 text-[10px]">·</span>
          <span className="text-white/40 text-[10px]">{course.duration}</span>
          {course.progress !== undefined && (
            <>
              <span className="text-white/25 text-[10px]">·</span>
              <span className="text-red-400 text-[10px] font-semibold">{course.progress}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function Row({ title, courses, onSelect, onPlay }: {
  title: string; courses: Course[];
  onSelect: (c: Course) => void; onPlay: (c: Course) => void;
}) {
  if (!courses.length) return null;
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4 px-10">
        <h3 className="text-white font-bold text-[15px]">{title}</h3>
        <span className="text-red-500 text-[11px] font-bold flex items-center gap-0.5 opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
          Explorar tudo <ChevronRight size={12} />
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-10 pb-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        {courses.map(c => <Card key={c.id} course={c} onSelect={onSelect} onPlay={onPlay} />)}
      </div>
    </div>
  );
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────

function Hero({ course, onSelect, onPlay }: {
  course: Course; onSelect: (c: Course) => void; onPlay: (c: Course) => void;
}) {
  return (
    <div className={`relative w-full shrink-0 bg-gradient-to-br ${course.gradient}`} style={{ height: 320 }}>
      {/* Cinematic overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 75%, transparent 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0A0A0A 0%, transparent 40%)' }} />

      {/* Accent glow */}
      <div className="absolute inset-0 opacity-20"
        style={{ background: `radial-gradient(ellipse at 65% 50%, ${course.accent} 0%, transparent 55%)` }} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-10 pb-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{course.category}</span>
          <span className="text-white/20">·</span>
          <LevelPill level={course.level} />
          {course.isFeatured && (
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-red-500/40 text-red-400 bg-red-500/10">
              Em destaque
            </span>
          )}
        </div>

        <h1 className="text-white font-black leading-none mb-2" style={{ fontSize: 42, letterSpacing: '-0.02em' }}>
          {course.title}
        </h1>
        {course.subtitle && (
          <p className="text-white/50 font-medium text-sm mb-3 -mt-1">{course.subtitle}</p>
        )}
        <p className="text-white/65 text-sm leading-relaxed mb-4 max-w-lg line-clamp-2">{course.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-5 text-[12px]">
          <span className="text-yellow-400 font-bold">★ {course.rating}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/55 flex items-center gap-1"><Clock size={11} />{course.duration}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/55 flex items-center gap-1"><Users size={11} />{fmtN(course.enrolled)} alunos</span>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <button onClick={() => onPlay(course)}
            className="flex items-center gap-2.5 bg-white text-black text-sm font-black px-7 py-3 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg">
            <Play size={14} className="fill-black" />
            {course.progress ? `Continuar — ${course.progress}%` : 'Começar agora'}
          </button>
          <button onClick={() => onSelect(course)}
            className="flex items-center gap-2 text-white/80 text-sm font-semibold px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-200 backdrop-blur-sm">
            <Info size={13} />Mais info
          </button>
        </div>

        {/* Progress */}
        {course.progress !== undefined && (
          <div className="mt-4 flex items-center gap-3">
            <div className="w-40 h-1 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${course.progress}%` }} />
            </div>
            <span className="text-white/35 text-[11px]">{course.progress}% concluído</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Browse Screen ────────────────────────────────────────────────────────────

function BrowseScreen({ onSelect, onPlay }: {
  onSelect: (c: Course) => void; onPlay: (c: Course) => void;
}) {
  const featured   = COURSES[0];
  const inProgress = COURSES.filter(c => c.progress !== undefined);
  const trending   = COURSES.filter(c => c.isTrending);
  const isNew      = COURSES.filter(c => c.isNew);
  const devWeb     = COURSES.filter(c => c.category === 'Desenvolvimento Web');
  const dados      = COURSES.filter(c => c.category === 'Dados & IA');
  const design     = COURSES.filter(c => c.category === 'Design & UX');

  return (
    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
      <Hero course={featured} onSelect={onSelect} onPlay={onPlay} />
      <div className="pt-2">
        <Row title="Continue de onde parou"         courses={inProgress} onSelect={onSelect} onPlay={onPlay} />
        <Row title="Em Alta esta Semana"             courses={trending}   onSelect={onSelect} onPlay={onPlay} />
        <Row title="Recém adicionados"              courses={isNew}      onSelect={onSelect} onPlay={onPlay} />
        <Row title="Desenvolvimento Web"             courses={devWeb}     onSelect={onSelect} onPlay={onPlay} />
        <Row title="Dados & Inteligência Artificial" courses={dados}      onSelect={onSelect} onPlay={onPlay} />
        <Row title="Design & UX"                    courses={design}     onSelect={onSelect} onPlay={onPlay} />
      </div>
    </div>
  );
}

// ─── Detail Screen ────────────────────────────────────────────────────────────

function DetailScreen({ course, onBack, onPlay, onSelect }: {
  course: Course; onBack: () => void; onPlay: (c: Course) => void; onSelect: (c: Course) => void;
}) {
  const [openMod, setOpenMod] = useState(0);
  const related = COURSES.filter(c => c.category === course.category && c.id !== course.id).slice(0, 3);
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
      {/* Hero */}
      <div className={`relative w-full bg-gradient-to-br ${course.gradient}`} style={{ height: 240 }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)' }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 60% 50%, ${course.accent}22 0%, transparent 60%)` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0A0A0A 0%, transparent 30%)' }} />

        <button onClick={onBack}
          className="absolute top-5 left-8 flex items-center gap-2 text-white/70 hover:text-white text-xs font-semibold transition-colors z-10">
          <ArrowLeft size={15} />Voltar
        </button>

        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={() => onPlay(course)}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all duration-200 shadow-2xl">
            <Play size={24} className="text-white fill-white ml-1" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-4">
              <LevelPill level={course.level} />
              {course.isNew      && <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">Novo</span>}
              {course.isTrending && <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400">Em Alta</span>}
            </div>

            <h1 className="text-white font-black text-2xl mb-1 leading-tight">{course.title}</h1>
            {course.subtitle && <p className="text-white/40 text-sm mb-3">{course.subtitle}</p>}

            {/* Rating row */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className="text-yellow-400 font-bold">★ {course.rating}</span>
              <span className="text-white/30 text-xs">({fmtN(course.reviewCount)} avaliações)</span>
              <span className="text-white/20">·</span>
              <span className="text-white/50 text-xs flex items-center gap-1"><Users size={11} />{fmtN(course.enrolled)} alunos</span>
            </div>

            <p className="text-white/55 text-sm leading-relaxed mb-6">{course.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {course.tags.map(t => (
                <span key={t} className="text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 text-white/45"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>{t}</span>
              ))}
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] mb-8"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                style={{ background: `${course.accent}22`, color: course.accent }}>
                {course.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{course.instructor}</p>
                <p className="text-white/40 text-xs mt-0.5">{course.instructorRole}</p>
              </div>
            </div>

            {/* Modules */}
            <div>
              <h3 className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-4">
                Conteúdo — {course.modules.length} módulos · {totalLessons} aulas
              </h3>
              <div className="flex flex-col gap-2">
                {course.modules.map((mod, mi) => (
                  <div key={mi} className="rounded-2xl border border-white/[0.07] overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <button onClick={() => setOpenMod(openMod === mi ? -1 : mi)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-white/20 text-xs font-bold tabular-nums">{String(mi + 1).padStart(2, '0')}</span>
                        <p className="text-white/75 text-sm font-semibold">{mod.title}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white/25 text-xs">{mod.lessons.length} aulas</span>
                        <ChevronRight size={14} className={`text-white/25 transition-transform duration-200 ${openMod === mi ? 'rotate-90' : ''}`} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {openMod === mi && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="border-t border-white/[0.06]">
                            {mod.lessons.map((l, li) => (
                              <div key={li} className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                                <span className="text-white/20 text-[10px] tabular-nums w-5 shrink-0">{li + 1}</span>
                                <Play size={9} className="text-white/15 shrink-0" />
                                <p className="text-white/55 text-xs flex-1">{l.title}</p>
                                {l.free && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/25 text-emerald-400 bg-emerald-500/8 shrink-0">grátis</span>
                                )}
                                <span className="text-white/20 text-[10px] shrink-0 tabular-nums">{l.duration}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            {/* Stats */}
            <div className="rounded-2xl border border-white/[0.07] p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-4">Sobre o curso</p>
              {[
                { icon: Award,    label: 'Nível',    value: course.level },
                { icon: Clock,    label: 'Duração',  value: course.duration },
                { icon: Users,    label: 'Alunos',   value: `${fmtN(course.enrolled)} matriculados` },
                { icon: Layers,   label: 'Módulos',  value: `${course.modules.length} módulos · ${totalLessons} aulas` },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                  <item.icon size={13} className="text-white/25 shrink-0" />
                  <div>
                    <p className="text-white/25 text-[9px] uppercase tracking-wide">{item.label}</p>
                    <p className="text-white/70 text-xs font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <button onClick={() => onPlay(course)}
              className="w-full py-3.5 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${course.accent}, ${course.accent}99)` }}>
              <Play size={14} className="fill-white" />
              {course.progress ? `Continuar (${course.progress}%)` : 'Começar agora'}
            </button>
            <button className="w-full py-2.5 rounded-xl font-semibold text-xs text-white/50 hover:text-white border border-white/[0.07] hover:border-white/20 transition-all flex items-center justify-center gap-2"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Plus size={12} />Adicionar à minha lista
            </button>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-2">
                <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest mb-3">Relacionados</p>
                <div className="flex flex-col gap-2">
                  {related.map(c => (
                    <div key={c.id} onClick={() => onSelect(c)}
                      className="flex gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-white/10 cursor-pointer transition-all group"
                      style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className={`w-14 h-9 rounded-lg bg-gradient-to-br ${c.gradient} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white/65 text-[11px] font-semibold truncate group-hover:text-white transition-colors">{c.title}</p>
                        <p className="text-white/25 text-[10px]">{c.duration} · ★ {c.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Player Screen ────────────────────────────────────────────────────────────

function PlayerScreen({ course, onBack }: { course: Course; onBack: () => void }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress]   = useState(course.progress ? Math.round((course.progress / 100) * 2580 * 0.12) : 8);
  const [duration]                = useState(2580);
  const [showCtrl, setShowCtrl]   = useState(true);
  const [showCaps, setShowCaps]   = useState(false);
  const [speed, setSpeed]         = useState('1×');
  const lessonIdx                 = course.progress ? 2 : 0;

  const allLessons = course.modules.flatMap(m => m.lessons);
  const lesson     = allLessons[lessonIdx] ?? allLessons[0];
  const pct        = (progress / duration) * 100;
  const fmtT       = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => setProgress(p => Math.min(p + 1, duration)), 1000);
    return () => clearInterval(t);
  }, [isPlaying, duration]);

  useEffect(() => {
    if (!showCtrl || !isPlaying) return;
    const t = setTimeout(() => setShowCtrl(false), 3500);
    return () => clearTimeout(t);
  }, [showCtrl, isPlaying]);

  return (
    <div className="flex-1 flex overflow-hidden relative" style={{ background: '#000' }}
      onMouseMove={() => setShowCtrl(true)}>

      {/* Video Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center cursor-pointer select-none"
        onClick={() => { setIsPlaying(p => !p); setShowCtrl(true); }}>

        {/* Subtle bg gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-[0.08]`} />

        {/* Course info (looks like a real video intro frame) */}
        <div className="relative text-center px-8 max-w-xl">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">{course.category}</p>
          <h2 className="text-white/85 font-black text-2xl leading-snug mb-2">{lesson.title}</h2>
          <p className="text-white/35 text-sm">{course.title}</p>

          {/* Animated equalizer */}
          <div className="flex items-end justify-center gap-1 mt-8 h-8">
            {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.4, 0.65, 0.9, 0.55, 0.75].map((h, i) => (
              <motion.div key={i}
                className="w-1 rounded-full"
                style={{ background: course.accent }}
                animate={{ height: isPlaying ? [h * 12, h * 32, h * 8, h * 28, h * 12] : 4, opacity: isPlaying ? 0.7 : 0.2 }}
                transition={{ repeat: Infinity, duration: 0.8 + i * 0.07, delay: i * 0.06, ease: 'easeInOut' }}
              />
            ))}
          </div>

          <p className="text-white/20 text-xs mt-4">{isPlaying ? 'reproduzindo' : '— pausado —'}</p>
        </div>

        {/* Controls overlay */}
        <AnimatePresence>
          {showCtrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              className="absolute inset-0 flex flex-col justify-between pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.9) 100%)' }}>

              {/* Top bar */}
              <div className="flex items-center justify-between px-8 pt-5 pointer-events-auto">
                <button onClick={(e) => { e.stopPropagation(); onBack(); }}
                  className="flex items-center gap-2.5 text-white/70 hover:text-white text-xs font-semibold transition-colors">
                  <ArrowLeft size={16} />
                  <div>
                    <p className="text-white font-bold text-sm leading-none">{course.title}</p>
                    <p className="text-white/40 text-[10px] mt-0.5">{lesson.title}</p>
                  </div>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setShowCaps(p => !p); }}
                  className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${showCaps ? 'border-white/40 text-white bg-white/10' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white/80'}`}>
                  Capítulos
                </button>
              </div>

              {/* Bottom controls */}
              <div className="px-8 pb-6 pointer-events-auto">
                <p className="text-white font-bold text-sm mb-4">{lesson.title}</p>

                {/* Progress bar */}
                <div className="h-1 bg-white/15 rounded-full mb-5 cursor-pointer group/bar"
                  onClick={(e) => {
                    e.stopPropagation();
                    const r = e.currentTarget.getBoundingClientRect();
                    setProgress(Math.round(((e.clientX - r.left) / r.width) * duration));
                  }}>
                  <div className="h-full rounded-full relative transition-all" style={{ width: `${pct}%`, background: course.accent }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white opacity-0 group-hover/bar:opacity-100 transition-opacity"
                      style={{ background: course.accent }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <button onClick={(e) => { e.stopPropagation(); setProgress(p => Math.max(0, p - 10)); }}
                      className="text-white/60 hover:text-white transition-colors">
                      <SkipBack size={20} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsPlaying(p => !p); }}
                      className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                      {isPlaying ? <Pause size={18} className="text-black" /> : <Play size={18} className="text-black fill-black ml-0.5" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setProgress(p => Math.min(duration, p + 10)); }}
                      className="text-white/60 hover:text-white transition-colors">
                      <SkipForward size={20} />
                    </button>
                    <span className="text-white/40 text-xs font-mono">{fmtT(progress)} / {fmtT(duration)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <select value={speed} onChange={e => setSpeed(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold border border-white/15 rounded-lg px-3 py-1.5 text-white/60 hover:border-white/30 hover:text-white transition-all cursor-pointer"
                      style={{ background: 'rgba(0,0,0,0.6)' }}>
                      {['0.5×','0.75×','1×','1.25×','1.5×','2×'].map(s => (
                        <option key={s} value={s} style={{ background: '#111' }}>{s}</option>
                      ))}
                    </select>
                    <Volume2 size={18} className="text-white/50 hover:text-white cursor-pointer transition-colors" />
                    <Maximize size={18} className="text-white/50 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chapters sidebar */}
      <AnimatePresence>
        {showCaps && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 288, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="shrink-0 border-l border-white/[0.07] overflow-hidden flex flex-col"
            style={{ background: '#0f0f0f' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
              <p className="text-white font-bold text-sm">Capítulos</p>
              <button onClick={() => setShowCaps(false)}>
                <X size={15} className="text-white/30 hover:text-white transition-colors" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {course.modules.map((mod, mi) => {
                const offset = course.modules.slice(0, mi).reduce((s, m) => s + m.lessons.length, 0);
                return (
                  <div key={mi} className="border-b border-white/[0.05]">
                    <p className="px-5 pt-4 pb-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">{mod.title}</p>
                    {mod.lessons.map((l, li) => {
                      const gi = offset + li;
                      const active = gi === lessonIdx;
                      const done   = gi < lessonIdx;
                      return (
                        <div key={li}
                          className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${active ? 'bg-white/5' : 'hover:bg-white/[0.03]'}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all
                            ${active ? 'text-white' : done ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/6 text-white/25'}`}
                            style={active ? { background: course.accent } : {}}>
                            {done ? <Check size={10} /> : gi + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-medium truncate ${active ? 'text-white' : 'text-white/45'}`}>{l.title}</p>
                            <p className="text-white/20 text-[10px]">{l.duration}</p>
                          </div>
                        </div>
                      );
                    })}
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

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onHome, screen }: { onHome: () => void; screen: Screen }) {
  const tabs = ['Início', 'Meu Aprendizado', 'Trilhas', 'Explorar'];
  const [active, setActive] = useState('Início');

  if (screen === 'player') return null;

  return (
    <div className="shrink-0 flex items-center justify-between px-10 border-b border-white/[0.05]"
      style={{ height: 56, background: '#0d0d0d' }}>
      {/* Left */}
      <div className="flex items-center gap-8">
        <button onClick={onHome} className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#E50914' }}>
            <Play size={12} className="text-white fill-white ml-0.5" />
          </div>
          <span className="text-white font-black text-[15px] tracking-tight">Aprendix</span>
        </button>
        <nav className="hidden md:flex items-center gap-6">
          {tabs.map(t => (
            <button key={t} onClick={() => { setActive(t); if (t === 'Início') onHome(); }}
              className={`text-xs font-semibold transition-colors pb-0.5 border-b-2 ${active === t ? 'text-white border-red-500' : 'text-white/40 border-transparent hover:text-white/70'}`}>
              {t}
            </button>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border border-white/[0.08] rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Search size={12} className="text-white/25" />
          <span className="text-white/20 text-xs">Buscar...</span>
        </div>
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
          <Bell size={15} className="text-white/40" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black cursor-pointer hover:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #E50914, #b91c1c)' }}>JM</div>
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function LMSPlatform() {
  const [screen, setScreen]   = useState<Screen>('browse');
  const [course, setCourse]   = useState<Course | null>(null);

  const goDetail = (c: Course) => { setCourse(c); setScreen('detail'); };
  const goPlayer = (c: Course) => { setCourse(c); setScreen('player'); };
  const goBack   = () => {
    if (screen === 'player') { setScreen('detail'); return; }
    setScreen('browse'); setCourse(null);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" style={{ background: '#0A0A0A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar onHome={() => { setScreen('browse'); setCourse(null); }} screen={screen} />

      <AnimatePresence mode="wait">
        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }} className="flex-1 flex flex-col overflow-hidden">
          {screen === 'browse' && <BrowseScreen onSelect={goDetail} onPlay={goPlayer} />}
          {screen === 'detail' && course && <DetailScreen course={course} onBack={goBack} onPlay={goPlayer} onSelect={goDetail} />}
          {screen === 'player' && course && <PlayerScreen course={course} onBack={goBack} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
