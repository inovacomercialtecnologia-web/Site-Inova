import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import SocialSidebar from './components/SocialSidebar';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import ImmersiveHome from './pages/ImmersiveHome';

const DiagnosticDetailPage = lazy(() => import('./pages/DiagnosticDetail'));
const MissionPage = lazy(() => import('./pages/MissionPage'));
const WebApplicationsPage = lazy(() => import('./pages/WebApplicationsPage'));
const MobileApplicationsPage = lazy(() => import('./pages/MobileApplicationsPage'));
const AutomationsPage = lazy(() => import('./pages/AutomationsPage'));
const ArtificialIntelligencePage = lazy(() => import('./pages/ArtificialIntelligencePage'));
const ContactQuizPage = lazy(() => import('./pages/ContactQuizPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const PhilosophyPage = lazy(() => import('./pages/PhilosophyPage'));
const TermosPage = lazy(() => import('./pages/TermosPage'));
const PrivacidadePage = lazy(() => import('./pages/PrivacidadePage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));

const App = () => {
  return (
    <Router>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:bg-[#C9A84C] focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Ir para conteúdo principal
      </a>
      <ScrollToTop />
      <Navbar />
      <SocialSidebar />
      <ErrorBoundary>
        <main id="main-content">
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/termos" element={<TermosPage />} />
              <Route path="/privacidade" element={<PrivacidadePage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </ErrorBoundary>
      <Footer />
    </Router>
  );
}

export default App;
