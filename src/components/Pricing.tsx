import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Camera, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
const plans = [{
  name: "Degustação",
  photos: 10,
  price: 99,
  description: "Ideal para testar nossa tecnologia",
  features: ["<strong>10 fotos profissionais</strong>", "Download individual", "Download em lote", "Suporte via e-mail"],
  popular: false
}, {
  name: "Chef",
  photos: 20,
  price: 149,
  description: "Perfeito para cardápios médios",
  features: ["<strong>20 fotos profissionais</strong>", "<strong>Importação de fotos de plataformas de delivery</strong>", "Processamento prioritário", "Download individual", "Download em lote", "Suporte via e-mail"],
  popular: true
}, {
  name: "Reserva",
  photos: 30,
  price: 199,
  description: "Para cardápios completos",
  features: ["<strong>30 fotos profissionais</strong>", "<strong>Importação de fotos de plataformas de delivery</strong>", "Processamento prioritário", "Download individual", "Download em lote", "Suporte via e-mail"],
  popular: false
}];
export const Pricing = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (planName: string) => {
    navigate(`/auth?plan=${encodeURIComponent(planName)}`);
  };

  return <section id="precos" className="py-20">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Escolha o plano ideal para o seu cardápio</span>
          </h2>
          
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-xl">Créditos válidos por 30 dias</span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, index) => <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} transition-all duration-300 hover:shadow-lg flex flex-col`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Mais Popular
                  </Badge>
                </div>}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold">R$ {plan.price}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1">
                {plan.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="text-sm" dangerouslySetInnerHTML={{
                __html: feature
              }}></span>
                  </div>)}
              </CardContent>

              <CardFooter className="mt-auto">
                <Button 
                  variant={plan.popular ? "hero" : "default"} 
                  className="w-full" 
                  size="lg"
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Transformar Fotos Agora
                </Button>
              </CardFooter>
            </Card>)}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Todos os planos incluem processamento com IA avançada e garantia de satisfação
          </p>
        </div>
      </div>
    </section>;
};