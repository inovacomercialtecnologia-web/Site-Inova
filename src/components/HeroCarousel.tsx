import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Pause, Play } from 'lucide-react';

const slides = [
  {
    supertitle: "INOVA SYSTEMS SOLUTIONS",
    headline: "Transformando operações em inteligência real",
    subheadline: "Processo estruturado. Metodologia aplicada. Tecnologia sob medida.",
    videoId: "V5vlk9d1tvY"
  },
  {
    supertitle: "MÉTODO INOVA",
    headline: "O processo vem antes da tecnologia",
    subheadline: "Mapeamos, estruturamos e só então construímos. Web, Mobile, Automação e IA para a realidade do seu negócio.",
    videoId: "gOBGh48IrUQ"
  },
  {
    supertitle: "CONSTRUÍDO PARA VOCÊ",
    headline: "Tecnologia sob Medida",
    subheadline: "Do processo à tecnologia. Desenvolvido para o seu negócio.",
    videoId: "jEXu2LRWXHY"
  },
  {
    supertitle: "TECNOLOGIA COM PROPÓSITO",
    headline: "Não vendemos sistema. Construímos o seu.",
    subheadline: "A única empresa que entende sua operação antes de desenvolver o seu sistema.",
    videoId: "V5vlk9d1tvY"
  }
];

interface HeroCarouselProps {
  onScrollClick: () => void;
}

export default function HeroCarousel({ onScrollClick }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // All iframes are mounted once and kept alive — never unmounted.
  // Transitions are pure opacity changes: zero loading between slides.
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 8000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Reset timer when manually switching
    if (timerRef.current) clearInterval(timerRef.current);
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 8000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#000000]">

      {/* Video Background — all iframes pre-loaded and permanently in DOM */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            style={{
              opacity: currentSlide === index ? 1 : 0,
              zIndex: currentSlide === index ? 1 : 0,
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <iframe
                className="w-full h-full pointer-events-none"
                src={`https://www.youtube.com/embed/${slide.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${slide.videoId}&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&start=2&vq=hd1080`}
                title={`Background Video ${index}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{ border: 'none' }}
                loading="eager"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Overlays — lighter to let video quality breathe */}
      <div className="absolute inset-0 bg-black/25 z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.55)_0%,_transparent_65%)] z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/85 z-[1]" />

      {/* Carousel Content */}
      <div className="relative z-[2] max-w-6xl w-full flex flex-col items-center justify-center h-full pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center w-full drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
          >
            <span className="text-[#C9A84C] text-[10px] md:text-[12px] font-medium uppercase tracking-[0.2em] mb-6 md:mb-10 block drop-shadow-md">
              {slides[currentSlide].supertitle}
            </span>

            <h1 className="text-[clamp(2.5rem,6vw,6rem)] font-serif font-light text-white leading-[1.1] md:leading-[1] tracking-tight mb-6 md:mb-10 max-w-[1000px] drop-shadow-xl">
              {slides[currentSlide].headline}
            </h1>

            <p className="text-gray-200 text-[16px] md:text-[20px] font-light max-w-2xl mx-auto leading-relaxed tracking-wide drop-shadow-lg">
              {slides[currentSlide].subheadline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-12 z-[10] flex items-center gap-6">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-[2px] w-8 md:w-12 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'bg-gradient-to-r from-[#C9A84C] to-[#E5C05C]'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-black fill-black" />
          ) : (
            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
