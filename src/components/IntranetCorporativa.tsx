import React, { useState } from 'react';
import {
  Home, MessageSquare, FileText, Users, Bell, Search,
  ChevronRight, Pin, Star, Download, Eye, Calendar,
  Folder, FolderOpen, File, Image, FileSpreadsheet,
  Hash, Lock, Globe, Clock, CheckCircle, AlertCircle,
  TrendingUp, Briefcase, Coffee, ChevronDown, Plus,
  Filter, Grid, List, ArrowUpRight, Building2, Layers,
  BookOpen, Video, Mic, Paperclip, Send, Smile,
  MoreHorizontal, X, Check, Award, Zap, Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type View = 'inicio' | 'comunicados' | 'documentos' | 'pessoas' | 'grupos';

interface Employee {
  id: string; name: string; role: string; dept: string;
  avatar: string; color: string; online: boolean; ext: string;
}

interface DocItem {
  id: string; name: string; type: 'folder' | 'pdf' | 'xlsx' | 'img' | 'doc' | 'video';
  size?: string; updatedBy?: string; updatedAt?: string;
  children?: DocItem[]; pinned?: boolean;
}

interface Post {
  id: string; author: string; authorRole: string; avatar: string;
  avatarColor: string; time: string; category: string;
  categoryColor: string; title: string; body: string;
  likes: number; comments: number; pinned?: boolean; urgent?: boolean;
  img?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const POSTS: Post[] = [
  {
    id:'p1', author:'Diretoria', authorRole:'Comunicação Institucional',
    avatar:'DIR', avatarColor:'#3B82F6', time:'Hoje, 08:30',
    category:'Institucional', categoryColor:'#3B82F6',
    title:'Resultados Q1 2026 — Crescimento de 34% na receita',
    body:'Temos o prazer de compartilhar os resultados do primeiro trimestre de 2026. A empresa atingiu R$ 28,4M em receita, superando a meta em 12%. Agradecemos o esforço de todos os times.',
    likes:142, comments:38, pinned:true,
  },
  {
    id:'p2', author:'RH', authorRole:'Recursos Humanos',
    avatar:'RH', avatarColor:'#8B5CF6', time:'Hoje, 10:15',
    category:'RH', categoryColor:'#8B5CF6',
    title:'Avaliação de Desempenho 2026 — Prazo: 28 de março',
    body:'A rodada semestral de avaliações começa na segunda-feira. Todos os colaboradores devem preencher a autoavaliação no portal de RH até o dia 28/03. Dúvidas: rh@inova.com.',
    likes:67, comments:14, urgent:true,
  },
  {
    id:'p3', author:'TI', authorRole:'Infraestrutura & Segurança',
    avatar:'TI', avatarColor:'#10B981', time:'Ontem, 16:00',
    category:'TI', categoryColor:'#10B981',
    title:'Atualização dos sistemas às 23h de sábado',
    body:'Informamos que os servidores passarão por manutenção programada no sábado, 15/03, das 23h às 02h. O acesso a sistemas internos ficará temporariamente indisponível.',
    likes:23, comments:7,
  },
  {
    id:'p4', author:'Comercial', authorRole:'Gerência de Vendas',
    avatar:'COM', avatarColor:'#F59E0B', time:'22 Fev, 14:30',
    category:'Vendas', categoryColor:'#F59E0B',
    title:'Meta de março: R$ 9,5M — Vamos juntos!',
    body:'Com o pipeline atual de R$ 11,2M qualificado, temos ótimas chances de fechar março acima da meta. Acompanhe o painel de vendas em tempo real no BI.',
    likes:98, comments:31,
  },
  {
    id:'p5', author:'Cultura & Engajamento', authorRole:'People Experience',
    avatar:'CX', avatarColor:'#EC4899', time:'20 Fev, 09:00',
    category:'Eventos', categoryColor:'#EC4899',
    title:'Happy Hour de aniversário da empresa — 20 de março 🎉',
    body:'Celebramos 8 anos de Inova! No dia 20/03, a partir das 18h, no rooftop do escritório. Confirme presença até sexta-feira no formulário abaixo.',
    likes:211, comments:89,
  },
];

const EMPLOYEES: Employee[] = [
  { id:'e1', name:'Ana Beatriz Souza',  role:'Diretora de Produto',     dept:'Produto',     avatar:'AB', color:'#8B5CF6', online:true,  ext:'2001' },
  { id:'e2', name:'Carlos Mendez',      role:'CTO',                      dept:'Tecnologia',  avatar:'CM', color:'#3B82F6', online:true,  ext:'2002' },
  { id:'e3', name:'Fernanda Lima',      role:'Head de Marketing',        dept:'Marketing',   avatar:'FL', color:'#EC4899', online:false, ext:'2003' },
  { id:'e4', name:'Rafael Torres',      role:'Gerente Comercial',        dept:'Comercial',   avatar:'RT', color:'#F59E0B', online:true,  ext:'2004' },
  { id:'e5', name:'Juliana Ramos',      role:'Coordenadora de RH',       dept:'RH',          avatar:'JR', color:'#10B981', online:true,  ext:'2005' },
  { id:'e6', name:'Diego Nascimento',   role:'Engenheiro de Software',   dept:'Tecnologia',  avatar:'DN', color:'#14B8A6', online:false, ext:'2006' },
  { id:'e7', name:'Mariana Oliveira',   role:'Analista Financeira',      dept:'Financeiro',  avatar:'MO', color:'#F97316', online:true,  ext:'2007' },
  { id:'e8', name:'Lucas Ferreira',     role:'Designer de UX/UI',        dept:'Produto',     avatar:'LF', color:'#A78BFA', online:false, ext:'2008' },
  { id:'e9', name:'Priya Gupta',        role:'Data Scientist',           dept:'Dados',       avatar:'PG', color:'#34D399', online:true,  ext:'2009' },
  { id:'e10', name:'Bruno Carvalho',    role:'Scrum Master',             dept:'Tecnologia',  avatar:'BC', color:'#60A5FA', online:true,  ext:'2010' },
  { id:'e11', name:'Camila Pereira',    role:'Gerente de Projetos',      dept:'Operações',   avatar:'CP', color:'#F472B6', online:false, ext:'2011' },
  { id:'e12', name:'Thiago Alves',      role:'Analista de Suporte',      dept:'TI',          avatar:'TA', color:'#4ADE80', online:true,  ext:'2012' },
];

const DOCS: DocItem[] = [
  { id:'d0', name:'Documentos da Empresa', type:'folder', children:[
    { id:'d1', name:'Políticas e Procedimentos', type:'folder', children:[
      { id:'d1a', name:'Política de Segurança da Informação.pdf', type:'pdf', size:'2.4 MB', updatedBy:'TI', updatedAt:'10 Mar 2026' },
      { id:'d1b', name:'Código de Conduta 2026.pdf', type:'pdf', size:'1.8 MB', updatedBy:'RH', updatedAt:'01 Jan 2026', pinned:true },
      { id:'d1c', name:'Política de Home Office.pdf', type:'pdf', size:'890 KB', updatedBy:'RH', updatedAt:'15 Fev 2026' },
    ]},
    { id:'d2', name:'Contratos e Jurídico', type:'folder', children:[
      { id:'d2a', name:'Modelo Contrato de Prestação de Serviços.docx', type:'doc', size:'145 KB', updatedBy:'Jurídico', updatedAt:'22 Fev 2026' },
      { id:'d2b', name:'NDA Padrão Internacional.pdf', type:'pdf', size:'320 KB', updatedBy:'Jurídico', updatedAt:'12 Jan 2026' },
    ]},
    { id:'d3', name:'Financeiro', type:'folder', children:[
      { id:'d3a', name:'Orçamento Anual 2026.xlsx', type:'xlsx', size:'4.2 MB', updatedBy:'Financeiro', updatedAt:'03 Mar 2026', pinned:true },
      { id:'d3b', name:'Fluxo de Caixa — Fev 2026.xlsx', type:'xlsx', size:'1.1 MB', updatedBy:'Mariana O.', updatedAt:'28 Fev 2026' },
    ]},
  ]},
  { id:'d4', name:'Marketing e Marca', type:'folder', children:[
    { id:'d4a', name:'Manual de Identidade Visual 2026.pdf', type:'pdf', size:'18 MB', updatedBy:'Design', updatedAt:'05 Jan 2026' },
    { id:'d4b', name:'Templates de Apresentação.pdf', type:'pdf', size:'6.3 MB', updatedBy:'Lucas F.', updatedAt:'14 Fev 2026' },
    { id:'d4c', name:'Fotos Institucionais 2025.zip', type:'img', size:'234 MB', updatedBy:'Mkt', updatedAt:'30 Nov 2025' },
  ]},
  { id:'d5', name:'Onboarding Novos Colaboradores', type:'folder', children:[
    { id:'d5a', name:'Guia de Boas-Vindas.pdf', type:'pdf', size:'5.8 MB', updatedBy:'RH', updatedAt:'20 Fev 2026' },
    { id:'d5b', name:'Treinamento de Cultura.mp4', type:'video', size:'1.2 GB', updatedBy:'PX', updatedAt:'10 Jan 2026' },
  ]},
];

const EVENTS = [
  { date:'15 Mar', day:'Sáb', title:'Manutenção dos sistemas', type:'TI',     color:'#10B981' },
  { date:'20 Mar', day:'Sex', title:'Happy Hour Aniversário',  type:'Evento', color:'#EC4899' },
  { date:'28 Mar', day:'Sex', title:'Prazo: Autoavaliação RH', type:'RH',     color:'#8B5CF6' },
  { date:'31 Mar', day:'Seg', title:'Fechamento trimestral',   type:'Fin.',   color:'#F59E0B' },
];

const GROUPS = [
  { id:'g1', name:'#geral',               members:248, unread:12, color:'#3B82F6',  locked:false },
  { id:'g2', name:'#tecnologia',          members:42,  unread:3,  color:'#10B981',  locked:false },
  { id:'g3', name:'#comercial',           members:28,  unread:0,  color:'#F59E0B',  locked:false },
  { id:'g4', name:'#marketing',           members:19,  unread:5,  color:'#EC4899',  locked:false },
  { id:'g5', name:'#diretoria-exec',      members:8,   unread:0,  color:'#8B5CF6',  locked:true  },
  { id:'g6', name:'#happy-hour-2026',     members:156, unread:44, color:'#F97316',  locked:false },
  { id:'g7', name:'#suporte-interno',     members:12,  unread:1,  color:'#14B8A6',  locked:false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileIcon(type: DocItem['type']) {
  if (type === 'folder')    return <Folder size={16} className="text-[#F59E0B]" />;
  if (type === 'pdf')       return <File size={16} className="text-[#EF4444]" />;
  if (type === 'xlsx')      return <FileSpreadsheet size={16} className="text-[#22C55E]" />;
  if (type === 'img')       return <Image size={16} className="text-[#3B82F6]" />;
  if (type === 'video')     return <Video size={16} className="text-[#8B5CF6]" />;
  return <FileText size={16} className="text-[#94A3B8]" />;
}

function Avatar({ initials, color, size = 32, online }: { initials: string; color: string; size?: number; online?: boolean }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="flex items-center justify-center rounded-full text-white font-bold" style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}>
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0D1117] ${online ? 'bg-green-400' : 'bg-slate-500'}`} />
      )}
    </div>
  );
}

// ─── Sub-views ────────────────────────────────────────────────────────────────

function InicioView() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  return (
    <div className="flex gap-4 md:gap-6 h-full overflow-hidden">
      {/* Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1" style={{ scrollbarWidth:'none' }}>
        {POSTS.map(post => (
          <motion.div key={post.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            className="bg-[#161B22] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar initials={post.avatar} color={post.avatarColor} size={38} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold">{post.author}</span>
                    {post.pinned && <Pin size={12} className="text-[#F59E0B]" />}
                    {post.urgent && <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full">Urgente</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white/40 text-xs">{post.authorRole}</span>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-white/40 text-xs">{post.time}</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: post.categoryColor + '20', color: post.categoryColor }}>
                {post.category}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-white font-semibold mb-2 leading-snug">{post.title}</h3>
            <p className="text-white/55 text-sm leading-relaxed">{post.body}</p>

            {/* Footer */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
              <button
                onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))}
                className={`flex items-center gap-1.5 text-xs transition-colors ${liked[post.id] ? 'text-red-400' : 'text-white/40 hover:text-white/70'}`}>
                <span className="text-base">{liked[post.id] ? '❤️' : '🤍'}</span>
                <span>{post.likes + (liked[post.id] ? 1 : 0)}</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
                <MessageSquare size={14} />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors ml-auto">
                <ArrowUpRight size={14} />
                <span>Compartilhar</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="hidden lg:block w-64 flex-shrink-0 space-y-4 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
        {/* User card */}
        <div className="bg-[#161B22] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <Avatar initials="VM" color="#3B82F6" size={44} online={true} />
            <div>
              <p className="text-white text-sm font-semibold">Vitor Machado</p>
              <p className="text-white/40 text-xs">Produto · Senior</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[['Posts','12'],['Docs','34'],['Grupos','7']].map(([l,v]) => (
              <div key={l} className="text-center">
                <p className="text-white font-bold text-lg leading-none">{v}</p>
                <p className="text-white/40 text-[10px] mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agenda */}
        <div className="bg-[#161B22] rounded-2xl p-4 border border-white/5">
          <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Agenda</h4>
          <div className="space-y-2">
            {EVENTS.map(ev => (
              <div key={ev.date} className="flex items-center gap-3">
                <div className="w-9 flex-shrink-0 text-center">
                  <p className="text-[10px] text-white/40 uppercase">{ev.day}</p>
                  <p className="text-white text-sm font-bold leading-tight">{ev.date.split(' ')[0]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="w-1 h-1 rounded-full mb-1" style={{ background: ev.color }} />
                  <p className="text-white/70 text-xs leading-tight truncate">{ev.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-[#161B22] rounded-2xl p-4 border border-white/5">
          <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Acesso Rápido</h4>
          <div className="space-y-1">
            {[
              ['Solicitações de RH', BookOpen, '#8B5CF6'],
              ['Painel de BI', TrendingUp, '#3B82F6'],
              ['Suporte Técnico', Zap, '#10B981'],
              ['Refeitório — Cardápio', Coffee, '#F59E0B'],
            ].map(([label, Icon, color]) => (
              <button key={label as string} className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: (color as string) + '20' }}>
                  {React.createElement(Icon as React.ElementType, { size:13, style:{ color } })}
                </div>
                <span className="text-white/60 text-xs">{label as string}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComunicadosView() {
  const categories = ['Todos', 'Institucional', 'RH', 'TI', 'Vendas', 'Eventos'];
  const [active, setActive] = useState('Todos');

  const filtered = active === 'Todos' ? POSTS : POSTS.filter(p => p.category === active);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setActive(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${active === c ? 'bg-[#3B82F6] text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3" style={{ scrollbarWidth:'none' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((post, i) => (
            <motion.div key={post.id}
              initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:10 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[#161B22] rounded-xl p-4 border border-white/5 flex gap-4 hover:border-white/10 transition-colors cursor-pointer group">
              <Avatar initials={post.avatar} color={post.avatarColor} size={42} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {post.pinned && <Pin size={12} className="text-[#F59E0B] flex-shrink-0" />}
                  {post.urgent && <AlertCircle size={12} className="text-red-400 flex-shrink-0" />}
                  <h3 className="text-white text-sm font-semibold truncate">{post.title}</h3>
                </div>
                <p className="text-white/45 text-xs leading-relaxed line-clamp-2">{post.body}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-white/30 text-xs">{post.author}</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/30 text-xs">{post.time}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-auto" style={{ background: post.categoryColor + '20', color: post.categoryColor }}>{post.category}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors self-center flex-shrink-0" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DocTree({ items, depth = 0 }: { items: DocItem[]; depth?: number }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ d0: true, d1: true });

  return (
    <div className={depth > 0 ? 'ml-4 border-l border-white/5 pl-3' : ''}>
      {items.map(item => (
        <div key={item.id}>
          <div
            onClick={() => item.type === 'folder' && setOpen(o => ({ ...o, [item.id]: !o[item.id] }))}
            className={`flex items-center gap-2 py-2 px-2 rounded-lg text-sm group transition-colors ${item.type === 'folder' ? 'cursor-pointer hover:bg-white/5' : 'hover:bg-white/[0.03] cursor-pointer'}`}>
            <span className="flex-shrink-0">
              {item.type === 'folder'
                ? (open[item.id] ? <FolderOpen size={15} className="text-[#F59E0B]" /> : <Folder size={15} className="text-[#F59E0B]" />)
                : fileIcon(item.type)}
            </span>
            <span className={`flex-1 truncate ${item.type === 'folder' ? 'text-white/80 font-medium' : 'text-white/60'}`}>{item.name}</span>
            {item.pinned && <Pin size={10} className="text-[#F59E0B] flex-shrink-0" />}
            {item.type !== 'folder' && (
              <>
                {item.size && <span className="text-white/30 text-xs flex-shrink-0">{item.size}</span>}
                <Download size={12} className="text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
              </>
            )}
            {item.type === 'folder' && item.children && (
              <ChevronDown size={12} className={`text-white/30 flex-shrink-0 transition-transform ${open[item.id] ? '' : '-rotate-90'}`} />
            )}
          </div>
          {item.type === 'folder' && open[item.id] && item.children && (
            <DocTree items={item.children} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

function DocumentosView() {
  return (
    <div className="h-full flex gap-4 md:gap-6 overflow-hidden">
      {/* Tree */}
      <div className="hidden md:block w-80 flex-shrink-0 bg-[#161B22] rounded-2xl p-4 border border-white/5 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Arquivos</span>
          <button className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#3B82F6]/20 text-[#3B82F6] hover:bg-[#3B82F6]/30 transition-colors">
            <Plus size={12} />
          </button>
        </div>
        <DocTree items={DOCS} />
      </div>

      {/* Recent */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Recentes & Fixados</h3>
          <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
            <Filter size={12} />
            Filtrar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[
            { name:'Orçamento Anual 2026.xlsx', type:'xlsx' as const, dept:'Financeiro', date:'03 Mar 2026', size:'4.2 MB', pinned:true },
            { name:'Código de Conduta 2026.pdf', type:'pdf' as const, dept:'RH', date:'01 Jan 2026', size:'1.8 MB', pinned:true },
            { name:'Política de Segurança da Informação.pdf', type:'pdf' as const, dept:'TI', date:'10 Mar 2026', size:'2.4 MB' },
            { name:'Manual de Identidade Visual 2026.pdf', type:'pdf' as const, dept:'Design', date:'05 Jan 2026', size:'18 MB' },
            { name:'Guia de Boas-Vindas.pdf', type:'pdf' as const, dept:'RH', date:'20 Fev 2026', size:'5.8 MB' },
            { name:'Fluxo de Caixa — Fev 2026.xlsx', type:'xlsx' as const, dept:'Financeiro', date:'28 Fev 2026', size:'1.1 MB' },
          ].map((doc, i) => (
            <motion.div key={i} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#161B22] rounded-xl p-4 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                {fileIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                  {doc.pinned && <Pin size={11} className="text-[#F59E0B] flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-white/40 text-xs">{doc.dept}</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/40 text-xs">{doc.date}</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/40 text-xs">{doc.size}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><Eye size={12} className="text-white/60" /></button>
                <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><Download size={12} className="text-white/60" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PessoasView() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('Todos');
  const depts = ['Todos', ...Array.from(new Set(EMPLOYEES.map(e => e.dept)))];

  const filtered = EMPLOYEES.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'Todos' || e.dept === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Search + filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-[#161B22] border border-white/8 rounded-xl px-3 py-2.5">
          <Search size={14} className="text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar colaboradores..."
            className="bg-transparent text-white text-sm placeholder-white/30 outline-none flex-1" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="bg-[#161B22] border border-white/8 rounded-xl px-3 py-2.5 text-white/70 text-sm outline-none cursor-pointer">
          {depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((emp, i) => (
              <motion.div key={emp.id} layout
                initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }}
                transition={{ delay: i * 0.03 }}
                className="bg-[#161B22] rounded-2xl p-4 border border-white/5 hover:border-white/15 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <Avatar initials={emp.avatar} color={emp.color} size={44} online={emp.online} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{emp.name}</p>
                    <p className="text-white/45 text-xs truncate mt-0.5">{emp.role}</p>
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-white/50 mt-2">{emp.dept}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] text-xs hover:bg-[#3B82F6]/25 transition-colors">
                    <MessageSquare size={11} />Mensagem
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 transition-colors">
                    <Phone size={11} />Ramal
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function GruposView() {
  const [activeGroup, setActiveGroup] = useState('g1');
  const group = GROUPS.find(g => g.id === activeGroup);

  const mockMessages = [
    { from:'Ana Beatriz', avatar:'AB', color:'#8B5CF6', time:'09:14', text:'Bom dia time! Reunião de produto às 14h na sala Gauss 🚀' },
    { from:'Carlos Mendez', avatar:'CM', color:'#3B82F6', time:'09:17', text:'Confirmado! Vou preparar os slides do roadmap Q2.' },
    { from:'Lucas Ferreira', avatar:'LF', color:'#A78BFA', time:'09:21', text:'Alguém pode compartilhar a ata da última reunião?' },
    { from:'Priya Gupta', avatar:'PG', color:'#34D399', time:'09:23', text:'Deixo a ata no canal de documentos. 📋', attachment:'Ata_Reunião_Produto_Mar.pdf' },
    { from:'Bruno Carvalho', avatar:'BC', color:'#60A5FA', time:'09:28', text:'Ótimo! Vejo vocês às 14h 👍' },
    { from:'Você', avatar:'VM', color:'#3B82F6', time:'09:31', text:'Estarei lá! Vou apresentar os dados de performance da sprint.', self:true },
  ];

  return (
    <div className="h-full flex gap-4 overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex w-56 flex-shrink-0 bg-[#161B22] rounded-2xl border border-white/5 flex-col overflow-hidden">
        <div className="p-3 border-b border-white/5">
          <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Canais</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth:'none' }}>
          {GROUPS.map(g => (
            <button key={g.id} onClick={() => !g.locked && setActiveGroup(g.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeGroup === g.id ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/80'} ${g.locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
              <div className="flex items-center gap-2 min-w-0">
                {g.locked ? <Lock size={12} className="flex-shrink-0" /> : <Hash size={12} className="flex-shrink-0" style={{ color: g.color }} />}
                <span className="truncate text-xs">{g.name.replace('#','')}</span>
              </div>
              {g.unread > 0 && !g.locked && (
                <span className="text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center" style={{ background: g.color + '30', color: g.color }}>
                  {g.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 bg-[#161B22] rounded-2xl border border-white/5 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
          <Hash size={16} style={{ color: group?.color }} />
          <span className="text-white font-semibold text-sm">{group?.name.replace('#','')}</span>
          <span className="text-white/30 text-xs">{group?.members} membros</span>
          <div className="ml-auto flex items-center gap-2">
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"><Search size={14} /></button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"><Users size={14} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth:'none' }}>
          {mockMessages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${(msg as any).self ? 'flex-row-reverse' : ''}`}>
              {!(msg as any).self && <Avatar initials={msg.avatar} color={msg.color} size={32} />}
              <div className={`max-w-[70%] ${(msg as any).self ? 'items-end' : 'items-start'} flex flex-col`}>
                {!(msg as any).self && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: msg.color }}>{msg.from}</span>
                    <span className="text-white/25 text-xs">{msg.time}</span>
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-2.5 text-sm ${(msg as any).self ? 'bg-[#3B82F6] text-white rounded-tr-sm' : 'bg-white/5 text-white/80 rounded-tl-sm'}`}>
                  {msg.text}
                  {msg.attachment && (
                    <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-black/20">
                      <Paperclip size={12} className="flex-shrink-0 text-white/60" />
                      <span className="text-xs text-white/70 truncate">{msg.attachment}</span>
                    </div>
                  )}
                </div>
                {(msg as any).self && <span className="text-white/25 text-xs mt-1">{msg.time}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
            <button className="text-white/30 hover:text-white/60 transition-colors"><Paperclip size={16} /></button>
            <input placeholder={`Mensagem em #${group?.name.replace('#','')}`}
              className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none" />
            <button className="text-white/30 hover:text-white/60 transition-colors"><Smile size={16} /></button>
            <button className="w-7 h-7 rounded-lg bg-[#3B82F6] flex items-center justify-center hover:bg-[#2563EB] transition-colors flex-shrink-0">
              <Send size={12} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const NAV: { id: View; label: string; Icon: React.ElementType; badge?: number }[] = [
  { id:'inicio',       label:'Início',      Icon: Home },
  { id:'comunicados',  label:'Comunicados', Icon: Bell,         badge: 3 },
  { id:'documentos',   label:'Documentos',  Icon: FileText },
  { id:'pessoas',      label:'Pessoas',     Icon: Users },
  { id:'grupos',       label:'Grupos',      Icon: MessageSquare, badge: 57 },
];

export default function IntranetCorporativa() {
  const [view, setView] = useState<View>('inicio');
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex h-full bg-[#0D1117] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="hidden md:flex w-56 flex-shrink-0 bg-[#080C10] border-r border-white/5 flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#3B82F6] flex items-center justify-center">
              <Building2 size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Inova</p>
              <p className="text-white/40 text-[10px] leading-tight">Intranet</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ id, label, Icon, badge }) => (
            <button key={id} onClick={() => setView(id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${view === id ? 'bg-[#3B82F6]/15 text-[#60A5FA] font-semibold' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}>
              <div className="flex items-center gap-3">
                <Icon size={16} />
                <span>{label}</span>
              </div>
              {badge && (
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${view === id ? 'bg-[#3B82F6] text-white' : 'bg-white/10 text-white/50'}`}>
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom user */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-2.5 px-2">
            <Avatar initials="VM" color="#3B82F6" size={32} online={true} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Vitor Machado</p>
              <p className="text-white/40 text-[10px] truncate">Produto · Senior</p>
            </div>
            <button className="text-white/30 hover:text-white/60 transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-3 md:px-6 border-b border-white/5 bg-[#0D1117] flex-shrink-0">
          <div>
            <h1 className="text-white font-semibold text-sm">{NAV.find(n => n.id === view)?.label}</h1>
            <p className="text-white/30 text-xs">Sexta-feira, 11 de Março de 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
              <Search size={13} className="text-white/30" />
              <input placeholder="Buscar na intranet..." className="bg-transparent text-white text-xs placeholder-white/30 outline-none w-40" />
            </div>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors text-white/40 hover:text-white/70">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 border border-[#0D1117]" />
            </button>
          </div>
        </header>

        {/* View content */}
        <div className="flex-1 overflow-hidden p-3 md:p-5">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
              transition={{ duration:0.18 }} className="h-full">
              {view === 'inicio'      && <InicioView />}
              {view === 'comunicados' && <ComunicadosView />}
              {view === 'documentos'  && <DocumentosView />}
              {view === 'pessoas'     && <PessoasView />}
              {view === 'grupos'      && <GruposView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
