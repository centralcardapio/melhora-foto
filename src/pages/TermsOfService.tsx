import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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
          <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-2">SEU CARDAPIO DIGITAL TECNOLOGIA LTDA</h2>
              <p className="text-muted-foreground">CNPJ: 61.251.929/0001-88</p>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. DISPOSIÇÕES PRELIMINARES</h2>
                
                <h3 className="text-xl font-medium mb-3">1.1 Identificação das Partes</h3>
                <p className="mb-4">
                  Os presentes Termos de Uso regulam a relação jurídica entre SEU CARDAPIO DIGITAL TECNOLOGIA LTDA., 
                  sociedade empresária limitada inscrita no CNPJ sob o nº 61.251.929/0001-88, com sede na Rua Pais Leme, 
                  nº 215, Conjunto 1713, Pinheiros, São Paulo/SP, CEP 05.424-150 (doravante denominada "EMPRESA", "nós" ou "nosso"), 
                  e o usuário dos serviços oferecidos através de nossa plataforma digital (doravante denominado "CONTRATANTE", "USUÁRIO" ou "você").
                </p>

                <h3 className="text-xl font-medium mb-3">1.2 Objeto e Natureza Jurídica</h3>
                <p className="mb-4">
                  Estes Termos constituem contrato de prestação de serviços digitais especializados em processamento e 
                  aprimoramento de imagens de cardápios mediante inteligência artificial, regido pelos princípios e normas 
                  do Código Civil Brasileiro (Lei nº 10.406/2002), Código de Defesa do Consumidor (Lei nº 8.078/1990), 
                  Marco Civil da Internet (Lei nº 12.965/2014), Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) 
                  e demais normas aplicáveis.
                </p>

                <h3 className="text-xl font-medium mb-3">1.3 Aceitação e Concordância</h3>
                <p className="mb-4">
                  Ao contratar nossos serviços através da plataforma digital, você declara expressamente ter lido, 
                  compreendido e aceito integralmente estes Termos de Uso, bem como nossa Política de Privacidade, 
                  comprometendo-se ao seu cumprimento. A contratação dos serviços implica aceitação tácita e irretratável destes termos.
                </p>

                <h3 className="text-xl font-medium mb-3">1.4 Capacidade Civil</h3>
                <p className="mb-4">
                  Declara possuir capacidade civil plena para celebrar este contrato, nos termos dos artigos 1º e 5º do Código Civil, 
                  e, se representante legal de pessoa jurídica, possuir poderes suficientes para vincular a entidade representada 
                  aos termos aqui estabelecidos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. DEFINIÇÕES</h2>
                <p className="mb-4">Para os fins destes Termos, aplicam-se as seguintes definições:</p>
                <ul className="space-y-2">
                  <li><strong>Plataforma:</strong> website e sistemas tecnológicos operados pela EMPRESA para disponibilização dos serviços.</li>
                  <li><strong>Serviços:</strong> conjunto de atividades técnicas de processamento e aprimoramento de imagens de cardápios mediante tecnologia de inteligência artificial.</li>
                  <li><strong>Créditos:</strong> unidades de processamento adquiridas pelo CONTRATANTE para utilização dos serviços, com validade de 30 (trinta) dias.</li>
                  <li><strong>Imagens de Origem:</strong> fotografias de pratos e produtos alimentícios fornecidas pelo CONTRATANTE para processamento.</li>
                  <li><strong>Imagens Processadas:</strong> fotografias resultantes do aprimoramento mediante inteligência artificial das Imagens de Origem.</li>
                  <li><strong>Área Logada:</strong> ambiente restrito da plataforma destinado à gestão de créditos e histórico de processamentos do CONTRATANTE.</li>
                  <li><strong>Dados de Cadastro:</strong> informações fornecidas pelo CONTRATANTE incluindo nome completo, e-mail, telefone e outros dados necessários para viabilização da prestação dos serviços.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. DESCRIÇÃO DOS SERVIÇOS</h2>
                
                <h3 className="text-xl font-medium mb-3">3.1 Serviços de Processamento de Imagens</h3>
                <p className="mb-4">A EMPRESA oferece serviços especializados em aprimoramento de imagens de cardápios mediante inteligência artificial, compreendendo:</p>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">a) Processamento por Inteligência Artificial:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Aprimoramento da qualidade visual de fotografias de pratos e produtos alimentícios</li>
                    <li>• Otimização de cores, iluminação e apresentação para plataformas de delivery</li>
                    <li>• Padronização estética conforme melhores práticas do mercado gastronômico digital</li>
                    <li>• Geração de imagens profissionais que potencializem a atratividade comercial dos produtos</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">b) Sistema de Versões Alternativas:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Possibilidade de solicitar até 3 (três) novas versões por imagem original</li>
                    <li>• Ajustes e refinamentos conforme feedback do CONTRATANTE</li>
                  </ul>
                </div>

                <h3 className="text-xl font-medium mb-3">3.2 Metodologia de Prestação dos Serviços</h3>
                <p className="mb-4">Os serviços são prestados mediante:</p>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">a) Submissão de Imagens:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Upload direto de fotografias pelo CONTRATANTE através da plataforma</li>
                    <li>• Acesso autorizado a estabelecimentos em plataformas de delivery para captura de imagens existentes</li>
                    <li>• Processamento automatizado mediante algoritmos de inteligência artificial proprietários</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">b) Gestão por Sistema de Créditos:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Aquisição prévia de créditos para processamento de imagens</li>
                    <li>• Consumo de créditos conforme utilização efetiva dos serviços</li>
                    <li>• Validade de 30 (trinta) dias a partir da data de aquisição</li>
                    <li>• Gestão transparente através da Área Logada</li>
                  </ul>
                </div>

                <h3 className="text-xl font-medium mb-3">3.3 Condições de Acesso e Cadastro</h3>
                <p className="mb-4">Para utilização da plataforma, o CONTRATANTE deve:</p>
                <ul className="space-y-1 ml-4 mb-4">
                  <li>• Realizar cadastro fornecendo nome completo, e-mail, telefone e demais informações solicitadas</li>
                  <li>• Manter dados de cadastro atualizados e verídicos</li>
                  <li>• Acessar a Área Logada para gestão de créditos e histórico de processamentos</li>
                  <li>• Adquirir créditos previamente à utilização dos serviços</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">3.4 Escopo de Processamento</h3>
                <p className="mb-4"><strong>Restrições de Conteúdo:</strong> Os serviços destinam-se exclusivamente ao processamento de fotografias de cardápios de restaurantes para venda online, sendo vedado o processamento de:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Imagens não relacionadas ao setor alimentício</li>
                  <li>• Conteúdo inadequado, ofensivo ou que viole direitos de terceiros</li>
                  <li>• Fotografias protegidas por direitos autorais de terceiros sem autorização</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. ORIGEM E LICITUDE DAS IMAGENS</h2>
                
                <h3 className="text-xl font-medium mb-3">4.1 Responsabilidade pela Origem das Imagens</h3>
                <p className="mb-3 font-semibold text-red-600">CLÁUSULA FUNDAMENTAL:</p>
                <p className="mb-4">O CONTRATANTE declara e garante, sob as penas da lei, que:</p>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">a) Titularidade e Direitos:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Possui todos os direitos necessários sobre as imagens fornecidas para processamento</li>
                    <li>• É o legítimo titular ou possui autorização expressa para utilização comercial das fotografias</li>
                    <li>• Obteve as imagens por meios lícitos e em conformidade com termos de uso aplicáveis</li>
                    <li>• Possui direitos sobre todos os elementos visuais presentes nas fotografias</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">b) Conformidade Legal:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• As imagens foram obtidas em estrita observância à legislação vigente</li>
                    <li>• Não há violação de direitos de propriedade intelectual, direitos autorais ou marcários</li>
                    <li>• O fornecimento das imagens não viola contratos ou termos de uso de terceiros</li>
                    <li>• Todas as imagens representam produtos efetivamente comercializados pelo estabelecimento</li>
                  </ul>
                </div>

                <h3 className="text-xl font-medium mb-3">4.2 Propriedade Intelectual das Imagens Processadas</h3>
                <p className="mb-4">
                  <strong>Titularidade do CONTRATANTE:</strong> As imagens processadas mediante inteligência artificial 
                  constituem propriedade intelectual exclusiva do CONTRATANTE, que assume integral responsabilidade por sua utilização comercial.
                </p>

                <h3 className="text-xl font-medium mb-3">4.3 Transferência Integral de Responsabilidade</h3>
                <p className="mb-4">O CONTRATANTE assume integral responsabilidade por eventuais:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Violações de direitos de propriedade intelectual de terceiros</li>
                  <li>• Utilização inadequada das imagens processadas</li>
                  <li>• Ações judiciais ou extrajudiciais movidas por terceiros relacionadas às imagens</li>
                  <li>• Danos materiais ou morais decorrentes da utilização comercial das imagens processadas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. CONDIÇÕES DE CONTRATAÇÃO E ACESSO</h2>
                
                <h3 className="text-xl font-medium mb-3">5.1 Elegibilidade</h3>
                <p className="mb-4">Os serviços destinam-se a:</p>
                <ul className="space-y-1 ml-4 mb-4">
                  <li>• Estabelecimentos do setor alimentício com operação em plataformas de delivery</li>
                  <li>• Empreendedores do food service que busquem aprimorar a apresentação visual de seus produtos</li>
                  <li>• Profissionais do marketing gastronômico e gestores de estabelecimentos alimentícios</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">5.2 Processo de Contratação</h3>
                <p className="mb-4">A contratação segue o seguinte fluxo:</p>
                <ol className="space-y-1 ml-4 mb-4">
                  <li>1. Cadastro na plataforma com informações completas e verídicas</li>
                  <li>2. Acesso à Área Logada para gestão de conta</li>
                  <li>3. Aquisição de créditos mediante pagamento integral</li>
                  <li>4. Utilização dos serviços conforme créditos disponíveis</li>
                </ol>

                <h3 className="text-xl font-medium mb-3">5.3 Condições de Pagamento</h3>
                <p className="mb-4">
                  <strong>Modalidades Aceitas:</strong> Pix e cartão de crédito<br/>
                  <strong>Condição Essencial:</strong> A utilização dos serviços está condicionada à aquisição prévia de créditos mediante pagamento integral
                </p>

                <h3 className="text-xl font-medium mb-3">5.4 Abrangência Territorial</h3>
                <p className="mb-4">
                  Os serviços são disponibilizados sem restrições geográficas, podendo ser acessados nacionalmente e internacionalmente, 
                  observadas as limitações técnicas e a legislação aplicável em cada jurisdição.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. OBRIGAÇÕES DAS PARTES</h2>
                
                <h3 className="text-xl font-medium mb-3">6.1 Obrigações da EMPRESA</h3>
                <p className="mb-4">A EMPRESA compromete-se a:</p>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">a) Prestação dos Serviços:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Processar imagens com tecnologia de inteligência artificial de qualidade profissional</li>
                    <li>• Disponibilizar até 3 (três) versões alternativas por imagem mediante solicitação</li>
                    <li>• Manter plataforma tecnológica confiável e segura</li>
                    <li>• Disponibilizar Área Logada para gestão transparente de créditos</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">b) Suporte Especializado:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Disponibilizar canal de atendimento através do e-mail contato@centraldocardapio.com.br</li>
                    <li>• Prestar esclarecimentos sobre funcionamento dos serviços</li>
                    <li>• Analisar e responder reclamações em prazo máximo de 10 (dez) dias úteis</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">c) Gestão de Créditos:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Processar estorno de créditos não consumidos em casos de insatisfação comprovada</li>
                    <li>• Manter registro transparente de consumo de créditos</li>
                  </ul>
                </div>

                <h3 className="text-xl font-medium mb-3">6.2 Obrigações do CONTRATANTE</h3>
                <p className="mb-4">O CONTRATANTE obriga-se a:</p>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">a) Fornecimento Lícito de Imagens:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Fornecer exclusivamente imagens sobre as quais possui direitos legítimos</li>
                    <li>• Garantir que todas as imagens foram obtidas por meios lícitos</li>
                    <li>• Limitar submissões a fotografias de cardápios de restaurantes</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">b) Responsabilidade pela Utilização:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Assumir total responsabilidade pela utilização das imagens processadas</li>
                    <li>• Verificar adequação das imagens processadas antes da utilização comercial</li>
                    <li>• Respeitar direitos de propriedade intelectual de terceiros</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">c) Manutenção de Dados:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Manter informações de cadastro atualizadas e verídicas</li>
                    <li>• Gerenciar adequadamente créditos adquiridos e sua validade</li>
                    <li>• Comunicar problemas técnicos identificados</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. LIMITAÇÕES DE RESPONSABILIDADE</h2>
                
                <h3 className="text-xl font-medium mb-3">7.1 Responsabilidade Limitada por Resultados Comerciais</h3>
                <p className="mb-3 font-semibold text-red-600">CLÁUSULA FUNDAMENTAL DE LIMITAÇÃO:</p>
                <p className="mb-4">
                  A EMPRESA não se responsabiliza por aumentos de vendas, atuando exclusivamente como fornecedora de tecnologia 
                  para aprimoramento da qualidade visual das imagens, que permitirão melhor divulgação dos produtos.
                </p>

                <h3 className="text-xl font-medium mb-3">7.2 Exclusão de Garantias Comerciais</h3>
                <p className="mb-4">A EMPRESA não garante:</p>
                <ul className="space-y-1 ml-4 mb-4">
                  <li>• Incremento de vendas ou receitas decorrente da utilização das imagens processadas</li>
                  <li>• Resultados comerciais específicos ou metas de performance</li>
                  <li>• Adequação das imagens a estratégias comerciais particulares</li>
                  <li>• Conformidade com padrões estéticos subjetivos não especificados</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">7.3 Limitação por Créditos Consumidos</h3>
                <p className="mb-4"><strong>Política de Estorno:</strong> Em caso de insatisfação com a qualidade das imagens geradas:</p>
                <ul className="space-y-1 ml-4 mb-4">
                  <li>• Créditos não consumidos: podem ser estornados</li>
                  <li>• Créditos consumidos: não serão estornados, ressalvado o direito de solicitar até 3 versões alternativas por imagem</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">7.4 Responsabilidade Exclusiva pela Utilização</h3>
                <p className="mb-4">
                  A utilização das imagens processadas é responsabilidade única e exclusiva do CONTRATANTE, 
                  que assume integralmente os riscos e consequências de sua aplicação comercial.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. POLÍTICAS DE CANCELAMENTO E REEMBOLSO</h2>
                
                <h3 className="text-xl font-medium mb-3">8.1 Ausência de Política de Reembolso Geral</h3>
                <p className="mb-4">
                  Considerando a natureza digital instantânea dos serviços, não são oferecidas políticas gerais de reembolso, 
                  ressalvados os casos específicos de:
                </p>
                <ul className="space-y-1 ml-4 mb-4">
                  <li>• Estorno de créditos não consumidos por insatisfação comprovada</li>
                  <li>• Vícios ou defeitos técnicos na prestação dos serviços</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">8.2 Direito de Cancelamento por Alteração de Termos</h3>
                <p className="mb-4">
                  <strong>Direito Assegurado:</strong> O CONTRATANTE possui direito de cancelamento dos serviços contratados 
                  em caso de discordância com alterações nos Termos de Uso, observado o prazo de 30 (trinta) dias da comunicação da alteração.
                </p>

                <h3 className="text-xl font-medium mb-3">8.3 Ausência de Políticas Específicas de Suspensão</h3>
                <p className="mb-4">
                  Não há políticas específicas para suspensão ou término de contas, aplicando-se as disposições gerais 
                  de resolução contratual previstas na legislação civil.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. RESOLUÇÃO DE CONFLITOS E COMUNICAÇÕES</h2>
                
                <h3 className="text-xl font-medium mb-3">9.1 Canal Oficial de Atendimento</h3>
                <p className="mb-4">
                  <strong>Comunicações Oficiais:</strong> Todas as reclamações, dúvidas, solicitações ou comunicações 
                  relacionadas aos serviços devem ser direcionadas exclusivamente ao e-mail contato@centraldocardapio.com.br.
                </p>
                <p className="mb-4">
                  <strong>Garantia de Resposta:</strong> Comprometemo-nos a analisar e responder todas as comunicações 
                  em prazo máximo de 10 (dez) dias úteis, contados do recebimento.
                </p>

                <h3 className="text-xl font-medium mb-3">9.2 Procedimento de Resolução de Disputas</h3>
                <p className="mb-4"><strong>Etapa Prévia Obrigatória:</strong> Antes de qualquer medida judicial, as partes comprometem-se a:</p>
                <ol className="space-y-1 ml-4 mb-4">
                  <li>1. Formalizar a reclamação por escrito através do canal oficial</li>
                  <li>2. Participar de tentativa de resolução amigável por prazo mínimo de 30 (trinta) dias</li>
                  <li>3. Considerar mediação extrajudicial quando apropriado</li>
                  <li>4. Esgotar as possibilidades de acordo direto entre as partes</li>
                </ol>

                <h3 className="text-xl font-medium mb-3">9.3 Foro de Eleição</h3>
                <p className="mb-4">
                  Para dirimir quaisquer controvérsias não resolvidas através dos métodos alternativos, fica eleito o 
                  Foro Central da Comarca de São Paulo, Estado de São Paulo, com renúncia expressa a qualquer outro, 
                  por mais privilegiado que seja.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. ALTERAÇÕES DOS TERMOS E COMUNICAÇÕES</h2>
                
                <h3 className="text-xl font-medium mb-3">10.1 Comunicação de Alterações</h3>
                <p className="mb-4">
                  <strong>Método de Comunicação:</strong> Alterações nos Termos de Uso serão comunicadas exclusivamente 
                  através de e-mail para o endereço cadastrado pelo CONTRATANTE.
                </p>
                <p className="mb-4">
                  <strong>Prazo de Antecedência:</strong> Alterações materiais serão comunicadas com antecedência 
                  mínima de 30 (trinta) dias da entrada em vigor.
                </p>

                <h3 className="text-xl font-medium mb-3">10.2 Direito de Cancelamento por Alteração</h3>
                <p className="mb-4">
                  <strong>Direito Assegurado:</strong> O CONTRATANTE que discordar das alterações poderá cancelar os 
                  serviços contratados no prazo de 30 (trinta) dias da comunicação, com direito ao estorno proporcional 
                  de créditos não consumidos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. DISPOSIÇÕES GERAIS E CLÁUSULAS FINAIS</h2>
                
                <h3 className="text-xl font-medium mb-3">11.1 Integralidade do Acordo</h3>
                <p className="mb-4">
                  <strong>Acordo Integral:</strong> Estes Termos de Uso, juntamente com a Política de Privacidade, 
                  constituem o acordo completo entre as partes, revogando todos os entendimentos anteriores relacionados ao objeto contratual.
                </p>

                <h3 className="text-xl font-medium mb-3">11.2 Independência das Cláusulas</h3>
                <p className="mb-4">
                  <strong>Princípio da Conservação:</strong> A eventual invalidade de qualquer disposição destes Termos 
                  não afetará a validade das demais cláusulas, que permanecerão em pleno vigor.
                </p>

                <h3 className="text-xl font-medium mb-3">11.3 Comunicações e Notificações</h3>
                <p className="mb-4"><strong>Endereços Oficiais:</strong></p>
                <div className="mb-4">
                  <p className="mb-2"><strong>EMPRESA:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• E-mail: contato@centraldocardapio.com.br</li>
                    <li>• Endereço: Rua Pais Leme, nº 215, Conjunto 1713, Pinheiros, São Paulo/SP, CEP 05.424-150</li>
                  </ul>
                  <p className="mt-3 mb-2"><strong>CONTRATANTE:</strong></p>
                  <p>Endereços fornecidos durante o cadastro e mantidos atualizados</p>
                </div>

                <h3 className="text-xl font-medium mb-3">11.4 Vigência</h3>
                <p className="mb-4">
                  Estes Termos permanecem válidos durante toda a relação contratual e até o integral cumprimento 
                  das obrigações por ambas as partes.
                </p>
              </section>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-8">
                <p className="font-semibold text-orange-800">
                  AO CONTRATAR NOSSOS SERVIÇOS, VOCÊ CONFIRMA TER LIDO, COMPREENDIDO E ACEITO INTEGRALMENTE ESTES TERMOS DE USO, 
                  ESPECIALMENTE AS CLÁUSULAS DE LIMITAÇÃO DE RESPONSABILIDADE E GESTÃO DE CRÉDITOS AQUI ESTABELECIDAS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;