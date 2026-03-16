import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

const diagnosticLinks = [
  { name: "Processo Centralizado", path: "/diagnostico/processo-na-cabeca-do-dono" },
  { name: "Sistemas Genéricos", path: "/diagnostico/sistema-generico" },
  { name: "Dados Irreais", path: "/diagnostico/dados-irreais" },
  { name: "Decisão no Achismo", path: "/diagnostico/decisao-no-achismo" }
];

const solutions = [
  { title: "Aplicações Web", path: "/solucoes/aplicacoes-web" },
  { title: "Aplicações Mobile", path: "/solucoes/aplicacoes-mobile" },
  { title: "Automações", path: "/solucoes/automacoes" },
  { title: "Inteligência Artificial", path: "/solucoes/ia" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOQueFazemosOpen, setIsOQueFazemosOpen] = useState(false);
  const [isQuemSomosOpen, setIsQuemSomosOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleLinkClick = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setIsOQueFazemosOpen(false);
    setIsQuemSomosOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setIsOQueFazemosOpen(false);
    setIsQuemSomosOpen(false);
  };

  const isDiagnosticPage = location.pathname.startsWith('/diagnostico/');
  const isWhitePage = isDiagnosticPage;

  const isTransparent = !isScrolled;
  const navStyle = isTransparent
    ? 'bg-transparent py-6'
    : 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-4';

  const isDarkText = isTransparent && isWhitePage;
  const textColor = isDarkText ? 'text-black' : 'text-white';
  const textColorMuted = isDarkText ? 'text-black/80' : 'text-white';
  const borderColor = isDarkText ? 'border-black/20' : 'border-white/50';
  const hoverBg = isDarkText ? 'hover:bg-black/5' : 'hover:bg-white/10';

  const mobileMenuOverlay = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
          className="bg-[#000000] flex flex-col p-8"
        >
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <Logo className="h-10 w-auto" color="#FFFFFF" />
              <div className="flex flex-col">
                <span className="text-xl font-light tracking-tight text-white">Inova.</span>
                <span className="text-[9px] font-medium text-gray-400 tracking-[0.2em] -mt-1 uppercase">Systems Solutions</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-8 overflow-y-auto">
            <Link to="/" onClick={handleHomeClick} className="text-2xl font-light text-white">Home</Link>

            <div className="flex flex-col gap-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-medium">O que fazemos</span>
              <div className="grid grid-cols-1 gap-4">
                {solutions.map((sol, i) => (
                  <Link
                    key={i}
                    to={sol.path}
                    onClick={() => handleLinkClick(sol.path)}
                    className="flex flex-col"
                  >
                    <span className="text-lg font-light text-gray-300">{sol.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-medium">Quem somos</span>
              <div className="grid grid-cols-1 gap-4">
                <Link
                  to="/missao"
                  onClick={() => handleLinkClick("/missao")}
                  className="text-lg font-light text-gray-300"
                >
                  Nossa missão
                </Link>
                <Link
                  to="/filosofia"
                  onClick={() => handleLinkClick("/filosofia")}
                  className="text-lg font-light text-gray-300"
                >
                  Nossa filosofia
                </Link>
              </div>
            </div>

            <Link to="/portfolio" onClick={() => handleLinkClick("/portfolio")} className="text-2xl font-light text-white">Portfólio</Link>
            <Link to="/blog" onClick={() => handleLinkClick("/blog")} className="text-2xl font-light text-white">Blog</Link>

            <div className="flex flex-col gap-4 mt-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-medium">Diagnósticos</span>
              {diagnosticLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="text-lg font-light text-gray-400 hover:text-[#C5A059]"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <Link
              to="/contato-quiz"
              onClick={() => handleLinkClick("/contato-quiz")}
              className="w-full py-5 bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] text-black font-medium tracking-[0.2em] uppercase rounded-2xl mt-8 text-center"
            >
              Contato
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${navStyle}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

          {/* Logo, Menu, Contact & Language */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2 group">
              <Logo
                className="h-12 w-auto transition-all duration-300"
                color={isDarkText ? "#000000" : "#C9A84C"}
              />
              <div className="flex flex-col">
                <span className={`text-xl font-light ${textColor} tracking-tight group-hover:text-[#C9A84C] transition-colors`}>Inova.</span>
                <span className={`text-[9px] font-medium ${textColorMuted} tracking-[0.2em] -mt-1 uppercase whitespace-nowrap`}>Systems Solutions</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4 lg:gap-10">
              <Link to="/" onClick={handleHomeClick} className={`text-[14px] font-light ${textColorMuted} hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#C9A84C] hover:to-[#E5C05C] transition-all tracking-wide`}>Home</Link>

              {/* O que fazemos Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsOQueFazemosOpen(true)}
                onMouseLeave={() => setIsOQueFazemosOpen(false)}
              >
                <div className={`flex items-center gap-1.5 text-[14px] font-light ${textColorMuted} hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#C9A84C] hover:to-[#E5C05C] cursor-pointer group tracking-wide py-2 transition-all`}>
                  O que fazemos <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOQueFazemosOpen ? 'rotate-180 text-[#C9A84C]' : ''}`} strokeWidth={2} />
                </div>

                <AnimatePresence>
                  {isOQueFazemosOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-[320px] bg-[#000000] border border-white/10 rounded-2xl shadow-2xl p-4 mt-2"
                    >
                      <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-2 px-2">Nossas Soluções</span>
                        {solutions.map((sol, i) => (
                          <Link
                            key={i}
                            to={sol.path}
                            onClick={() => handleLinkClick(sol.path)}
                            className="px-3 py-2 hover:bg-white/5 rounded-xl transition-all cursor-pointer group/item"
                          >
                            <div className="text-[13px] text-gray-300 group-hover/item:text-transparent group-hover/item:bg-clip-text group-hover/item:bg-gradient-to-r group-hover/item:from-[#C9A84C] group-hover/item:to-[#E5C05C] font-light transition-all">{sol.title}</div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quem somos Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsQuemSomosOpen(true)}
                onMouseLeave={() => setIsQuemSomosOpen(false)}
              >
                <div className={`flex items-center gap-1.5 text-[14px] font-light ${textColorMuted} hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#C9A84C] hover:to-[#E5C05C] cursor-pointer tracking-wide py-2 transition-all`}>
                  Quem somos <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isQuemSomosOpen ? 'rotate-180 text-[#C9A84C]' : ''}`} strokeWidth={2} />
                </div>

                <AnimatePresence>
                  {isQuemSomosOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-[240px] bg-[#000000] border border-white/10 rounded-2xl shadow-2xl p-4 mt-2"
                    >
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/missao"
                          onClick={() => handleLinkClick("/missao")}
                          className="px-3 py-2 hover:bg-white/5 rounded-xl transition-all cursor-pointer group/item"
                        >
                          <div className="text-[13px] text-gray-300 group-hover/item:text-transparent group-hover/item:bg-clip-text group-hover/item:bg-gradient-to-r group-hover/item:from-[#C9A84C] group-hover/item:to-[#E5C05C] font-light transition-all">Nossa missão</div>
                        </Link>
                        <Link
                          to="/filosofia"
                          onClick={() => handleLinkClick("/filosofia")}
                          className="px-3 py-2 hover:bg-white/5 rounded-xl transition-all cursor-pointer group/item"
                        >
                          <div className="text-[13px] text-gray-300 group-hover/item:text-transparent group-hover/item:bg-clip-text group-hover/item:bg-gradient-to-r group-hover/item:from-[#C9A84C] group-hover/item:to-[#E5C05C] font-light transition-all">Nossa filosofia</div>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/portfolio" className={`text-[14px] font-light ${textColorMuted} hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#C9A84C] hover:to-[#E5C05C] transition-all tracking-wide`} onClick={() => handleLinkClick("/portfolio")}>Portfólio</Link>
              <Link to="/blog" className={`text-[14px] font-light ${textColorMuted} hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#C9A84C] hover:to-[#E5C05C] transition-all tracking-wide`} onClick={() => handleLinkClick("/blog")}>Blog</Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              <Link
                to="/contato-quiz"
                onClick={() => handleLinkClick("/contato-quiz")}
                className={`hidden sm:block border ${borderColor} ${textColor} text-[11px] font-medium tracking-[0.2em] px-10 py-3.5 rounded-full transition-all ${hoverBg} uppercase`}
              >
                Contato
              </Link>

              {/* Language Selector (Desktop only) */}
              <div role="button" aria-label="Selecionar idioma" className={`hidden md:flex items-center gap-2 text-[11px] font-medium ${textColor} tracking-[0.2em] cursor-pointer hover:opacity-80 transition-colors group`}>
                <Globe className="w-3.5 h-3.5 group-hover:text-[#C9A84C] transition-colors" strokeWidth={2} />
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#C9A84C] group-hover:to-[#E5C05C] transition-all">BRASIL</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-all" strokeWidth={2} />
              </div>

              <button
                type="button"
                className={`md:hidden ${textColor} p-2 -mr-2 cursor-pointer rounded-lg hover:bg-white/10 transition-colors`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Abrir menu"
                style={{ touchAction: 'manipulation' }}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — rendered via portal directly into document.body */}
      {typeof document !== 'undefined' && createPortal(mobileMenuOverlay, document.body)}
    </>
  );
}
