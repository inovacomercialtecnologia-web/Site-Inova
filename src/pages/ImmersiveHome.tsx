import React, { useRef } from 'react';
import { ArrowRight, Globe, Smartphone, Zap, Brain, Target, ShieldCheck, Cpu, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, cubicBezier } from 'motion/react';
import HeroCarousel from '../components/HeroCarousel';
import ImpactCarousel from '../components/ImpactCarousel';
import ScrollSection from '../components/ScrollSection';
import TriadeSection from '../components/TriadeSection';
import CasesSection from '../components/CasesSection';

// --- MAIN COMPONENT ---
const ImmersiveHome = () => {
  return (
    <div className="relative bg-[#080808] selection:bg-[#C9A84C]/30">
      
      {/* CONTENT LAYERS */}
      <div className="relative z-10">
        
        {/* SCENE 1: THE VISION */}
        <ScrollSection isFirst={true} className="h-screen">
          <HeroCarousel onScrollClick={() => {}} />
        </ScrollSection>

        {/* SCENE 2: THE PROBLEM (CHAOS) - REPLACED WITH IMPACT CAROUSEL */}
        <ImpactCarousel />

        {/* SCENE 3: THE METHOD (TRÍADE) — 500vh pinned, scroll-driven */}
        <TriadeSection />

        {/* SCENE 4: THE SOLUTIONS (CASES) */}
        <CasesSection />

      </div>
    </div>
  );
};

export default ImmersiveHome;
