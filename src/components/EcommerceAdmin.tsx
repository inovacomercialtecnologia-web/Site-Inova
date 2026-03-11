import React, { useState } from 'react';
import {
  LayoutDashboard, ShoppingBag, Package, Users,
  Settings, Search, ShoppingCart, ArrowLeft,
  Plus, Minus, Trash2, CheckCircle2, TrendingUp,
  ArrowUpRight, ArrowDownRight, ChevronRight, X,
  Star, Truck, Clock, AlertTriangle, Eye,
  Heart, ShieldCheck, MapPin, CreditCard, Zap,
  ChevronDown, Tag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'admin' | 'store';
type AdminView = 'dashboard' | 'pedidos' | 'produtos' | 'clientes';
type StoreScreen = 'vitrine' | 'produto' | 'carrinho';
type OrderStatus = 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  gradient: string;
  active: boolean;
  sold: number;
  desc: string;
  colors: string[];
  rating: number;
  reviewCount: number;
  badge?: 'Mais Vendido' | 'Oferta' | 'Novo' | 'Exclusivo';
  freeShipping: boolean;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  value: number;
  status: OrderStatus;
  items: { productId: string; name: string; qty: number; price: number }[];
  address: string;
  history: { status: string; time: string }[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  ltv: number;
  lastPurchase: string;
  active: boolean;
}

interface CartItem {
  product: Product;
  qty: number;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const products: Product[] = [
  { id: 'p1', name: 'Vaso Orgânico Artesanal',      price: 290,  originalPrice: 380,  stock: 14, category: 'Decoração',  gradient: 'from-stone-300 via-amber-100 to-stone-200',      active: true,  sold: 47,  desc: 'Vaso em cerâmica artesanal com formas orgânicas inspiradas na natureza. Acabamento esmaltado à mão, peça única produzida por artesãos do Vale do Capão - BA.', colors: ['Areia', 'Terracota', 'Off-white'],  rating: 4.7, reviewCount: 183, badge: 'Oferta',      freeShipping: false },
  { id: 'p2', name: 'Luminária Cobre Minimalista',   price: 580,  originalPrice: 720,  stock: 3,  category: 'Iluminação', gradient: 'from-amber-200 via-yellow-100 to-orange-200',     active: true,  sold: 31,  desc: 'Luminária de mesa com estrutura em cobre escovado e cúpula de linho natural. Luz quente 3000K, cabo têxtil de 1,8m e dimmer integrado.', colors: ['Cobre', 'Dourado'],               rating: 4.9, reviewCount: 97,  badge: 'Exclusivo',   freeShipping: true },
  { id: 'p3', name: 'Espelho Redondo Rattan',         price: 420,  stock: 8,            category: 'Espelhos',   gradient: 'from-lime-100 via-emerald-50 to-teal-100',        active: true,  sold: 58,  desc: 'Espelho de 60cm de diâmetro com moldura em rattan natural trançado à mão por artesãos do Nordeste. Perfeito para ambientes boho e contemporâneos.', colors: ['Natural', 'Branqueado'],          rating: 4.8, reviewCount: 312, badge: 'Mais Vendido', freeShipping: true },
  { id: 'p4', name: 'Tapete Persa Moderno',           price: 890,  stock: 6,            category: 'Têxteis',    gradient: 'from-rose-200 via-red-100 to-orange-100',         active: true,  sold: 22,  desc: 'Tapete 2×3m em lã e algodão com padrão geométrico inspirado em kilims persas. Tons terrosos naturais, antiderrapante incluso.', colors: ['Terracota', 'Cinza', 'Azul'],    rating: 4.6, reviewCount: 74,  badge: undefined,     freeShipping: true },
  { id: 'p5', name: 'Almofada Linho Natural',          price: 180,  originalPrice: 220,  stock: 22, category: 'Têxteis',    gradient: 'from-sky-100 via-blue-50 to-indigo-100',          active: true,  sold: 93,  desc: 'Almofada 50×50cm em linho puro lavado com enchimento de fibra siliconada hipoalergênica. Capa removível com zíper invisível.', colors: ['Natural', 'Cinza', 'Branco'],   rating: 4.8, reviewCount: 547, badge: 'Mais Vendido', freeShipping: false },
  { id: 'p6', name: 'Prateleira Madeira Nogal',        price: 340,  stock: 4,            category: 'Móveis',     gradient: 'from-yellow-700 via-amber-500 to-yellow-400',     active: true,  sold: 29,  desc: 'Prateleira flutuante 80cm em madeira de nogal maciço certificado. Suporte de aço preto fosco incluso. Suporta até 15kg.', colors: ['Nogal', 'Carvalho'],              rating: 4.7, reviewCount: 128, badge: undefined,     freeShipping: true },
  { id: 'p7', name: 'Jarra Cerâmica Sage',             price: 210,  stock: 0,            category: 'Decoração',  gradient: 'from-teal-200 via-emerald-100 to-green-100',      active: false, sold: 64,  desc: 'Jarra 35cm em cerâmica artesanal na cor sage verde. Ideal para flores secas ou frescas. Produzida em forno de lenha, cada peça é única.', colors: ['Sage', 'Musgo'],                  rating: 4.9, reviewCount: 231, badge: 'Novo',        freeShipping: false },
  { id: 'p8', name: 'Quadro Abstrato P&B',             price: 650,  originalPrice: 850,  stock: 11, category: 'Arte',       gradient: 'from-slate-600 via-slate-400 to-slate-300',       active: true,  sold: 18,  desc: 'Impressão em canvas premium 60×80cm com moldura de madeira escura. Arte abstrata minimalista original assinada por artista brasileiro.', colors: ['P&B'],                           rating: 4.5, reviewCount: 52,  badge: 'Oferta',      freeShipping: true },
  { id: 'p9', name: 'Porta-Velas Travertino',          price: 155,  stock: 2,            category: 'Decoração',  gradient: 'from-stone-300 via-stone-200 to-amber-50',        active: true,  sold: 76,  desc: 'Porta-velas em pedra travertino natural, cada peça com veios únicos. Altura 8cm, diâmetro 7cm. Ideal para velas cilíndricas até 6cm.', colors: ['Travertino'],                     rating: 4.8, reviewCount: 398, badge: 'Mais Vendido', freeShipping: false },
];

const orders: Order[] = [
  { id: '#4821', customer: 'Beatriz Fonseca',   email: 'b.fonseca@email.exemplo',   date: 'Hoje, 09:14',      value: 1050, status: 'Pendente',    items: [{ productId:'p3', name:'Espelho Rattan', qty:1, price:420 }, { productId:'p5', name:'Almofada Linho (×2)', qty:2, price:360 }, { productId:'p9', name:'Porta-Velas (×2)', qty:2, price:310 }], address: 'Rua das Oliveiras, 88 — Bairro Demo, SP', history: [{ status:'Pedido realizado', time:'Hoje 09:14' }, { status:'Aguardando pagamento', time:'Hoje 09:15' }] },
  { id: '#4820', customer: 'Rafael Monteiro',    email: 'r.monteiro@email.exemplo',  date: 'Hoje, 07:33',      value: 580,  status: 'Processando', items: [{ productId:'p2', name:'Luminária Cobre', qty:1, price:580 }], address: 'Av. Central, 1100 — Bairro Demo, SP', history: [{ status:'Pedido realizado', time:'Hoje 07:33' }, { status:'Pagamento aprovado', time:'Hoje 07:40' }, { status:'Em separação', time:'Hoje 08:20' }] },
  { id: '#4819', customer: 'Camila Duarte',      email: 'c.duarte@email.exemplo',    date: 'Ontem, 18:52',     value: 290,  status: 'Enviado',     items: [{ productId:'p1', name:'Vaso Orgânico', qty:1, price:290 }], address: 'Rua das Acácias, 430 — Bairro Demo, SP', history: [{ status:'Pedido realizado', time:'Ontem 18:52' }, { status:'Pagamento aprovado', time:'Ontem 19:00' }, { status:'Enviado — Rastreio: JD489201BR', time:'Hoje 10:15' }] },
  { id: '#4818', customer: 'Lucas Pereira',      email: 'l.pereira@email.exemplo',   date: 'Ontem, 14:20',     value: 890,  status: 'Enviado',     items: [{ productId:'p4', name:'Tapete Persa', qty:1, price:890 }], address: 'Al. dos Ipês, 700 — Bairro Demo, SP', history: [{ status:'Pedido realizado', time:'Ontem 14:20' }, { status:'Pagamento aprovado', time:'Ontem 14:35' }, { status:'Enviado — Rastreio: JD489180BR', time:'Ontem 17:00' }] },
  { id: '#4817', customer: 'Fernanda Alves',     email: 'f.alves@email.exemplo',     date: '2 dias atrás',     value: 1540, status: 'Entregue',    items: [{ productId:'p8', name:'Quadro Abstrato', qty:1, price:650 }, { productId:'p6', name:'Prateleira Nogal (×2)', qty:2, price:680 }, { productId:'p9', name:'Porta-Velas', qty:1, price:155 }], address: 'R. das Palmeiras, 55 — Bairro Demo, SP', history: [{ status:'Pedido realizado', time:'2d atrás' }, { status:'Pagamento aprovado', time:'2d atrás' }, { status:'Enviado', time:'Ontem' }, { status:'Entregue', time:'Hoje 11:00' }] },
  { id: '#4816', customer: 'Thiago Costa',       email: 't.costa@email.exemplo',     date: '3 dias atrás',     value: 580,  status: 'Entregue',    items: [{ productId:'p2', name:'Luminária Cobre', qty:1, price:580 }], address: 'R. dos Cedros, 200 — Bairro Demo, SP', history: [] },
  { id: '#4815', customer: 'Ana Beatriz Lima',   email: 'ab.lima@email.exemplo',     date: '4 dias atrás',     value: 470,  status: 'Entregue',    items: [{ productId:'p5', name:'Almofada Linho (×2)', qty:2, price:360 }, { productId:'p9', name:'Porta-Velas', qty:1, price:155 }], address: 'Al. dos Pinheiros, 550 — Bairro Demo, SP', history: [] },
  { id: '#4814', customer: 'Mariana Souza',      email: 'm.souza@email.exemplo',     date: '5 dias atrás',     value: 420,  status: 'Cancelado',   items: [{ productId:'p3', name:'Espelho Rattan', qty:1, price:420 }], address: 'R. das Magnólias, 320 — Bairro Demo, SP', history: [] },
  { id: '#4813', customer: 'Diego Ferreira',     email: 'd.ferreira@email.exemplo',  date: '5 dias atrás',     value: 210,  status: 'Cancelado',   items: [{ productId:'p7', name:'Jarra Cerâmica', qty:1, price:210 }], address: 'R. dos Jacarandás, 88 — Bairro Demo, SP', history: [] },
  { id: '#4812', customer: 'Isabela Nunes',      email: 'i.nunes@email.exemplo',     date: '6 dias atrás',     value: 730,  status: 'Entregue',    items: [{ productId:'p5', name:'Almofada Linho', qty:1, price:180 }, { productId:'p6', name:'Prateleira Nogal', qty:1, price:340 }, { productId:'p9', name:'Porta-Velas', qty:1, price:155 }], address: 'R. das Hortênsias, 1200 — Bairro Demo, SP', history: [] },
  { id: '#4811', customer: 'Pedro Almeida',      email: 'p.almeida@email.exemplo',   date: '1 semana atrás',   value: 1170, status: 'Entregue',    items: [{ productId:'p4', name:'Tapete Persa', qty:1, price:890 }, { productId:'p1', name:'Vaso Orgânico', qty:1, price:290 }], address: 'Av. das Flores, 550 — Bairro Demo, SP', history: [] },
  { id: '#4810', customer: 'Sofia Ribeiro',      email: 's.ribeiro@email.exemplo',   date: '1 semana atrás',   value: 650,  status: 'Entregue',    items: [{ productId:'p8', name:'Quadro Abstrato', qty:1, price:650 }], address: 'R. dos Lírios, 700 — Bairro Demo, SP', history: [] },
];

const customers: Customer[] = [
  { id: 'c1', name: 'Fernanda Alves',    email: 'f.alves@email.exemplo',    orders: 6,  ltv: 4820, lastPurchase: '2 dias atrás',   active: true },
  { id: 'c2', name: 'Pedro Almeida',     email: 'p.almeida@email.exemplo',  orders: 4,  ltv: 3640, lastPurchase: '1 semana atrás', active: true },
  { id: 'c3', name: 'Isabela Nunes',     email: 'i.nunes@email.exemplo',    orders: 5,  ltv: 2910, lastPurchase: '6 dias atrás',   active: true },
  { id: 'c4', name: 'Ana Beatriz Lima',  email: 'ab.lima@email.exemplo',    orders: 3,  ltv: 1840, lastPurchase: '4 dias atrás',   active: true },
  { id: 'c5', name: 'Sofia Ribeiro',     email: 's.ribeiro@email.exemplo',  orders: 3,  ltv: 1750, lastPurchase: '1 semana atrás', active: true },
  { id: 'c6', name: 'Thiago Costa',      email: 't.costa@email.exemplo',    orders: 2,  ltv: 1160, lastPurchase: '3 dias atrás',   active: true },
  { id: 'c7', name: 'Mariana Souza',     email: 'm.souza@email.exemplo',    orders: 2,  ltv: 840,  lastPurchase: '5 dias atrás',   active: false },
  { id: 'c8', name: 'Diego Ferreira',    email: 'd.ferreira@email.exemplo', orders: 1,  ltv: 290,  lastPurchase: '5 dias atrás',   active: false },
];

const weekRevenue = [
  { day: 'Seg', v: 1240 },
  { day: 'Ter', v: 980 },
  { day: 'Qua', v: 1870 },
  { day: 'Qui', v: 640 },
  { day: 'Sex', v: 2140 },
  { day: 'Sáb', v: 1680 },
  { day: 'Dom', v: 890 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

const statusCfg: Record<OrderStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  Pendente:    { label: 'Pendente',    cls: 'bg-amber-50 text-amber-700 border-amber-200',      icon: <Clock size={11} /> },
  Processando: { label: 'Processando', cls: 'bg-blue-50 text-blue-700 border-blue-200',         icon: <Settings size={11} /> },
  Enviado:     { label: 'Enviado',     cls: 'bg-violet-50 text-violet-700 border-violet-200',   icon: <Truck size={11} /> },
  Entregue:    { label: 'Entregue',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',icon: <CheckCircle2 size={11} /> },
  Cancelado:   { label: 'Cancelado',   cls: 'bg-rose-50 text-rose-700 border-rose-200',         icon: <X size={11} /> },
};

// ─── Admin Components ─────────────────────────────────────────────────────────

function AdminDashboard() {
  const todayOrders = orders.filter(o => o.date.startsWith('Hoje')).length;
  const monthRevenue = orders.filter(o => o.status !== 'Cancelado').reduce((s, o) => s + o.value, 0);
  const avgTicket = Math.round(monthRevenue / orders.filter(o => o.status !== 'Cancelado').length);
  const convRate = '3.8%';
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 3);
  const recentOrders = orders.slice(0, 5);
  const maxRev = Math.max(...weekRevenue.map(d => d.v));

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pedidos hoje',    value: `${todayOrders}`,   delta: '+2 vs ontem',  up: true,  icon: <ShoppingBag size={15} /> },
          { label: 'Receita / mês',   value: fmt(monthRevenue),  delta: '+18% MoM',     up: true,  icon: <TrendingUp size={15} /> },
          { label: 'Ticket médio',    value: fmt(avgTicket),     delta: '+R$40',        up: true,  icon: <ArrowUpRight size={15} /> },
          { label: 'Taxa conversão',  value: convRate,           delta: '+0.4pp',       up: true,  icon: <Star size={15} /> },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-stone-400 text-[11px]">{k.label}</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">{k.icon}</div>
            </div>
            <p className="text-stone-800 font-bold text-lg leading-none">{k.value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {k.up ? <ArrowUpRight size={11} className="text-emerald-500" /> : <ArrowDownRight size={11} className="text-rose-500" />}
              <span className="text-[10px] text-emerald-600 font-medium">{k.delta}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="md:col-span-2 bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-stone-800 text-sm">Receita da Semana</h3>
              <p className="text-stone-400 text-[11px]">Seg a Dom · valores em R$</p>
            </div>
            <span className="text-amber-600 font-bold text-sm">{fmt(weekRevenue.reduce((s,d) => s+d.v, 0))}</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {weekRevenue.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
                  style={{ height: `${(d.v / maxRev) * 100}%`, transformOrigin: 'bottom' }}
                  className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-md"
                />
                <span className="text-[10px] text-stone-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-stone-800 text-sm mb-4">Mais Vendidos</h3>
          {topProducts.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 mb-4 last:mb-0">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.gradient} shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-stone-700 text-xs font-medium truncate">{p.name}</p>
                <p className="text-stone-400 text-[10px]">{p.sold} vendidos</p>
              </div>
              <span className="text-amber-600 text-xs font-semibold shrink-0">{fmt(p.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800 text-sm">Últimos Pedidos</h3>
          <span className="text-amber-600 text-[11px] font-medium cursor-pointer hover:underline">Ver todos →</span>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-stone-50">
            {['Pedido','Cliente','Data','Valor','Status'].map(h => (
              <th key={h} className="text-left text-[11px] text-stone-400 font-semibold uppercase tracking-wide px-5 py-2.5">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {recentOrders.map((o, i) => {
              const s = statusCfg[o.status];
              return (
                <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3 text-stone-600 text-xs font-mono">{o.id}</td>
                  <td className="px-5 py-3 text-stone-800 text-xs font-medium">{o.customer}</td>
                  <td className="px-5 py-3 text-stone-400 text-xs">{o.date}</td>
                  <td className="px-5 py-3 text-stone-800 text-xs font-semibold">{fmt(o.value)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full border ${s.cls}`}>
                      {s.icon}{s.label}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PedidosView() {
  const [filter, setFilter] = useState<string>('Todos');
  const [selected, setSelected] = useState<Order | null>(null);
  const statuses: string[] = ['Todos', 'Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado'];
  const filtered = filter === 'Todos' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative">
      {/* Filter bar */}
      <div className="px-5 py-3 border-b border-stone-100 bg-white flex gap-1.5 flex-wrap shrink-0">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${filter === s ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
            {s}
          </button>
        ))}
      </div>
      {/* Table */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-stone-100">
            {['Pedido','Cliente','Data','Valor','Status',''].map((h, i) => (
              <th key={i} className="text-left text-[11px] text-stone-400 font-semibold uppercase tracking-wide pb-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((o, i) => {
              const s = statusCfg[o.status];
              return (
                <motion.tr key={o.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="border-b border-stone-50 last:border-0 hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 text-stone-600 text-xs font-mono font-bold">{o.id}</td>
                  <td className="py-3">
                    <p className="text-stone-800 text-xs font-medium">{o.customer}</p>
                    <p className="text-stone-400 text-[10px]">{o.email}</p>
                  </td>
                  <td className="py-3 text-stone-400 text-xs">{o.date}</td>
                  <td className="py-3 text-stone-800 text-xs font-semibold">{fmt(o.value)}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full border ${s.cls}`}>
                      {s.icon}{s.label}
                    </span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => setSelected(o)}
                      className="flex items-center gap-1 text-[11px] text-amber-600 hover:text-amber-700 font-medium">
                      <Eye size={12} />Ver
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Order detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-80 bg-white border-l border-stone-200 shadow-xl flex flex-col z-10 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100 shrink-0">
              <div>
                <p className="font-bold text-stone-800">{selected.id}</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusCfg[selected.status].cls}`}>
                  {statusCfg[selected.status].icon}{selected.status}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-700 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <p className="text-[11px] text-stone-400 uppercase tracking-wide mb-1">Cliente</p>
                <p className="text-stone-800 font-semibold text-sm">{selected.customer}</p>
                <p className="text-stone-400 text-xs">{selected.email}</p>
              </div>
              <div>
                <p className="text-[11px] text-stone-400 uppercase tracking-wide mb-1">Endereço</p>
                <p className="text-stone-600 text-xs">{selected.address}</p>
              </div>
              <div>
                <p className="text-[11px] text-stone-400 uppercase tracking-wide mb-2">Itens</p>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs py-2 border-b border-stone-50 last:border-0">
                    <span className="text-stone-700">{item.name}</span>
                    <span className="text-stone-800 font-semibold">{fmt(item.price)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-stone-200">
                  <span className="text-stone-700">Total</span>
                  <span className="text-amber-600">{fmt(selected.value)}</span>
                </div>
              </div>
              {selected.history.length > 0 && (
                <div>
                  <p className="text-[11px] text-stone-400 uppercase tracking-wide mb-2">Histórico</p>
                  {selected.history.map((h, i) => (
                    <div key={i} className="flex gap-3 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-stone-700 text-xs">{h.status}</p>
                        <p className="text-stone-400 text-[10px]">{h.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProdutosView() {
  const [search, setSearch] = useState('');
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="px-5 py-3 border-b border-stone-100 bg-white shrink-0">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto..."
            className="w-full pl-8 pr-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-amber-400 transition-colors" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
              <div className={`h-28 bg-gradient-to-br ${p.gradient} relative`}>
                {!p.active && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <span className="text-xs font-bold text-stone-500 bg-white px-2 py-1 rounded">Inativo</span>
                  </div>
                )}
                {p.stock > 0 && p.stock < 5 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <AlertTriangle size={9} />Estoque baixo
                  </div>
                )}
                {p.stock === 0 && (
                  <div className="absolute top-2 right-2 bg-stone-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Esgotado
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-stone-800 text-xs font-semibold leading-tight mb-1">{p.name}</p>
                <p className="text-stone-400 text-[10px] mb-2">{p.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-bold text-sm">{fmt(p.price)}</span>
                  <span className="text-stone-400 text-[10px]">Estoque: {p.stock}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClientesAdminView() {
  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-stone-100">
            {['Cliente','Pedidos','LTV','Última Compra','Status'].map(h => (
              <th key={h} className="text-left text-[11px] text-stone-400 font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {customers.map((c, i) => (
              <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="text-stone-800 text-xs font-semibold">{c.name}</p>
                  <p className="text-stone-400 text-[10px]">{c.email}</p>
                </td>
                <td className="px-5 py-3 text-stone-600 text-xs">{c.orders} pedidos</td>
                <td className="px-5 py-3 text-amber-600 text-xs font-bold">{fmt(c.ltv)}</td>
                <td className="px-5 py-3 text-stone-400 text-xs">{c.lastPurchase}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${c.active ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                    {c.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Store Helpers ────────────────────────────────────────────────────────────

function Stars({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size}
          className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'} />
      ))}
    </div>
  );
}

const badgeCfg: Record<string, string> = {
  'Mais Vendido': 'bg-orange-500 text-white',
  'Oferta':       'bg-rose-500 text-white',
  'Novo':         'bg-emerald-500 text-white',
  'Exclusivo':    'bg-violet-600 text-white',
};

const installments = (price: number) => `12x ${fmt(price / 12)} sem juros`;

// ─── Store Components ─────────────────────────────────────────────────────────

function StoreNavbar({ cartCount, onCartClick }: { cartCount: number; onCartClick: () => void }) {
  const categories = ['Decoração', 'Iluminação', 'Têxteis', 'Arte', 'Móveis', 'Espelhos'];
  return (
    <div className="shrink-0 bg-white border-b border-stone-100 shadow-sm">
      {/* Announcement bar */}
      <div className="bg-stone-900 text-center py-1.5 px-4">
        <p className="text-[10px] text-stone-300">
          🚚 <span className="text-amber-300 font-semibold">Frete Grátis</span> em compras acima de R$500 ·
          📦 Devolução em 30 dias · 🔒 Pagamento 100% seguro
        </p>
      </div>
      {/* Main navbar */}
      <div className="flex items-center gap-4 px-5 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-black">V</span>
          </div>
          <div className="leading-none">
            <p className="text-stone-800 font-black text-sm tracking-tight">VESTA</p>
            <p className="text-stone-400 text-[9px] tracking-[0.2em] uppercase">Home</p>
          </div>
        </div>
        {/* Search */}
        <div className="flex-1 flex items-center bg-stone-50 border border-stone-200 rounded-xl overflow-hidden hover:border-amber-400 transition-colors group">
          <Search size={14} className="text-stone-400 ml-3 shrink-0" />
          <input placeholder="Buscar produtos, marcas e muito mais..."
            className="flex-1 px-3 py-2.5 text-xs bg-transparent outline-none text-stone-600 placeholder-stone-400" />
          <button className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2.5 text-xs font-semibold transition-colors shrink-0">
            Buscar
          </button>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex flex-col items-center gap-0.5 text-stone-500 hover:text-amber-600 transition-colors">
            <Heart size={18} />
            <span className="text-[9px]">Favoritos</span>
          </button>
          <button onClick={onCartClick} className="relative flex flex-col items-center gap-0.5 text-stone-500 hover:text-amber-600 transition-colors">
            <div className="relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </motion.span>
              )}
            </div>
            <span className="text-[9px]">Carrinho</span>
          </button>
        </div>
      </div>
      {/* Category nav */}
      <div className="flex items-center gap-1 px-5 pb-2 overflow-x-auto">
        {categories.map(cat => (
          <button key={cat}
            className="shrink-0 text-[11px] text-stone-500 hover:text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap flex items-center gap-1">
            {cat} <ChevronDown size={10} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ p, onClick, delay }: { p: Product; onClick: () => void; delay: number }) {
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col"
    >
      {/* Image area */}
      <div className={`relative h-40 bg-gradient-to-br ${p.gradient} overflow-hidden`}>
        {p.badge && (
          <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-1 rounded-md z-10 ${badgeCfg[p.badge]}`}>
            {p.badge.toUpperCase()}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 text-[9px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded z-10">
            -{discount}%
          </span>
        )}
        <button className="absolute bottom-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white">
          <Heart size={13} className="text-stone-500" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-stone-400 text-[9px] uppercase tracking-wide">{p.category}</p>
        <p className="text-stone-800 text-xs font-semibold leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">{p.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Stars rating={p.rating} size={9} />
          <span className="text-stone-400 text-[9px]">{p.rating} ({p.reviewCount})</span>
          {p.sold > 50 && <span className="text-stone-300 text-[9px]">· {p.sold} vendidos</span>}
        </div>

        {/* Price */}
        <div className="mt-auto pt-1">
          {p.originalPrice && (
            <p className="text-stone-300 text-[10px] line-through">{fmt(p.originalPrice)}</p>
          )}
          <p className="text-stone-900 font-black text-base leading-none">{fmt(p.price)}</p>
          <p className="text-stone-400 text-[10px] mt-0.5">{installments(p.price)}</p>
          {p.freeShipping && (
            <p className="text-emerald-600 text-[10px] font-semibold flex items-center gap-0.5 mt-0.5">
              <Truck size={9} />Frete Grátis
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Vitrine({ onProductClick }: { onProductClick: (p: Product) => void }) {
  const activeProducts = products.filter(p => p.active);
  const featured = activeProducts.filter(p => p.badge === 'Mais Vendido');
  const rest = activeProducts.filter(p => p.badge !== 'Mais Vendido');

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F5F3]">
      {/* Hero banner */}
      <div className="relative overflow-hidden">
        <div className="h-36 bg-gradient-to-r from-stone-800 via-stone-700 to-amber-900 flex items-center">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(217,119,6,0.3) 0%, transparent 60%)' }} />
          <div className="relative px-8 flex items-center justify-between w-full">
            <div>
              <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-[0.3em] mb-1.5">Coleção Outono · 2026</p>
              <h2 className="text-white text-xl font-black leading-tight mb-3">Espaços que contam<br />a sua história.</h2>
              <button className="bg-amber-500 hover:bg-amber-400 text-white text-[11px] font-bold px-5 py-2 rounded-lg transition-colors">
                Ver coleção completa →
              </button>
            </div>
            <div className="hidden md:flex flex-col gap-2 text-right">
              {['✓ Peças exclusivas', '✓ Frete em 1 dia útil', '✓ Artesanato certificado'].map(t => (
                <p key={t} className="text-stone-300 text-[11px]">{t}</p>
              ))}
            </div>
          </div>
        </div>
        {/* Category pills */}
        <div className="bg-white border-b border-stone-100 px-6 py-2.5 flex gap-2 overflow-x-auto">
          {[{ label: '🔥 Ofertas', hot: true }, { label: 'Decoração' }, { label: 'Iluminação' }, { label: 'Têxteis' }, { label: 'Arte' }, { label: 'Móveis' }, { label: 'Espelhos' }].map(c => (
            <button key={c.label}
              className={`shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap
                ${c.hot ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-700'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* Flash sale strip */}
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-white" />
            <span className="text-white font-black text-sm">OFERTA RELÂMPAGO</span>
            <span className="text-white/80 text-[11px]">Termina em</span>
            <span className="bg-white/20 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">04:22:18</span>
          </div>
          <span className="text-white/80 text-[11px] font-medium">Até 38% OFF →</span>
        </div>

        {/* Most sold */}
        {featured.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-stone-800 font-black text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-500 rounded-full" />Mais Vendidos
              </h3>
              <button className="text-amber-600 text-[11px] font-semibold hover:underline">Ver todos</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {featured.map((p, i) => <ProductCard key={p.id} p={p} onClick={() => onProductClick(p)} delay={i * 0.06} />)}
            </div>
          </div>
        )}

        {/* All products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-stone-800 font-black text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-stone-400 rounded-full" />Para você
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
              <span>Ordenar por:</span>
              <button className="font-semibold text-stone-700 flex items-center gap-0.5">Relevância <ChevronDown size={10} /></button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {rest.map((p, i) => <ProductCard key={p.id} p={p} onClick={() => onProductClick(p)} delay={i * 0.05} />)}
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <ShieldCheck size={18} />, title: 'Compra Segura', sub: 'Dados criptografados' },
            { icon: <Truck size={18} />,       title: 'Entrega Rápida', sub: 'Em até 3 dias úteis' },
            { icon: <Tag size={18} />,         title: 'Menor Preço', sub: 'Garantia de preço' },
            { icon: <Heart size={18} />,       title: '30 dias', sub: 'Devolução sem custo' },
          ].map(b => (
            <div key={b.title} className="bg-white border border-stone-100 rounded-xl p-3 flex items-center gap-3">
              <div className="text-amber-500 shrink-0">{b.icon}</div>
              <div>
                <p className="text-stone-700 text-xs font-bold">{b.title}</p>
                <p className="text-stone-400 text-[10px]">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductPage({ product, onBack, onAddToCart }: {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, qty: number, color: string) => void;
  cartHasItem: boolean;
}) {
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const thumbGradients = [
    product.gradient,
    'from-stone-200 to-stone-300',
    'from-amber-100 to-stone-200',
  ];

  const handleAdd = () => {
    onAddToCart(product, qty, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F5F3]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-100 px-5 py-2.5 flex items-center gap-1.5 text-[11px] text-stone-400">
        <button onClick={onBack} className="hover:text-amber-600 transition-colors">Início</button>
        <ChevronRight size={10} />
        <span className="hover:text-amber-600 cursor-pointer transition-colors">{product.category}</span>
        <ChevronRight size={10} />
        <span className="text-stone-700 font-medium truncate">{product.name}</span>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Images */}
            <div className="p-5 border-r border-stone-100 flex flex-col gap-3">
              <div className={`h-52 rounded-xl bg-gradient-to-br ${thumbGradients[activeThumb]} relative overflow-hidden`}>
                {product.badge && (
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-md ${badgeCfg[product.badge]}`}>
                    {product.badge.toUpperCase()}
                  </span>
                )}
                {discount > 0 && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold bg-rose-500 text-white px-2 py-1 rounded-md">
                    -{discount}% OFF
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {thumbGradients.map((g, i) => (
                  <button key={i} onClick={() => setActiveThumb(i)}
                    className={`flex-1 h-14 rounded-lg bg-gradient-to-br ${g} border-2 transition-all ${activeThumb === i ? 'border-amber-500 shadow-sm' : 'border-transparent'}`} />
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="p-5 flex flex-col gap-3">
              <div>
                <p className="text-stone-400 text-[10px] uppercase tracking-widest mb-1">{product.category}</p>
                <h2 className="text-stone-800 font-black text-base leading-tight">{product.name}</h2>
              </div>

              {/* Rating row */}
              <div className="flex items-center gap-2 flex-wrap">
                <Stars rating={product.rating} size={12} />
                <span className="text-amber-600 text-xs font-bold">{product.rating}</span>
                <span className="text-stone-400 text-[11px]">({product.reviewCount} avaliações)</span>
                <span className="text-stone-300">·</span>
                <span className="text-stone-500 text-[11px]">{product.sold} vendidos</span>
              </div>

              {/* Price */}
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                {product.originalPrice && (
                  <p className="text-stone-400 text-xs line-through">De: {fmt(product.originalPrice)}</p>
                )}
                <p className="text-stone-900 font-black text-2xl leading-none">{fmt(product.price)}</p>
                {discount > 0 && <span className="text-rose-500 text-[11px] font-bold">Você economiza {fmt(product.originalPrice! - product.price)}</span>}
                <p className="text-stone-500 text-[11px] mt-1">{installments(product.price)}</p>
              </div>

              {/* Shipping */}
              <div className="flex items-center gap-2 text-xs">
                <Truck size={13} className={product.freeShipping ? 'text-emerald-500' : 'text-stone-400'} />
                {product.freeShipping
                  ? <span className="text-emerald-600 font-semibold">Frete Grátis</span>
                  : <span className="text-stone-500">Calcule o frete:</span>
                }
                {!product.freeShipping && (
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                    <input placeholder="00000-000" className="w-20 px-2 py-1 text-[11px] outline-none" />
                    <button className="bg-stone-100 px-2 py-1 text-[10px] font-semibold text-stone-600 hover:bg-stone-200 transition-colors">OK</button>
                  </div>
                )}
              </div>

              {/* Color */}
              <div>
                <p className="text-stone-600 text-xs font-bold mb-2">
                  Cor: <span className="text-amber-600 font-black">{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] border-2 font-semibold transition-all
                        ${selectedColor === c ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty + Stock */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-stone-500 text-[11px] mb-1">Quantidade</p>
                  <div className="flex items-center border-2 border-stone-200 rounded-xl overflow-hidden w-fit">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors font-bold"><Minus size={13} /></button>
                    <span className="w-8 text-center text-stone-800 font-black text-sm">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors font-bold"><Plus size={13} /></button>
                  </div>
                </div>
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-rose-500 text-[11px] font-bold">⚡ Últimas {product.stock} unidades!</p>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-2">
                <motion.button onClick={handleAdd} whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2
                    ${added ? 'bg-emerald-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-200'}`}>
                  {added ? <><CheckCircle2 size={16} />Adicionado ao carrinho!</> : <><ShoppingCart size={16} />Adicionar ao Carrinho</>}
                </motion.button>
                <button onClick={() => { onAddToCart(product, qty, selectedColor); }}
                  className="w-full py-2.5 rounded-xl font-bold text-sm border-2 border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Zap size={14} />Comprar Agora
                </button>
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-100">
                {[
                  { icon: <ShieldCheck size={12} />, label: 'Compra Segura' },
                  { icon: <Truck size={12} />,       label: 'Entrega Rápida' },
                  { icon: <Heart size={12} />,       label: '30 dias p/ devolver' },
                ].map(t => (
                  <div key={t.label} className="flex flex-col items-center gap-1 text-center">
                    <div className="text-emerald-500">{t.icon}</div>
                    <p className="text-[9px] text-stone-400 leading-tight">{t.label}</p>
                  </div>
                ))}
              </div>

              {/* Payment icons */}
              <div className="flex items-center gap-2">
                <CreditCard size={12} className="text-stone-400" />
                <p className="text-[10px] text-stone-400">Pix · Cartão de Crédito · Boleto · Pix Parcelado</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-5 py-4 border-t border-stone-100">
            <h3 className="text-stone-700 font-bold text-xs mb-2">Sobre o produto</h3>
            <p className="text-stone-500 text-xs leading-relaxed">{product.desc}</p>
          </div>
        </div>

        <button onClick={onBack} className="mt-3 flex items-center gap-1.5 text-stone-400 hover:text-stone-700 text-xs transition-colors">
          <ArrowLeft size={13} />Continuar comprando
        </button>
      </div>
    </div>
  );
}

type CheckoutStep = 'carrinho' | 'entrega' | 'pagamento' | 'confirmacao';
type PayMethod = 'pix' | 'cartao' | 'boleto';

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 'carrinho',     label: 'Carrinho' },
  { id: 'entrega',      label: 'Entrega' },
  { id: 'pagamento',    label: 'Pagamento' },
  { id: 'confirmacao',  label: 'Confirmação' },
];

function StepIndicator({ current }: { current: CheckoutStep }) {
  const idx = STEPS.findIndex(s => s.id === current);
  return (
    <div className="flex items-center justify-center gap-0 py-3 bg-white border-b border-stone-100">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all
              ${i < idx ? 'bg-emerald-500 text-white' : i === idx ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-stone-100 text-stone-400'}`}>
              {i < idx ? '✓' : i + 1}
            </div>
            <span className={`text-[9px] font-semibold uppercase tracking-wide hidden sm:block
              ${i === idx ? 'text-amber-600' : i < idx ? 'text-emerald-600' : 'text-stone-400'}`}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-10 md:w-16 mx-1 transition-all ${i < idx ? 'bg-emerald-400' : 'bg-stone-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function OrderSummaryPanel({ cart, discount, shipping, couponApplied }: {
  cart: CartItem[]; discount: number; shipping: number; couponApplied: boolean;
}) {
  const subtotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const total = subtotal - discount + shipping;
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
      <h3 className="font-black text-stone-800 text-xs mb-3 uppercase tracking-wider">Resumo</h3>
      <div className="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto">
        {cart.map(item => (
          <div key={item.product.id} className="flex gap-2 items-center">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.product.gradient} shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-stone-700 text-[10px] font-semibold truncate">{item.product.name}</p>
              <p className="text-stone-400 text-[9px]">Qtd: {item.qty}</p>
            </div>
            <p className="text-stone-800 text-[11px] font-bold shrink-0">{fmt(item.product.price * item.qty)}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-stone-100 pt-3 flex flex-col gap-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-stone-500">Subtotal</span>
          <span className="font-semibold text-stone-700">{fmt(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-emerald-600 font-semibold">Cupom VESTA10</span>
            <span className="text-emerald-600 font-bold">- {fmt(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-stone-500">Frete</span>
          <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'text-stone-700 font-semibold'}>
            {shipping === 0 ? 'Grátis' : fmt(shipping)}
          </span>
        </div>
        <div className="flex justify-between border-t border-stone-100 pt-2 mt-1">
          <span className="text-stone-800 font-black text-xs">Total</span>
          <div className="text-right">
            <p className="text-stone-900 font-black text-base leading-none">{fmt(total)}</p>
            <p className="text-stone-400 text-[9px]">{installments(total)}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-100">
        <ShieldCheck size={10} className="text-emerald-500" />
        <p className="text-[9px] text-stone-400">Compra protegida com SSL</p>
      </div>
    </div>
  );
}

function CartView({ cart, onUpdateQty, onRemove, onBack }: {
  cart: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState<CheckoutStep>('carrinho');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [shippingOption, setShippingOption] = useState<'padrao' | 'expresso' | 'gratis'>('padrao');
  const [payMethod, setPayMethod] = useState<PayMethod>('pix');
  const [pixCopied, setPixCopied] = useState(false);
  const [boletoCopied, setBoletoCopied] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '', installments: '1' });
  const [address, setAddress] = useState({ nome: '', email: '', cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' });

  const subtotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const freeShippingEligible = subtotal - discount >= 500;
  const shippingCost = freeShippingEligible ? 0 : shippingOption === 'expresso' ? 49.90 : 29.90;
  const total = subtotal - discount + shippingCost;
  const freeShippingLeft = Math.max(0, 500 - (subtotal - discount));

  // Confirmation screen
  if (step === 'confirmacao') {
    return (
      <div className="flex-1 bg-[#F5F5F3] flex items-center justify-center overflow-y-auto">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 20 }}
          className="text-center max-w-sm w-full px-6 py-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 250, damping: 18 }}
            className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-stone-800 font-black text-2xl mb-2">Pedido confirmado!</h2>
            <p className="text-stone-500 text-sm mb-1">
              Pedido <span className="font-bold text-stone-700">#4822</span> realizado com sucesso.
            </p>
            <p className="text-stone-400 text-xs mb-1">
              Previsão de entrega: <span className="font-semibold text-stone-600">
                {shippingOption === 'expresso' ? '12 a 14 de Março' : '14 a 17 de Março'}
              </span>
            </p>
            <p className="text-stone-400 text-xs mb-2">
              {payMethod === 'pix' && 'Pagamento via Pix confirmado automaticamente.'}
              {payMethod === 'cartao' && `Pagamento no cartão em ${cardForm.installments}x aprovado.`}
              {payMethod === 'boleto' && 'Boleto gerado — prazo de pagamento: 3 dias úteis.'}
            </p>
            {address.email && (
              <p className="text-stone-400 text-xs mb-6">
                Confirmação enviada para <span className="text-amber-600 font-semibold">{address.email}</span>
              </p>
            )}

            {/* Mini receipt */}
            <div className="bg-white rounded-2xl border border-stone-100 p-4 text-left mb-5 shadow-sm">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-stone-500">Total pago</span>
                <span className="font-black text-stone-800 text-base">{fmt(total)}</span>
              </div>
              {address.rua && (
                <div className="flex gap-1.5 text-xs text-stone-500 mt-2 pt-2 border-t border-stone-100">
                  <MapPin size={11} className="text-stone-400 shrink-0 mt-0.5" />
                  <span>{address.rua}{address.numero ? `, ${address.numero}` : ''} — {address.bairro || 'São Paulo'}, SP</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={onBack}
                className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-3 rounded-xl text-sm font-black transition-colors shadow-lg shadow-amber-100">
                Continuar Comprando
              </button>
              <button className="text-stone-400 text-xs hover:text-stone-600 transition-colors font-medium py-1">
                Rastrear pedido →
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F5F3]">
      <StepIndicator current={step} />

      <div className="flex-1 overflow-y-auto">
        {/* ── STEP: CARRINHO ── */}
        {step === 'carrinho' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3 flex flex-col gap-3">
              {/* Free shipping bar */}
              {freeShippingLeft > 0 && cart.length > 0 && (
                <div className="bg-amber-50 rounded-xl border border-amber-100 px-4 py-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-stone-600">Falta <span className="font-bold text-amber-600">{fmt(freeShippingLeft)}</span> para Frete Grátis</span>
                    <Truck size={13} className="text-amber-500" />
                  </div>
                  <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((subtotal - discount) / 500) * 100)}%` }}
                      className="h-full bg-amber-400 rounded-full" />
                  </div>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center">
                  <ShoppingCart size={32} className="text-stone-200 mx-auto mb-3" />
                  <p className="text-stone-400 text-sm font-medium">Seu carrinho está vazio</p>
                  <button onClick={onBack} className="mt-3 text-amber-600 text-xs font-semibold hover:underline">Explorar produtos</button>
                </div>
              ) : cart.map(item => (
                <div key={item.product.id} className="bg-white rounded-xl border border-stone-100 p-4 flex gap-4 shadow-sm">
                  <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.product.gradient} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-stone-500 text-[10px] uppercase">{item.product.category}</p>
                        <p className="text-stone-800 text-xs font-bold leading-tight">{item.product.name}</p>
                        <p className="text-stone-400 text-[10px]">Cor: {item.color}</p>
                      </div>
                      <button onClick={() => onRemove(item.product.id)} className="text-stone-300 hover:text-rose-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border-2 border-stone-100 rounded-lg overflow-hidden">
                        <button onClick={() => item.qty > 1 ? onUpdateQty(item.product.id, item.qty - 1) : onRemove(item.product.id)}
                          className="w-7 h-7 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"><Minus size={11} /></button>
                        <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.product.id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"><Plus size={11} /></button>
                      </div>
                      <p className="text-stone-900 font-black text-sm">{fmt(item.product.price * item.qty)}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              {cart.length > 0 && (
                <div className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm">
                  <p className="text-stone-600 text-xs font-bold mb-2 flex items-center gap-1.5"><Tag size={12} />Cupom de desconto</p>
                  <div className="flex gap-2">
                    <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Ex: VESTA10"
                      className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-amber-400 transition-colors uppercase font-mono" />
                    <button onClick={() => { if (coupon === 'VESTA10') setCouponApplied(true); }}
                      className="bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Aplicar</button>
                  </div>
                  {couponApplied
                    ? <p className="text-emerald-600 text-[11px] font-semibold mt-1.5">✓ Cupom aplicado — 10% de desconto!</p>
                    : <p className="text-stone-400 text-[10px] mt-1">Use <span className="font-mono font-bold text-amber-600">VESTA10</span> para 10% OFF</p>}
                </div>
              )}
            </div>

            {/* Summary + CTA */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <OrderSummaryPanel cart={cart} discount={discount} shipping={shippingCost} couponApplied={couponApplied} />
              <button onClick={() => { if (cart.length > 0) setStep('entrega'); }}
                className={`w-full py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2
                  ${cart.length > 0 ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-100' : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}>
                Ir para Entrega <ChevronRight size={15} />
              </button>
              <button onClick={onBack} className="flex items-center justify-center gap-1.5 text-stone-400 hover:text-stone-600 text-xs transition-colors">
                <ArrowLeft size={12} />Continuar comprando
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: ENTREGA ── */}
        {step === 'entrega' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3 flex flex-col gap-4">
              {/* Address form */}
              <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <p className="text-stone-700 font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-wider"><MapPin size={13} className="text-amber-500" />Endereço de entrega</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {([
                    { key: 'nome',         label: 'Nome completo',    span: 2 },
                    { key: 'email',        label: 'Email',            span: 2 },
                    { key: 'cep',          label: 'CEP',              span: 1 },
                    { key: 'estado',       label: 'Estado',           span: 1 },
                    { key: 'rua',          label: 'Rua / Avenida',    span: 2 },
                    { key: 'numero',       label: 'Número',           span: 1 },
                    { key: 'complemento',  label: 'Complemento',      span: 1 },
                    { key: 'bairro',       label: 'Bairro',           span: 1 },
                    { key: 'cidade',       label: 'Cidade',           span: 1 },
                  ] as { key: keyof typeof address; label: string; span: number }[]).map(f => (
                    <div key={f.key} className={f.span === 2 ? 'col-span-2' : 'col-span-1'}>
                      <label className="block text-[10px] text-stone-500 font-semibold mb-1">{f.label}</label>
                      <input value={address[f.key]} onChange={e => setAddress(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping options */}
              <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <p className="text-stone-700 font-black text-xs mb-3 flex items-center gap-2 uppercase tracking-wider"><Truck size={13} className="text-amber-500" />Opção de frete</p>
                <div className="flex flex-col gap-2">
                  {freeShippingEligible && (
                    <label onClick={() => setShippingOption('gratis')}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                        ${shippingOption === 'gratis' ? 'border-emerald-400 bg-emerald-50' : 'border-stone-100 hover:border-stone-200'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                        ${shippingOption === 'gratis' ? 'border-emerald-500' : 'border-stone-300'}`}>
                        {shippingOption === 'gratis' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-stone-700">Frete Grátis</p>
                        <p className="text-[10px] text-stone-400">Entrega em 5 a 8 dias úteis</p>
                      </div>
                      <span className="text-emerald-600 font-black text-xs">GRÁTIS</span>
                    </label>
                  )}
                  <label onClick={() => setShippingOption('padrao')}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${shippingOption === 'padrao' ? 'border-amber-400 bg-amber-50' : 'border-stone-100 hover:border-stone-200'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                      ${shippingOption === 'padrao' ? 'border-amber-500' : 'border-stone-300'}`}>
                      {shippingOption === 'padrao' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-stone-700">Padrão</p>
                      <p className="text-[10px] text-stone-400">Entrega em 5 a 7 dias úteis</p>
                    </div>
                    <span className="text-stone-700 font-bold text-xs">{fmt(29.90)}</span>
                  </label>
                  <label onClick={() => setShippingOption('expresso')}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${shippingOption === 'expresso' ? 'border-amber-400 bg-amber-50' : 'border-stone-100 hover:border-stone-200'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                      ${shippingOption === 'expresso' ? 'border-amber-500' : 'border-stone-300'}`}>
                      {shippingOption === 'expresso' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-stone-700 flex items-center gap-1.5">Expresso <Zap size={10} className="text-amber-500" /></p>
                      <p className="text-[10px] text-stone-400">Entrega em 1 a 2 dias úteis</p>
                    </div>
                    <span className="text-stone-700 font-bold text-xs">{fmt(49.90)}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              <OrderSummaryPanel cart={cart} discount={discount} shipping={shippingCost} couponApplied={couponApplied} />
              <button onClick={() => setStep('pagamento')}
                className="w-full py-3.5 rounded-xl font-black text-sm bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-100 transition-all flex items-center justify-center gap-2">
                Ir para Pagamento <ChevronRight size={15} />
              </button>
              <button onClick={() => setStep('carrinho')} className="flex items-center justify-center gap-1.5 text-stone-400 hover:text-stone-600 text-xs transition-colors">
                <ArrowLeft size={12} />Voltar ao carrinho
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: PAGAMENTO ── */}
        {step === 'pagamento' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <p className="text-stone-700 font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-wider"><CreditCard size={13} className="text-amber-500" />Forma de pagamento</p>

                {/* Method tabs */}
                <div className="flex gap-2 mb-5 p-1 bg-stone-50 rounded-xl border border-stone-100">
                  {([
                    { id: 'pix',    label: 'Pix',    icon: '⚡' },
                    { id: 'cartao', label: 'Cartão', icon: '💳' },
                    { id: 'boleto', label: 'Boleto', icon: '📄' },
                  ] as { id: PayMethod; label: string; icon: string }[]).map(m => (
                    <button key={m.id} onClick={() => setPayMethod(m.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all
                        ${payMethod === m.id ? 'bg-white shadow text-stone-800 border border-stone-100' : 'text-stone-400 hover:text-stone-600'}`}>
                      <span>{m.icon}</span>{m.label}
                    </button>
                  ))}
                </div>

                {/* PIX */}
                {payMethod === 'pix' && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-stone-600 text-xs text-center">Escaneie o QR code com seu app bancário</p>
                      {/* Simulated QR code */}
                      <div className="w-40 h-40 bg-white border-4 border-stone-800 rounded-xl p-2 grid grid-cols-7 gap-0.5">
                        {Array.from({ length: 49 }, (_, i) => {
                          const corners = [0,1,2,7,8,9,14,15,16,32,33,34,39,40,41,46,47,48];
                          const inner = [10,11,12,17,19,24,25,26,31,36,37,38];
                          const filled = corners.includes(i) || inner.includes(i) || (i % 3 === 0 && i > 16 && i < 32);
                          return <div key={i} className={`rounded-[1px] ${filled ? 'bg-stone-800' : 'bg-white'}`} />;
                        })}
                      </div>
                      <span className="text-[10px] text-stone-400">Pix válido por 30 minutos</span>
                    </div>
                    <div className="w-full">
                      <p className="text-stone-500 text-[10px] mb-1 font-semibold">Ou copie o código Pix:</p>
                      <div className="flex gap-2 items-center bg-stone-50 rounded-lg border border-stone-200 px-3 py-2">
                        <span className="text-[10px] text-stone-400 font-mono flex-1 truncate">00020126580014br.gov.bcb.pix0136vesta-home-key-pix@vestahome.com.br</span>
                        <button onClick={() => { setPixCopied(true); setTimeout(() => setPixCopied(false), 2000); }}
                          className={`text-[10px] font-bold shrink-0 transition-colors ${pixCopied ? 'text-emerald-500' : 'text-amber-600 hover:text-amber-500'}`}>
                          {pixCopied ? '✓ Copiado' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-emerald-50 rounded-xl border border-emerald-100 p-3 flex items-center gap-2">
                      <Zap size={14} className="text-emerald-500 shrink-0" />
                      <p className="text-emerald-700 text-[11px] font-semibold">Pagamento via Pix é confirmado na hora — sem espera!</p>
                    </div>
                  </div>
                )}

                {/* CARTÃO */}
                {payMethod === 'cartao' && (
                  <div className="flex flex-col gap-3">
                    {/* Card preview */}
                    <div className="w-full h-28 bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 rounded-2xl p-4 relative overflow-hidden shadow-lg">
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-10 -translate-x-10" />
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-white/60 text-[9px] font-semibold uppercase tracking-widest">Vesta Home</span>
                        <div className="flex gap-0 -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-red-400 opacity-80" />
                          <div className="w-6 h-6 rounded-full bg-amber-400 opacity-80" />
                        </div>
                      </div>
                      <p className="text-white font-mono text-sm tracking-widest mb-1">
                        {cardForm.number ? cardForm.number.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                      </p>
                      <div className="flex justify-between items-end">
                        <p className="text-white/70 text-[10px] uppercase">{cardForm.name || 'NOME NO CARTÃO'}</p>
                        <p className="text-white/70 text-[10px]">{cardForm.expiry || 'MM/AA'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-stone-500 font-semibold mb-1">Número do cartão</label>
                        <input value={cardForm.number} maxLength={16} onChange={e => setCardForm(p => ({ ...p, number: e.target.value.replace(/\D/g, '') }))}
                          placeholder="0000 0000 0000 0000" className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-amber-400 transition-all font-mono" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-stone-500 font-semibold mb-1">Nome no cartão</label>
                        <input value={cardForm.name} onChange={e => setCardForm(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                          placeholder="NOME SOBRENOME" className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-amber-400 transition-all uppercase" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-stone-500 font-semibold mb-1">Validade</label>
                        <input value={cardForm.expiry} maxLength={5} onChange={e => {
                          let v = e.target.value.replace(/\D/g,'');
                          if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2,4);
                          setCardForm(p => ({ ...p, expiry: v }));
                        }} placeholder="MM/AA" className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-amber-400 transition-all font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-stone-500 font-semibold mb-1">CVV</label>
                        <input value={cardForm.cvv} maxLength={3} onChange={e => setCardForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'') }))}
                          placeholder="•••" type="password" className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-amber-400 transition-all" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-stone-500 font-semibold mb-1">Parcelas</label>
                        <select value={cardForm.installments} onChange={e => setCardForm(p => ({ ...p, installments: e.target.value }))}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-amber-400 transition-all bg-white">
                          {[1,2,3,4,6,8,10,12].map(n => (
                            <option key={n} value={String(n)}>
                              {n}x de {fmt(total / n)}{n > 3 ? ' (com juros)' : ' sem juros'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOLETO */}
                {payMethod === 'boleto' && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
                      {/* Barcode visual */}
                      <div className="flex gap-px mb-3 h-14 items-end justify-center">
                        {Array.from({ length: 60 }, (_, i) => (
                          <div key={i} style={{ width: i % 7 === 0 ? 3 : 1, height: `${50 + (i % 5) * 6}%` }}
                            className="bg-stone-800 rounded-sm shrink-0" />
                        ))}
                      </div>
                      <p className="text-[10px] text-stone-500 text-center font-mono mb-2">1234.5678 9012.3456 7890.1234 5 67890000000000</p>
                      <button onClick={() => { setBoletoCopied(true); setTimeout(() => setBoletoCopied(false), 2000); }}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-colors border
                          ${boletoCopied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-stone-200 text-stone-700 hover:border-amber-300 hover:text-amber-600'}`}>
                        {boletoCopied ? '✓ Linha digitável copiada!' : 'Copiar linha digitável'}
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        { icon: '📅', text: 'Vencimento em 3 dias úteis' },
                        { icon: '⏱️', text: 'Compensação em até 2 dias úteis após pagamento' },
                        { icon: '🏦', text: 'Pague em qualquer banco, lotérica ou app' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs text-stone-500">
                          <span className="text-sm">{item.icon}</span>{item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              <OrderSummaryPanel cart={cart} discount={discount} shipping={shippingCost} couponApplied={couponApplied} />
              <button onClick={() => setStep('confirmacao')}
                className="w-full py-3.5 rounded-xl font-black text-sm bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-100 transition-all flex items-center justify-center gap-2">
                <ShieldCheck size={15} />Confirmar Pedido · {fmt(total)}
              </button>
              <button onClick={() => setStep('entrega')} className="flex items-center justify-center gap-1.5 text-stone-400 hover:text-stone-600 text-xs transition-colors">
                <ArrowLeft size={12} />Voltar à entrega
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function EcommerceAdmin() {
  const [mode, setMode] = useState<Mode>('admin');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');
  const [storeScreen, setStoreScreen] = useState<StoreScreen>('vitrine');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (product: Product, qty: number, color: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { product, qty, color }];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    setCart(prev => prev.map(c => c.product.id === productId ? { ...c, qty } : c));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(c => c.product.id !== productId));
  };

  const handleProductClick = (p: Product) => {
    setSelectedProduct(p);
    setStoreScreen('produto');
  };

  const handleSwitchMode = (m: Mode) => {
    setMode(m);
    setStoreScreen('vitrine');
  };

  const adminNavItems: { view: AdminView; icon: React.ReactNode; label: string }[] = [
    { view: 'dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
    { view: 'pedidos',   icon: <ShoppingBag size={15} />,     label: 'Pedidos' },
    { view: 'produtos',  icon: <Package size={15} />,         label: 'Produtos' },
    { view: 'clientes',  icon: <Users size={15} />,           label: 'Clientes' },
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden font-sans text-sm">
      {/* Mode toggle bar */}
      <div className="shrink-0 bg-stone-900 flex items-center justify-between px-5 py-2.5 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-black">V</span>
          </div>
          <span className="text-white font-semibold text-xs">Vesta Home</span>
        </div>

        {/* Toggle */}
        <div className="flex items-center bg-stone-800 rounded-xl p-1 gap-1">
          <button onClick={() => handleSwitchMode('admin')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
              ${mode === 'admin' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-200'}`}>
            <Settings size={12} />Painel Admin
          </button>
          <button onClick={() => handleSwitchMode('store')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
              ${mode === 'store' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-200'}`}>
            <ShoppingBag size={12} />Ver Loja
          </button>
        </div>

        <div className="text-stone-500 text-[10px] hidden md:block">
          {mode === 'admin' ? 'Visão administrativa' : 'Visão do consumidor'}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'admin' ? (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="flex-1 flex overflow-hidden bg-stone-50">
            {/* Admin sidebar */}
            <div className="w-48 bg-white border-r border-stone-200 flex flex-col shrink-0">
              <div className="px-4 py-4 border-b border-stone-100">
                <p className="text-stone-400 text-[10px] uppercase tracking-widest">Gestão da Loja</p>
              </div>
              <nav className="flex-1 px-3 py-3 flex flex-col gap-1">
                {adminNavItems.map(n => (
                  <button key={n.view} onClick={() => setAdminView(n.view)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all text-left
                      ${adminView === n.view ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'}`}>
                    {n.icon}{n.label}
                  </button>
                ))}
              </nav>
              <div className="px-4 py-4 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center">VH</div>
                  <div>
                    <p className="text-stone-700 text-[10px] font-medium">Admin</p>
                    <p className="text-stone-400 text-[9px]">vesta@vestahome.exemplo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-5 py-3 bg-white border-b border-stone-100 flex items-center justify-between shrink-0">
                <h2 className="font-semibold text-stone-800 text-sm capitalize">{adminView}</h2>
                <span className="text-stone-400 text-xs">Março 2026</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={adminView} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                  className="flex-1 overflow-hidden flex flex-col">
                  {adminView === 'dashboard' && <AdminDashboard />}
                  {adminView === 'pedidos'   && <PedidosView />}
                  {adminView === 'produtos'  && <ProdutosView />}
                  {adminView === 'clientes'  && <ClientesAdminView />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div key="store" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col overflow-hidden">
            <StoreNavbar cartCount={cartCount} onCartClick={() => setStoreScreen('carrinho')} />
            <AnimatePresence mode="wait">
              <motion.div key={storeScreen} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden flex flex-col">
                {storeScreen === 'vitrine' && <Vitrine onProductClick={handleProductClick} />}
                {storeScreen === 'produto' && selectedProduct && (
                  <ProductPage
                    product={selectedProduct}
                    onBack={() => setStoreScreen('vitrine')}
                    onAddToCart={addToCart}
                    cartHasItem={cart.some(c => c.product.id === selectedProduct.id)}
                  />
                )}
                {storeScreen === 'carrinho' && (
                  <CartView
                    cart={cart}
                    onUpdateQty={updateQty}
                    onRemove={removeFromCart}
                    onBack={() => setStoreScreen('vitrine')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #d6d3d1; }
      `}</style>
    </div>
  );
}
