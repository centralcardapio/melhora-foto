import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Smartphone, DollarSign, Clock, Shield, TrendingUp } from "lucide-react";
const benefits = [{
  icon: Star,
  title: "Fotos Mais Apetitosas",
  description: "Aplicamos técnicas profissionais de fotografia gastronômica para destacar o melhor de cada prato",
  highlight: "Mais apetitoso"
}, {
  icon: TrendingUp,
  title: "Melhora Posicionamento",
  description: "Apps de delivery valorizam fotos de qualidade, melhorando seu ranking e visibilidade",
  highlight: "Maior visibilidade"
}, {
  icon: Shield,
  title: "Mantém Aspecto Real",
  description: "Suas fotos continuam fiéis ao produto real - apenas com aparência mais profissional",
  highlight: "100% autêntico"
}, {
  icon: Smartphone,
  title: "Foto com Celular",
  description: "Tire fotos com seu próprio celular - nossa IA cuida de todos os detalhes profissionais",
  highlight: "Sem equipamento"
}, {
  icon: DollarSign,
  title: "Custo Benefício",
  description: "Muito mais barato que contratar um fotógrafo profissional para todo o cardápio",
  highlight: "10x mais barato"
}, {
  icon: Clock,
  title: "Resultado Rápido",
  description: "Processamento em minutos - não precisa esperar dias para ter suas fotos prontas",
  highlight: "Em 2 minutos"
}];
export const Benefits = () => {
  return <section id="como-funciona" className="bg-muted/30 py-[57px]">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Por que escolher nossa
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> solução?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transformamos fotos amadoras em imagens profissionais que transmitem confiança e despertam o apetite dos seus clientes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {benefit.highlight}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>
    </section>;
};