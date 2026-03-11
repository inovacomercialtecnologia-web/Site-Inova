import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
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

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <SocialSidebar />
      <Routes>
        <Route path="/" element={<ImmersiveHome />} />
        <Route path="/missao" element={<MissionPage />} />
        <Route path="/filosofia" element={<PhilosophyPage />} />
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
