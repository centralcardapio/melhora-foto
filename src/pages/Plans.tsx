import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PricingPlans } from "@/components/PricingPlans";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePaymentLink } from "@/hooks/usePaymentLink";

interface Plan {
  name: string;
  photos: number;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
}

const Plans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availableCredits, setAvailableCredits] = useState(0);
  const [hasUsedCredits, setHasUsedCredits] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { createPaymentLink } = usePaymentLink();

  // Fetch user's credit information
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;
      
      try {
        const { data: availableData, error: availableError } = await supabase.rpc('get_user_available_credits', {
          user_id_param: user.id
        });

        if (availableError) {
          console.error('Error fetching available credits:', availableError);
          return;
        }

        const { data: usageData, error: usageError } = await supabase
          .from('credit_usage_history')
          .select('amount_used')
          .eq('user_id', user.id)
          .limit(1);

        if (usageError && usageError.code !== 'PGRST116') {
          console.error('Error fetching usage history:', usageError);
        }

        setAvailableCredits(availableData || 0);
        setHasUsedCredits(usageData && usageData.length > 0);
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    fetchCredits();
  }, [user]);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = async () => {
    if (!selectedPlan || !user) return;
    
    setIsProcessing(true);
    
    try {
      toast.info("Preparando seu pagamento...");
      
      const paymentLink = await createPaymentLink({
        planName: selectedPlan.name,
        value: selectedPlan.price,
        userEmail: user.email || '',
        userName: user.user_metadata?.full_name || 'Cliente',
        userId: user.id, // ID do usuário no banco de dados
      });
      
      if (paymentLink?.url) {
        // Abre o link de pagamento em uma nova aba
        window.open(paymentLink.url, '_blank');
        // Redireciona para a página de status de pagamento
        navigate('/payment/status?status=pending');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao processar pagamento';
      toast.error(`Não foi possível processar o pagamento: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

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

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* Planos à esquerda */}
            <div className="xl:col-span-2">
              <PricingPlans onPlanSelect={handlePlanSelect} />
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
                  {selectedPlan ? (
                    <div className="border border-primary/30 rounded-lg p-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">{selectedPlan.name}</h3>
                        <p className="text-2xl font-bold">R$ {selectedPlan.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                      </div>
                      
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Fotos inclusas:</span>
                          <span className="font-medium">{selectedPlan.photos} fotos</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Processamento:</span>
                          <span className="text-green-500 font-medium">Prioritário</span>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          className="w-full"
                          onClick={handlePayment}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processando...' : 'Finalizar Compra'}
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground text-center">
                          Você será redirecionado para o ambiente seguro do Asaas
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-primary/30 rounded-lg p-6 text-center space-y-3">
                      <div className="text-muted-foreground text-sm">
                        Nenhum plano selecionado
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Selecione um plano ao lado para continuar
                      </p>
                    </div>
                  )}

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


                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      Pagamento 100% seguro via Asaas
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