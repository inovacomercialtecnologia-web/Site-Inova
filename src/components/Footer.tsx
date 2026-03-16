import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { Logo } from './Logo';

const footerData = {
  companyInfo: "Transformando inteligência operacional em tecnologia de alta performance para o mercado B2B.",
  columns: [
    {
      title: "SOLUÇÕES",
      links: [
        { label: "Aplicações Web", path: "/solucoes/aplicacoes-web" },
        { label: "Aplicações Mobile", path: "/solucoes/aplicacoes-mobile" },
        { label: "Automações", path: "/solucoes/automacoes" },
        { label: "Inteligência Artificial", path: "/solucoes/ia" }
      ]
    },
    {
      title: "PORTFÓLIO",
      links: [
        { label: "Cases de Sucesso", path: "/portfolio" }
      ]
    },
    {
      title: "EMPRESA",
      links: [
        { label: "Nossa Missão", path: "/missao" },
        { label: "Nossa Filosofia", path: "/filosofia" }
      ]
    },
    {
      title: "POLÍTICA DE PRIVACIDADE",
      links: [
        { label: "Termos de uso", path: "/termos" },
        { label: "Privacidade", path: "/privacidade" },
        { label: "Cookies", path: "/cookies" }
      ]
    }
  ],
  socials: [
    { id: "linkedin", icon: Linkedin, href: "#" },
    { id: "instagram", icon: Instagram, href: "#" },
    { id: "facebook", icon: Facebook, href: "#" },
    { id: "twitter", icon: Twitter, href: "#" },
    { id: "mail", icon: Mail, href: "mailto:contato@inovasystems.com.br" }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-16 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3 mb-2 group inline-flex">
              <Logo className="h-10 w-auto" color="#C9A84C" />
              <div className="flex flex-col">
                <span className="text-2xl font-light tracking-tight text-white group-hover:text-[#C9A84C] transition-colors">Inova.</span>
                <span className="text-[9px] font-medium text-gray-400 tracking-[0.2em] uppercase">Systems Solutions</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 font-light leading-relaxed mt-4 max-w-sm">
              {footerData.companyInfo}
            </p>
          </div>

          {/* Links Columns Area */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {footerData.columns.map((column, idx) => (
                <div key={idx} className="flex flex-col">
                  <h4 className="uppercase tracking-[0.15em] text-xs font-medium bg-gradient-to-r from-[#D4AF37] to-[#FDE047] bg-clip-text text-transparent mb-6">
                    {column.title}
                  </h4>
                  <div className="flex flex-col space-y-3">
                    {column.links.map((link, linkIdx) => (
                      <Link
                        key={linkIdx}
                        to={link.path}
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-sm text-gray-400 font-light transition-all duration-300 hover:text-white hover:translate-x-1 inline-block w-fit"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar (Sub-footer) */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-gray-600">
            © {new Date().getFullYear()} Inova Systems Solutions Ltda. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-6">
            {footerData.socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                className="text-gray-500 hover:text-[#D4AF37] transition-colors"
                aria-label={`Visitar ${social.id}`}
              >
                <social.icon className="w-5 h-5" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
