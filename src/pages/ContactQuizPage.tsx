import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ArrowLeft, Check, Loader2,
  Globe, Smartphone, Brain, Zap, HelpCircle,
  User, Users, Building2, TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL || '';

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface CardOpt { label: string; desc: string; Icon: React.ElementType; wide?: boolean; }
interface Answers {
  servico: string[]; tamanho: string; faturamento: string; budget: string;
  status: string; descricao: string; nome: string; empresa: string;
  whatsapp: string; email: string;
}

const SERVICES: CardOpt[] = [
  { label: 'Aplicação Web',           desc: 'Sistemas, plataformas, portais e dashboards',   Icon: Globe },
  { label: 'Aplicativo Mobile',        desc: 'Apps iOS e Android — corporativo ou produto',   Icon: Smartphone },
  { label: 'Inteligência Artificial',  desc: 'IA integrada, assistentes e automação',         Icon: Brain },
  { label: 'Automações',               desc: 'Fluxos automáticos, integrações e APIs',        Icon: Zap },
  { label: 'Ainda não sei',            desc: 'Preciso de orientação para o melhor caminho',   Icon: HelpCircle, wide: true },
];

const SIZES: CardOpt[] = [
  { label: 'Solo / MEI',       desc: 'Você decide tudo',          Icon: User },
  { label: 'Pequena empresa',  desc: 'Até 20 funcionários',        Icon: Users },
  { label: 'Média empresa',    desc: '20 a 100 funcionários',      Icon: Building2 },
  { label: 'Grande empresa',   desc: 'Mais de 100 funcionários',   Icon: TrendingUp },
];

const REVENUE = ['Até R$20 mil', 'R$20 mil a R$100 mil', 'R$100 mil a R$500 mil', 'Acima de R$500 mil'];
const B_FULL  = ['Menos de R$10.000', 'R$10.000 a R$30.000', 'R$30.000 a R$100.000', 'Acima de R$100.000'];
const B_AUTO  = ['Menos de R$3.000', 'R$3.000 a R$10.000', 'R$10.000 a R$30.000', 'R$30.000 a R$100.000', 'Acima de R$100.000'];

// Ambient orb per step — sizes clamped for mobile
const ORB_DATA = [
  { color: 'rgba(201,168,76,0.12)',  x: '70%',  y: '-5%',  desktop: 700, mobile: 350 },
  { color: 'rgba(59,130,246,0.09)',  x: '15%',  y: '58%',  desktop: 580, mobile: 300 },
  { color: 'rgba(16,185,129,0.08)', x: '74%',  y: '68%',  desktop: 620, mobile: 320 },
  { color: 'rgba(201,168,76,0.11)', x: '28%',  y: '22%',  desktop: 660, mobile: 340 },
  { color: 'rgba(139,92,246,0.09)', x: '64%',  y: '44%',  desktop: 640, mobile: 330 },
];
function getOrb(step: number, isMobile: boolean) {
  const d = ORB_DATA[(step - 1) % ORB_DATA.length];
  return { color: d.color, x: d.x, y: d.y, size: isMobile ? d.mobile : d.desktop };
}

// ─── Shared layout pieces ─────────────────────────────────────────────────────

function Overline({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <div className="w-6 h-px bg-[#C9A84C]" />
      <span className="text-[10px] uppercase tracking-[0.34em] text-[#C9A84C] font-medium">{label}</span>
    </div>
  );
}

function Question({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-serif font-light leading-[1.06] tracking-tight text-[#FAFAF8] mb-3"
      style={{ fontSize: 'clamp(2rem, 4.2vw, 3.4rem)' }}
    >
      {children}
    </h2>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-light text-white/40 mb-10 leading-relaxed max-w-[560px]">{children}</p>
  );
}

// ─── ServiceCard ──────────────────────────────────────────────────────────────

function ServiceCard({
  item, isSelected, onClick, horizontal = false,
}: { item: CardOpt; isSelected: boolean; onClick: () => void; horizontal?: boolean }) {
  const { label, desc, Icon } = item;
  return (
    <button
      onClick={onClick}
      className={`
        group relative text-left border transition-all duration-300 active:scale-[0.98]
        ${horizontal ? 'flex flex-row items-center gap-5 px-6 py-5' : 'flex flex-col gap-4 p-6'}
        ${isSelected
          ? 'bg-[#C9A84C]/[0.08] border-[#C9A84C]/50 shadow-[0_0_40px_-12px_rgba(201,168,76,0.3)]'
          : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15]'
        }
      `}
    >
      {/* Left accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/60 to-transparent
                   transition-transform duration-500 origin-top"
        style={{ transform: isSelected ? 'scaleY(1)' : 'scaleY(0)' }}
      />

      {/* Icon */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300"
        style={{
          backgroundColor: isSelected ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.04)',
          borderColor:     isSelected ? 'rgba(201,168,76,0.45)' : 'rgba(255,255,255,0.08)',
        }}
      >
        <Icon
          size={18}
          className="transition-colors duration-300"
          style={{ color: isSelected ? '#C9A84C' : 'rgba(255,255,255,0.35)' }}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium tracking-tight transition-colors duration-300"
          style={{ color: isSelected ? '#C9A84C' : 'rgba(255,255,255,0.82)' }}
        >
          {label}
        </p>
        <p className="text-[11px] font-light text-white/30 mt-1 leading-snug">{desc}</p>
      </div>

      {/* Checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 440, damping: 24 }}
            className={`flex-shrink-0 w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center ${horizontal ? '' : 'self-end'}`}
          >
            <Check className="w-2.5 h-2.5 text-[#080808]" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── OptionCard ───────────────────────────────────────────────────────────────

function OptionCard({
  label, index, isSelected, onClick,
}: { label: string; index: number; isSelected: boolean; onClick: () => void }) {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center gap-5 px-6 py-5 text-left border transition-all duration-300 active:scale-[0.99]
        ${isSelected
          ? 'bg-[#C9A84C]/[0.08] border-[#C9A84C]/50'
          : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15]'
        }
      `}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/60 to-transparent
                   transition-transform duration-500 origin-top"
        style={{ transform: isSelected ? 'scaleY(1)' : 'scaleY(0)' }}
      />

      {/* Letter badge */}
      <div
        className="w-7 h-7 rounded border flex items-center justify-center flex-shrink-0 text-[10px] font-bold transition-all duration-300"
        style={{
          backgroundColor: isSelected ? '#C9A84C' : 'transparent',
          borderColor:     isSelected ? '#C9A84C' : 'rgba(255,255,255,0.12)',
          color:           isSelected ? '#080808' : 'rgba(255,255,255,0.22)',
        }}
      >
        {letters[index] ?? ''}
      </div>

      <span
        className="flex-1 text-[0.875rem] font-light tracking-tight transition-colors duration-300"
        style={{ color: isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)' }}
      >
        {label}
      </span>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 440, damping: 24 }}
            className="w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center flex-shrink-0"
          >
            <Check className="w-2.5 h-2.5 text-[#080808]" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── FloatingInput ────────────────────────────────────────────────────────────

function FloatingInput({
  id, label, type = 'text', value, onChange,
}: { id: string; label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative pt-2">
      <motion.label
        htmlFor={id}
        animate={{
          y:     lifted ? -22 : 0,
          scale: lifted ? 0.72 : 1,
        }}
        style={{ color: focused ? '#C9A84C' : 'rgba(255,255,255,0.30)' }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        className="absolute left-0 top-5 text-sm font-light origin-left pointer-events-none"
      >
        {label}
      </motion.label>

      <input
        id={id} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-8 pb-2 bg-transparent border-0 border-b text-white text-sm font-light outline-none transition-colors duration-300"
        style={{ borderBottomColor: focused ? '#C9A84C' : 'rgba(255,255,255,0.10)' }}
      />

      {/* Animated gold underline overlay */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-[#C9A84C]"
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0, width: '100%' }}
      />
    </div>
  );
}

// ─── NavRow ───────────────────────────────────────────────────────────────────

function NavRow({
  onBack, onNext, disabled, nextLabel = 'Continuar', isSubmitting = false,
}: {
  onBack: (() => void) | null; onNext: () => void;
  disabled: boolean; nextLabel?: string; isSubmitting?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-12">
      {onBack
        ? <button onClick={onBack}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/25 hover:text-white/55 transition-colors duration-200">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
          </button>
        : <div />
      }

      <button
        onClick={disabled ? undefined : onNext}
        disabled={disabled}
        className={`
          relative overflow-hidden text-[10px] font-bold tracking-[0.22em] uppercase
          px-10 py-[14px] flex items-center gap-2.5 min-w-[168px] justify-center
          transition-all duration-300 group
          ${disabled
            ? 'bg-[#C9A84C]/20 text-[#C9A84C]/30 cursor-not-allowed'
            : 'bg-[#C9A84C] text-[#080808] hover:bg-[#E0BB5E] hover:shadow-[0_0_40px_-8px_rgba(201,168,76,0.55)] cursor-pointer active:scale-[0.97]'
          }
        `}
      >
        {/* Shine sweep on hover */}
        {!disabled && (
          <span
            className="absolute inset-0 -skew-x-12 bg-white/20 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-500 pointer-events-none"
          />
        )}
        <span className="relative flex items-center gap-2.5">
          {isSubmitting
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <>{nextLabel} <ArrowRight className="w-3.5 h-3.5" /></>
          }
        </span>
      </button>
    </div>
  );
}

// ─── StepProgress ─────────────────────────────────────────────────────────────

function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="fixed top-[100px] left-0 right-0 z-[90] flex items-center justify-center pointer-events-none select-none">
      <div className="flex items-center">
        {Array.from({ length: total }, (_, i) => {
          const n      = i + 1;
          const done   = n < current;
          const active = n === current;
          return (
            <React.Fragment key={n}>
              {i > 0 && (
                <div
                  className="h-px transition-colors duration-500"
                  style={{ width: 36, backgroundColor: done ? 'rgba(201,168,76,0.45)' : 'rgba(255,255,255,0.07)' }}
                />
              )}
              <motion.div
                animate={{
                  width:  active ? 32 : 24,
                  height: active ? 32 : 24,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                className="rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-500"
                style={{
                  backgroundColor: active ? '#C9A84C' : 'transparent',
                  borderColor:     active ? '#C9A84C' : done ? 'rgba(201,168,76,0.40)' : 'rgba(255,255,255,0.10)',
                }}
              >
                {done
                  ? <Check className="w-2.5 h-2.5 text-[#C9A84C]" strokeWidth={3} />
                  : <span
                      className="text-[9px] font-bold tabular-nums"
                      style={{ color: active ? '#080808' : 'rgba(255,255,255,0.18)' }}
                    >
                      {String(n).padStart(2, '0')}
                    </span>
                }
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─── Validation helpers ──────────────────────────────────────────────────────

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidPhone = (phone: string) =>
  /^[\d\s()+-]{8,20}$/.test(phone.trim());

const sanitizeText = (text: string, maxLen = 200) =>
  text.replace(/[<>{}]/g, '').slice(0, maxLen).trim();

// ─── Main ─────────────────────────────────────────────────────────────────────

const ContactQuizPage = () => {
  const isMobileOrb = useIsMobile();
  const [step, setStep]     = useState(1);
  const [dir,  setDir]      = useState(1);
  const [busy, setBusy]     = useState(false);
  const [done, setDone]     = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [lastSubmit, setLastSubmit] = useState(0);
  const [ans,  setAns]      = useState<Answers>({
    servico: [], tamanho: '', faturamento: '', budget: '',
    status: '', descricao: '', nome: '', empresa: '', whatsapp: '', email: '',
  });

  const TOTAL = 5;
  const orb   = getOrb(step, isMobileOrb);

  const next = () => { setDir(1);  setStep(p => Math.min(p + 1, TOTAL)); window.scrollTo(0, 0); };
  const back = () => { setDir(-1); setStep(p => Math.max(p - 1, 1));     window.scrollTo(0, 0); };

  const set = (field: keyof Answers, val: string) =>
    setAns(p => ({ ...p, [field]: val }));

  const toggleSvc = (val: string) =>
    setAns(p => {
      const cur = p.servico;
      const has = cur.includes(val);
      const nxt = has ? cur.filter(s => s !== val)
        : val === 'Ainda não sei' ? ['Ainda não sei']
        : [...cur.filter(s => s !== 'Ainda não sei'), val];
      return { ...p, servico: nxt };
    });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const map: Record<string, keyof Answers> = {
      fNome: 'nome', fEmpresa: 'empresa', fWhats: 'whatsapp', fEmail: 'email', outDesc: 'descricao',
    };
    const field = map[e.target.id];
    if (!field) return;
    const maxLens: Partial<Record<keyof Answers, number>> = { nome: 100, empresa: 100, whatsapp: 20, email: 120, descricao: 500 };
    const val = sanitizeText(e.target.value, maxLens[field] ?? 200);
    setAns(p => ({ ...p, [field]: val }));
  };

  const checkBudget = (val: string) => {
    const onlyAuto = ans.servico.length === 1 && ans.servico[0] === 'Automações';
    const out = (onlyAuto && val === 'Menos de R$3.000') || (!onlyAuto && val === 'Menos de R$10.000');
    setAns(p => ({ ...p, budget: val, status: out ? 'Fora do perfil — análise manual' : 'Lead qualificado' }));
  };

  const valid = () => {
    if (step === 1) return ans.servico.length > 0;
    if (step === 2) return !!ans.tamanho;
    if (step === 3) return !!ans.faturamento;
    if (step === 4) return !!ans.budget;
    if (step === 5) return !!ans.nome.trim() && !!ans.empresa.trim() && isValidPhone(ans.whatsapp) && isValidEmail(ans.email);
    return false;
  };

  const submit = async () => {
    // Anti-bot: honeypot field must be empty
    if (honeypot) return;
    // Rate limit: 30s between submissions
    const now = Date.now();
    if (now - lastSubmit < 30000) {
      alert('Aguarde alguns segundos antes de enviar novamente.');
      return;
    }
    // Final validation
    if (!isValidEmail(ans.email) || !isValidPhone(ans.whatsapp)) {
      alert('Verifique o e-mail e WhatsApp informados.');
      return;
    }
    setBusy(true);
    setLastSubmit(now);
    const controller = new AbortController();
    try {
      const payload = {
        ...ans,
        servico: ans.servico.join(', '),
        nome: ans.nome.trim(),
        empresa: ans.empresa.trim(),
        whatsapp: ans.whatsapp.trim(),
        email: ans.email.trim(),
      };
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      setDone(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      alert('Erro ao enviar. Verifique sua conexão e tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  // Directional page transition
  const pv = {
    initial: (d: number) => ({ opacity: 0, y: d * 32, scale: 0.97, filter: 'blur(8px)' }),
    animate: {
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
      transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] as number[] },
    },
    exit: (d: number) => ({
      opacity: 0, y: d * -18, scale: 1.02, filter: 'blur(6px)',
      transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as number[] },
    }),
  };

  const onlyAuto = ans.servico.length === 1 && ans.servico[0] === 'Automações';

  // ── Success screen ────────────────────────────────────────────────────────
  if (done) {
    const first     = ans.nome.split(' ')[0];
    const qualified = ans.status === 'Lead qualificado';

    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-8 overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)', filter: 'blur(50px)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-[540px] w-full text-center"
        >
          {/* Expanding rings + check */}
          <div className="flex justify-center mb-12">
            <div className="relative w-20 h-20">
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  initial={{ scale: 1, opacity: 0.35 }}
                  animate={{ scale: 2.4 + i * 0.65, opacity: 0 }}
                  transition={{ duration: 1.4 + i * 0.3, delay: 0.25 + i * 0.18 }}
                  className="absolute inset-0 rounded-full border border-[#C9A84C]/20"
                />
              ))}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.15, 1] }}
                transition={{ duration: 0.5, times: [0, 0.65, 1], delay: 0.1 }}
                className="absolute inset-0 rounded-full border border-[#C9A84C]/30 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.42 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(201,168,76,0.10)' }}
                >
                  <Check className="w-6 h-6 text-[#C9A84C]" strokeWidth={1.8} />
                </motion.div>
              </motion.div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}
            className="text-[10px] uppercase tracking-[0.36em] text-[#C9A84C] mb-5"
          >
            {qualified ? 'Lead confirmado' : 'Mensagem recebida'}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }}
            className="font-serif font-light leading-[1.1] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)' }}
          >
            {qualified ? <><em>Perfeito,</em> {first}.</> : <><em>Recebido,</em> {first}.</>}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }}
            className="text-white/45 font-light leading-relaxed mb-10 max-w-[420px] mx-auto"
          >
            {qualified
              ? 'Nossa equipe vai analisar seu perfil e entrar em contato pelo WhatsApp ou e-mail. Geralmente respondemos em menos de 24 horas.'
              : 'Recebemos sua mensagem e vamos analisar com atenção. Entraremos em contato em breve para entender como podemos ajudar.'
            }
          </motion.p>

          {qualified && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.84 }}
              className="mb-12 flex flex-col items-center gap-3"
            >
              <div className="h-px w-12 bg-white/[0.08] mb-1" />
              {['Revisamos seu perfil e necessidades', 'Montamos uma proposta personalizada', 'Agendamos uma conversa estratégica'].map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-white/35 text-sm font-light">
                  <span className="w-5 h-5 rounded-full border border-[#C9A84C]/25 text-[#C9A84C] text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
            <Link to="/"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#C9A84C]/55 hover:text-[#C9A84C] transition-colors duration-200"
            >
              <ArrowLeft className="w-3 h-3" /> Voltar para o início
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ── Quiz ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080808] text-[#FAFAF8] overflow-x-hidden">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_60%_at_50%_0%,#0d0a05_0%,#080808_50%)]" />
        <div className="absolute inset-0 opacity-[0.018]"
             style={{ backgroundImage: 'radial-gradient(circle,#C9A84C 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        {/* Orb — position shifts per step */}
        <motion.div
          animate={{ left: orb.x, top: orb.y }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: orb.size, height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 68%)`,
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* ── Progress ── */}
      <StepProgress current={step} total={TOTAL} />

      {/* ── Step counter ── */}
      <div className="fixed top-[106px] right-6 md:right-12 z-[90] text-[10px] tracking-[0.28em] text-white/20 uppercase select-none">
        {String(step).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 pt-40 pb-24">

        {/* Watermark number */}
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0 font-serif tabular-nums"
          style={{
            fontSize: 'clamp(80px, 22vw, 340px)',
            color: 'rgba(201,168,76,0.022)',
            lineHeight: 1,
            letterSpacing: '-0.05em',
          }}
        >
          {String(step).padStart(2, '0')}
        </div>

        <div className="w-full max-w-[800px] relative z-10">
          <AnimatePresence mode="wait" custom={dir}>

            {/* ══ STEP 1: Serviços ══ */}
            {step === 1 && (
              <motion.div key="s1" custom={dir} variants={pv} initial="initial" animate="animate" exit="exit"
                          className="flex flex-col">
                <Overline label="Vamos começar" />
                <Question>O que você <em>precisa?</em></Question>
                <Sub>Você pode selecionar mais de uma opção.</Sub>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {SERVICES.filter(s => !s.wide).map(svc => (
                    <ServiceCard key={svc.label} item={svc}
                      isSelected={ans.servico.includes(svc.label)}
                      onClick={() => toggleSvc(svc.label)} />
                  ))}
                </div>
                {SERVICES.filter(s => s.wide).map(svc => (
                  <ServiceCard key={svc.label} item={svc}
                    isSelected={ans.servico.includes(svc.label)}
                    onClick={() => toggleSvc(svc.label)} horizontal />
                ))}

                <NavRow onBack={null} onNext={next} disabled={!valid()} />
              </motion.div>
            )}

            {/* ══ STEP 2: Tamanho ══ */}
            {step === 2 && (
              <motion.div key="s2" custom={dir} variants={pv} initial="initial" animate="animate" exit="exit"
                          className="flex flex-col">
                <Overline label="Seu negócio" />
                <Question>Qual o tamanho da <em>sua empresa?</em></Question>
                <Sub>Isso nos ajuda a calibrar escopo e complexidade do projeto.</Sub>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SIZES.map(opt => (
                    <ServiceCard key={opt.label} item={opt}
                      isSelected={ans.tamanho === opt.label}
                      onClick={() => set('tamanho', opt.label)} />
                  ))}
                </div>

                <NavRow onBack={back} onNext={next} disabled={!valid()} />
              </motion.div>
            )}

            {/* ══ STEP 3: Faturamento ══ */}
            {step === 3 && (
              <motion.div key="s3" custom={dir} variants={pv} initial="initial" animate="animate" exit="exit"
                          className="flex flex-col">
                <Overline label="Seu negócio" />
                <Question>Qual o faturamento <em>mensal aproximado?</em></Question>
                <Sub>Confidencial — usamos apenas para entender o momento do seu negócio.</Sub>

                <div className="flex flex-col gap-2.5">
                  {REVENUE.map((opt, i) => (
                    <OptionCard key={opt} label={opt} index={i}
                      isSelected={ans.faturamento === opt}
                      onClick={() => set('faturamento', opt)} />
                  ))}
                </div>

                <NavRow onBack={back} onNext={next} disabled={!valid()} />
              </motion.div>
            )}

            {/* ══ STEP 4: Budget ══ */}
            {step === 4 && (
              <motion.div key="s4" custom={dir} variants={pv} initial="initial" animate="animate" exit="exit"
                          className="flex flex-col">
                <Overline label="Seu projeto" />
                <Question>Qual o <em>budget disponível</em> para esse projeto?</Question>
                <Sub>Isso nos permite sugerir a solução mais adequada ao seu momento.</Sub>

                <div className="flex flex-col gap-2.5">
                  {(onlyAuto ? B_AUTO : B_FULL).map((opt, i) => (
                    <OptionCard key={opt} label={opt} index={i}
                      isSelected={ans.budget === opt}
                      onClick={() => checkBudget(opt)} />
                  ))}
                </div>

                <AnimatePresence>
                  {ans.status === 'Fora do perfil — análise manual' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6 space-y-4"
                    >
                      <div className="relative p-5 pl-6 border border-[#C9A84C]/20 bg-[#C9A84C]/[0.04]">
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C9A84C] to-transparent" />
                        <p className="text-sm font-light leading-relaxed text-white/55">
                          {onlyAuto
                            ? <>O investimento mínimo para <strong className="text-white/75">Automações</strong> é de <strong className="text-white/75">R$3.000</strong>. Descreva o que precisa e vamos avaliar.</>
                            : <>O investimento mínimo para desenvolvimento é de <strong className="text-white/75">R$10.000</strong>. Conte-nos o que você precisa e vamos avaliar.</>
                          }
                        </p>
                      </div>
                      <textarea
                        id="outDesc" value={ans.descricao} onChange={handleInput}
                        placeholder="Descreva brevemente o que você precisa e seu contexto..."
                        className="w-full h-32 bg-white/[0.03] border border-white/[0.08] p-4 px-5
                                   text-white text-sm font-light leading-relaxed resize-none outline-none
                                   focus:border-[#C9A84C]/40 transition-colors duration-300 placeholder:text-white/20"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <NavRow onBack={back} onNext={next} disabled={!valid()} />
              </motion.div>
            )}

            {/* ══ STEP 5: Contato ══ */}
            {step === 5 && (
              <motion.div key="s5" custom={dir} variants={pv} initial="initial" animate="animate" exit="exit"
                          className="flex flex-col">
                <Overline label="Quase lá" />
                <Question>Como podemos <em>te contatar?</em></Question>
                <Sub>Seus dados são confidenciais e usados apenas para contato da nossa equipe.</Sub>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-10">
                  <FloatingInput id="fNome"    label="Nome completo" value={ans.nome}     onChange={handleInput} />
                  <FloatingInput id="fEmpresa" label="Empresa"       value={ans.empresa}  onChange={handleInput} />
                  <FloatingInput id="fWhats"   label="WhatsApp"  type="tel"   value={ans.whatsapp} onChange={handleInput} />
                  <FloatingInput id="fEmail"   label="E-mail"    type="email" value={ans.email}    onChange={handleInput} />
                </div>
                {/* Honeypot anti-bot field — hidden from users */}
                <input
                  type="text"
                  name="website_url"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                />

                {/* Answers summary */}
                <div className="border border-white/[0.06] bg-white/[0.015] p-5 mb-2">
                  <p className="text-[9px] uppercase tracking-[0.34em] text-white/25 mb-4">Resumo das suas respostas</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[
                      { label: 'Solução',     value: ans.servico.join(', ') || '—' },
                      { label: 'Empresa',     value: ans.tamanho    || '—' },
                      { label: 'Faturamento', value: ans.faturamento || '—' },
                      { label: 'Budget',      value: ans.budget      || '—' },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-[9px] uppercase tracking-[0.22em] text-white/22 mb-1">{item.label}</p>
                        <p className="text-[11px] text-white/50 font-light leading-snug">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <NavRow onBack={back} onNext={submit}
                        disabled={!valid() || busy}
                        nextLabel="Enviar" isSubmitting={busy} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ContactQuizPage;
