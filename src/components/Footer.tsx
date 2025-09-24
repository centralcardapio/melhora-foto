import { ChefHat } from "lucide-react";
export const Footer = () => {
  return <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Fotos Profissionais</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Transformando fotos de cardápio com inteligência artificial para aumentar suas vendas no delivery.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Produto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => {
                const element = document.getElementById('antes-depois');
                if (element) {
                  const y = element.offsetTop - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }} className="hover:text-foreground transition-colors cursor-pointer">Como Funciona</button></li>
              <li><a 
                href="#precos" 
                className="hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('precos');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >Planos</a></li>
              <li><button onClick={() => {
                const element = document.getElementById('faq');
                if (element) {
                  const y = element.offsetTop - 50;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }} className="hover:text-foreground transition-colors cursor-pointer">FAQ</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:contato@centraldocardapio.com.br" className="hover:text-foreground transition-colors">Fale Conosco</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/politica-privacidade" className="hover:text-foreground transition-colors">Política de Privacidade</a></li>
              <li><a href="/termos-de-servico" className="hover:text-foreground transition-colors">Termos e Condições</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Central do Cardápio. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Desenvolvido com <span className="text-orange-500">🧡</span> para restaurantes brasileiros
          </p>
        </div>
      </div>
    </footer>;
};