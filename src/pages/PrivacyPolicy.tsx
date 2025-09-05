import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Fotos Profissionais</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-2">SEU CARDAPIO DIGITAL TECNOLOGIA LTDA</h2>
              <p className="text-muted-foreground">CNPJ: 61.251.929/0001-88</p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. INTRODUÇÃO</h2>
              <p className="text-muted-foreground leading-relaxed">
                A SEU CARDAPIO DIGITAL TECNOLOGIA LTDA ("Empresa", "nós" ou "nosso"), inscrita no CNPJ sob o nº 61.251.929/0001-88, com sede na Rua Pais Leme, nº 215, Conjunto 1713, Pinheiros, São Paulo/SP, CEP 05.424-150, desenvolveu esta Política de Privacidade em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - "LGPD"), o Marco Civil da Internet (Lei nº 12.965/2014) e demais normas aplicáveis.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Esta política descreve como coletamos, utilizamos, armazenamos, compartilhamos e protegemos os dados pessoais dos usuários de nossa plataforma digital, que oferece soluções para transferência automatizada de cardápios entre plataformas de delivery, incluindo melhorias através de inteligência artificial.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Ao utilizar nossos serviços, você declara ter lido, compreendido e concordado com os termos desta Política de Privacidade. Caso não concorde com qualquer disposição aqui estabelecida, recomendamos que não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. DEFINIÇÕES</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Para os fins desta Política, aplicam-se as seguintes definições:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Dados Pessoais:</strong> informação relacionada a pessoa natural identificada ou identificável, conforme definido na LGPD.</li>
                <li><strong>Titular:</strong> pessoa natural a quem se referem os dados pessoais que são objeto de tratamento.</li>
                <li><strong>Tratamento:</strong> toda operação realizada com dados pessoais, como coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.</li>
                <li><strong>Controlador:</strong> pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais.</li>
                <li><strong>Operador:</strong> pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. DADOS PESSOAIS COLETADOS</h2>
              <h3 className="text-xl font-medium mb-3">3.1 Categorias de Dados</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Coletamos as seguintes categorias de dados pessoais:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Nome completo do contratante/responsável legal</li>
                <li>• Endereço de e-mail corporativo</li>
                <li>• Número de telefone de contato</li>
              </ul>
              <h3 className="text-xl font-medium mb-3 mt-6">3.2 Dados Sensíveis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Confirmamos que não coletamos dados pessoais sensíveis, conforme classificação estabelecida no artigo 5º, inciso II, da LGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. FINALIDADES DO TRATAMENTO</h2>
              <h3 className="text-xl font-medium mb-3">4.1 Base Legal</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">O tratamento de dados pessoais é realizado com fundamento nas seguintes bases legais previstas no artigo 7º da LGPD:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Execução de Contrato:</strong> para prestação dos serviços contratados (inciso V)</li>
                <li>• <strong>Interesse Legítimo:</strong> para comunicações institucionais e melhorias dos serviços (inciso IX)</li>
                <li>• <strong>Consentimento:</strong> para envio de comunicações promocionais e marketing direto (inciso I)</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6">4.2 Finalidades Específicas</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Os dados pessoais são tratados para as seguintes finalidades:</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">a) Prestação dos Serviços Contratados:</h4>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Execução da transferência automatizada de cardápios entre plataformas</li>
                    <li>• Processamento e melhoria de descrições e imagens através de inteligência artificial</li>
                    <li>• Sincronização de informações comerciais entre plataformas de delivery</li>
                    <li>• Suporte técnico e atendimento ao cliente</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">b) Comunicação Institucional:</h4>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Fornecimento de atualizações sobre o status dos serviços contratados</li>
                    <li>• Comunicação de alterações nos termos de uso ou políticas</li>
                    <li>• Resposta a solicitações e esclarecimento de dúvidas</li>
                    <li>• Envio de informações técnicas relevantes aos serviços</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">c) Marketing e Comunicações Promocionais:</h4>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Divulgação de novos produtos e serviços que possam ser de interesse</li>
                    <li>• Envio de newsletters e materiais informativos</li>
                    <li>• Pesquisas de satisfação e feedback</li>
                    <li>• Análise de perfil para personalização de ofertas</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">d) Cumprimento de Obrigações Legais:</h4>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Atendimento a determinações de autoridades competentes</li>
                    <li>• Cumprimento de obrigações fiscais e contábeis</li>
                    <li>• Prevenção a fraudes e atividades ilícitas</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. COLETA DE DADOS</h2>
              <h3 className="text-xl font-medium mb-3">5.1 Métodos de Coleta</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Os dados pessoais são coletados através dos seguintes métodos:</p>
              <div className="space-y-3">
                <p className="text-muted-foreground"><strong>a) Formulários Eletrônicos:</strong> preenchimento voluntário de formulários em nosso website para contratação de serviços.</p>
                <p className="text-muted-foreground"><strong>b) Integração com APIs:</strong> coleta automatizada de informações disponíveis publicamente nas plataformas de delivery, mediante autorização expressa do titular.</p>
                <p className="text-muted-foreground"><strong>c) Comunicações Diretas:</strong> interações via e-mail, telefone ou outros canais de comunicação.</p>
              </div>
              
              <h3 className="text-xl font-medium mb-3 mt-6">5.2 Consentimento</h3>
              <p className="text-muted-foreground leading-relaxed">
                Para atividades que dependem de consentimento, especialmente marketing direto, solicitamos sua autorização expressa e inequívoca. O consentimento pode ser revogado a qualquer momento através dos canais de contato disponibilizados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. COOKIES E TECNOLOGIAS SIMILARES</h2>
              <h3 className="text-xl font-medium mb-3">6.1 Utilização de Cookies</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nosso website utiliza cookies e tecnologias similares para aprimorar a experiência do usuário, analisar o tráfego e personalizar conteúdos.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-6">6.2 Tipos de Cookies Utilizados</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground"><strong>a) Cookies Essenciais:</strong> necessários para o funcionamento básico do website.</p>
                <p className="text-muted-foreground"><strong>b) Cookies de Performance:</strong> coletam informações sobre como os visitantes utilizam o site.</p>
                <p className="text-muted-foreground"><strong>c) Cookies de Funcionalidade:</strong> permitem que o site lembre de escolhas feitas pelo usuário.</p>
                <p className="text-muted-foreground"><strong>d) Cookies de Marketing:</strong> utilizados para rastrear visitantes em websites para exibir anúncios relevantes.</p>
              </div>
              
              <h3 className="text-xl font-medium mb-3 mt-6">6.3 Gestão de Cookies</h3>
              <p className="text-muted-foreground leading-relaxed">
                Informamos sobre a utilização de cookies através de banner específico em nosso website. Embora não oferecemos ferramenta de gestão individualizada de cookies no site, você pode configurar seu navegador para bloquear ou deletar cookies, observando que isso pode afetar a funcionalidade de algumas áreas do website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. COMPARTILHAMENTO DE DADOS</h2>
              <h3 className="text-xl font-medium mb-3">7.1 Compartilhamento com Terceiros</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Podemos compartilhar dados pessoais nas seguintes situações:</p>
              <div className="space-y-3">
                <p className="text-muted-foreground"><strong>a) Prestadores de Serviços:</strong> empresas que prestam serviços essenciais para nossa operação, incluindo provedores de infraestrutura tecnológica, serviços de nuvem, analytics e marketing digital.</p>
                <p className="text-muted-foreground"><strong>b) Parceiros Comerciais:</strong> para enriquecimento de base de dados e aprimoramento de serviços, sempre mediante salvaguardas contratuais adequadas.</p>
                <p className="text-muted-foreground"><strong>c) Autoridades Competentes:</strong> quando exigido por lei ou determinação judicial.</p>
              </div>
              
              <h3 className="text-xl font-medium mb-3 mt-6">7.2 Salvaguardas Contratuais</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Todos os terceiros que recebem dados pessoais são obrigados contratualmente a:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Tratar os dados exclusivamente para as finalidades autorizadas</li>
                <li>• Implementar medidas de segurança adequadas</li>
                <li>• Não realizar tratamento incompatível com esta Política</li>
                <li>• Notificar imediatamente sobre incidentes de segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. TRANSFERÊNCIA INTERNACIONAL DE DADOS</h2>
              <h3 className="text-xl font-medium mb-3">8.1 Países de Destino</h3>
              <p className="text-muted-foreground leading-relaxed">
                Dados pessoais podem ser transferidos para outros países onde estão localizados servidores de nossos prestadores de serviços tecnológicos.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-6">8.2 Salvaguardas para Transferências</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">As transferências internacionais são realizadas mediante:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Contratos que incorporam cláusulas contratuais padrão para proteção de dados</li>
                <li>• Verificação de que o país de destino oferece grau de proteção adequado</li>
                <li>• Implementação de medidas técnicas e organizacionais complementares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. RETENÇÃO DE DADOS</h2>
              <h3 className="text-xl font-medium mb-3">9.1 Período de Armazenamento</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Os dados pessoais são conservados pelos seguintes períodos:</p>
              <div className="space-y-3">
                <p className="text-muted-foreground"><strong>a) Dados para Execução Contratual:</strong> durante a vigência do contrato e por período adicional de 5 (cinco) anos após o encerramento, para cumprimento de obrigações legais.</p>
                <p className="text-muted-foreground"><strong>b) Dados para Marketing:</strong> até a revogação do consentimento</p>
                <p className="text-muted-foreground"><strong>c) Dados para Cumprimento Legal:</strong> pelo prazo exigido pela legislação aplicável.</p>
              </div>
              
              <h3 className="text-xl font-medium mb-3 mt-6">9.2 Eliminação de Dados</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ao final do período de retenção, os dados são eliminados de forma segura e definitiva, salvo quando sua conservação for exigida por obrigação legal ou para exercício regular de direitos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. SEGURANÇA DA INFORMAÇÃO</h2>
              <h3 className="text-xl font-medium mb-3">10.1 Medidas Técnicas</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Implementamos as seguintes medidas de segurança técnicas:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Criptografia de dados em trânsito e em repouso</li>
                <li>• Controles de acesso baseados em necessidade e função</li>
                <li>• Monitoramento contínuo de sistemas e logs de auditoria</li>
                <li>• Backup regular e planos de continuidade de negócios</li>
                <li>• Utilização de infraestrutura de provedores certificados</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6">10.2 Medidas Organizacionais</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Adotamos medidas organizacionais que incluem:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Treinamento regular de colaboradores sobre proteção de dados</li>
                <li>• Políticas internas de segurança da informação</li>
                <li>• Controles de acesso físico e lógico</li>
                <li>• Avaliação periódica de riscos de segurança</li>
                <li>• Contratos de confidencialidade com todos os envolvidos</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6">10.3 Resposta a Incidentes</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Mantemos procedimento estruturado para resposta a incidentes de segurança que prevê:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Identificação e contenção imediata do incidente</li>
                <li>• Avaliação do impacto e risco aos titulares</li>
                <li>• Notificação à Autoridade Nacional de Proteção de Dados (ANPD) em até 72 horas quando aplicável</li>
                <li>• Comunicação aos titulares afetados quando o incidente puder acarretar risco ou dano relevante</li>
                <li>• Implementação de medidas corretivas e preventivas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. DIREITOS DOS TITULARES</h2>
              <h3 className="text-xl font-medium mb-3">11.1 Direitos Garantidos</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Em conformidade com a LGPD, você possui os seguintes direitos:</p>
              <div className="space-y-3">
                <p className="text-muted-foreground"><strong>a) Confirmação e Acesso:</strong> obter confirmação sobre a existência de tratamento e acessar seus dados pessoais.</p>
                <p className="text-muted-foreground"><strong>b) Correção:</strong> solicitar a correção de dados incompletos, inexatos ou desatualizados.</p>
                <p className="text-muted-foreground"><strong>c) Anonimização, Bloqueio ou Eliminação:</strong> requerer a anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.</p>
                <p className="text-muted-foreground"><strong>d) Portabilidade:</strong> solicitar a portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa e observadas as questões técnicas.</p>
                <p className="text-muted-foreground"><strong>e) Eliminação:</strong> requerer a eliminação dos dados pessoais tratados com base no consentimento, exceto nas hipóteses previstas em lei.</p>
                <p className="text-muted-foreground"><strong>f) Informação sobre Compartilhamento:</strong> obter informações sobre entidades públicas e privadas com as quais realizamos compartilhamento de dados.</p>
                <p className="text-muted-foreground"><strong>g) Informação sobre Negativa:</strong> ser informado sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa.</p>
                <p className="text-muted-foreground"><strong>h) Revogação do Consentimento:</strong> revogar o consentimento a qualquer momento, mediante manifestação expressa.</p>
              </div>
              
              <h3 className="text-xl font-medium mb-3 mt-6">11.2 Exercício dos Direitos</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Para exercer seus direitos, entre em contato conosco através do e-mail contato@centraldocardapio.com.br, informando:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Nome completo e dados de identificação</li>
                <li>• Descrição clara do direito que deseja exercer</li>
                <li>• Documentos que comprovem sua identidade</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Responderemos às solicitações em prazo máximo de 15 (quinze) dias, podendo ser prorrogado por igual período mediante justificativa expressa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. ALTERAÇÕES NA POLÍTICA</h2>
              <h3 className="text-xl font-medium mb-3">12.1 Processo de Atualização</h3>
              <p className="text-muted-foreground leading-relaxed">
                Esta Política pode ser alterada a qualquer momento para adequação a mudanças legislativas, regulamentares ou operacionais. As alterações entrarão em vigor na data de sua publicação.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-6">12.2 Comunicação de Mudanças</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Alterações materiais serão comunicadas através de:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• E-mail para todos os usuários cadastrados</li>
                <li>• Aviso destacado em nosso website</li>
                <li>• Outras formas de comunicação quando apropriado</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Recomendamos a consulta periódica desta Política para manter-se atualizado sobre nossas práticas de tratamento de dados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. ENCARREGADO DE DADOS PESSOAIS</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Designamos encarregado de dados pessoais para atuar como canal de comunicação entre a empresa, os titulares de dados e a Autoridade Nacional de Proteção de Dados (ANPD).
              </p>
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Contato do Encarregado:</h4>
                <p className="text-muted-foreground">E-mail: contato@centraldocardapio.com.br</p>
                <p className="text-muted-foreground">Endereço: Rua Pais Leme, nº 215, Conjunto 1713, Pinheiros, São Paulo/SP, CEP 05.424-150</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. DISPOSIÇÕES GERAIS</h2>
              <h3 className="text-xl font-medium mb-3">14.1 Legislação Aplicável</h3>
              <p className="text-muted-foreground leading-relaxed">
                Esta Política é regida pela legislação brasileira, especialmente pela LGPD, Marco Civil da Internet e Código de Defesa do Consumidor.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-6">14.2 Foro Competente</h3>
              <p className="text-muted-foreground leading-relaxed">
                Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias decorrentes desta Política, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-6">14.3 Separabilidade</h3>
              <p className="text-muted-foreground leading-relaxed">
                Caso qualquer disposição desta Política seja considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.
              </p>
            </section>

            <div className="bg-card p-6 rounded-lg border mt-8">
              <p className="text-sm text-muted-foreground">
                <strong>Data da última atualização:</strong> 04 de julho de 2025<br />
                <strong>Versão:</strong> 1.0
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Para dúvidas, sugestões ou exercício de direitos relacionados aos seus dados pessoais, entre em contato conosco através do e-mail contato@centraldocardapio.com.br.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;