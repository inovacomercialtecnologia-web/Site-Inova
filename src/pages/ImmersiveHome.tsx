import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import HeroSection from '../components/HeroCarousel';
import ProblemSolution from '../components/ImpactCarousel';
import TriadeSection from '../components/TriadeSection';
import ServicesGrid from '../components/ServicesGrid';
import CasesSection from '../components/CasesSection';
import CTASection from '../components/CTABanner';
import ComplianceSection from '../components/ComplianceSection';
import AnimatedSvgDivider from '../components/AnimatedSvgDivider';
import CustomCursor from '../components/CustomCursor';
import PageMeta from '../components/PageMeta';

const ImmersiveHome = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative bg-[#080808] selection:bg-[#C9A84C]/30" style={{ overflowX: 'clip' }}>
      <PageMeta
        title="Transformação Digital Estratégica"
        description="Transformamos inteligência operacional em tecnologia sob medida. Sistemas web, aplicativos mobile, automações e IA para empresas B2B."
      />

      {/* Custom cursor — desktop only (auto-disabled on touch) */}
      <CustomCursor />

      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: 'left' }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999]
                   bg-gradient-to-r from-[#C9A84C] via-[#E5C05C] to-[#C9A84C]"
      />

      <div className="relative z-10">
        {/* 1. Hero — Cinematic */}
        <HeroSection />

        {/* 2. Problema → Posicionamento */}
        <ProblemSolution />

        {/* Divider: dark → cream */}
        <AnimatedSvgDivider fromColor="#080808" toColor="#F5F2EC" />

        {/* 3. A Tríade: Processo → Metodologia → Tecnologia */}
        <TriadeSection />

        {/* Divider: cream → dark */}
        <AnimatedSvgDivider fromColor="#F5F2EC" toColor="#080808" />

        {/* 4. Serviços: Web, Mobile, Automação, IA */}
        <ServicesGrid />

        {/* 5. Compliance & Segurança */}
        <ComplianceSection />

        {/* 6. Cases destaque (3) */}
        <CasesSection />

        {/* 7. CTA final */}
        <CTASection />
      </div>
    </div>
  );
};

export default ImmersiveHome;
