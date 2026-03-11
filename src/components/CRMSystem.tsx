import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Activity, BarChart2,
  Phone, Mail, Video, FileText, Search,
  X, TrendingUp, Target, Clock,
  Building2, ChevronRight, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechado';
type View = 'pipeline' | 'clientes' | 'atividades' | 'relatorios';

interface Deal {
  id: string;
  company: string;
  value: number;
  responsible: string;
  responsibleName: string;
  probability: number;
  daysInStage: number;
  stage: Stage;
  segment: string;
  phone: string;
  email: string;
  notes: string;
  lastActivity: string;
}

interface Client {
  id: string;
  company: string;
  segment: string;
  contact: string;
  email: string;
  totalValue: number;
  status: 'Ativo' | 'Em negociação' | 'Inativo';
  lastActivity: string;
}

interface ActivityItem {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'proposal';
  title: string;
  company: string;
  responsible: string;
  time: string;
  description: string;
}

interface MonthlyRevenue {
  month: string;
  value: number;
  target: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const deals: Deal[] = [
  { id: 'd1', company: 'TechBR Soluções', value: 85000, responsible: 'RA', responsibleName: 'Rafael Alves', probability: 15, daysInStage: 4, stage: 'prospeccao', segment: 'Tecnologia', phone: '(00) 90000-0001', email: 'g.nunes@techbr.exemplo', notes: 'Empresa de médio porte buscando modernizar sistemas legados. Reunião inicial agendada.', lastActivity: 'Hoje' },
  { id: 'd2', company: 'Grupo Varejo Max', value: 120000, responsible: 'CM', responsibleName: 'Carla Melo', probability: 20, daysInStage: 8, stage: 'prospeccao', segment: 'Varejo', phone: '(00) 90000-0002', email: 'a.souza@varejomax.exemplo', notes: 'Rede com 12 lojas, interesse em plataforma de e-commerce integrada ao ERP.', lastActivity: '4 dias atrás' },
  { id: 'd3', company: 'FinTech Plus', value: 200000, responsible: 'RA', responsibleName: 'Rafael Alves', probability: 40, daysInStage: 12, stage: 'qualificacao', segment: 'Financeiro', phone: '(00) 90000-0003', email: 'bruno@fintechplus.exemplo', notes: 'Startup fintech com 50k usuários. Necessita plataforma robusta com compliance regulatório.', lastActivity: '2 dias atrás' },
  { id: 'd4', company: 'Construtora Verde', value: 95000, responsible: 'JP', responsibleName: 'João Pedro', probability: 45, daysInStage: 6, stage: 'qualificacao', segment: 'Construção', phone: '(00) 90000-0004', email: 'engenharia@construtoraverde.exemplo', notes: 'Construtora sustentável com 8 obras ativas. Quer sistema de gestão de projetos e fornecedores.', lastActivity: '2 dias atrás' },
  { id: 'd5', company: 'Saúde Total', value: 150000, responsible: 'CM', responsibleName: 'Carla Melo', probability: 65, daysInStage: 9, stage: 'proposta', segment: 'Saúde', phone: '(00) 90000-0005', email: 'c.reis@saudetotal.exemplo', notes: 'Clínica com 3 unidades. Proposta enviada para sistema de agendamento e prontuário digital.', lastActivity: 'Ontem' },
  { id: 'd6', company: 'LogisTech', value: 75000, responsible: 'RA', responsibleName: 'Rafael Alves', probability: 80, daysInStage: 14, stage: 'negociacao', segment: 'Logística', phone: '(00) 90000-0006', email: 'diego@logistech.exemplo', notes: 'Transportadora com frota de 200 veículos. Negociando módulo de rastreamento em tempo real.', lastActivity: 'Ontem' },
  { id: 'd7', company: 'EduPlus', value: 60000, responsible: 'JP', responsibleName: 'João Pedro', probability: 85, daysInStage: 3, stage: 'negociacao', segment: 'Educação', phone: '(00) 90000-0007', email: 'f.cruz@eduplus.exemplo', notes: 'EdTech com 5k alunos. Em fase final de negociação de LMS personalizado com gamificação.', lastActivity: '3 dias atrás' },
  { id: 'd8', company: 'RetailX', value: 110000, responsible: 'CM', responsibleName: 'Carla Melo', probability: 100, daysInStage: 2, stage: 'fechado', segment: 'Varejo', phone: '(00) 90000-0008', email: 'ana@retailx.exemplo', notes: 'Contrato assinado. Kickoff agendado para próxima semana.', lastActivity: 'Hoje' },
];

const clients: Client[] = [
  { id: 'c1', company: 'RetailX', segment: 'Varejo', contact: 'Ana Souza', email: 'ana@retailx.exemplo', totalValue: 110000, status: 'Ativo', lastActivity: 'Hoje' },
  { id: 'c2', company: 'FinTech Plus', segment: 'Financeiro', contact: 'Bruno Lima', email: 'bruno@fintechplus.exemplo', totalValue: 200000, status: 'Em negociação', lastActivity: '2 dias atrás' },
  { id: 'c3', company: 'Saúde Total', segment: 'Saúde', contact: 'Cláudia Reis', email: 'c.reis@saudetotal.exemplo', totalValue: 150000, status: 'Em negociação', lastActivity: 'Ontem' },
  { id: 'c4', company: 'LogisTech', segment: 'Logística', contact: 'Diego Faria', email: 'diego@logistech.exemplo', totalValue: 75000, status: 'Ativo', lastActivity: '5 dias atrás' },
  { id: 'c5', company: 'EduPlus', segment: 'Educação', contact: 'Fernanda Cruz', email: 'f.cruz@eduplus.exemplo', totalValue: 60000, status: 'Em negociação', lastActivity: '3 dias atrás' },
  { id: 'c6', company: 'TechBR Soluções', segment: 'Tecnologia', contact: 'Gabriel Nunes', email: 'g.nunes@techbr.exemplo', totalValue: 85000, status: 'Ativo', lastActivity: '1 semana atrás' },
];

const activities: ActivityItem[] = [
  { id: 'a1', type: 'meeting', title: 'Reunião de apresentação', company: 'FinTech Plus', responsible: 'Rafael Alves', time: 'Hoje, 10:30', description: 'Demo da plataforma realizada com sucesso. Próximo passo: proposta técnica.' },
  { id: 'a2', type: 'proposal', title: 'Proposta enviada', company: 'Saúde Total', responsible: 'Carla Melo', time: 'Hoje, 09:15', description: 'Proposta comercial enviada por email. Aguardando retorno do gestor financeiro.' },
  { id: 'a3', type: 'call', title: 'Ligação de follow-up', company: 'LogisTech', responsible: 'Rafael Alves', time: 'Ontem, 16:45', description: 'Cliente solicitou ajuste no escopo do módulo de rastreamento. Revisão agendada.' },
  { id: 'a4', type: 'email', title: 'Email de proposta revisada', company: 'EduPlus', responsible: 'João Pedro', time: 'Ontem, 14:00', description: 'Enviada versão 2.0 da proposta com desconto de 8% e novos prazos de entrega.' },
  { id: 'a5', type: 'meeting', title: 'Demo do produto', company: 'Construtora Verde', responsible: 'João Pedro', time: '2 dias atrás, 11:00', description: 'Demonstração do módulo de gestão de projetos. Equipe técnica aprovou a solução.' },
  { id: 'a6', type: 'call', title: 'Qualificação inicial', company: 'TechBR Soluções', responsible: 'Rafael Alves', time: '3 dias atrás, 15:20', description: 'BANT confirmado: budget aprovado, decisor identificado, necessidade clara, prazo Q2.' },
  { id: 'a7', type: 'email', title: 'Boas-vindas ao pipeline', company: 'Grupo Varejo Max', responsible: 'Carla Melo', time: '4 dias atrás', description: 'Email de apresentação enviado com materiais institucionais e cases do setor.' },
];

const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Out', value: 320, target: 350 },
  { month: 'Nov', value: 410, target: 380 },
  { month: 'Dez', value: 380, target: 400 },
  { month: 'Jan', value: 290, target: 350 },
  { month: 'Fev', value: 450, target: 420 },
  { month: 'Mar', value: 510, target: 450 },
];

const funnelData = [
  { stage: 'Prospecção', count: 47, pct: 100 },
  { stage: 'Qualificação', count: 31, pct: 66 },
  { stage: 'Proposta', count: 19, pct: 40 },
  { stage: 'Negociação', count: 11, pct: 23 },
  { stage: 'Fechado Ganho', count: 8, pct: 17 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

const stageConfig: Record<Stage, { label: string; color: string; border: string }> = {
  prospeccao:  { label: 'Prospecção',    color: 'bg-slate-100 text-slate-600',    border: 'border-t-slate-400' },
  qualificacao:{ label: 'Qualificação',  color: 'bg-blue-50 text-blue-600',       border: 'border-t-blue-400' },
  proposta:    { label: 'Proposta',      color: 'bg-yellow-50 text-yellow-700',   border: 'border-t-yellow-400' },
  negociacao:  { label: 'Negociação',    color: 'bg-orange-50 text-orange-600',   border: 'border-t-orange-400' },
  fechado:     { label: 'Fechado Ganho', color: 'bg-green-50 text-green-700',     border: 'border-t-green-500' },
};

const activityIconConfig: Record<ActivityItem['type'], { icon: React.ReactNode; bg: string; text: string }> = {
  call:     { icon: <Phone size={14} />,     bg: 'bg-blue-50',   text: 'text-blue-600' },
  email:    { icon: <Mail size={14} />,      bg: 'bg-slate-50',  text: 'text-slate-600' },
  meeting:  { icon: <Video size={14} />,     bg: 'bg-violet-50', text: 'text-violet-600' },
  proposal: { icon: <FileText size={14} />,  bg: 'bg-amber-50',  text: 'text-amber-600' },
};

const statusBadge: Record<Client['status'], string> = {
  'Ativo':          'bg-green-50 text-green-700',
  'Em negociação':  'bg-violet-50 text-violet-700',
  'Inativo':        'bg-slate-100 text-slate-500',
};

const probColor = (p: number) => p >= 70 ? 'text-green-600' : p >= 40 ? 'text-yellow-600' : 'text-red-500';

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 text-left
        ${active ? 'bg-violet-600 text-white font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function KpiChip({ label, value, up }: { label: string; value: string; up?: boolean }) {
  return (
    <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full">
      <span className="text-violet-500 text-[11px]">{label}</span>
      <span className="text-violet-800 text-[11px] font-semibold">{value}</span>
      {up !== undefined && (
        up
          ? <ArrowUpRight size={11} className="text-green-500" />
          : <ArrowDownRight size={11} className="text-red-400" />
      )}
    </div>
  );
}

function DealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-violet-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Building2 size={13} className="text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-800 text-sm leading-tight">{deal.company}</span>
        </div>
        <ChevronRight size={14} className="text-slate-300 group-hover:text-violet-500 transition-colors" />
      </div>
      <p className="text-violet-600 font-bold text-base mb-3">{formatCurrency(deal.value)}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center justify-center">
            {deal.responsible}
          </div>
          <span className="text-slate-400 text-xs">{deal.daysInStage}d</span>
        </div>
        <span className={`text-xs font-semibold ${probColor(deal.probability)}`}>{deal.probability}%</span>
      </div>
    </motion.div>
  );
}

function KanbanColumn({ stage, deals, onCardClick }: { stage: Stage; deals: Deal[]; onCardClick: (d: Deal) => void }) {
  const cfg = stageConfig[stage];
  const total = deals.reduce((s, d) => s + d.value, 0);
  return (
    <div className={`min-w-[210px] flex-1 bg-slate-50 rounded-xl border-t-4 ${cfg.border} flex flex-col`}>
      <div className="p-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{cfg.label}</span>
          <span className="text-xs bg-white border border-slate-200 text-slate-500 rounded-full px-2 py-0.5">{deals.length}</span>
        </div>
        {deals.length > 0 && (
          <p className="text-xs text-slate-400">{formatCurrency(total)}</p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onClick={() => onCardClick(deal)} />
        ))}
        {deals.length === 0 && (
          <div className="flex items-center justify-center h-20 text-slate-300 text-xs">Vazio</div>
        )}
      </div>
    </div>
  );
}

function DealDetailPanel({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const cfg = stageConfig[deal.stage];
  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      className="absolute right-0 top-0 h-full w-80 bg-white border-l border-slate-200 flex flex-col shadow-xl z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
        <div>
          <h3 className="font-semibold text-slate-800">{deal.company}</h3>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Value */}
        <div className="bg-violet-50 rounded-xl p-4 text-center">
          <p className="text-xs text-violet-500 mb-1">Valor do negócio</p>
          <p className="text-2xl font-bold text-violet-700">{formatCurrency(deal.value)}</p>
        </div>

        {/* Probability bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">Probabilidade de fechamento</span>
            <span className={`font-semibold ${probColor(deal.probability)}`}>{deal.probability}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${deal.probability}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${deal.probability >= 70 ? 'bg-green-500' : deal.probability >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center shrink-0">
              {deal.responsible}
            </div>
            <div>
              <p className="text-slate-800 font-medium text-xs">{deal.responsibleName}</p>
              <p className="text-slate-400 text-[11px]">Responsável</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Phone size={13} className="text-slate-400" />
            <span>{deal.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Mail size={13} className="text-slate-400" />
            <span>{deal.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={13} className="text-slate-400" />
            <span>{deal.daysInStage} dias neste estágio · Última atividade: {deal.lastActivity}</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Notas</p>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
            {deal.notes}
          </p>
        </div>

        {/* Segment */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Target size={13} className="text-slate-400" />
          <span>Segmento: <span className="font-medium text-slate-700">{deal.segment}</span></span>
        </div>
      </div>
    </motion.div>
  );
}

function PipelineView({ deals, selectedDeal, onDealClick, onClosePanel }: {
  deals: Deal[];
  selectedDeal: Deal | null;
  onDealClick: (d: Deal) => void;
  onClosePanel: () => void;
}) {
  const stages: Stage[] = ['prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechado'];
  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <div className="flex gap-3 p-4 h-full min-w-max">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={deals.filter((d) => d.stage === stage)}
              onCardClick={onDealClick}
            />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedDeal && (
          <DealDetailPanel deal={selectedDeal} onClose={onClosePanel} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ClientesView({ clients, search, onSearch, segmentFilter, onSegmentChange }: {
  clients: Client[];
  search: string;
  onSearch: (s: string) => void;
  segmentFilter: string;
  onSegmentChange: (s: string) => void;
}) {
  const segments = ['Todos', ...Array.from(new Set(clients.map((c) => c.segment)))];
  const filtered = clients.filter((c) => {
    const matchSearch = c.company.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase());
    const matchSeg = segmentFilter === 'Todos' || c.segment === segmentFilter;
    return matchSearch && matchSeg;
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Filter bar */}
      <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-3 bg-white shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar empresa ou contato..."
            className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-violet-400 transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {segments.map((s) => (
            <button
              key={s}
              onClick={() => onSegmentChange(s)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${segmentFilter === s ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Empresa</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Segmento</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Contato</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Valor Total</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Status</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Última Atividade</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-slate-50 hover:bg-violet-50/50 transition-colors"
              >
                <td className="py-3 font-semibold text-slate-800">{c.company}</td>
                <td className="py-3 text-slate-500 text-xs">{c.segment}</td>
                <td className="py-3">
                  <div>
                    <p className="text-slate-700 text-xs">{c.contact}</p>
                    <p className="text-slate-400 text-[11px]">{c.email}</p>
                  </div>
                </td>
                <td className="py-3 text-violet-600 font-semibold">{formatCurrency(c.totalValue)}</td>
                <td className="py-3">
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${statusBadge[c.status]}`}>{c.status}</span>
                </td>
                <td className="py-3 text-slate-400 text-xs">{c.lastActivity}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-12">Nenhum cliente encontrado</div>
        )}
      </div>
    </div>
  );
}

function AtividadesView({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="max-w-2xl">
        {activities.map((a, i) => {
          const cfg = activityIconConfig[a.type];
          const isLast = i === activities.length - 1;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-4 relative"
            >
              {/* Connector line */}
              {!isLast && (
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-100" />
              )}
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full ${cfg.bg} ${cfg.text} flex items-center justify-center shrink-0 border border-white shadow-sm z-10`}>
                {cfg.icon}
              </div>
              {/* Content */}
              <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{a.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      <span className="text-violet-600 font-medium">{a.company}</span>
                      {' · '}{a.responsible}
                    </p>
                  </div>
                  <span className="text-slate-400 text-[11px] shrink-0 ml-4">{a.time}</span>
                </div>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
                  {a.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function RevenueBarChart({ data }: { data: MonthlyRevenue[] }) {
  const max = Math.max(...data.map((d) => Math.max(d.value, d.target)));
  return (
    <div>
      <div className="flex items-end gap-3 h-40">
        {data.map((d, i) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5 h-32">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                style={{ height: `${(d.value / max) * 100}%`, transformOrigin: 'bottom' }}
                className="flex-1 bg-violet-500 rounded-t-md"
              />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.08 + 0.05, duration: 0.5, ease: 'easeOut' }}
                style={{ height: `${(d.target / max) * 100}%`, transformOrigin: 'bottom' }}
                className="flex-1 bg-slate-200 rounded-t-md"
              />
            </div>
            <span className="text-[10px] text-slate-400">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded bg-violet-500" /><span className="text-[11px] text-slate-500">Realizado (R$k)</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded bg-slate-200" /><span className="text-[11px] text-slate-500">Meta (R$k)</span></div>
      </div>
    </div>
  );
}

function ConversionFunnel() {
  return (
    <div className="flex flex-col gap-1.5">
      {funnelData.map((f, i) => (
        <motion.div
          key={f.stage}
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="w-24 text-[11px] text-slate-500 text-right shrink-0">{f.stage}</div>
          <div className="flex-1 flex items-center gap-2">
            <div
              style={{ width: `${f.pct}%` }}
              className="h-7 bg-violet-500 rounded-md flex items-center justify-end pr-2 transition-all"
            >
              <span className="text-white text-[10px] font-bold">{f.count}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RelatoriosView() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Receita Mensal</h3>
              <p className="text-xs text-slate-400">Realizado vs Meta · Out/25 – Mar/26</p>
            </div>
            <div className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">
              <TrendingUp size={12} />
              +13% vs meta
            </div>
          </div>
          <RevenueBarChart data={monthlyRevenue} />
        </div>

        {/* Funnel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-800 mb-1">Funil de Conversão</h3>
          <p className="text-xs text-slate-400 mb-5">Taxa geral: 17%</p>
          <ConversionFunnel />
        </div>

        {/* KPI Summary Cards */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Deals Ganhos', value: '8', sub: 'este trimestre', icon: <Target size={16} />, up: true },
            { label: 'Ciclo Médio', value: '34 dias', sub: 'do lead ao fechamento', icon: <Clock size={16} />, up: false },
            { label: 'Pipeline Total', value: 'R$ 895k', sub: '8 oportunidades ativas', icon: <BarChart2 size={16} />, up: true },
            { label: 'Engajamento', value: '94%', sub: 'taxa de resposta', icon: <Activity size={16} />, up: true },
          ].map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">{k.label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${k.up ? 'bg-violet-50 text-violet-500' : 'bg-slate-50 text-slate-400'}`}>
                  {k.icon}
                </div>
              </div>
              <p className="text-xl font-bold text-slate-800">{k.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {k.up ? <ArrowUpRight size={11} className="text-green-500" /> : <ArrowDownRight size={11} className="text-amber-500" />}
                <p className="text-[11px] text-slate-400">{k.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function CRMSystem() {
  const [activeView, setActiveView] = useState<View>('pipeline');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('Todos');

  const navItems: { view: View; icon: React.ReactNode; label: string }[] = [
    { view: 'pipeline',    icon: <LayoutDashboard size={16} />, label: 'Pipeline' },
    { view: 'clientes',    icon: <Users size={16} />,           label: 'Clientes' },
    { view: 'atividades',  icon: <Activity size={16} />,        label: 'Atividades' },
    { view: 'relatorios',  icon: <BarChart2 size={16} />,       label: 'Relatórios' },
  ];

  return (
    <div className="flex h-full w-full bg-[#F7F8FA] overflow-hidden text-slate-800 font-sans text-sm">
      {/* Sidebar */}
      <div className="hidden lg:flex w-52 bg-[#111827] flex-col shrink-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
              <Users size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold leading-tight">NexFlow CRM</p>
              <p className="text-slate-500 text-[10px]">v2.4.1</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <p className="text-slate-600 text-[10px] uppercase tracking-widest px-1 mb-2">Menu</p>
          {navItems.map((n) => (
            <NavItem
              key={n.view}
              icon={n.icon}
              label={n.label}
              active={activeView === n.view}
              onClick={() => { setActiveView(n.view); setSelectedDeal(null); }}
            />
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">IS</div>
            <div>
              <p className="text-white text-xs font-medium">Inova Admin</p>
              <p className="text-slate-500 text-[10px]">admin@inova.exemplo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-800 text-sm capitalize">{activeView === 'relatorios' ? 'Relatórios' : activeView === 'atividades' ? 'Atividades' : activeView === 'clientes' ? 'Clientes' : 'Pipeline'}</h2>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-slate-400 text-xs">Março 2026</span>
          </div>
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <KpiChip label="Leads" value="47" up />
            <KpiChip label="Pipeline" value="R$ 890k" up />
            <KpiChip label="Conversão" value="23%" up />
            <KpiChip label="Ticket médio" value="R$ 45k" />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            {activeView === 'pipeline' && (
              <PipelineView
                deals={deals}
                selectedDeal={selectedDeal}
                onDealClick={setSelectedDeal}
                onClosePanel={() => setSelectedDeal(null)}
              />
            )}
            {activeView === 'clientes' && (
              <ClientesView
                clients={clients}
                search={searchQuery}
                onSearch={setSearchQuery}
                segmentFilter={segmentFilter}
                onSegmentChange={setSegmentFilter}
              />
            )}
            {activeView === 'atividades' && <AtividadesView activities={activities} />}
            {activeView === 'relatorios' && <RelatoriosView />}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
