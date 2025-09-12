import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  photos: number;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
}

interface PricingPlansProps {
  onPlanSelect: (plan: Plan) => void;
}

const plans: Plan[] = [
  {
    name: "Degustação",
    photos: 10,
    price: 99,
    description: "Ideal para testar nossa tecnologia",
    features: ["<strong>10 fotos profissionais</strong>", "Download individual", "Download em lote", "Suporte via e-mail"],
    popular: false
  },
  {
    name: "Chef",
    photos: 20,
    price: 159,
    description: "Perfeito para cardápios médios",
    features: ["<strong>20 fotos profissionais</strong>", "<strong>Importação de fotos de plataformas de delivery</strong>", "Processamento prioritário", "Download individual", "Download em lote", "Suporte via e-mail"],
    popular: true
  },
  {
    name: "Reserva",
    photos: 30,
    price: 219,
    description: "Para cardápios completos",
    features: ["<strong>30 fotos profissionais</strong>", "<strong>Importação de fotos de plataformas de delivery</strong>", "Processamento prioritário", "Download individual", "Download em lote", "Suporte via e-mail"],
    popular: false
  }
];

export const PricingPlans = ({ onPlanSelect }: PricingPlansProps) => {
  const handlePlanSelect = (plan: Plan) => {
    onPlanSelect(plan);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
      {plans.map((plan, index) => (
        <Card 
          key={index} 
          className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} transition-all duration-300 hover:shadow-lg flex flex-col cursor-pointer hover:border-primary/50`}
          onClick={() => handlePlanSelect(plan)}
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
        </Card>
      ))}
      </div>
      
    </div>
  );
};