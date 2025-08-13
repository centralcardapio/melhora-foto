import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Camera, Clock } from "lucide-react";

const plans = [
  {
    name: "Mini",
    photos: 10,
    price: 49,
    description: "Ideal para testar nossa tecnologia",
    features: [
      "10 fotos melhoradas",
      "Processamento em até 2 minutos",
      "Download individual",
      "Download em lote",
      "Suporte via email"
    ],
    popular: false
  },
  {
    name: "Professional",
    photos: 20,
    price: 79,
    description: "Perfeito para cardápios médios",
    features: [
      "20 fotos melhoradas",
      "Processamento prioritário",
      "Download individual",
      "Download em lote",
      "Suporte via email",
      "Reprocessamento gratuito"
    ],
    popular: true
  },
  {
    name: "Complete",
    photos: 30,
    price: 99,
    description: "Para cardápios completos",
    features: [
      "30 fotos melhoradas",
      "Processamento prioritário",
      "Download individual",
      "Download em lote",
      "Suporte prioritário",
      "Reprocessamento gratuito",
      "Consultoria de cardápio"
    ],
    popular: false
  }
];

export const Pricing = () => {
  return (
    <section id="precos" className="py-20">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Planos que cabem no seu
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> orçamento</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha o plano ideal para o tamanho do seu cardápio. Todos os créditos são válidos por 30 dias.
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Créditos válidos por 30 dias</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} transition-all duration-300 hover:shadow-lg`}>
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
                    <span className="text-4xl font-bold">R${plan.price}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{plan.photos} fotos</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button 
                  variant={plan.popular ? "hero" : "default"} 
                  className="w-full"
                  size="lg"
                >
                  Começar Agora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Todos os planos incluem processamento com IA avançada e garantia de satisfação
          </p>
        </div>
      </div>
    </section>
  );
};