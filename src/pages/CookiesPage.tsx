import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageMeta from '../components/PageMeta';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#FAFAF8] font-sans pt-20 md:pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <PageMeta title="Política de Cookies" description="Política de cookies do site Inova Systems Solutions." />
      <div className="max-w-[800px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#C9A84C] text-[11px] font-bold uppercase tracking-widest mb-12 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar
        </Link>
        <h1 className="text-2xl md:text-4xl font-light tracking-tight mb-8">Política de Cookies</h1>
        <div className="text-white/60 font-light leading-relaxed space-y-6">
          <p>Última atualização: 15 de março de 2026.</p>

          <p>Esta Política de Cookies explica como a <strong className="text-white/80">Inova Systems Solutions Ltda</strong> ("Inova", "nós" ou "nosso") utiliza cookies e tecnologias semelhantes no site <a href="https://inovasystemssolutions.com" className="text-[#C9A84C] hover:underline">inovasystemssolutions.com</a>. Ao continuar navegando em nosso site, você concorda com o uso de cookies conforme descrito nesta política.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">1. O que São Cookies</h2>
          <p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou smartphone) quando você visita um site. Eles permitem que o site reconheça seu dispositivo e armazene informações sobre suas preferências ou ações anteriores, melhorando sua experiência de navegação.</p>
          <p>Os cookies podem ser "persistentes" (permanecem no seu dispositivo até serem excluídos ou até expirarem) ou "de sessão" (são apagados automaticamente quando você fecha o navegador).</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">2. Tipos de Cookies Utilizados</h2>

          <p><strong className="text-white/80">2.1 Cookies Essenciais</strong></p>
          <p>São cookies estritamente necessários para o funcionamento do site. Eles permitem a navegação e o uso de funcionalidades básicas, como o carregamento correto das páginas e a memorização de suas preferências de consentimento. Esses cookies não podem ser desativados sem comprometer o funcionamento do site.</p>

          <p><strong className="text-white/80">2.2 Cookies de Análise e Desempenho (Analytics)</strong></p>
          <p>Utilizamos cookies de analytics para coletar informações sobre como os visitantes utilizam nosso site, como páginas mais visitadas, tempo de permanência, origem do tráfego e taxas de rejeição. Esses dados são coletados de forma agregada e anônima, permitindo-nos melhorar continuamente a experiência de navegação e o conteúdo oferecido.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">3. Cookies de Terceiros</h2>
          <p>Nosso site pode utilizar serviços de terceiros que definem seus próprios cookies. Não temos controle sobre esses cookies. Os principais serviços de terceiros utilizados incluem:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white/80">Google Fonts:</strong> utilizado para o carregamento de fontes tipográficas. O Google pode coletar dados como endereço IP e informações do navegador ao fornecer as fontes. Para mais informações, consulte a <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline">Política de Privacidade do Google</a>.</li>
            <li><strong className="text-white/80">YouTube:</strong> caso nosso site incorpore vídeos do YouTube, cookies poderão ser definidos pelo YouTube/Google para rastrear visualizações e preferências de vídeo. Para mais informações, consulte a <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline">Política de Privacidade do Google</a>.</li>
            <li><strong className="text-white/80">Unsplash:</strong> imagens fornecidas pelo Unsplash podem gerar requisições a servidores externos. Para mais informações, consulte a <a href="https://unsplash.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline">Política de Privacidade do Unsplash</a>.</li>
          </ul>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">4. Como Gerenciar Cookies</h2>
          <p>Você pode gerenciar ou desativar cookies a qualquer momento por meio das configurações do seu navegador. Abaixo estão os links para as instruções dos navegadores mais utilizados:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/pt-BR/kb/protecao-aprimorada-contra-rastreamento-firefox" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline">Microsoft Edge</a></li>
            <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline">Safari</a></li>
          </ul>
          <p>Importante: a desativação de determinados cookies pode afetar a funcionalidade e a experiência de navegação em nosso site.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">5. Contato</h2>
          <p>Em caso de dúvidas sobre esta Política de Cookies, entre em contato conosco:</p>
          <ul className="list-none space-y-2 ml-4">
            <li><strong className="text-white/80">Empresa:</strong> Inova Systems Solutions Ltda</li>
            <li><strong className="text-white/80">E-mail:</strong> <a href="mailto:contato@inovasystems.com.br" className="text-[#C9A84C] hover:underline">contato@inovasystems.com.br</a></li>
            <li><strong className="text-white/80">Site:</strong> <a href="https://inovasystemssolutions.com" className="text-[#C9A84C] hover:underline">inovasystemssolutions.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
