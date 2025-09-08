import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, ArrowLeft, Check } from "lucide-react";
import { PricingPlans } from "@/components/PricingPlans";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Plans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availableCredits, setAvailableCredits] = useState(0);
  const [hasUsedCredits, setHasUsedCredits] = useState(false);

  // Fetch user's credit information
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('photo_credits')
          .select('available, total_used')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching credits:', error);
          return;
        }

        setAvailableCredits(data?.available || 0);
        setHasUsedCredits((data?.total_used || 0) > 0);
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    fetchCredits();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Fotos Profissionais</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Escolha seu
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Plano</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Selecione o plano ideal para transformar as fotos do seu cardápio em imagens profissionais
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Planos à esquerda */}
            <div className="lg:col-span-2">
              <PricingPlans />
            </div>

            {/* Checkout à direita */}
            <div className="space-y-6">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                  <CardDescription>
                    Seus dados de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-dashed border-primary/30 rounded-lg p-6 text-center space-y-3">
                    <div className="text-muted-foreground text-sm">
                      Nenhum plano selecionado
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Selecione um plano ao lado para continuar
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      Processamento por IA avançada
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      Download em alta qualidade
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      Suporte técnico incluso
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      Garantia de satisfação
                    </div>
                  </div>

                  {/* Show free trial button if user hasn't used their initial credits */}
                  {user && availableCredits > 0 && !hasUsedCredits && (
                    <div className="pt-4 border-t">
                      <Button 
                        variant="default" 
                        size="lg"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => navigate("/dashboard")}
                      >
                        Experimentar 2 fotos profissionais gratuitas
                      </Button>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      Pagamento 100% seguro via Stripe
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Plans;