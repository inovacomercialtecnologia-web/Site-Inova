import React from 'react';
import HeroSection from '../components/HeroCarousel';
import ProblemSolution from '../components/ImpactCarousel';
import TriadeSection from '../components/TriadeSection';
import ServicesGrid from '../components/ServicesGrid';
import CasesSection from '../components/CasesSection';
import CTASection from '../components/CTABanner';
import PageMeta from '../components/PageMeta';

const ImmersiveHome = () => {
  return (
    <div className="relative bg-[#080808] selection:bg-[#C9A84C]/30" style={{ overflowX: 'clip' }}>
      <PageMeta
        title="Transformação Digital Estratégica"
        description="Transformamos inteligência operacional em tecnologia sob medida. Sistemas web, aplicativos mobile, automações e IA para empresas B2B."
      />

      <div className="relative z-10">
        {/* 1. Hero — CTA + social proof acima do fold */}
        <HeroSection />

        {/* 2. Problema → Posicionamento */}
        <ProblemSolution />

        {/* 3. A Tríade: Processo → Metodologia → Tecnologia */}
        <TriadeSection />

        {/* 4. Serviços: Web, Mobile, Automação, IA */}
        <ServicesGrid />

        {/* 5. Cases destaque (3) */}
        <CasesSection />

        {/* 6. CTA final forte */}
        <CTASection />
      </div>
    </div>
  );
};

export default ImmersiveHome;
