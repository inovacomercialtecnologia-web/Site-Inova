import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Facebook, Twitter, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [nlState, setNlState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setNlState('loading');
    try {
      // Store newsletter signup — uses the same contact endpoint with a special flag
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsletter: true, email }),
      });
      if (res.ok) {
        setNlState('success');
        setEmail('');
      } else {
        setNlState('error');
      }
    } catch {
      setNlState('error');
    }
    setTimeout(() => setNlState('idle'), 4000);
  };

  return (
    <footer className="bg-black border-t border-white/10 py-16 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        {/* Newsletter Section */}
        <div className="border-b border-white/[0.06] pb-12 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-md">
              <h4 className="uppercase tracking-[0.15em] text-xs font-medium bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent mb-2">
                Newsletter
              </h4>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Receba insights sobre transformação digital, cases de sucesso e tendências de tecnologia para o mercado B2B.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={nlState === 'loading'}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-gray-500 font-light focus:outline-none focus:border-[#C9A84C]/40 transition-colors disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={nlState === 'loading' || nlState === 'success'}
                className="shrink-0 bg-[#C9A84C] text-[#080808] w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#E8C97A] transition-all disabled:opacity-60"
                aria-label="Inscrever na newsletter"
              >
                {nlState === 'loading' ? <Loader2 size={16} className="animate-spin" /> :
                 nlState === 'success' ? <CheckCircle2 size={16} /> :
                 <ArrowRight size={16} />}
              </button>
            </form>
            {nlState === 'success' && (
              <span className="text-xs text-emerald-400 font-light">Inscrito com sucesso!</span>
            )}
            {nlState === 'error' && (
              <span className="text-xs text-red-400 font-light">Erro ao inscrever. Tente novamente.</span>
            )}
          </div>
        </div>

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
                  <h4 className="uppercase tracking-[0.15em] text-xs font-medium bg-gradient-to-r from-[#C9A84C] to-[#E5C05C] bg-clip-text text-transparent mb-6">
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
                className="text-gray-500 hover:text-[#C9A84C] transition-colors"
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
