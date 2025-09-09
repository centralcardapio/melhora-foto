import { Button } from "@/components/ui/button";
import { ChefHat, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/auth?mode=login");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="text-sm sm:text-xl font-bold text-foreground hidden xs:block">Fotos Profissionais</span>
          <span className="text-sm font-bold text-foreground block xs:hidden">FP</span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-6">
          <a 
            href="#antes-depois" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('antes-depois');
              if (element) {
                const y = element.offsetTop - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
          >
            Como Funciona
          </a>
          <a 
            href="#precos" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('precos');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Planos
          </a>
          <a 
            href="#faq" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('faq');
              if (element) {
                const y = element.offsetTop - 50;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
          >
            FAQ
          </a>
        </nav>

        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 text-xs sm:text-sm"
          onClick={handleLoginClick}
        >
          <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Entrar</span>
        </Button>
      </div>
    </header>
  );
};