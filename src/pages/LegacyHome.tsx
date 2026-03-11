import React from 'react';
import MainHeroSection from '../components/MainHeroSection';
import PlatformScrollBanner from '../components/PlatformScrollBanner';
import DiagnosticSection from '../components/DiagnosticSection';
import MetricsSection from '../components/MetricsSection';
import ProcessMethodologySection from '../components/ProcessMethodologySection';
import ProcessTechSection from '../components/ProcessTechSection';

const LegacyHome = () => {
  return (
    <main className="bg-white">
      <MainHeroSection />
      <PlatformScrollBanner />
      <DiagnosticSection />
      <MetricsSection />
      <ProcessMethodologySection />
      <ProcessTechSection />
      {/* Deliverables and other sections can be added here if needed */}
    </main>
  );
};

export default LegacyHome;
