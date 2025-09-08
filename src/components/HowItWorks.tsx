import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Upload, CheckCircle, Download } from "lucide-react";
export const HowItWorks = () => {
  const steps = [{
    icon: Palette,
    title: "Selecionar o estilo do seu restaurante",
    description: "Escolha entre 9 estilos profissionais que melhor representam a identidade visual do seu estabelecimento."
  }, {
    icon: Upload,
    title: "Selecionar as fotos",
    description: "Via upload direto ou importação direta do cardápio do iFood para máxima praticidade."
  }, {
    icon: CheckCircle,
    title: "Validar ou ajustar as fotos processadas",
    description: "Revise e aprove as transformações feitas pela nossa IA ou solicite ajustes se necessário."
  }, {
    icon: Download,
    title: "Download das fotos para vender mais!",
    description: "Baixe suas fotos profissionais em alta qualidade e comece a aumentar suas vendas no delivery."
  }];
  return <section className="bg-muted/30 py-20">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">
            Processo Simples
          </Badge>
          
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Como
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Funciona</span>
          </h2>
          
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => <Card key={index} className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="text-xs font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </Badge>
                </div>
                
                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold leading-tight">
                  {step.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};