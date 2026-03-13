import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronDown } from 'lucide-react';

export default function MainHeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Progress bar logic
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveSlide((s) => (s + 1) % slides.length);
            return 0;
          }
          return prev + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const slides = [
    {
      tag: "RESULTADOS MENSURÁVEIS",
      title: "Sistemas que não apenas funcionam, mas impulsionam o crescimento real do seu negócio",
      video: "V5vlk9d1tvY",
      type: "youtube"
    },
    {
      tag: "TECNOLOGIA DE PONTA",
      title: "Desenvolvemos o futuro da automação empresarial com inteligência artificial aplicada",
      video: "gOBGh48IrUQ",
      type: "youtube"
    },
    {
      tag: "UMA OPERAÇÃO VISIONÁRIA",
      title: "Estrategistas, engenheiros e especialistas em transformar operações complexas em escala global",
      video: "jEXu2LRWXHY",
      type: "youtube"
    }
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#000000] font-sans">
      {/* Background Videos with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          {slides[activeSlide].type === 'youtube' ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
              <iframe
                className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] md:w-[200%] md:h-[200%] -translate-x-1/2 -translate-y-1/2 object-cover scale-110"
                src={`https://www.youtube.com/embed/${slides[activeSlide].video}?autoplay=1&mute=1&controls=0&loop=1&playlist=${slides[activeSlide].video}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`}
                allow="autoplay; encrypted-media"
                frameBorder="0"
              />
            </div>
          ) : (
            <video
              key={slides[activeSlide].video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={slides[activeSlide].video} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.05, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="w-6 md:w-8 h-[1px] bg-white/30"></div>
              <span className="bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent font-medium text-[9px] md:text-xs tracking-[0.2em] uppercase">
                {slides[activeSlide].tag}
              </span>
              <div className="w-6 md:w-8 h-[1px] bg-white/30"></div>
            </div>
            
            <h1 className="font-light leading-[1.1] text-white tracking-tight max-w-[900px] drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
              style={{ fontSize: 'clamp(1.5rem, 5vw, 4rem)' }}>
              {slides[activeSlide].title}
            </h1>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "60px" }}
              transition={{ delay: 0.8, duration: 1 }}
              className="h-[2px] bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] mt-12"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-12 left-0 w-full px-6 md:px-12 flex items-end justify-between z-20">
        {/* Progress Bars */}
        <div className="flex items-center gap-8">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="w-12 md:w-20 h-[2px] bg-white/20 relative cursor-pointer overflow-hidden"
                onClick={() => { setActiveSlide(i); setProgress(0); }}
              >
                {activeSlide === i && (
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#C9A84C] to-[#E5C05C]"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        </div>

        {/* Scroll Arrow */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 hidden md:block"
        >
          <ChevronDown className="text-white w-8 h-8 opacity-50" />
        </motion.div>
      </div>

    </section>
  );
}
