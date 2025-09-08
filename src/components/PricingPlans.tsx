import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Degustação",
    photos: 10,
    price: 49,
    description: "Ideal para testar nossa tecnologia",
    features: ["<strong>10 fotos profissionais</strong>", "Download individual", "Download em lote", "Suporte via e-mail"],
    popular: false
  },
  {
    name: "Chef",
    photos: 30,
    price: 99,
    description: "Perfeito para cardápios médios",
    features: ["<strong>30 fotos profissionais</strong>", "<strong>Importação de fotos de plataformas de delivery</strong>", "Processamento prioritário", "Download individual", "Download em lote", "Suporte via e-mail"],
    popular: true
  },
  {
    name: "Reserva",
    photos: 50,
    price: 149,
    description: "Para cardápios completos",
    features: ["<strong>50 fotos profissionais</strong>", "<strong>Importação de fotos de plataformas de delivery</strong>", "Processamento prioritário", "Download individual", "Download em lote", "Suporte via e-mail"],
    popular: false
  }
];

export const PricingPlans = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (planName: string) => {
    // TODO: Implement payment flow
    console.log(`Selected plan: ${planName}`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
      {plans.map((plan, index) => (
        <Card 
          key={index} 
          className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} transition-all duration-300 hover:shadow-lg flex flex-col cursor-pointer hover:border-primary/50`}
          onClick={() => handlePlanSelect(plan.name)}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                Mais Popular
              </Badge>
            </div>
          )}
          
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
            {plan.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-success flex-shrink-0" />
                <span className="text-sm" dangerouslySetInnerHTML={{ __html: feature }}></span>
              </div>
            ))}
          </CardContent>

          <CardFooter className="mt-auto">
            <div className="w-full text-center py-4 bg-muted/30 rounded-lg">
              <Camera className="h-5 w-5 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Clique para selecionar</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};