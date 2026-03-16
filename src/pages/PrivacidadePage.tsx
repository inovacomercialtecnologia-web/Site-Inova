import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageMeta from '../components/PageMeta';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#FAFAF8] font-sans pt-20 md:pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <PageMeta title="Política de Privacidade" description="Política de privacidade e proteção de dados da Inova Systems Solutions." />
      <div className="max-w-[800px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#C9A84C] text-[11px] font-bold uppercase tracking-widest mb-12 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar
        </Link>
        <h1 className="text-2xl md:text-4xl font-light tracking-tight mb-8">Política de Privacidade</h1>
        <div className="text-white/60 font-light leading-relaxed space-y-6">
          <p>Última atualização: 15 de março de 2026.</p>

          <p>A <strong className="text-white/80">Inova Systems Solutions Ltda</strong> ("Inova", "nós" ou "nosso") tem o compromisso de proteger a privacidade e os dados pessoais de todos os visitantes e usuários do site <a href="https://inovasystemssolutions.com" className="text-[#C9A84C] hover:underline">inovasystemssolutions.com</a>. Esta Política de Privacidade foi elaborada em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018) e demais normas aplicáveis.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">1. Dados Pessoais Coletados</h2>
          <p>Coletamos dados pessoais fornecidos voluntariamente por você ao preencher nosso formulário de contato. Os dados coletados podem incluir:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white/80">Nome completo;</strong></li>
            <li><strong className="text-white/80">Endereço de e-mail;</strong></li>
            <li><strong className="text-white/80">Número de telefone;</strong></li>
            <li><strong className="text-white/80">Nome da empresa;</strong></li>
            <li><strong className="text-white/80">Mensagem</strong> e demais informações que você opte por compartilhar no campo de texto livre.</li>
          </ul>
          <p>Também podemos coletar dados de navegação de forma automatizada, como endereço IP, tipo de navegador, páginas acessadas e tempo de permanência, por meio de cookies e tecnologias semelhantes (consulte nossa <Link to="/cookies" className="text-[#C9A84C] hover:underline">Política de Cookies</Link>).</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">2. Finalidade do Tratamento</h2>
          <p>Os dados pessoais coletados são utilizados para as seguintes finalidades:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Responder às solicitações enviadas por meio do formulário de contato;</li>
            <li>Entrar em contato para apresentação de propostas comerciais e informações sobre nossos serviços de consultoria em tecnologia;</li>
            <li>Melhorar a experiência de navegação e o desempenho do site;</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">3. Base Legal para o Tratamento (LGPD)</h2>
          <p>O tratamento dos seus dados pessoais é fundamentado nas seguintes bases legais previstas na LGPD (art. 7º):</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white/80">Consentimento do titular (art. 7º, I):</strong> ao preencher e enviar o formulário de contato, você consente com o tratamento dos seus dados para as finalidades descritas;</li>
            <li><strong className="text-white/80">Legítimo interesse do controlador (art. 7º, IX):</strong> para comunicações comerciais B2B relacionadas aos nossos serviços;</li>
            <li><strong className="text-white/80">Cumprimento de obrigação legal ou regulatória (art. 7º, II):</strong> quando aplicável.</li>
          </ul>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">4. Compartilhamento de Dados</h2>
          <p>A Inova Systems Solutions não comercializa, aluga ou compartilha seus dados pessoais com terceiros para fins de marketing. Seus dados poderão ser compartilhados apenas nas seguintes hipóteses:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Com prestadores de serviços essenciais ao funcionamento do site (hospedagem, e-mail, analytics), que atuam sob nossas instruções e em conformidade com esta política;</li>
            <li>Para cumprimento de obrigação legal, regulatória ou por determinação judicial;</li>
            <li>Para proteger os direitos, a propriedade ou a segurança da Inova, de seus clientes ou de terceiros.</li>
          </ul>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">5. Armazenamento e Segurança</h2>
          <p>Os dados pessoais são armazenados em ambientes seguros, com adoção de medidas técnicas e administrativas adequadas para protegê-los contra acesso não autorizado, destruição, perda, alteração ou qualquer forma de tratamento inadequado.</p>
          <p>Os dados serão retidos apenas pelo período necessário para o cumprimento das finalidades descritas nesta política ou conforme exigido pela legislação aplicável. Após esse período, os dados serão eliminados de forma segura.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">6. Direitos do Titular</h2>
          <p>Nos termos da LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Confirmação da existência de tratamento de dados;</li>
            <li>Acesso aos dados pessoais tratados;</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
            <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
            <li>Eliminação dos dados tratados com base no consentimento;</li>
            <li>Informação sobre entidades públicas e privadas com as quais realizamos uso compartilhado de dados;</li>
            <li>Revogação do consentimento a qualquer momento.</li>
          </ul>
          <p>Para exercer seus direitos, entre em contato conosco por meio do e-mail indicado na seção de contato abaixo.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">7. Cookies</h2>
          <p>Nosso site utiliza cookies e tecnologias semelhantes para melhorar a experiência de navegação e obter dados analíticos sobre o uso do site. Para informações detalhadas sobre os tipos de cookies utilizados e como gerenciá-los, consulte nossa <Link to="/cookies" className="text-[#C9A84C] hover:underline">Política de Cookies</Link>.</p>

          <h2 className="text-xl font-medium text-white/90 mt-10 mb-4">8. Contato do Encarregado (DPO)</h2>
          <p>Em caso de dúvidas sobre esta Política de Privacidade, sobre o tratamento dos seus dados pessoais ou para exercer seus direitos como titular, entre em contato com nosso Encarregado de Proteção de Dados:</p>
          <ul className="list-none space-y-2 ml-4">
            <li><strong className="text-white/80">Empresa:</strong> Inova Systems Solutions Ltda</li>
            <li><strong className="text-white/80">E-mail do Encarregado:</strong> <a href="mailto:contato@inovasystems.com.br" className="text-[#C9A84C] hover:underline">contato@inovasystems.com.br</a></li>
            <li><strong className="text-white/80">Site:</strong> <a href="https://inovasystemssolutions.com" className="text-[#C9A84C] hover:underline">inovasystemssolutions.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
