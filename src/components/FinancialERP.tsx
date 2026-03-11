import React from 'react';
import { 
  Search, Bell, LayoutDashboard, DollarSign, 
  Users, Package, BarChart2, Settings, 
  Plus, MoreVertical, ArrowUpRight, ArrowDownRight,
  Filter, Download, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';

export default function FinancialERP() {
  return (
    <div className="flex h-full w-full bg-[#F8F9FA] overflow-hidden text-slate-800 font-sans text-sm relative z-10">
      {/* Sidebar - Hidden on smaller screens */}
      <div className="hidden lg:flex w-64 bg-[#0F172A] text-slate-300 flex-col shrink-0">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800/50 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="font-bold text-lg text-white tracking-tight">ERP Nexus</span>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4 custom-scrollbar-dark">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-4">Principal</div>
          <MenuItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <MenuItem icon={<DollarSign size={18} />} label="Financeiro" />
          <MenuItem icon={<Users size={18} />} label="Vendas & CRM" />
          <MenuItem icon={<Package size={18} />} label="Estoque" />
          
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-6 px-4">Gestão</div>
          <MenuItem icon={<BarChart2 size={18} />} label="Relatórios" />
          <MenuItem icon={<Settings size={18} />} label="Configurações" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
        {/* Topbar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 hover:text-slate-800">
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block w-64 lg:w-96">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar transações, clientes..." 
                className="w-full h-10 pl-10 pr-4 bg-[#F8F9FA] border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="hidden sm:block w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-medium text-sm text-slate-700">Marcelo Costa</span>
                <span className="text-xs text-slate-500">Diretor Financeiro</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                MC
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard Financeiro</h1>
              <p className="text-slate-500 mt-1 text-sm">Resumo das operações e fluxo de caixa.</p>
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 shrink-0">
              <Plus size={18} />
              Nova Transação
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            <KpiCard title="Receita Total" value="R$ 124.500,00" trend="+12.5%" trendUp={true} />
            <KpiCard title="Despesas" value="R$ 42.300,00" trend="-2.4%" trendUp={false} />
            <KpiCard title="Saldo Previsto" value="R$ 82.200,00" trend="+8.2%" trendUp={true} />
            <KpiCard title="Inadimplência" value="R$ 5.400,00" trend="+1.2%" trendUp={false} isWarning />
          </div>

          {/* Middle Section: Chart & Alerts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Chart */}
            <div className="col-span-1 xl:col-span-2 bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold text-slate-800">Fluxo de Caixa</h2>
                <select className="bg-[#F8F9FA] border border-slate-200 text-slate-600 text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                  <option>Últimos 7 dias</option>
                  <option>Este Mês</option>
                  <option>Este Ano</option>
                </select>
              </div>
              <div className="h-48 w-full relative flex items-end gap-2 sm:gap-4">
                {/* Mock Bar Chart */}
                <Bar height="60%" label="01" />
                <Bar height="40%" label="02" />
                <Bar height="70%" label="03" />
                <Bar height="90%" label="04" />
                <Bar height="50%" label="05" />
                <Bar height="30%" label="06" />
                <Bar height="80%" label="07" active />
                <Bar height="65%" label="08" />
                <Bar height="45%" label="09" />
                <Bar height="85%" label="10" />
              </div>
            </div>

            {/* Alerts */}
            <div className="col-span-1 bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Alertas Operacionais</h2>
              <div className="flex flex-col gap-4 flex-1">
                <AlertItem type="warning" title="Estoque Baixo" desc="MacBook Pro M2 (2 unid.)" />
                <AlertItem type="danger" title="Conta Vencendo Hoje" desc="Fornecedor: Dell Technologies" />
                <AlertItem type="info" title="Conciliação Pendente" desc="3 transações do Banco Itaú" />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-slate-800">Contas a Receber</h2>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">
                  <Filter size={16} /> Filtros
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">
                  <Download size={16} /> Exportar
                </button>
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar-light">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#F8F9FA] text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                    <th className="p-4 font-semibold">Cliente / Descrição</th>
                    <th className="p-4 font-semibold">Categoria</th>
                    <th className="p-4 font-semibold">Vencimento</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Valor</th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  <TableRow 
                    client="Acme Corp" desc="Licença Anual Software" category="Vendas" 
                    date="Hoje" status="Pendente" amount="R$ 12.500,00" 
                  />
                  <TableRow 
                    client="TechNova Ltda" desc="Consultoria de Implantação" category="Serviços" 
                    date="05 Nov 2023" status="Pago" amount="R$ 8.300,00" 
                  />
                  <TableRow 
                    client="Global Industries" desc="Manutenção Mensal" category="Serviços" 
                    date="01 Nov 2023" status="Atrasado" amount="R$ 3.200,00" 
                  />
                  <TableRow 
                    client="Stark Enterprises" desc="Upgrade de Servidores" category="Hardware" 
                    date="10 Nov 2023" status="Pendente" amount="R$ 45.000,00" 
                  />
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
              <span>Mostrando 1 a 4 de 24 registros</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100"><ChevronLeft size={16} /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-50 text-blue-600 font-medium">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <style>{`
        .custom-scrollbar-light::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function MenuItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function KpiCard({ title, value, trend, trendUp, isWarning }: { title: string, value: string, trend: string, trendUp: boolean, isWarning?: boolean }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors group">
      <h3 className="text-slate-500 font-medium mb-2 md:mb-4 text-sm md:text-base">{title}</h3>
      <div className="flex items-end justify-between gap-2">
        <span className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{value}</span>
        <div className={`flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-1 rounded-md shrink-0 ${
          isWarning ? 'bg-red-50 text-red-600' : 
          trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {trendUp ? <ArrowUpRight size={12} className="md:w-[14px] md:h-[14px]" /> : <ArrowDownRight size={12} className="md:w-[14px] md:h-[14px]" />}
          {trend}
        </div>
      </div>
    </div>
  );
}

function Bar({ height, label, active }: { height: string, label: string, active?: boolean }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1 md:gap-2 group">
      <div className="w-full bg-slate-100 rounded-t-md relative flex-1 flex items-end overflow-hidden">
        <div 
          className={`w-full rounded-t-md transition-all duration-500 ${active ? 'bg-blue-600' : 'bg-blue-200 group-hover:bg-blue-400'}`} 
          style={{ height }}
        ></div>
      </div>
      <span className={`text-[10px] md:text-xs ${active ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}

function AlertItem({ type, title, desc }: { type: 'warning' | 'danger' | 'info', title: string, desc: string }) {
  const colors = {
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200'
  };
  const dotColors = {
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  return (
    <div className={`p-3 rounded-lg border ${colors[type]} flex items-start gap-3`}>
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColors[type]}`}></div>
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs opacity-80">{desc}</span>
      </div>
    </div>
  );
}

function TableRow({ client, desc, category, date, status, amount }: any) {
  const statusColors: any = {
    'Pago': 'bg-green-100 text-green-700',
    'Pendente': 'bg-yellow-100 text-yellow-700',
    'Atrasado': 'bg-red-100 text-red-700'
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="p-4"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></td>
      <td className="p-4">
        <div className="font-medium text-slate-900">{client}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </td>
      <td className="p-4 text-slate-600">{category}</td>
      <td className="p-4 text-slate-600">{date}</td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </td>
      <td className="p-4 text-right font-medium text-slate-900">{amount}</td>
      <td className="p-4 text-right">
        <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical size={18} />
        </button>
      </td>
    </tr>
  );
}
