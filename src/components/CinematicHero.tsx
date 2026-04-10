import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  MessageCircle, ArrowRight, ChevronDown,
  Globe, Smartphone, Zap, Brain,
  TrendingUp, Users, CheckCircle,
  Package, Mail, Clock, GitBranch, FileSpreadsheet,
  Bot, BarChart3, Home, Activity,
  MapPin, Bell, Camera, Navigation, ClipboardList,
} from "lucide-react";
import NeuralBackground from "./NeuralBackground";
import { Logo } from "./Logo";
import { useIsMobile } from "../hooks/useIsMobile";
import { useCountUp, parseMetric } from "../hooks/useCountUp";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const STYLES = `
  .main-card, .cta-wrap { visibility: hidden; }

  .premium-depth-card {
    background: linear-gradient(145deg, #1A1A1A 0%, #0A0A0A 100%);
    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.9), 0 20px 40px -20px rgba(0,0,0,0.8),
      inset 0 1px 2px rgba(201,168,76,0.10), inset 0 -2px 4px rgba(0,0,0,0.8);
    border: 1px solid rgba(201,168,76,0.06);
  }
  .card-sheen {
    position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:50;
    background: radial-gradient(700px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(201,168,76,0.035) 0%, transparent 40%);
    mix-blend-mode:screen;
  }

  .wg {
    background:linear-gradient(180deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%);
    box-shadow:0 4px 12px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.04);
  }

  /* Device frames */
  .device-frame {
    background:#0A0A0A;
    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.9), 0 10px 20px -5px rgba(0,0,0,0.7),
      inset 0 1px 1px rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.06);
  }
  .laptop-hinge {
    background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
    border: 1px solid rgba(255,255,255,0.04);
    border-top: none;
  }
  .iphone-bezel {
    background:#111;
    box-shadow: inset 0 0 0 2px #52525B, inset 0 0 0 7px #000,
      0 40px 80px -15px rgba(0,0,0,0.9), 0 15px 25px -5px rgba(0,0,0,0.7);
    transform-style:preserve-3d;
  }
  .hw-btn {
    background:linear-gradient(90deg,#404040 0%,#171717 100%);
    box-shadow:-2px 0 5px rgba(0,0,0,0.8), inset -1px 0 1px rgba(255,255,255,0.15);
    border-left:1px solid rgba(255,255,255,0.05);
  }

  .orbital-svc {
    background:rgba(18,18,18,0.92);
    backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
    border:1px solid rgba(201,168,76,0.16);
    box-shadow:0 8px 24px rgba(0,0,0,0.5);
    transition: opacity .5s ease, border-color .5s ease, box-shadow .5s ease, transform .5s ease;
  }
  .orbital-svc.orb-active {
    border-color: var(--svc-color);
    box-shadow: 0 0 20px color-mix(in srgb, var(--svc-color) 25%, transparent), 0 8px 24px rgba(0,0,0,0.5);
    transform: scale(1.06);
  }
  .orbital-svc.orb-dim { opacity: 0.4; }

  .btn-gold {
    background:linear-gradient(180deg,#E5C05C 0%,#C9A84C 100%); color:#0A0A0A;
    box-shadow:0 0 0 1px rgba(201,168,76,0.3), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(201,168,76,0.35), inset 0 1px 1px rgba(255,255,255,0.5);
    transition:all .4s cubic-bezier(.25,1,.5,1);
  }
  .btn-gold:hover { transform:translateY(-3px); box-shadow:0 0 0 1px rgba(201,168,76,0.4), 0 6px 12px -2px rgba(201,168,76,0.3), 0 20px 32px -6px rgba(201,168,76,0.5), inset 0 1px 1px rgba(255,255,255,0.5); }
  .btn-dark {
    background:linear-gradient(180deg,#27272A 0%,#18181B 100%); color:#FFF;
    box-shadow:0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15);
    transition:all .4s cubic-bezier(.25,1,.5,1);
  }
  .btn-dark:hover { transform:translateY(-3px); background:linear-gradient(180deg,#3F3F46 0%,#27272A 100%); }

  .svc-tab-item { transition: background .3s ease, border-color .3s ease; }

  @keyframes chevronBob { 0%,100%{transform:translateY(0);opacity:.25} 50%{transform:translateY(4px);opacity:.65} }
  @keyframes pulse-dot { 0%,100%{opacity:.4} 50%{opacity:1} }
  .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

  /* ── AI Neural Representation ── */
  @keyframes neural-breathe {
    0%,100% { transform:scale(1); opacity:0.6; }
    50% { transform:scale(1.08); opacity:1; }
  }
  @keyframes neural-ring-pulse {
    0% { transform:scale(0.95); opacity:0.15; }
    50% { transform:scale(1.05); opacity:0.3; }
    100% { transform:scale(0.95); opacity:0.15; }
  }
  @keyframes neural-orbit {
    0% { transform:rotate(0deg); }
    100% { transform:rotate(360deg); }
  }
  @keyframes neural-orbit-rev {
    0% { transform:rotate(360deg); }
    100% { transform:rotate(0deg); }
  }
  @keyframes neural-float {
    0%,100% { transform:translateY(0); }
    50% { transform:translateY(-4px); }
  }
  @keyframes data-flow {
    0% { stroke-dashoffset: 20; }
    100% { stroke-dashoffset: 0; }
  }
  .ai-core-glow {
    background: radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(236,72,153,0.08) 40%, transparent 70%);
    animation: neural-breathe 4s ease-in-out infinite;
  }
  .ai-ring { animation: neural-ring-pulse 4s ease-in-out infinite; }
  .ai-ring-2 { animation: neural-ring-pulse 4s ease-in-out 1s infinite; }
  .ai-ring-3 { animation: neural-ring-pulse 4s ease-in-out 2s infinite; }
  .ai-orbit-slow { animation: neural-orbit 30s linear infinite; }
  .ai-orbit-med { animation: neural-orbit-rev 20s linear infinite; }
  .ai-orbit-fast { animation: neural-orbit 12s linear infinite; }
  .ai-float { animation: neural-float 3s ease-in-out infinite; }
  .ai-float-d1 { animation: neural-float 3s ease-in-out 0.5s infinite; }
  .ai-float-d2 { animation: neural-float 3s ease-in-out 1s infinite; }
  .ai-float-d3 { animation: neural-float 3s ease-in-out 1.5s infinite; }
  .ai-badge {
    background: rgba(10,10,10,0.85);
    backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
    border: 1px solid rgba(236,72,153,0.15);
    box-shadow: 0 4px 16px rgba(0,0,0,0.5), 0 0 12px rgba(236,72,153,0.08);
  }

  @media (prefers-reduced-motion:reduce) { .main-card,.cta-wrap{visibility:visible!important} }
`;

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const metricsData = [
  { raw: "50+", label: "Projetos entregues" },
  { raw: "140h", label: "Economizadas/cliente" },
  { raw: "68%", label: "Menos retrabalho" },
];

const services = [
  { id: "web", Icon: Globe, title: "Web", sub: "Sistemas completos", color: "#3B82F6" },
  { id: "mob", Icon: Smartphone, title: "Mobile", sub: "Apps sob medida", color: "#A855F7" },
  { id: "aut", Icon: Zap, title: "Automação", sub: "Fluxos inteligentes", color: "#22C55E" },
  { id: "ia",  Icon: Brain, title: "IA", sub: "Inteligência artificial", color: "#EC4899" },
];

const cardPos: React.CSSProperties[] = [
  { top: "2%", left: "1%" },
  { top: "2%", right: "1%" },
  { bottom: "2%", left: "1%" },
  { bottom: "2%", right: "1%" },
];

const CTR = { x: 300, y: 300 };
const RINGS = [{ r: 105, da: 660 }, { r: 185, da: 1162 }];
const ENDS = [{ x: 75, y: 55 }, { x: 525, y: 55 }, { x: 75, y: 545 }, { x: 525, y: 545 }];
function lineDots(ex: number, ey: number) {
  return [0.32, 0.58].map(t => ({ x: CTR.x + t * (ex - CTR.x), y: CTR.y + t * (ey - CTR.y) }));
}

/* ═══════════════════════════════════════════
   DEVICE 1: LAPTOP (Web)
   ═══════════════════════════════════════════ */
function LaptopDevice() {
  const spark = [3, 5, 4, 7, 6, 8, 9];
  const chartPts = [{ x: 0, y: 55 }, { x: 30, y: 35 }, { x: 60, y: 42 }, { x: 90, y: 20 }, { x: 120, y: 30 }, { x: 150, y: 10 }];
  const chartLine = chartPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const chartArea = `${chartLine} L150,65 L0,65 Z`;

  return (
    <div className="flex flex-col items-center">
      {/* Laptop screen */}
      <div className="device-frame rounded-lg overflow-hidden" style={{ width: 340, height: 220 }}>
        {/* Browser bar */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111] border-b border-white/5">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F57]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#FEBC2E]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 mx-2 bg-white/5 rounded px-2 py-0.5">
            <span className="text-[7px] text-neutral-500">app.inova.systems</span>
          </div>
        </div>
        {/* Content area */}
        <div className="flex h-[195px]">
          {/* Sidebar */}
          <div className="w-[70px] bg-[#0d0d0d] border-r border-white/5 px-2 py-3 flex flex-col gap-1.5 shrink-0">
            {[
              { icon: <BarChart3 className="w-2.5 h-2.5" />, l: "Dashboard", active: true },
              { icon: <Users className="w-2.5 h-2.5" />, l: "Clientes", active: false },
              { icon: <Package className="w-2.5 h-2.5" />, l: "Pedidos", active: false },
              { icon: <Mail className="w-2.5 h-2.5" />, l: "Mensagens", active: false },
            ].map(s => (
              <div key={s.l} className={`flex items-center gap-1.5 px-1.5 py-1 rounded ${s.active ? "bg-[#3B82F6]/15" : ""}`}>
                <div style={{ color: s.active ? "#3B82F6" : "#525252" }}>{s.icon}</div>
                <span className="text-[6px] font-medium" style={{ color: s.active ? "#3B82F6" : "#525252" }}>{s.l}</span>
              </div>
            ))}
          </div>
          {/* Main content */}
          <div className="flex-1 p-3 overflow-hidden">
            {/* KPI row */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="rounded-md p-2 border" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, transparent 100%)", borderColor: "rgba(59,130,246,0.12)" }}>
                <span className="text-[6px] text-[#3B82F6] uppercase tracking-wider font-bold block">Receita</span>
                <span className="text-sm font-extrabold text-white leading-none">R$ 2.4M</span>
                <span className="text-[7px] text-emerald-400 font-bold block mt-0.5">↗ +12%</span>
              </div>
              <div className="rounded-md p-2 border" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, transparent 100%)", borderColor: "rgba(201,168,76,0.12)" }}>
                <span className="text-[6px] text-[#C9A84C] uppercase tracking-wider font-bold block">Clientes</span>
                <span className="text-sm font-extrabold text-white leading-none">127</span>
                <span className="text-[7px] text-emerald-400 font-bold block mt-0.5">↗ +8%</span>
              </div>
              <div className="rounded-md p-2 border" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, transparent 100%)", borderColor: "rgba(34,197,94,0.12)" }}>
                <span className="text-[6px] text-emerald-400 uppercase tracking-wider font-bold block">Conversão</span>
                <span className="text-sm font-extrabold text-white leading-none">12.3%</span>
                <span className="text-[7px] text-emerald-400 font-bold block mt-0.5">↗ +3%</span>
              </div>
            </div>
            {/* Chart */}
            <div className="wg rounded-md p-2 mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-[6px] text-neutral-500 uppercase tracking-wider font-bold">Faturamento</span>
                <span className="text-[6px] text-[#3B82F6] font-bold">6 meses</span>
              </div>
              <svg className="w-full" viewBox="0 0 150 65" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lcf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d={chartArea} fill="url(#lcf)" />
                <path d={chartLine} fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                {chartPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#0A0A0A" stroke="#3B82F6" strokeWidth="0.8" />)}
              </svg>
            </div>
            {/* Activity */}
            <div className="space-y-1">
              {[{ t: "Deploy v3.2 concluído", d: "2h" }, { t: "Proposta enviada", d: "1d" }].map(a => (
                <div key={a.t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-2 h-2 text-emerald-400 shrink-0" />
                  <span className="text-[6px] text-white">{a.t}</span>
                  <span className="text-[6px] text-neutral-600 ml-auto">{a.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Laptop hinge */}
      <div className="laptop-hinge rounded-b-lg" style={{ width: 380, height: 10 }}>
        <div className="w-12 h-0.5 bg-white/5 rounded-full mx-auto mt-2" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DEVICE 2: iPHONE (Mobile — App de Campo)
   ═══════════════════════════════════════════ */
function IPhoneDevice() {
  return (
    <div className="relative w-[220px] h-[460px] rounded-[2.5rem] iphone-bezel flex flex-col">
      <div className="absolute top-[90px] -left-[3px] w-[3px] h-[20px] hw-btn rounded-l-md" />
      <div className="absolute top-[125px] -left-[3px] w-[3px] h-[35px] hw-btn rounded-l-md" />
      <div className="absolute top-[170px] -left-[3px] w-[3px] h-[35px] hw-btn rounded-l-md" />
      <div className="absolute top-[130px] -right-[3px] w-[3px] h-[50px] hw-btn rounded-r-md scale-x-[-1]" />
      <div className="absolute inset-[6px] bg-[#050914] rounded-[2.2rem] overflow-hidden text-white z-10">
        {/* Dynamic Island */}
        <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[75px] h-[22px] bg-black rounded-full z-50 flex items-center justify-end px-2">
          <div className="w-1 h-1 rounded-full bg-[#C9A84C] shadow-[0_0_4px_rgba(201,168,76,0.8)] animate-pulse" />
        </div>
        {/* Screen */}
        <div className="pt-9 px-3 pb-3 flex flex-col h-full">
          {/* Header — personal greeting */}
          <div className="flex justify-between items-center mb-2.5">
            <div>
              <span className="text-xs font-bold text-white">Olá, Maria</span>
              <span className="text-[7px] text-neutral-500 block">3 tarefas hoje</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#A855F7]/15 text-[#A855F7] flex items-center justify-center font-bold text-[7px] border border-[#A855F7]/20">MS</div>
          </div>

          {/* Mini map */}
          <div className="rounded-lg overflow-hidden mb-2.5" style={{ height: 90, background: "#0A1628" }}>
            <svg className="w-full h-full" viewBox="0 0 200 90" preserveAspectRatio="xMidYMid meet">
              {/* Streets */}
              <line x1="0" y1="35" x2="200" y2="35" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <line x1="0" y1="65" x2="200" y2="65" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <line x1="60" y1="0" x2="60" y2="90" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <line x1="140" y1="0" x2="140" y2="90" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              {/* Street lines */}
              <line x1="0" y1="35" x2="200" y2="35" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="4 3" />
              <line x1="0" y1="65" x2="200" y2="65" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="4 3" />
              {/* You are here — blue pulse */}
              <circle cx="100" cy="50" r="6" fill="rgba(59,130,246,0.15)" />
              <circle cx="100" cy="50" r="3" fill="#3B82F6" />
              <circle cx="100" cy="50" r="6" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5" className="ai-ring" />
              {/* Pin 1 — green (current task) */}
              <circle cx="55" cy="32" r="4" fill="rgba(34,197,94,0.2)" />
              <circle cx="55" cy="32" r="2" fill="#22C55E" />
              {/* Pin 2 — yellow (next task) */}
              <circle cx="145" cy="62" r="4" fill="rgba(234,179,8,0.2)" />
              <circle cx="145" cy="62" r="2" fill="#EAB308" />
              {/* Pin 3 — gray (done) */}
              <circle cx="65" cy="68" r="2" fill="#6B7280" opacity="0.5" />
              {/* Route line */}
              <path d="M 100,50 L 55,32" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="0.8" strokeDasharray="3 2" />
            </svg>
          </div>

          {/* Task 1 — current (green) */}
          <div className="rounded-lg p-2 mb-1.5 border" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, transparent 100%)", borderColor: "rgba(34,197,94,0.12)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-[8px] font-bold text-white">Instalação Wi-Fi</span>
              </div>
              <span className="text-[6px] text-neutral-500">14:30</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <MapPin className="w-2 h-2 text-neutral-500" />
                <span className="text-[6px] text-neutral-400">R. das Flores, 142</span>
              </div>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.15)" }}>
                <span className="text-[6px] text-emerald-400 font-bold">Iniciar</span>
                <ArrowRight className="w-2 h-2 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Task 2 — pending (yellow) */}
          <div className="rounded-lg p-2 mb-1.5 border" style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.06) 0%, transparent 100%)", borderColor: "rgba(234,179,8,0.1)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span className="text-[8px] font-bold text-white">Manutenção CFTV</span>
              </div>
              <span className="text-[6px] text-neutral-500">16:00</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-2 h-2 text-neutral-500" />
              <span className="text-[6px] text-neutral-400">Av. Brasil, 890</span>
            </div>
          </div>

          {/* Task 3 — done (gray) */}
          <div className="rounded-lg p-1.5 mb-2 border border-white/5">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5 text-neutral-600" />
              <span className="text-[7px] text-neutral-600 line-through">Reparo rede • R. Bahia, 45</span>
              <span className="text-[6px] text-neutral-700 ml-auto">09:00</span>
            </div>
          </div>

          {/* Quick actions — native mobile features */}
          <div className="flex items-center justify-around py-1.5 mb-1 rounded-lg" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.1)" }}>
            {[
              { icon: <Bell className="w-3 h-3" />, label: "2", c: "#A855F7" },
              { icon: <Camera className="w-3 h-3" />, label: "Scan", c: "#A855F7" },
              { icon: <Navigation className="w-3 h-3" />, label: "Nav", c: "#3B82F6" },
            ].map(a => (
              <div key={a.label} className="flex flex-col items-center gap-0.5">
                <div style={{ color: a.c }}>{a.icon}</div>
                <span className="text-[5px] text-neutral-500">{a.label}</span>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="flex justify-around pt-1.5 mt-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { i: <Home className="w-2.5 h-2.5" />, l: "Home", a: true },
              { i: <ClipboardList className="w-2.5 h-2.5" />, l: "Tarefas", a: false },
              { i: <Bell className="w-2.5 h-2.5" />, l: "Alertas", a: false },
              { i: <Users className="w-2.5 h-2.5" />, l: "Perfil", a: false },
            ].map(t => (
              <div key={t.l} className="flex flex-col items-center gap-0.5">
                <div style={{ color: t.a ? "#A855F7" : "rgba(255,255,255,0.2)" }}>{t.i}</div>
                <span className="text-[5px]" style={{ color: t.a ? "#A855F7" : "rgba(255,255,255,0.2)" }}>{t.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DEVICE 3: AUTOMATION WORKFLOW (sem moldura)
   Fluxo vivo flutuando no espaço escuro,
   como se fosse construído ali.
   ═══════════════════════════════════════════ */

/* Row 1: Webhook flow (top) */
const r1 = [
  { icon: Globe, color: "#C9A84C", label: "Webhook", x: 8,   y: 5 },
  { icon: GitBranch, color: "#6B7280", label: "Switch", x: 60,  y: 5 },
  { icon: FileSpreadsheet, color: "#22C55E", label: "Planilha", x: 120, y: 5 },
  { icon: GitBranch, color: "#6B7280", label: "If", x: 170, y: 5 },
  { icon: Mail, color: "#22C55E", label: "Email", x: 230, y: 5 },
  { icon: CheckCircle, color: "#22C55E", label: "Log", x: 290, y: 5 },
];
/* Row 2: branch from Switch */
const r2 = [
  { icon: FileSpreadsheet, color: "#22C55E", label: "Update", x: 120, y: 50 },
  { icon: Bot, color: "#8B5CF6", label: "IA Agent", x: 180, y: 50 },
  { icon: Mail, color: "#22C55E", label: "Notificar", x: 240, y: 50 },
];
/* Row 3: Facebook Ads flow (bottom) */
const r3 = [
  { icon: Globe, color: "#3B82F6", label: "FB Ads", x: 8,   y: 95 },
  { icon: FileSpreadsheet, color: "#22C55E", label: "Lead", x: 60,  y: 95 },
  { icon: GitBranch, color: "#6B7280", label: "Checar", x: 120, y: 95 },
  { icon: Bot, color: "#8B5CF6", label: "IA Agent", x: 180, y: 95 },
  { icon: Mail, color: "#22C55E", label: "Resposta", x: 240, y: 95 },
  { icon: CheckCircle, color: "#22C55E", label: "CRM", x: 290, y: 95 },
];

const allWfNodes = [...r1, ...r2, ...r3];

/* Connection paths — curved like n8n */
const wfConns = [
  /* Row 1 horizontal */
  "M 28,15 C 40,15 48,15 60,15", "M 80,15 C 95,15 105,15 120,15",
  "M 140,15 L 170,15", "M 190,15 L 230,15", "M 250,15 L 290,15",
  /* Switch down to Row 2 */
  "M 75,25 C 75,40 100,50 120,55",
  /* Row 2 horizontal */
  "M 140,55 L 180,55", "M 200,55 L 240,55",
  /* Row 2 back up to Row 1 Email */
  "M 255,50 C 255,35 245,25 245,15",
  /* Row 3 horizontal */
  "M 28,105 C 40,105 48,105 60,105", "M 80,105 L 120,105",
  "M 140,105 L 180,105", "M 200,105 L 240,105", "M 260,105 L 290,105",
  /* Row 2 IA down to Row 3 IA */
  "M 195,65 C 195,80 195,90 195,95",
];

function PanelDevice() {
  return (
    <div className="relative" style={{ width: 340, height: 230 }}>
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 60%)" }} />

      {/* Grid background — like n8n canvas */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundSize: "20px 20px",
        backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
      }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 140" preserveAspectRatio="xMidYMid meet">
        {/* Connection paths */}
        {wfConns.map((d, i) => (
          <g key={i}>
            {/* Shadow line */}
            <path d={d} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
            {/* Main line */}
            <path d={d} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            {/* Animated data pulse — every 3rd connection */}
            {i % 3 === 0 && (
              <path d={d} fill="none" stroke="rgba(34,197,94,0.35)" strokeWidth="1.5"
                strokeDasharray="4 30" style={{ animation: `data-flow ${2.5 + i * 0.2}s linear infinite` }} />
            )}
          </g>
        ))}

        {/* Nodes */}
        {allWfNodes.map((n, i) => (
          <g key={i}>
            {/* Node background */}
            <rect x={n.x} y={n.y} width="20" height="20" rx="4"
              fill={`${n.color}15`} stroke={`${n.color}30`} strokeWidth="0.5" />
            {/* Small colored dot top-left */}
            <circle cx={n.x + 3} cy={n.y + 3} r="1.2" fill={n.color} opacity="0.7" />
          </g>
        ))}
      </svg>

      {/* Node icons + labels as HTML (better rendering than SVG) */}
      {allWfNodes.map((n, i) => (
        <div key={i} className="absolute flex flex-col items-center" style={{ left: n.x, top: n.y + 48, width: 20 }}>
          <div className="w-5 h-5 flex items-center justify-center">
            <n.icon className="w-2.5 h-2.5" style={{ color: n.color }} />
          </div>
          <span className="text-[4px] text-neutral-600 mt-[1px] text-center whitespace-nowrap leading-none">{n.label}</span>
        </div>
      ))}

      {/* Floating status badges */}
      <div className="absolute ai-badge rounded px-2 py-1 ai-float" style={{ top: 160, left: 15 }}>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[6px] text-white font-medium">NF #4521 processada</span>
          <span className="text-[5px] text-neutral-600">12s</span>
        </div>
      </div>
      <div className="absolute ai-badge rounded px-2 py-1 ai-float-d1" style={{ top: 160, left: 145 }}>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[6px] text-white font-medium">Lead qualificado</span>
          <span className="text-[5px] text-neutral-600">3m</span>
        </div>
      </div>
      <div className="absolute ai-badge rounded px-2 py-1 ai-float-d2" style={{ top: 160, right: 15 }}>
        <div className="flex items-center gap-1">
          <Clock className="w-2 h-2 text-[#C9A84C]" />
          <span className="text-[6px] text-[#C9A84C] font-bold">140h/mês</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DEVICE 4: AI NEURAL PRESENCE
   Uma rede de luz. Sem moldura. Sem rosto.
   Presença que pulsa quando processa,
   se acalma quando escuta.
   ═══════════════════════════════════════════ */

/* Neural constellation nodes */
const neuralNodes = [
  { x: 170, y: 115, r: 3, primary: true },  /* core */
  { x: 120, y: 70, r: 2 }, { x: 220, y: 65, r: 2 },
  { x: 95, y: 130, r: 1.5 }, { x: 245, y: 125, r: 1.5 },
  { x: 130, y: 170, r: 2 }, { x: 215, y: 175, r: 2 },
  { x: 170, y: 50, r: 1.5 }, { x: 80, y: 95, r: 1 },
  { x: 260, y: 90, r: 1 }, { x: 75, y: 165, r: 1 },
  { x: 265, y: 160, r: 1 }, { x: 170, y: 195, r: 1.5 },
];
/* Connections between nodes (index pairs) */
const neuralEdges = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,12],
  [1,7],[1,8],[2,7],[2,9],[3,8],[3,10],[4,9],[4,11],
  [5,10],[5,12],[6,11],[6,12],[1,3],[2,4],[5,3],[6,4],
];

function AIDevice() {
  return (
    <div className="relative" style={{ width: 340, height: 230 }}>
      {/* Ambient glow — the "room" responds */}
      <div className="absolute inset-0 ai-core-glow rounded-3xl" />

      {/* SVG Neural constellation */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 230" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#EC4899" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Orbital rings (concentric, pulsing) */}
        <circle cx="170" cy="115" r="35" fill="none" stroke="rgba(236,72,153,0.08)" strokeWidth="0.5" className="ai-ring" />
        <circle cx="170" cy="115" r="65" fill="none" stroke="rgba(236,72,153,0.06)" strokeWidth="0.5" className="ai-ring-2" />
        <circle cx="170" cy="115" r="95" fill="none" stroke="rgba(236,72,153,0.04)" strokeWidth="0.5" className="ai-ring-3" />

        {/* Connection lines — the synapses */}
        {neuralEdges.map(([a, b], i) => (
          <line key={i} x1={neuralNodes[a].x} y1={neuralNodes[a].y} x2={neuralNodes[b].x} y2={neuralNodes[b].y}
            stroke="rgba(236,72,153,0.08)" strokeWidth="0.5" />
        ))}

        {/* Data flow lines — animated dashes traveling the synapses */}
        {[0, 1, 2, 5, 6, 7].map((ei) => {
          const [a, b] = neuralEdges[ei];
          return (
            <line key={`f${ei}`} x1={neuralNodes[a].x} y1={neuralNodes[a].y} x2={neuralNodes[b].x} y2={neuralNodes[b].y}
              stroke="rgba(236,72,153,0.25)" strokeWidth="0.8" strokeDasharray="3 17"
              style={{ animation: `data-flow ${2 + ei * 0.3}s linear infinite` }} />
          );
        })}

        {/* Core glow */}
        <circle cx="170" cy="115" r="28" fill="url(#coreGlow)" />

        {/* Nodes — the neurons */}
        {neuralNodes.map((n, i) => (
          <g key={i}>
            {n.primary && <circle cx={n.x} cy={n.y} r="12" fill="rgba(236,72,153,0.1)" className="ai-ring" />}
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.primary ? "#EC4899" : "rgba(236,72,153,0.5)"} filter={n.primary ? "url(#softGlow)" : undefined} />
            {!n.primary && <circle cx={n.x} cy={n.y} r={n.r + 3} fill="none" stroke="rgba(236,72,153,0.06)" strokeWidth="0.3" />}
          </g>
        ))}
      </svg>

      {/* Orbiting particles — data in motion */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="ai-orbit-slow" style={{ width: 130, height: 130 }}>
          <div className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-[#EC4899] shadow-[0_0_4px_rgba(236,72,153,0.6)]" />
          <div className="absolute bottom-0 right-1/4 w-0.5 h-0.5 rounded-full bg-[#EC4899]/50" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="ai-orbit-med" style={{ width: 190, height: 190 }}>
          <div className="absolute top-2 right-4 w-0.5 h-0.5 rounded-full bg-[#3B82F6]" />
          <div className="absolute bottom-4 left-2 w-1 h-1 rounded-full bg-[#3B82F6]/40 shadow-[0_0_3px_rgba(59,130,246,0.4)]" />
        </div>
      </div>

      {/* Floating insight badges — ideas materializing */}
      <div className="absolute ai-badge rounded-lg px-2.5 py-1.5 ai-float" style={{ top: 12, left: 20 }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-[#EC4899] pulse-dot" />
          <span className="text-[7px] text-white font-semibold">Padrão detectado</span>
        </div>
      </div>

      <div className="absolute ai-badge rounded-lg px-2.5 py-1.5 ai-float-d1" style={{ top: 12, right: 15 }}>
        <div className="flex items-center gap-1.5">
          <Activity className="w-2.5 h-2.5 text-[#EC4899]" />
          <div>
            <span className="text-[7px] text-white font-bold block leading-none">94.2%</span>
            <span className="text-[5px] text-neutral-500">Acurácia</span>
          </div>
        </div>
      </div>

      <div className="absolute ai-badge rounded-lg px-2.5 py-1.5 ai-float-d2" style={{ bottom: 18, left: 15 }}>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-2.5 h-2.5 text-[#3B82F6]" />
          <div>
            <span className="text-[7px] text-white font-bold block leading-none">+45 leads</span>
            <span className="text-[5px] text-neutral-500">↗ +22% mês</span>
          </div>
        </div>
      </div>

      <div className="absolute ai-badge rounded-lg px-2.5 py-1.5 ai-float-d3" style={{ bottom: 18, right: 10 }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[7px] text-white font-semibold">Anomalia corrigida</span>
        </div>
      </div>

      {/* Center label — the identity */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center ai-float">
          <Brain className="w-4 h-4 text-[#EC4899] mx-auto mb-1 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
          <span className="text-[8px] text-[#EC4899]/70 uppercase tracking-[0.2em] font-bold">Processando</span>
        </div>
      </div>
    </div>
  );
}

const DEVICES = [LaptopDevice, IPhoneDevice, PanelDevice, AIDevice];

/* ═══════════════════════════════════════════
   METRIC BADGE
   ═══════════════════════════════════════════ */
function MetricBadge({ raw, label, delay }: { key?: React.Key; raw: string; label: string; delay: number }) {
  const { value, suffix } = parseMetric(raw);
  const { display, ref } = useCountUp(value, { duration: 1500, delay, suffix });
  return (
    <div className="flex flex-col items-center gap-1">
      <span ref={ref as React.RefObject<HTMLSpanElement>} className="text-[#C9A84C] text-2xl md:text-3xl font-bold tracking-tight">{display}</span>
      <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const isMobile = useIsMobile();

  /* Mouse parallax on card */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (cardRef.current) {
          const r = cardRef.current.getBoundingClientRect();
          cardRef.current.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
          cardRef.current.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
        }
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  /* Hero text fade — vanilla scroll */
  useEffect(() => {
    if (isMobile) return; // Mobile: no hero fade, hero is a separate section
    const heroEl = document.querySelector(".hero-text") as HTMLElement | null;
    const chevEl = document.querySelector(".hero-chev") as HTMLElement | null;
    const neuralEl = document.querySelector(".neural-bg") as HTMLElement | null;
    if (!heroEl) return;

    let pinActive = false;
    const onScroll = () => {
      if (pinActive) return;
      const sy = window.scrollY;
      if (sy > 500) { pinActive = true; heroEl.style.opacity = "0"; return; }
      const p = Math.min(sy / 350, 1);
      heroEl.style.opacity = String(1 - p);
      heroEl.style.transform = `scale(${1 + p * 0.08})`;
      heroEl.style.filter = `blur(${p * 12}px)`;
      if (chevEl) chevEl.style.opacity = String(Math.max(1 - p * 2, 0));
      if (neuralEl) neuralEl.style.opacity = String(0.25 * (1 - p));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  /* Mobile: auto-rotate devices every 3s */
  useEffect(() => {
    if (!isMobile) return;
    let current = 0;
    const slots = document.querySelectorAll(".device-slot");
    if (slots.length === 0) return;

    // Show first device
    slots.forEach((s, i) => {
      (s as HTMLElement).style.opacity = i === 0 ? "1" : "0";
      (s as HTMLElement).style.transition = "opacity 0.6s ease";
    });
    setActiveCard(0);

    const interval = setInterval(() => {
      const prev = current;
      current = (current + 1) % 4;
      (slots[prev] as HTMLElement).style.opacity = "0";
      (slots[current] as HTMLElement).style.opacity = "1";
      setActiveCard(current);
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile]);

  /* GSAP scroll timeline — DESKTOP ONLY */
  useEffect(() => {
    if (isMobile) return; // No GSAP pin on mobile
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set(".main-card", { y: window.innerHeight * 1.5, autoAlpha: 1 });
      gsap.set([".card-txt", ".mockup-wrap", ".pw", ".orb-card", ".orb-dot"], { autoAlpha: 0 });
      gsap.set(".cta-wrap", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      gsap.set(".device-slot", { autoAlpha: 0, scale: 0.9 });
      gsap.set(".device-slot-0", { autoAlpha: 1, scale: 1 });

      RINGS.forEach((ring, i) => {
        gsap.set(`.orb-ring-${i}`, { attr: { "stroke-dasharray": ring.da, "stroke-dashoffset": ring.da } });
      });
      gsap.set(".orb-line", { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: "+=4500", pin: true, scrub: 1, anticipatePin: 1 },
      });

      tl
        .to(".main-card", { y: 0, duration: 1.2, ease: "power3.inOut" })
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", duration: 0.8, ease: "power3.inOut" })
        .fromTo(".mockup-wrap", { y: 150, autoAlpha: 0, scale: 0.8 }, { y: 0, autoAlpha: 1, scale: 1, duration: 1.5, ease: "expo.out" }, "-=0.3")
        .to(".orb-ring-0, .orb-ring-1", { attr: { "stroke-dashoffset": 0 }, duration: 1.0, ease: "power2.inOut" }, "-=1.0")
        .to(".orb-line", { autoAlpha: 1, stagger: 0.04, duration: 0.5 }, "-=0.7")
        .fromTo(".orb-card", { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: 0.06, duration: 0.7, ease: "back.out(1.2)" }, "-=0.5")
        .fromTo(".orb-dot", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, stagger: 0.02, duration: 0.3, ease: "back.out(2)" }, "-=0.3")
        .fromTo(".card-txt", { x: -30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: "power4.out" }, "-=0.6")
        .add(() => setActiveCard(0), "-=0.4");

      /* Device transitions */
      for (let i = 0; i < 3; i++) {
        tl.to({}, { duration: 0.5 })
          .add(() => setActiveCard(i + 1))
          .to(`.device-slot-${i}`, { autoAlpha: 0, scale: 0.95, duration: 0.5, ease: "power2.inOut" })
          .fromTo(`.device-slot-${i + 1}`, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.inOut" }, "-=0.3");
      }

      tl.to({}, { duration: 0.8 }).add(() => setActiveCard(-1));

      /* CTA */
      tl.set(".hero-text", { autoAlpha: 0 }).set(".cta-wrap", { autoAlpha: 1 })
        .to({}, { duration: 0.3 })
        .to([".mockup-wrap", ".orb-card", ".card-txt"], { scale: 0.9, y: -30, autoAlpha: 0, duration: 0.8, ease: "power3.in", stagger: 0.03 })
        .to(".main-card", { width: "85vw", height: "85vh", borderRadius: "40px", duration: 1.2, ease: "expo.inOut" }, "pull")
        .to(".cta-wrap", { scale: 1, filter: "blur(0px)", duration: 1.2, ease: "expo.inOut" }, "pull")
        .to(".main-card", { y: -window.innerHeight - 300, duration: 0.8, ease: "power3.in" });

    }, containerRef);
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div ref={containerRef} className={`relative w-screen bg-[#080808] text-white font-sans antialiased ${isMobile ? "min-h-screen" : "h-screen overflow-hidden flex items-center justify-center"}`} style={{ perspective: "1500px" }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="neural-bg absolute inset-0 z-[1]">
        <NeuralBackground className="absolute inset-0" opacity={0.25} nodeCount={isMobile ? 20 : 55} connectionDist={160} color="201, 168, 76" />
      </div>
      {!isMobile && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] z-[2] pointer-events-none animate-spin" style={{ opacity: 0.03, animationDuration: "120s" }}>
          <Logo color="#C9A84C" />
        </div>
      )}
      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)" }} />

      {/* Hero Text — hidden on mobile (card is shown directly) */}
      <div className={`hero-text absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 will-change-transform pointer-events-none ${isMobile ? "hidden" : ""}`}>
        <span className="text-[#C9A84C] text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] mb-6 md:mb-8 block">Inteligência operacional aplicada</span>
        <h1 className="font-serif font-light text-white tracking-tight leading-[1.08] md:leading-[1.02] mb-6 md:mb-8" style={{ fontSize: "clamp(2.4rem, 6vw, 5.5rem)" }}>
          <span className="inline-block">Não vendemos sistema.</span><br />
          <span className="inline-block bg-gradient-to-r from-[#C9A84C] via-[#E5C05C] to-[#C9A84C] bg-clip-text text-transparent" style={{ backgroundSize: "200% auto", animation: "shimmer 3s linear 1.5s infinite" }}>Construímos o seu.</span>
        </h1>
        <p className="text-gray-300 text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12">Antes de qualquer linha de código, entendemos como sua empresa funciona. Depois, construímos a tecnologia que ela merece.</p>
        <div className="pointer-events-auto">
          <Link to="/contato-quiz" className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] text-black px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider hover:shadow-[0_8px_32px_rgba(201,168,76,0.4)] transition-all duration-300 min-h-[52px]" style={{ animation: "ctaPulse 2.5s ease-in-out infinite" }}>
            <MessageCircle size={16} /> Falar com especialista <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 md:gap-10 mt-14 md:mt-16">
          {metricsData.map((m, i) => <MetricBadge key={m.raw} raw={m.raw} label={m.label} delay={1500 + i * 150} />)}
        </div>
      </div>

      {/* Chevrons */}
      <div className={`hero-chev absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-0 ${isMobile ? "hidden" : ""}`}>
        {[0, 1, 2].map(i => <div key={i} style={{ animation: `chevronBob 1.5s ease-in-out ${i * 0.15}s infinite` }}><ChevronDown className="w-5 h-5 text-[#C9A84C]" strokeWidth={1.5} /></div>)}
      </div>

      {/* CTA */}
      <div className={`cta-wrap absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-auto will-change-transform ${isMobile ? "hidden" : ""}`}>
        <h2 className="font-serif font-light text-white tracking-tight mb-6" style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}>Vamos construir o seu.</h2>
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">Junte-se a mais de 50 empresas que transformaram seus processos com tecnologia sob medida.</p>
        <div className="flex flex-col sm:flex-row gap-5">
          <Link to="/contato-quiz" className="btn-gold group flex items-center justify-center gap-3 px-8 py-4 rounded-full">
            <MessageCircle size={18} /><span className="font-semibold text-sm uppercase tracking-wider">Falar com especialista</span><ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#cases" className="btn-dark group flex items-center justify-center gap-3 px-8 py-4 rounded-full">
            <span className="font-semibold text-sm uppercase tracking-wider text-white">Ver nossos cases</span><ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Dark Card */}
      <div className={`${isMobile ? "relative" : "absolute inset-0"} z-20 flex items-center justify-center ${isMobile ? "" : "pointer-events-none"}`} style={{ perspective: "1500px" }}>
        <div ref={cardRef} className={`main-card premium-depth-card relative overflow-hidden flex items-center justify-center pointer-events-auto ${isMobile ? "w-full min-h-screen" : "w-[85vw] h-[85vh] rounded-[40px]"}`}>
          <div className="card-sheen" aria-hidden="true" />
          <div className="relative w-full h-full max-w-7xl mx-auto px-2 md:px-4 lg:px-12 flex flex-col lg:flex-row items-center justify-center z-10 py-3 lg:py-0 gap-2 lg:gap-8">

            {/* Mobile service tabs — outside mockup-wrap, always on top */}
            <div className="svc-tab md:hidden flex items-center justify-center gap-3 shrink-0 order-1 z-30">
              {services.map((svc, i) => (
                <div key={svc.id} className={`svc-tab-item svc-tab-${i} flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300`} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <svc.Icon className="w-3.5 h-3.5" style={{ color: svc.color }} />
                </div>
              ))}
            </div>

            {/* Left text — desktop only */}
            <div className="card-txt hidden lg:flex flex-col justify-center text-left z-20 w-[28%] px-0 order-1">
              <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-2 lg:mb-5 tracking-tight">Inteligência operacional aplicada.</h3>
              <p className="text-gray-400 text-xs md:text-sm lg:text-base font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">A <span className="text-[#C9A84C] font-semibold">Inova</span> entende o processo, desenha a solução e entrega tecnologia que funciona desde o dia 1.</p>
            </div>

            {/* Devices + orbitals */}
            <div className="mockup-wrap order-2 lg:order-2 relative w-full lg:w-[72%] h-[70vh] md:h-[380px] lg:h-[600px] flex items-center justify-center z-10">
              {/* SVG orbitals */}
              <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                {RINGS.map((r, i) => <circle key={i} className={`orb-ring-${i}`} cx={CTR.x} cy={CTR.y} r={r.r} fill="none" stroke="rgba(201,168,76,0.10)" strokeWidth="1" />)}
                {ENDS.map((ep, i) => <line key={i} className="orb-line" x1={CTR.x} y1={CTR.y} x2={ep.x} y2={ep.y} stroke="rgba(201,168,76,0.12)" strokeWidth="1" strokeDasharray="6 4" />)}
                {ENDS.flatMap((ep, i) => lineDots(ep.x, ep.y).map((d, j) => <circle key={`${i}-${j}`} className="orb-dot" cx={d.x} cy={d.y} r="2.5" fill="#C9A84C" opacity="0.45" />))}
              </svg>
              {/* Device slots */}
              <div className="relative z-10 flex items-center justify-center transform scale-[0.85] md:scale-[0.8] lg:scale-100">
                {DEVICES.map((Device, i) => (
                  <div key={i} className={`device-slot device-slot-${i} ${i > 0 ? "absolute" : ""}`}>
                    <Device />
                  </div>
                ))}
              </div>
              {/* Orbital cards */}
              {services.map((svc, i) => (
                <div key={svc.id} className={`orb-card orb-card-${i} hidden md:block absolute orbital-svc rounded-lg lg:rounded-xl z-20`} style={{ ...cardPos[i], borderLeft: `3px solid ${svc.color}`, "--svc-color": svc.color } as React.CSSProperties}>
                  <div className="p-2 lg:p-3">
                    <div className="flex items-center gap-1.5 lg:gap-2 mb-0.5">
                      <svc.Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" style={{ color: svc.color }} />
                      <span className="text-white text-xs lg:text-sm font-bold tracking-tight">{svc.title}</span>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-1.5">
                      <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full shrink-0" style={{ backgroundColor: svc.color }} />
                      <span className="text-gray-400 text-[9px] lg:text-[11px]">{svc.sub}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA — below the card, always visible */}
      {isMobile && (
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 bg-[#080808]">
          <h2 className="font-serif font-light text-white tracking-tight mb-6" style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}>Vamos construir o seu.</h2>
          <p className="text-gray-400 text-base mb-8 max-w-sm mx-auto font-light leading-relaxed">Junte-se a mais de 50 empresas que transformaram seus processos com tecnologia sob medida.</p>
          <Link to="/contato-quiz" className="btn-gold group flex items-center justify-center gap-3 px-8 py-4 rounded-full">
            <MessageCircle size={18} /><span className="font-semibold text-sm uppercase tracking-wider">Falar com especialista</span><ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}

function setActiveCard(index: number) {
  /* Desktop orbital cards */
  document.querySelectorAll(".orb-card").forEach((el, i) => {
    el.classList.remove("orb-active", "orb-dim");
    if (index === -1) return;
    if (i === index) el.classList.add("orb-active");
    else el.classList.add("orb-dim");
  });
  /* Mobile service tabs */
  document.querySelectorAll(".svc-tab-item").forEach((el, i) => {
    const tab = el as HTMLElement;
    if (index === -1) {
      tab.style.background = "rgba(255,255,255,0.04)";
      tab.style.borderColor = "rgba(255,255,255,0.06)";
      tab.style.transform = "scale(1)";
      tab.style.boxShadow = "none";
    } else if (i === index) {
      const color = services[i].color;
      tab.style.background = `${color}20`;
      tab.style.borderColor = `${color}50`;
      tab.style.transform = "scale(1.15)";
      tab.style.boxShadow = `0 0 12px ${color}30`;
    } else {
      tab.style.background = "rgba(255,255,255,0.02)";
      tab.style.borderColor = "rgba(255,255,255,0.03)";
      tab.style.transform = "scale(0.9)";
      tab.style.boxShadow = "none";
    }
  });
}
