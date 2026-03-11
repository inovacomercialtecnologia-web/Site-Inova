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

        {/* SCENE 3: THE METHOD (TRÍADE) */}
        {/* We use a padding-bottom of 100vh to create a scroll track.
            The sticky bottom-0 container will stick to the bottom of the screen 
            once the user reaches the end of TriadeSection, allowing CasesSection 
            to scroll up and cover it using the Clip-Path Portal effect. */}
        <div className="relative z-0 bg-white" style={{ paddingBottom: '100vh' }}>
          <div className="sticky bottom-0 w-full overflow-hidden">
            <TriadeSection />
          </div>
        </div>

        {/* SCENE 4: THE SOLUTIONS (CASES) */}
        {/* Negative margin pulls CasesSection up to overlap the padding area of TriadeSection */}
        <div className="relative z-20 -mt-[100vh]">
          <CasesSection />
        </div>

      </div>
    </div>
  );
};

export default ImmersiveHome;
