import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#FAFAF8] font-sans pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-[800px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#C9A84C] text-[11px] font-bold uppercase tracking-widest mb-12 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar
        </Link>
        <h1 className="text-4xl font-light tracking-tight mb-8">Termos de Uso</h1>
        <div className="text-white/60 font-light leading-relaxed space-y-6">
          <p>Esta página está em construção. Em breve os Termos de Uso completos da Inova Systems Solutions estarão disponíveis aqui.</p>
          <p>Para dúvidas, entre em contato pelo e-mail: <a href="mailto:contato@inovasystems.com.br" className="text-[#C9A84C] hover:underline">contato@inovasystems.com.br</a></p>
        </div>
      </div>
    </div>
  );
}
