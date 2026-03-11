import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw2JxsckTXUGllEs31QQobuTXaI3Dbf4EBsm4mWVHbsMjWlOf1ocH0snu2VF7mcjuSL7Q/exec';

const ContactQuizPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [answers, setAnswers] = useState({
    servico: [] as string[],
    tamanho: '',
    faturamento: '',
    budget: '',
    status: '',
    descricao: '',
    nome: '',
    empresa: '',
    whatsapp: '',
    email: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const totalSteps = 5;
  const progress = ((currentStep - 1) / totalSteps) * 100;

  const selectOption = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (value: string) => {
    setAnswers(prev => {
      const current = prev.servico as string[];
      const isSelected = current.includes(value);
      let next;
      if (isSelected) {
        next = current.filter(s => s !== value);
      } else {
        if (value === 'Ainda não sei') {
          next = ['Ainda não sei'];
        } else {
          next = [...current.filter(s => s !== 'Ainda não sei'), value];
        }
      }
      return { ...prev, servico: next };
    });
  };

  const goNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldMap: { [key: string]: string } = {
      fNome: 'nome',
      fEmpresa: 'empresa',
      fWhats: 'whatsapp',
      fEmail: 'email',
      outBudgetDesc: 'descricao'
    };
    setAnswers(prev => ({ ...prev, [fieldMap[id]]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return answers.servico.length > 0;
      case 2: return !!answers.tamanho;
      case 3: return !!answers.faturamento;
      case 4: return !!answers.budget;
      case 5: return !!answers.nome && !!answers.empresa && !!answers.whatsapp && !!answers.email;
      default: return false;
    }
  };

  const checkBudgetStatus = (budget: string) => {
    const services = answers.servico as string[];
    const isOnlyAutomacao = services.length === 1 && services[0] === 'Automações';
    const isOut = (isOnlyAutomacao && budget === 'Menos de R$3.000') ||
                  (!isOnlyAutomacao && budget === 'Menos de R$10.000');
    
    setAnswers(prev => ({
      ...prev,
      budget,
      status: isOut ? 'Fora do perfil — análise manual' : 'Lead qualificado'
    }));
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...answers,
        servico: Array.isArray(answers.servico) ? answers.servico.join(', ') : answers.servico
      };
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('Erro ao enviar. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#FAFAF8] font-body flex items-center justify-center p-8">
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,#0e0c08_0%,#080808_70%)]" />
        <div className="relative z-10 max-w-[680px] w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start"
          >
            <div className="w-14 h-14 border border-[#C9A84C] flex items-center justify-center mb-8">
              <Check className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <h2 className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-[1.1] tracking-tight mb-4">
              {answers.status === 'Fora do perfil — análise manual' ? (
                <>Mensagem <em>recebida!</em></>
              ) : (
                <>Recebemos suas <em>informações!</em></>
              )}
            </h2>
            <p className="text-base font-light leading-relaxed text-white/55 max-w-[480px]">
              {answers.status === 'Fora do perfil — análise manual' 
                ? 'Recebemos sua descrição e nosso time vai analisar com cuidado. Entraremos em contato em breve para entender melhor como podemos ajudar.'
                : 'Nossa equipe vai analisar o seu perfil e entrar em contato em breve pelo WhatsApp ou e-mail informado. Obrigado pelo interesse na Inova Digital.'
              }
            </p>
            <Link to="/" className="mt-12 text-[11px] uppercase tracking-widest text-[#C9A84C] hover:text-[#E8C97A] transition-colors flex items-center gap-2">
              <ArrowLeft className="w-3 h-3" /> Voltar para o início
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#FAFAF8] font-body flex items-center justify-center p-8 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,#0e0c08_0%,#080808_70%)]" />
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Progress & Step Label - Positioned below the main Navbar */}
      <div className="fixed top-[100px] left-0 right-0 z-[90] h-0.5 bg-white/5">
        <motion.div 
          className="h-full bg-[#C9A84C]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="fixed top-[115px] right-6 md:right-12 text-[10px] uppercase tracking-[0.2em] text-white/30 z-[90]">
        Passo {currentStep} de {totalSteps}
      </div>

      <div className="relative z-10 w-full max-w-[680px] py-20">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#C9A84C]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]">Vamos começar</span>
              </div>
              <h2 className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-[1.1] tracking-tight mb-3">O que você <em>precisa?</em></h2>
              <p className="text-sm font-light text-white/40 mb-11 leading-relaxed">Selecione o tipo de solução que melhor se encaixa no seu objetivo.</p>
              
                {/* Step 1 Options */}
                {[
                  { label: 'Aplicação Web', desc: 'Sistemas, plataformas, e-commerce, portais e dashboards' },
                  { label: 'Aplicativo Mobile', desc: 'Apps para iOS e Android — corporativo, cliente ou produto' },
                  { label: 'Inteligência Artificial', desc: 'IA integrada ao seu negócio, assistentes e automação inteligente' },
                  { label: 'Automações', desc: 'Fluxos automáticos, integrações entre sistemas e APIs' },
                  { label: 'Ainda não sei', desc: 'Preciso de orientação para entender o melhor caminho' }
                ].map((opt) => {
                  const isSelected = answers.servico.includes(opt.label);
                  return (
                    <button 
                      key={opt.label}
                      onClick={() => toggleService(opt.label)}
                      className={`group relative flex items-center gap-4 p-5 px-7 text-left border transition-all duration-300 ${
                        isSelected 
                        ? 'bg-[#C9A84C]/10 border-[#C9A84C]/50' 
                        : 'bg-white/[0.03] border-white/[0.07] hover:bg-[#C9A84C]/5 hover:border-[#C9A84C]/25'
                      }`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9A84C] transition-transform duration-400 origin-top ${isSelected ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-white/20'}`}>
                        <Check className={`w-2.5 h-2.5 text-[#080808] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                      </div>
                      <div>
                        <div className="font-display text-sm font-semibold tracking-tight">{opt.label}</div>
                        <div className="text-[11px] font-light text-white/40 mt-0.5">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}

              <div className="flex items-center justify-between mt-10">
                <div />
                <button 
                  onClick={goNext}
                  disabled={!isStepValid()}
                  className="font-display text-[11px] font-bold tracking-widest uppercase text-[#080808] bg-[#C9A84C] px-10 py-4 flex items-center gap-3 hover:bg-[#E8C97A] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  Continuar <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#C9A84C]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]">Seu negócio</span>
              </div>
              <h2 className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-[1.1] tracking-tight mb-3">Qual o tamanho da <em>sua empresa?</em></h2>
              <p className="text-sm font-light text-white/40 mb-11 leading-relaxed">Isso nos ajuda a entender o contexto e o escopo do projeto.</p>
              
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Empreendedor Solo / MEI', desc: '' },
                  { label: 'Pequena empresa', desc: 'Até 20 funcionários' },
                  { label: 'Média empresa', desc: '20 a 100 funcionários' },
                  { label: 'Grande empresa', desc: 'Mais de 100 funcionários' }
                ].map((opt) => (
                  <button 
                    key={opt.label}
                    onClick={() => selectOption('tamanho', opt.label)}
                    className={`group relative flex items-center gap-4 p-5 px-7 text-left border transition-all duration-300 ${
                      answers.tamanho === opt.label 
                      ? 'bg-[#C9A84C]/10 border-[#C9A84C]/50' 
                      : 'bg-white/[0.03] border-white/[0.07] hover:bg-[#C9A84C]/5 hover:border-[#C9A84C]/25'
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9A84C] transition-transform duration-400 origin-top ${answers.tamanho === opt.label ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${answers.tamanho === opt.label ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-white/20'}`}>
                      <Check className={`w-2.5 h-2.5 text-[#080808] transition-opacity ${answers.tamanho === opt.label ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                    </div>
                    <div>
                      <div className="font-display text-sm font-semibold tracking-tight">{opt.label}</div>
                      {opt.desc && <div className="text-[11px] font-light text-white/40 mt-0.5">{opt.desc}</div>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-10">
                <button onClick={goBack} className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <button 
                  onClick={goNext}
                  disabled={!isStepValid()}
                  className="font-display text-[11px] font-bold tracking-widest uppercase text-[#080808] bg-[#C9A84C] px-10 py-4 flex items-center gap-3 hover:bg-[#E8C97A] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  Continuar <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#C9A84C]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]">Seu negócio</span>
              </div>
              <h2 className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-[1.1] tracking-tight mb-3">Qual o faturamento <em>mensal aproximado?</em></h2>
              <p className="text-sm font-light text-white/40 mb-11 leading-relaxed">Informação confidencial, usada apenas para entender o momento do seu negócio.</p>
              
              <div className="flex flex-col gap-2.5">
                {[
                  'Até R$20 mil',
                  'R$20 mil a R$100 mil',
                  'R$100 mil a R$500 mil',
                  'Acima de R$500 mil'
                ].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => selectOption('faturamento', opt)}
                    className={`group relative flex items-center gap-4 p-5 px-7 text-left border transition-all duration-300 ${
                      answers.faturamento === opt 
                      ? 'bg-[#C9A84C]/10 border-[#C9A84C]/50' 
                      : 'bg-white/[0.03] border-white/[0.07] hover:bg-[#C9A84C]/5 hover:border-[#C9A84C]/25'
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9A84C] transition-transform duration-400 origin-top ${answers.faturamento === opt ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${answers.faturamento === opt ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-white/20'}`}>
                      <Check className={`w-2.5 h-2.5 text-[#080808] transition-opacity ${answers.faturamento === opt ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                    </div>
                    <div>
                      <div className="font-display text-sm font-semibold tracking-tight">{opt}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-10">
                <button onClick={goBack} className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <button 
                  onClick={goNext}
                  disabled={!isStepValid()}
                  className="font-display text-[11px] font-bold tracking-widest uppercase text-[#080808] bg-[#C9A84C] px-10 py-4 flex items-center gap-3 hover:bg-[#E8C97A] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  Continuar <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#C9A84C]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]">Seu projeto</span>
              </div>
              <h2 className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-[1.1] tracking-tight mb-3">Qual o <em>budget disponível</em> para esse projeto?</h2>
              <p className="text-sm font-light text-white/40 mb-11 leading-relaxed">Isso nos permite sugerir a solução mais adequada ao seu momento.</p>
              
              <div className="flex flex-col gap-2.5">
                {(() => {
                  const services = answers.servico as string[];
                  const isOnlyAutomacao = services.length === 1 && services[0] === 'Automações';
                  
                  if (isOnlyAutomacao) {
                    return ['Menos de R$3.000', 'R$3.000 a R$10.000', 'R$10.000 a R$30.000', 'R$30.000 a R$100.000', 'Acima de R$100.000'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => checkBudgetStatus(opt)}
                        className={`group relative flex items-center gap-4 p-5 px-7 text-left border transition-all duration-300 ${
                          answers.budget === opt 
                          ? 'bg-[#C9A84C]/10 border-[#C9A84C]/50' 
                          : 'bg-white/[0.03] border-white/[0.07] hover:bg-[#C9A84C]/5 hover:border-[#C9A84C]/25'
                        }`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9A84C] transition-transform duration-400 origin-top ${answers.budget === opt ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${answers.budget === opt ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-white/20'}`}>
                          <Check className={`w-2.5 h-2.5 text-[#080808] transition-opacity ${answers.budget === opt ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                        </div>
                        <div className="font-display text-sm font-semibold tracking-tight">{opt}</div>
                      </button>
                    ));
                  } else {
                    return ['Menos de R$10.000', 'R$10.000 a R$30.000', 'R$30.000 a R$100.000', 'Acima de R$100.000'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => checkBudgetStatus(opt)}
                        className={`group relative flex items-center gap-4 p-5 px-7 text-left border transition-all duration-300 ${
                          answers.budget === opt 
                          ? 'bg-[#C9A84C]/10 border-[#C9A84C]/50' 
                          : 'bg-white/[0.03] border-white/[0.07] hover:bg-[#C9A84C]/5 hover:border-[#C9A84C]/25'
                        }`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9A84C] transition-transform duration-400 origin-top ${answers.budget === opt ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${answers.budget === opt ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-white/20'}`}>
                          <Check className={`w-2.5 h-2.5 text-[#080808] transition-opacity ${answers.budget === opt ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                        </div>
                        <div className="font-display text-sm font-semibold tracking-tight">{opt}</div>
                      </button>
                    ));
                  }
                })()}
              </div>

              {answers.status === 'Fora do perfil — análise manual' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 space-y-5"
                >
                  <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 p-5 px-6">
                    <p className="text-sm font-light leading-relaxed text-white/65">
                      {(() => {
                        const services = answers.servico as string[];
                        const isOnlyAutomacao = services.length === 1 && services[0] === 'Automações';
                        if (isOnlyAutomacao) {
                          return <>O investimento mínimo para <strong>Automações</strong> é de <strong>R$3.000</strong>. Mas não se preocupe — conte-nos o que você precisa e vamos avaliar.</>;
                        } else {
                          return <>O investimento mínimo para <strong>Aplicações Web, Mobile e IA</strong> é de <strong>R$10.000</strong>. Mas não se preocupe — conte-nos o que você precisa e vamos avaliar.</>;
                        }
                      })()}
                    </p>
                  </div>
                  <textarea 
                    id="outBudgetDesc"
                    value={answers.descricao}
                    onChange={handleInputChange}
                    placeholder="Descreva brevemente o que você precisa e qual é o seu contexto. Vamos analisar e entrar em contato..."
                    className="w-full h-36 bg-white/[0.03] border border-white/10 p-5 px-6 text-white font-body text-sm font-light leading-relaxed resize-none outline-none focus:border-[#C9A84C]/40 transition-colors placeholder:text-white/25"
                  />
                </motion.div>
              )}

              <div className="flex items-center justify-between mt-10">
                <button onClick={goBack} className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <button 
                  onClick={goNext}
                  disabled={!isStepValid()}
                  className="font-display text-[11px] font-bold tracking-widest uppercase text-[#080808] bg-[#C9A84C] px-10 py-4 flex items-center gap-3 hover:bg-[#E8C97A] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  Continuar <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div key="step5" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#C9A84C]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]">Quase lá</span>
              </div>
              <h2 className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-[1.1] tracking-tight mb-3">Como podemos <em>te contatar?</em></h2>
              <p className="text-sm font-light text-white/40 mb-11 leading-relaxed">Preencha seus dados para finalizarmos e entrarmos em contato.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Nome completo</label>
                  <input id="fNome" value={answers.nome} onChange={handleInputChange} type="text" placeholder="Seu nome" className="bg-white/[0.03] border border-white/10 border-b-white/20 p-4 px-5 text-white font-body text-sm font-light outline-none focus:border-[#C9A84C]/40 focus:bg-[#C9A84C]/5 transition-all placeholder:text-white/20 w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Empresa</label>
                  <input id="fEmpresa" value={answers.empresa} onChange={handleInputChange} type="text" placeholder="Nome da empresa" className="bg-white/[0.03] border border-white/10 border-b-white/20 p-4 px-5 text-white font-body text-sm font-light outline-none focus:border-[#C9A84C]/40 focus:bg-[#C9A84C]/5 transition-all placeholder:text-white/20 w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">WhatsApp</label>
                  <input id="fWhats" value={answers.whatsapp} onChange={handleInputChange} type="tel" placeholder="(00) 00000-0000" className="bg-white/[0.03] border border-white/10 border-b-white/20 p-4 px-5 text-white font-body text-sm font-light outline-none focus:border-[#C9A84C]/40 focus:bg-[#C9A84C]/5 transition-all placeholder:text-white/20 w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">E-mail</label>
                  <input id="fEmail" value={answers.email} onChange={handleInputChange} type="email" placeholder="seu@email.com" className="bg-white/[0.03] border border-white/10 border-b-white/20 p-4 px-5 text-white font-body text-sm font-light outline-none focus:border-[#C9A84C]/40 focus:bg-[#C9A84C]/5 transition-all placeholder:text-white/20 w-full" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-10">
                <button onClick={goBack} className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <button 
                  onClick={submitQuiz}
                  disabled={!isStepValid() || isSubmitting}
                  className="font-display text-[11px] font-bold tracking-widest uppercase text-[#080808] bg-[#C9A84C] px-12 py-4 flex items-center gap-3 hover:bg-[#E8C97A] transition-colors disabled:opacity-30 disabled:pointer-events-none min-w-[160px] justify-center"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Enviar <ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactQuizPage;
