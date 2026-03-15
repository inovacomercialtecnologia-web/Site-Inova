import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import SocialSidebar from './components/SocialSidebar';
import Footer from './components/Footer';
import DiagnosticDetailPage from './pages/DiagnosticDetail';
import MissionPage from './pages/MissionPage';
import WebApplicationsPage from './pages/WebApplicationsPage';
import MobileApplicationsPage from './pages/MobileApplicationsPage';
import AutomationsPage from './pages/AutomationsPage';
import ArtificialIntelligencePage from './pages/ArtificialIntelligencePage';
import ContactQuizPage from './pages/ContactQuizPage';
import AboutUsPage from './pages/AboutUsPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PhilosophyPage from './pages/PhilosophyPage';
import ImmersiveHome from './pages/ImmersiveHome';
import MVVPage from './pages/MVVPage';
import TermosPage from './pages/TermosPage';
import PrivacidadePage from './pages/PrivacidadePage';
import CookiesPage from './pages/CookiesPage';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <SocialSidebar />
      <ErrorBoundary>
      <Routes>
        <Route path="/" element={<ImmersiveHome />} />
        <Route path="/missao" element={<MissionPage />} />
        <Route path="/filosofia" element={<PhilosophyPage />} />
        <Route path="/mvv" element={<MVVPage />} />
        <Route path="/quem-somos" element={<AboutUsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/solucoes/aplicacoes-web" element={<WebApplicationsPage />} />
        <Route path="/solucoes/aplicacoes-mobile" element={<MobileApplicationsPage />} />
        <Route path="/solucoes/automacoes" element={<AutomationsPage />} />
        <Route path="/solucoes/ia" element={<ArtificialIntelligencePage />} />
        <Route path="/contato-quiz" element={<ContactQuizPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/diagnostico/:slug" element={<DiagnosticDetailPage />} />
        <Route path="/termos" element={<TermosPage />} />
        <Route path="/privacidade" element={<PrivacidadePage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ErrorBoundary>
      <Footer />
    </Router>
  );
}

export default App;
