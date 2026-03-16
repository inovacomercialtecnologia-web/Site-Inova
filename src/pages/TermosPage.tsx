import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageMeta from '../components/PageMeta';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#FAFAF8] font-sans pt-20 md:pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <PageMeta title="Termos de Uso" description="Termos de uso do site Inova Systems Solutions." />
      <div className="max-w-[800px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#C9A84C] text-[11px] font-bold uppercase tracking-widest mb-12 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar
        </Link>
        <h1 className="text-2xl md:text-4xl font-light tracking-tight mb-8">Termos de Uso</h1>
        <div className="text-white/60 font-light leading-relaxed space-y-6">
          <p>Última atualização: 15 de março de 2026.</p>

          <p>Bem-vindo ao site da <strong className="text-white/80">Inova Systems Solutions Ltda</strong> ("Inova", "nós" ou "nosso"), pessoa jurídica de direito privado, com sede no Brasil. Estes Termos de Uso regulam o acesso e a utilização do site <a href="https://inovasystemssolutions.com" className="text-[#C9A84C] hover:underline">inovasystemssolutions.com</a> e dos serviços nele disponibilizados.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">1. Aceitação dos Termos</h2>
          <p>Ao acessar ou utilizar nosso site, você declara que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição aqui prevista, solicitamos que não utilize o site ou nossos serviços.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">2. Uso do Site e Serviços</h2>
          <p>O site da Inova Systems Solutions tem como objetivo apresentar informações sobre a empresa, seus serviços de consultoria em tecnologia e soluções B2B, bem como possibilitar o contato por meio de formulário eletrônico.</p>
          <p>Ao utilizar nosso site, você se compromete a:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Fornecer informações verdadeiras, precisas e atualizadas ao preencher formulários de contato;</li>
            <li>Não utilizar o site para fins ilícitos, fraudulentos ou que possam causar danos à Inova ou a terceiros;</li>
            <li>Não realizar tentativas de acesso não autorizado a sistemas, servidores ou redes relacionadas ao site;</li>
            <li>Não reproduzir, distribuir ou modificar qualquer conteúdo do site sem autorização prévia e expressa.</li>
          </ul>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">3. Propriedade Intelectual</h2>
          <p>Todo o conteúdo presente no site, incluindo, mas não se limitando a, textos, logotipos, marcas, imagens, layouts, código-fonte, design e identidade visual, é de propriedade exclusiva da Inova Systems Solutions ou de seus licenciadores, sendo protegido pela legislação brasileira de propriedade intelectual e direitos autorais (Lei nº 9.610/1998 e Lei nº 9.279/1996).</p>
          <p>É expressamente proibida a reprodução, distribuição, modificação, exibição pública ou qualquer outra forma de utilização do conteúdo do site, total ou parcialmente, sem a autorização prévia e por escrito da Inova Systems Solutions.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">4. Limitação de Responsabilidade</h2>
          <p>O site e seus conteúdos são fornecidos "no estado em que se encontram". A Inova Systems Solutions não garante que o site estará disponível de forma ininterrupta, livre de erros ou de componentes nocivos.</p>
          <p>A Inova Systems Solutions não se responsabiliza por:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Danos diretos ou indiretos decorrentes do uso ou da impossibilidade de uso do site;</li>
            <li>Decisões tomadas com base nas informações disponibilizadas no site;</li>
            <li>Conteúdo de sites de terceiros acessados por meio de links disponíveis em nosso site;</li>
            <li>Falhas técnicas, interrupções, vírus ou outros problemas decorrentes do uso da internet.</li>
          </ul>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">5. Modificações nos Termos</h2>
          <p>A Inova Systems Solutions reserva-se o direito de modificar, a qualquer momento e sem aviso prévio, os presentes Termos de Uso. As alterações entram em vigor imediatamente após sua publicação no site. Recomendamos a consulta periódica desta página para manter-se informado sobre eventuais atualizações.</p>
          <p>O uso continuado do site após a publicação de alterações constitui a sua aceitação dos novos termos.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">6. Lei Aplicável e Foro</h2>
          <p>Estes Termos de Uso são regidos e interpretados de acordo com a legislação da República Federativa do Brasil. Fica eleito o foro da comarca da sede da Inova Systems Solutions Ltda para dirimir quaisquer questões oriundas destes Termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">7. Contato</h2>
          <p>Em caso de dúvidas sobre estes Termos de Uso, entre em contato conosco:</p>
          <ul className="list-none space-y-2 ml-4">
            <li><strong className="text-white/80">Empresa:</strong> Inova Systems Solutions Ltda</li>
            <li><strong className="text-white/80">Site:</strong> <a href="https://inovasystemssolutions.com" className="text-[#C9A84C] hover:underline">inovasystemssolutions.com</a></li>
            <li><strong className="text-white/80">E-mail:</strong> <a href="mailto:contato@inovasystems.com.br" className="text-[#C9A84C] hover:underline">contato@inovasystems.com.br</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
