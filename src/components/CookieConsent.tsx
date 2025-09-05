import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowConsent(false);
  };

  const closeBanner = () => {
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            A Fotos Profissionais utiliza cookies e outras tecnologias semelhantes para melhorar a sua experiência, de acordo com a nossa{" "}
            <a 
              href="/politica-privacidade" 
              className="text-primary hover:underline font-medium"
            >
              Política de Privacidade
            </a>
            , ao continuar navegando, você concorda com estas condições.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={acceptCookies}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            Entendi
          </Button>
          <Button
            onClick={closeBanner}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;