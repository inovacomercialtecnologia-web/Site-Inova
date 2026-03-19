import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Target, Users, Shield, Zap, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const revealVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="bg-[#080808] text-[#FAFAF8] font-sans overflow-x-hidden">
      <PageMeta title="Quem Somos" description="Estrategistas e engenheiros transformando negócios B2B com tecnologia de alta performance. Conheça a equipe Inova Systems Solutions." />

      {/* HERO SECTION - Editorial Style */}
      <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden px-6 md:px-12 lg:px-24 pt-24 pb-12">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_#1c160a_0%,_#080808_70%)]" />
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        
        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 text-center max-w-5xl"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C9A84C] text-[10px] md:text-[12px] font-bold uppercase tracking-[0.4em] mb-8 block"
          >
            Nossa Essência
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[clamp(1.6rem,6vw,6rem)] font-serif font-extrabold leading-[1.05] tracking-tighter mb-10 md:mb-16 uppercase"
          >
            Inova<span className="text-[#C9A84C]">.</span><br />
            <span className="font-light italic">Digital</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-xl font-light text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            Transformando inteligência operacional em tecnologia de alta performance para o mercado B2B.
          </motion.p>
        </motion.div>
      </section>

      {/* MANIFESTO SECTION */}
      <section className="py-16 md:py-32 px-6 md:px-12 lg:px-24 bg-white text-[#080808] relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-16 items-center">
          <div className="lg:col-span-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
            >
              <span className="text-[#C9A84C] text-[10px] font-black uppercase tracking-[0.3em] mb-6 block">O Manifesto</span>
              <h2 className="text-[clamp(1.6rem,5vw,3rem)] font-serif font-[200] leading-[1.2] tracking-tighter mb-10">
                Não somos apenas <br />
                <span className="italic font-[400] text-[#C9A84C]">desenvolvedores.</span>
              </h2>
            </motion.div>
          </div>
          <div className="lg:col-span-7">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="space-y-8"
            >
              <p className="text-base md:text-2xl font-light leading-relaxed text-gray-600">
                A Inova nasceu de uma frustração comum: ver empresas brilhantes presas a sistemas genéricos que engessam a operação em vez de impulsioná-la.
              </p>
              <p className="text-lg font-light leading-relaxed text-gray-500">
                Acreditamos que a tecnologia deve ser o reflexo fiel da estratégia de um negócio. Por isso, somos estrategistas antes de sermos programadores. Mapeamos processos, estruturamos metodologias e só então construímos o código que vai escalar sua visão.
              </p>
              <div className="pt-8 flex flex-wrap gap-6 md:gap-12">
                <div>
                  <div className="text-4xl font-bold text-[#C9A84C] mb-2">+50</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Projetos Entregues</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#C9A84C] mb-2">100%</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Foco em B2B</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#C9A84C] mb-2">24/7</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Monitoramento</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION - Technical Grid Style */}
      <section className="py-16 md:py-32 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-light opacity-[0.02] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12 md:mb-24">
            <motion.span 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.4em] mb-6 block"
            >
              Nossos Pilares
            </motion.span>
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="text-[clamp(1.5rem,4.5vw,2.6rem)] font-serif font-[200] leading-[1.2] tracking-tighter"
            >
              Valores que guiam cada <span className="italic text-[#C9A84C]">linha de código.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {[
              {
                icon: Target,
                title: "Precisão Técnica",
                desc: "Não aceitamos o 'funciona'. Buscamos a excelência na arquitetura, segurança e performance de cada solução."
              },
              {
                icon: Users,
                title: "Parceria Estratégica",
                desc: "Não somos fornecedores, somos parceiros. O sucesso do seu negócio é o único KPI que realmente importa para nós."
              },
              {
                icon: Zap,
                title: "Inovação com Propósito",
                desc: "Usamos IA e automação não porque é tendência, mas porque gera ROI real e libera o potencial humano da sua equipe."
              },
              {
                icon: Shield,
                title: "Segurança de Dados",
                desc: "Sua operação é seu maior ativo. Protegemos cada bit de informação com as tecnologias mais robustas do mercado."
              },
              {
                icon: Globe,
                title: "Escalabilidade Global",
                desc: "Construímos sistemas prontos para crescer. Do primeiro usuário ao milhão, sua infraestrutura estará pronta."
              },
              {
                icon: Cpu,
                title: "Inteligência Aplicada",
                desc: "Transformamos dados brutos em dashboards inteligentes que permitem decisões baseadas em fatos, não em achismos."
              }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-[#0A0A0A] p-6 md:p-12 group hover:bg-[#111111] transition-colors duration-500"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-8 group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C]/5 transition-all duration-500">
                  <value.icon className="w-5 h-5 text-white/40 group-hover:text-[#C9A84C] transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-[#C9A84C] transition-colors">{value.title}</h3>
                <p className="text-sm font-light leading-relaxed text-white/40 group-hover:text-white/60 transition-colors">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION - Abstract/Modern */}
      <section className="py-16 md:py-32 px-6 md:px-12 lg:px-24 bg-white text-[#080808]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
            >
              <span className="text-[#C9A84C] text-[10px] font-black uppercase tracking-[0.3em] mb-6 block">O Time</span>
              <h2 className="text-[clamp(1.6rem,5vw,3rem)] font-serif font-[200] leading-[1.2] tracking-tighter mb-10">
                Estrategistas e <br />
                <span className="italic font-[400] text-[#C9A84C]">Engenheiros.</span>
              </h2>
              <p className="text-base font-light leading-relaxed text-gray-500 mb-12">
                Nossa equipe é formada por especialistas que transitam entre o mundo dos negócios e o mundo da tecnologia. Entendemos de balanço patrimonial tanto quanto entendemos de algoritmos de IA.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 border border-gray-100 rounded-2xl hover:border-[#C9A84C]/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#C9A84C]">ES</div>
                  <div>
                    <div className="font-bold mb-1">Estrategistas de Negócios</div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest">Mapeamento & ROI</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 border border-gray-100 rounded-2xl hover:border-[#C9A84C]/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#C9A84C]">SE</div>
                  <div>
                    <div className="font-bold mb-1">Software Engineers</div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest">Arquitetura & Performance</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 border border-gray-100 rounded-2xl hover:border-[#C9A84C]/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#C9A84C]">AI</div>
                  <div>
                    <div className="font-bold mb-1">Especialistas em IA</div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest">Modelagem & Automação</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-100"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                alt="Inova Team Collaboration"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12">
                <div className="text-white text-lg md:text-2xl font-light italic">"Cultura de excelência em cada entrega."</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-12 md:py-44 px-6 text-center relative overflow-hidden bg-[#080808]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-[radial-gradient(circle,_rgba(201,168,76,0.05)_0%,_transparent_70%)] pointer-events-none" />
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          className="relative z-10"
        >
          <h2 className="text-[clamp(1.6rem,5vw,3.5rem)] font-serif font-[200] leading-[1.2] tracking-tighter mb-10">
            Faça parte da <br />
            <span className="italic font-[400] text-[#C9A84C]">nossa história.</span>
          </h2>
          <p className="text-base font-light text-white/40 mb-16 max-w-xl mx-auto">
            Estamos prontos para ser o braço tecnológico que sua empresa precisa para alcançar o próximo nível.
          </p>
          <Link 
            to="/contato-quiz"
            className="inline-flex items-center gap-4 bg-[#C9A84C] text-[#080808] px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-[#E8C97A] transition-all duration-500 shadow-2xl"
          >
            Iniciar conversa <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
};

export default AboutUsPage;
