import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Brain, ShieldX, BarChart3, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

export default function DiagnosticSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  // Parallax scroll setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const topics = [
    {
      id: "01",
      slug: "processo-na-cabeca-do-dono",
      icon: Brain,
      title: "O processo vive na cabeça do dono",
      desc: "A operação depende de quem está ali. Se alguém sai, o conhecimento vai junto. Nada é replicável, nada é escalável.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "02",
      slug: "sistema-generico",
      icon: ShieldX,
      title: "O sistema genérico não resolveu",
      desc: "Software de prateleira foi feito para todos, por isso não serve para você. Sua empresa se adapta ao sistema, quando deveria ser o contrário.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "03",
      slug: "dados-irreais",
      icon: BarChart3,
      title: "O dado não reflete a realidade",
      desc: "Dashboards bonitos com números que ninguém confia. Relatórios que geram mais dúvidas do que decisões estratégicas.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "04",
      slug: "decisao-no-achismo",
      icon: Target,
      title: "A decisão ainda é no achismo",
      desc: "Sem processo e sem dados, toda decisão vira intuição. Você continua apagando incêndios enquanto a operação patina no improviso.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const easePremium = [0.22, 1, 0.36, 1];

  // Scanner line position based on scroll
  const scannerY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative bg-[#FFFFFF] py-16 md:py-48 overflow-hidden font-sans">
      
      {/* Technical Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.1]" 
           style={{ backgroundImage: 'radial-gradient(#C9A84C 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]" 
           style={{ backgroundImage: 'linear-gradient(#C9A84C 1.5px, transparent 1.5px), linear-gradient(90deg, #C9A84C 1.5px, transparent 1.5px)', backgroundSize: '200px 200px' }}>
      </div>

      {/* Scanner Line */}
      <motion.div 
        style={{ top: scannerY }}
        className="absolute left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent z-10 pointer-events-none"
      >
        <div className="absolute inset-0 blur-md bg-[#C9A84C]/40"></div>
      </motion.div>

      {/* Background Glows */}
      <div className="absolute top-[10%] left-[5%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#C9A84C]/[0.08] rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#C9A84C]/[0.06] rounded-full blur-[220px] pointer-events-none"></div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-px bg-[#C9A84C]"></div>
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent text-[10px] uppercase tracking-[0.4em] font-medium">
              O Diagnóstico
            </span>
            <div className="w-12 h-px bg-[#C9A84C]"></div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: easePremium }}
            className="text-[20px] sm:text-[28px] md:text-[40px] lg:text-[56px] font-light leading-[1.1] tracking-tight text-gray-900 mb-8 md:mb-10"
          >
            Sua empresa cresce, mas a operação <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent font-light tracking-tight">pede socorro.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[14px] md:text-[16px] font-light text-gray-500 leading-relaxed max-w-[600px]"
          >
            Planilhas infinitas, sistemas genéricos e decisões no achismo. O problema não é falta de ferramentas, é falta de base estratégica.
          </motion.p>
        </div>

        {/* Topics with Unified Connected Backgrounds */}
        <div className="flex flex-col gap-8 md:gap-24 relative">
          {/* Vertical connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#C9A84C]/30 to-transparent -translate-x-1/2 hidden lg:block"></div>
          
          {topics.map((topic) => (
            <DiagnosticCard 
              key={topic.id} 
              topic={topic} 
              index={parseInt(topic.id) - 1} 
              scrollYProgress={scrollYProgress} 
              onClick={() => { navigate('/contato-quiz'); }}
            />
          ))}
        </div>
      </div>

    </section>
  );
}

interface DiagnosticCardProps {
  topic: {
    id: string;
    slug: string;
    icon: any;
    title: string;
    desc: string;
    image: string;
  };
  index: number;
  scrollYProgress: any;
  onClick: () => void;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ topic, index, scrollYProgress, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  // Card-specific scroll for more precise parallax
  const { scrollYProgress: cardScroll } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Parallax for image inside card - Only on desktop for stability
  const isMobile = useIsMobile();
  const imgY = useTransform(cardScroll, [0, 1], isMobile ? [0, 0] : [index % 2 === 0 ? -20 : 20, index % 2 === 0 ? 20 : -20]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-[#000000] rounded-[24px] md:rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/5 overflow-hidden group/card p-5 sm:p-8 md:p-12 lg:p-16 cursor-pointer"
    >
      {/* Spotlight Effect */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{ 
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(201, 168, 76, 0.08), transparent 40%)` 
        }}
      />

      {/* Background Watermark ID - Hidden on mobile, adjusted position on desktop */}
      <div className="hidden lg:block absolute top-10 right-10 text-[160px] font-black text-white/[0.02] leading-none select-none pointer-events-none font-mono transition-colors duration-500 group-hover/card:text-[#C9A84C]/[0.03]">
        {topic.id}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 md:gap-16 items-center relative z-10">
        
        {/* Text Side - Given more space (col-span-7) to avoid cutting */}
        <div className={`w-full lg:col-span-7 flex flex-col ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 md:mb-8 transition-all duration-500 group-hover/card:border-[#C9A84C]/40 group-hover/card:bg-[#C9A84C]/5 relative">
            <topic.icon className="w-5 h-5 md:w-8 md:h-8 text-[#C9A84C] transition-transform duration-500 group-hover/card:scale-110" strokeWidth={1} />
          </div>

          <h3 className="text-[18px] sm:text-[22px] md:text-[28px] lg:text-[32px] font-light text-white mb-4 md:mb-6 leading-[1.2] md:leading-[1.1] tracking-tight group-hover/card:text-[#C9A84C] transition-colors duration-500 break-words max-w-full">
            {topic.title}
          </h3>

          <p className="text-[12px] sm:text-[13px] md:text-[14px] font-light text-gray-400 leading-relaxed max-w-[520px] group-hover/card:text-gray-300 transition-colors duration-500">
            {topic.desc}
          </p>

          <div className="mt-6 md:mt-10 flex items-center gap-4 group/btn">
            <div className="w-8 h-[1px] bg-[#C9A84C]/30 group-hover/card:w-16 transition-all duration-500"></div>
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent text-[10px] uppercase tracking-[0.3em] font-medium group-hover/card:tracking-[0.4em] transition-all duration-500">Saiba mais</span>
          </div>
        </div>

        {/* Image Side - Proportional space (col-span-5) */}
        <div className={`w-full lg:col-span-5 relative group/img ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-[16px] md:rounded-[24px] overflow-hidden border border-white/10 shadow-2xl z-10">
            <motion.img 
              style={{ y: imgY }}
              src={topic.image} 
              alt={topic.title}
              className="absolute inset-0 w-full h-[140%] object-cover opacity-80 group-hover/card:opacity-100 transition-opacity duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
          </div>
          
          {/* Technical Corner Accents */}
          <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-10 h-10 md:w-14 md:h-14 border-t-2 border-r-2 border-[#C9A84C]/60 rounded-tr-lg md:rounded-tr-xl z-20 pointer-events-none group-hover/card:translate-x-2 group-hover/card:-translate-y-2 transition-transform duration-500"></div>
          <div className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 w-10 h-10 md:w-14 md:h-14 border-b-2 border-l-2 border-[#C9A84C]/60 rounded-bl-lg md:rounded-bl-xl z-20 pointer-events-none group-hover/card:-translate-x-2 group-hover/card:translate-y-2 transition-transform duration-500"></div>
        </div>
      </div>
    </motion.div>
  );
}
