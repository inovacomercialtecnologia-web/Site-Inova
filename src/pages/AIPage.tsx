import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Monitor, Activity, MessageSquare, Zap, Database, Globe, ShoppingCart, Users, BarChart3, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';

const AIPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const revealVariants = {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
  };

  const revealLeft = {
    hidden: { opacity: 0, x: -48 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
  };

  const revealRight = {
    hidden: { opacity: 0, x: 48 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-[#080808] text-[#FAFAF8] font-sans overflow-x-hidden bg-grid-dark">
      {/* HERO */}
      <section className="relative min-h-[600px] h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_50%,_#0e0b08_0%,_#050505_70%)]" />
        <NeuralBackground opacity={0.55} />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#050505]/92 via-[#050505]/10 to-transparent bg-gradient-to-t from-[#050505]/85 to-transparent" />

        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute top-[110px] left-6 md:left-12 lg:left-24 z-[3] flex items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">O que fazemos</span>
          <span className="text-[#C9A84C]/60">/</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C]">Inteligência Artificial</span>
        </motion.div>

        {/* Side Label */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-[3] hidden md:flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#C9A84C] to-transparent" />
          <span className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.2em] text-white/20">Inteligência Artificial</span>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-[3] px-6 md:px-12 lg:px-24 pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="font-sans text-[clamp(2.4rem,5vw,4.8rem)] font-extrabold leading-[1] tracking-tighter mb-6"
          >
            Inteligência<br />
            <span className="text-[#C9A84C]">Artificial</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 1 }}
            className="text-base md:text-lg font-light text-white/60 max-w-[560px] leading-relaxed"
          >
            A Inteligência Artificial deixou de ser tendência e se tornou uma vantagem competitiva real. Integramos IA diretamente nas soluções do seu negócio.
          </motion.p>
        </div>

        {/* Scroll Cue */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-12 right-6 md:right-12 lg:right-24 z-[3] flex items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Scroll</span>
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
            <ArrowRight className="w-3 h-3 text-white/40 rotate-90" />
          </div>
        </motion.div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

      {/* IA QUE SE CONECTA SECTION - DARK */}
      <section className="bg-[#111111] py-24 md:py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-[1]">
          <motion.div 
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-9 h-px bg-[#C9A84C]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C]">A camada que potencializa tudo</span>
            </div>
            <h2 className="font-serif text-[clamp(2.4rem,4.5vw,4.4rem)] font-light leading-[1.05] tracking-tight mb-12">
              IA que se <em className="italic text-[#C9A84C]">conecta com tudo</em>
            </h2>
            <p className="text-lg font-light leading-relaxed text-white/60 max-w-[780px]">
              A Inteligência Artificial não é um produto isolado — ela é uma <strong className="text-white font-normal">camada que potencializa tudo que construímos</strong>. Integramos IA às aplicações web e mobile para criar experiências mais inteligentes e personalizadas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mt-20">
            {[
              { 
                num: "01", 
                icon: Monitor, 
                title: "IA em Aplicações Web & Mobile", 
                desc: "Integramos IA diretamente nos sistemas e apps do seu negócio, criando experiências personalizadas e recomendações inteligentes." 
              },
              { 
                num: "02", 
                icon: Activity, 
                title: "IA em Automações", 
                desc: "Fluxos automatizados que não apenas executam tarefas — eles aprendem, se adaptam e tomam decisões de forma autônoma." 
              },
              { 
                num: "03", 
                icon: MessageSquare, 
                title: "Assistentes & Bases de Conhecimento", 
                desc: "Desenvolvemos assistentes inteligentes capazes de atender, responder e operar em escala — permitindo interações 24h por dia." 
              }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-[#111111] p-14 relative overflow-hidden group hover:bg-[#161616] transition-colors duration-500"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                <span className="font-serif text-sm text-[#C9A84C] tracking-widest block mb-8">{pillar.num}</span>
                <div className="w-12 h-12 border border-[#C9A84C]/20 flex items-center justify-center mb-7 group-hover:border-[#C9A84C]/60 transition-colors">
                  <pillar.icon className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <h3 className="font-sans text-lg font-bold tracking-tight mb-5 leading-snug">{pillar.title}</h3>
                <p className="text-sm font-light leading-relaxed text-white/50 group-hover:text-white/75 transition-colors">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

      {/* ECOSYSTEM SECTION - WHITE */}
      <section className="bg-[#FAFAF8] text-[#1a1a1a] py-24 md:py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            variants={revealLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-px bg-[#C9A84C]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C]">Ecossistema integrado</span>
            </div>
            <h2 className="font-serif text-[clamp(2.2rem,3.5vw,3.6rem)] font-light leading-[1.05] tracking-tight">
              Uma inteligência<br />
              <em className="italic text-[#C9A84C] block">que permeia tudo</em>
            </h2>
            <p className="text-base font-light leading-relaxed text-[#1a1a1a]/60">
              A IA não substitui o que construímos — ela <strong className="text-[#1a1a1a] font-normal">amplifica</strong>. Cada solução que desenvolvemos pode ser potencializada com camadas de inteligência artificial.
            </p>
          </motion.div>

          <motion.div 
            variants={revealRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative h-[360px] flex items-center justify-center"
          >
            {/* Rings */}
            <div className="absolute w-[180px] h-[180px] border border-[#C9A84C]/10 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-[280px] h-[280px] border border-[#C9A84C]/5 rounded-full animate-[spin_35s_linear_infinite_reverse]" />
            <div className="absolute w-[360px] h-[360px] border border-[#C9A84C]/5 rounded-full animate-[spin_50s_linear_infinite]" />
            
            {/* Center Node */}
            <div className="absolute w-24 h-24 border border-[#C9A84C]/50 flex items-center justify-center bg-[#C9A84C]/5 z-[2]">
              <span className="font-sans text-[11px] font-extrabold tracking-widest text-[#C9A84C]">IA</span>
            </div>

            {/* Satellite Nodes */}
            {[
              { label: "Web Apps", pos: "top-0 left-1/2 -translate-x-1/2" },
              { label: "Mobile", pos: "top-1/2 right-0 -translate-y-1/2" },
              { label: "Automações", pos: "bottom-0 left-1/2 -translate-x-1/2" },
              { label: "Assistentes", pos: "top-1/2 left-0 -translate-y-1/2" },
              { label: "Analytics", pos: "top-[14%] right-[10%]" },
              { label: "CRM", pos: "bottom-[14%] right-[10%]" },
              { label: "E-commerce", pos: "bottom-[14%] left-[10%]" },
              { label: "ERP", pos: "top-[14%] left-[10%]" }
            ].map((sat, i) => (
              <div key={i} className={`absolute flex flex-col items-center gap-2 ${sat.pos}`}>
                <div className="w-2 h-2 bg-[#C9A84C] rounded-full opacity-50" />
                <span className="text-[9px] uppercase tracking-widest text-[#1a1a1a]/45 font-sans font-semibold whitespace-nowrap">{sat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

      {/* CAPABILITIES SECTION - DARK */}
      <section className="bg-[#080808] py-24 md:py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <motion.div 
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <blockquote className="font-serif text-[clamp(1.6rem,2.8vw,2.8rem)] font-light leading-tight tracking-tight text-white/35 italic">
              "O futuro não é sobre <em className="text-white not-italic">substituir pessoas</em> — é sobre dar à sua equipe uma <span className="text-[#C9A84C]">inteligência que nunca dorme</span>."
            </blockquote>
          </motion.div>

          <div className="flex flex-col gap-0.5 bg-white/5">
            {[
              { num: "01", title: "Personalização em Escala", desc: "Experiências únicas para cada usuário, geradas em tempo real com base em comportamento e dados." },
              { num: "02", title: "Decisões Automatizadas", desc: "Sistemas que analisam dados e tomam decisões operacionais de forma autônoma e precisa." },
              { num: "03", title: "Atendimento Inteligente", desc: "Assistentes com base de conhecimento que respondem, orientam e resolvem sem intervenção humana." },
              { num: "04", title: "Aprendizado Contínuo", desc: "Modelos que evoluem com o uso — quanto mais operam, mais precisos e eficientes se tornam." }
            ].map((row, i) => (
              <motion.div 
                key={i}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-[#080808] grid grid-cols-1 md:grid-cols-[60px_1fr_1fr] items-center gap-12 p-11 hover:bg-[#0e0e0e] border-l-2 border-transparent hover:border-[#C9A84C] transition-all duration-400"
              >
                <span className="font-serif text-xl text-[#C9A84C]/40 leading-none">{row.num}</span>
                <h4 className="font-sans text-base font-bold tracking-tight whitespace-nowrap">{row.title}</h4>
                <p className="text-sm font-light leading-relaxed text-white/40 hover:text-white/70 transition-colors">{row.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

      {/* CTA SECTION */}
      <section className="bg-[#080808] py-32 md:py-48 px-6 md:px-12 lg:px-24 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,_rgba(201,168,76,0.08)_0%,_transparent_65%)] pointer-events-none animate-pulse" />
        <motion.div 
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-[1]"
        >
          <h2 className="font-serif text-[clamp(2.4rem,4.5vw,4.8rem)] font-light leading-[1.05] tracking-tight mb-7">
            O futuro do seu negócio <em className="italic text-[#C9A84C]">começa agora</em>
          </h2>
          <p className="text-sm font-light text-white/40 mb-16">
            Fale com nossos especialistas e descubra como a IA pode transformar a sua operação.
          </p>
          <Link 
            to="/contato-quiz"
            className="inline-flex items-center gap-4 font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-[#080808] bg-[#C9A84C] px-12 py-5 hover:bg-[#E8C97A] transition-colors duration-300"
          >
            Iniciar conversa <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default AIPage;
