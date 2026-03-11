import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const customEase = [0.16, 1, 0.3, 1];

const cards = [
  {
    category: "PROCESSO",
    title: "O processo vive na cabeça do dono",
    description: "Quando o colaborador sai, o conhecimento vai junto. Nada documentado. Nada replicável. A operação depende de pessoa, não de método.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
    link: "#"
  },
  {
    category: "TECNOLOGIA",
    title: "O sistema genérico não foi feito para você",
    description: "Foi construído para servir todo mundo. Por isso não resolve ninguém de verdade. Você adapta sua operação ao sistema, quando deveria ser o contrário.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    link: "#"
  },
  {
    category: "DADOS",
    title: "O dado não reflete o que acontece de verdade",
    description: "Dashboard bonito, número que ninguém confia. Indicador que não indica nada. Relatório que gera mais dúvida do que decisão.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    link: "#"
  },
  {
    category: "GESTÃO",
    title: "A decisão ainda é no achismo",
    description: "Sem processo estruturado, toda decisão vira intuição. O empresário continua apagando incêndio e a operação continua refém do improviso.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    link: "#"
  }
];

// Split text into words for staggered animation
const paragraphText = "A maioria das empresas já investiu em sistema, já contratou ferramenta, já tentou organizar com planilha. E o resultado foi sempre o mesmo, tecnologia rodando em cima de um processo que nunca foi estruturado.";
const words = paragraphText.split(" ");

export default function ImpactCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { scrollXProgress } = useScroll({ container: scrollRef });
  const progressBarWidth = useTransform(scrollXProgress, [0, 1], ["0%", "100%"]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 1.2;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-32 bg-[#000000] text-white overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="mb-24 text-center flex flex-col items-center"
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="text-[#D4AF37] text-xs font-medium uppercase tracking-[0.2em] mb-6"
          >
            POR QUE O SISTEMA SOZINHO NÃO RESOLVE
          </motion.div>
          
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="text-5xl md:text-6xl font-serif font-light tracking-tight leading-tight"
          >
            <span className="text-white block">Você não tem problema de tecnologia.</span>
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#FDE047] bg-clip-text text-transparent block mt-2">Tem problema de processo.</span>
          </motion.h2>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="max-w-4xl mx-auto mt-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 backdrop-blur-sm relative overflow-hidden text-left"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-transparent" />
            <p className="text-gray-300 font-light text-lg md:text-xl leading-relaxed text-balance">
              A maioria das empresas já investiu em sistema, já contratou ferramenta, já tentou organizar com planilha. E o resultado foi sempre o mesmo, tecnologia rodando em cima de um processo que nunca foi estruturado.
            </p>
          </motion.div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons (Desktop) */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="hidden md:flex justify-end gap-4 mb-8"
          >
             <button 
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] transition-all duration-300 hover:bg-[#C9A84C] hover:text-black active:scale-90 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[#C9A84C] disabled:active:scale-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] transition-all duration-300 hover:bg-[#C9A84C] hover:text-black active:scale-90 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[#C9A84C] disabled:active:scale-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
          </motion.div>

          {/* Cards Scroll Area */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 md:gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide -mr-6 md:-mr-12 lg:-mr-24 pr-6 md:pr-12 lg:pr-24"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cards.map((card, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, ease: customEase, delay: index * 0.15 }}
                className="min-w-[300px] md:min-w-[360px] lg:min-w-[400px] snap-center"
              >
                <div className="group h-full flex flex-col p-6 rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 ease-out hover:border-[#C9A84C]/40 hover:bg-white/[0.04] hover:shadow-[0_20px_40px_-15px_rgba(201,168,76,0.15)] cursor-pointer">
                  
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-8 bg-[#111]">
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 grayscale"
                    />
                    {/* Subtle Gold Overlay on Hover */}
                    <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/20 transition-colors duration-700 ease-out mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow">
                    <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent text-xs font-medium uppercase tracking-[0.2em] mb-4 block opacity-90">
                      {card.category}
                    </span>
                    <h3 className="text-2xl font-serif font-light text-white mb-4 leading-[1.3] group-hover:text-[#C9A84C] transition-colors duration-500 tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow font-light">
                      {card.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-gray-500 group-hover:text-[#C9A84C] transition-colors duration-500 w-fit mt-auto">
                      Fale com nossa equipe 
                      <ArrowRight className="w-4 h-4 text-[#C9A84C] transform transition-transform duration-500 ease-out group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto h-[2px] bg-white/10 rounded-full overflow-hidden mt-4">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] rounded-full origin-left"
              style={{ width: progressBarWidth }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}

