import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, ShieldX, BarChart3, Target, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';

const topicsData: Record<string, any> = {
  "processo-na-cabeca-do-dono": {
    id: "01",
    icon: Brain,
    title: "O processo vive na cabeça do dono",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
    details: [
      "Dependência extrema de figuras-chave",
      "Dificuldade em treinar novos colaboradores",
      "Gargalos constantes na tomada de decisão",
      "Falta de padrões de qualidade replicáveis"
    ],
    longDesc: "Quando o conhecimento não está documentado e estruturado, a empresa para de crescer porque o dono se torna o maior gargalo. Cada nova venda gera mais caos em vez de mais lucro."
  },
  "sistema-generico": {
    id: "02",
    icon: ShieldX,
    title: "O sistema genérico não resolveu",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200",
    details: [
      "Processos engessados por limitações técnicas",
      "Excesso de planilhas paralelas para 'ajudar' o sistema",
      "Baixa adesão da equipe às ferramentas",
      "Custo alto de manutenção para pouco retorno real"
    ],
    longDesc: "Sistemas genéricos tentam colocar sua empresa em uma caixa. Nós construímos a caixa ao redor do seu processo ideal, garantindo que a tecnologia impulsione, não limite."
  },
  "dados-irreais": {
    id: "03",
    icon: BarChart3,
    title: "O dado não reflete a realidade",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    details: [
      "Dados fragmentados em múltiplas fontes",
      "Erro humano na alimentação de indicadores",
      "Dificuldade em cruzar informações estratégicas",
      "Visão retroativa em vez de preditiva"
    ],
    longDesc: "Ter dados não é o mesmo que ter inteligência. Transformamos o fluxo de informação para que você tenha uma 'única fonte da verdade', permitindo decisões rápidas e seguras."
  },
  "decisao-no-achismo": {
    id: "04",
    icon: Target,
    title: "A decisão ainda é no achismo",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200",
    details: [
      "Gestão baseada em 'sentimento' e não em fatos",
      "Incapacidade de prever crises operacionais",
      "Desperdício de recursos em iniciativas sem métricas",
      "Cultura de improviso que cansa a equipe"
    ],
    longDesc: "O achismo é o inimigo da escala. Implementamos uma cultura orientada a processos e dados onde cada ação é medida e cada resultado é previsível."
  }
};

export default function DiagnosticDetailPage() {
  const { slug } = useParams();
  const topic = slug ? topicsData[slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
          <Link to="/" className="text-[#C9A84C] hover:underline">Voltar para o início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 md:px-24 lg:px-32">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#C9A84C] transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[12px] md:text-[14px] font-medium uppercase tracking-widest">Voltar ao Diagnóstico</span>
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                <topic.icon className="w-5 h-5 md:w-7 md:h-7 text-[#C9A84C]" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#C9A84C] font-bold">Diagnóstico Detalhado</span>
            </div>

            <h1 className="text-[clamp(1.6rem,5vw,3rem)] font-serif font-[200] text-gray-950 leading-[1.1] mb-6 md:mb-8 tracking-tighter">
              {topic.title}
            </h1>

            <p className="text-[14px] md:text-[16px] text-gray-600 leading-[1.7] font-[300]">
              {topic.longDesc}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/3] rounded-[20px] md:rounded-[32px] lg:rounded-[48px] overflow-hidden shadow-2xl border border-gray-100"
          >
            <img 
              src={topic.image} 
              alt={topic.title}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 right-6 md:top-8 md:right-8 text-[64px] md:text-[96px] font-bold text-white/10 font-mono leading-none select-none">{topic.id}</div>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Symptoms */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-[40px] p-10 md:p-16 border border-gray-100"
          >
            <h3 className="text-[20px] font-serif font-[300] text-gray-950 mb-10 tracking-tight">Sintomas comuns identificados</h3>
            <div className="space-y-6">
              {topic.details.map((detail: string, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#C9A84C] mt-1 shrink-0" strokeWidth={1.5} />
                  <span className="text-[16px] text-gray-600 font-[300] leading-tight">{detail}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Solution CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-black rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="text-[20px] font-serif font-[300] mb-6 relative z-10">Como a InovaCore resolve isso?</h3>
            <p className="text-white/60 text-[14px] leading-[1.6] mb-12 relative z-10">
              Nossa abordagem não é apenas técnica. Nós mergulhamos no seu negócio para estruturar o processo antes de codificar a solução. O resultado é uma operação blindada e pronta para escalar.
            </p>

            <Link 
              to="/contato-quiz"
              className="w-full py-5 bg-[#C9A84C] text-black font-bold rounded-2xl hover:bg-white transition-all duration-500 flex items-center justify-center gap-3 group relative z-10"
            >
              Agendar Consultoria Estratégica
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
