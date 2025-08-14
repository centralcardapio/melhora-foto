import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const faqs = [{
  question: "Como funciona o processamento das fotos?",
  answer: "Nossa inteligência artificial analisa cada foto e aplica automaticamente técnicas profissionais de fotografia gastronômica, como ajuste de iluminação, saturação de cores, contraste e composição para tornar seus pratos mais apetitosos."
}, {
  question: "As fotos mantêm o aspecto real dos pratos?",
  answer: "Sim! Nossa tecnologia apenas melhora a apresentação visual da foto, mantendo o aspecto autêntico do prato. Não criamos elementos que não existem - apenas realçamos o que já está presente na imagem original."
}, {
  question: "Quanto tempo demora o processamento?",
  answer: "O processamento é bem rápido! A maioria das fotos fica pronta em até 2 minutos. Para clientes dos planos Professional e Complete, oferecemos processamento prioritário."
}, {
  question: "Que tipo de foto posso enviar?",
  answer: "Você pode enviar fotos tiradas com celular, câmera digital ou qualquer dispositivo. Recomendamos fotos com boa resolução e que mostrem bem o prato. Nossa IA trabalha melhor com fotos que não estejam muito escuras."
}, {
  question: "Posso reprovar uma foto e gerar nova versão?",
  answer: "Sim! Se você não gostar do resultado, pode reprovar a foto e nossa IA gerará 2 novas versões para você escolher. Clientes dos planos Professional e Complete têm reprocessamento gratuito incluso."
}, {
  question: "Os créditos têm prazo de validade?",
  answer: "Sim, todos os créditos são válidos por 30 dias a partir da data da compra. Recomendamos processar suas fotos logo após a aquisição do plano."
}, {
  question: "Como faço o download das fotos?",
  answer: "Você pode fazer download individual de cada foto ou baixar todas de uma vez em um arquivo compactado. As fotos processadas ficam disponíveis na sua área do usuário."
}, {
  question: "Existe garantia de satisfação?",
  answer: "Sim! Oferecemos garantia de satisfação. Se você não ficar satisfeito com os resultados, entre em contato conosco e faremos o possível para resolver a situação."
}];
export const FAQ = () => {
  return <section id="faq" className="bg-muted/30 py-[20px]">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Perguntas
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Frequentes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tire suas dúvidas sobre como nossa tecnologia funciona
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6 bg-background/50">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </div>
    </section>;
};