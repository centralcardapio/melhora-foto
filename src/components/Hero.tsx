import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Sparkles, TrendingUp } from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";
export const Hero = () => {
  return <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-[42px] lg:py-[111px]">
      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Sparkles className="h-3 w-3 mr-1" />
                Tecnologia IA Avançada
              </Badge>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Transforme suas fotos de
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> cardápio</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Consolidamos as melhores técnicas de fotografia profissional com IA para tornar seus pratos irresistíveis e aumentar suas vendas no delivery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg py-6 px-[109px] mx-[76px]">
                <Camera className="h-5 w-5 mr-2" />
                Transformar Fotos Agora
              </Button>
              
              
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+57%</div>
                <div className="text-sm text-muted-foreground">Aumento médio em vendas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mx-[24px]">15x</div>
                <div className="text-sm text-muted-foreground">Mais barato que fotógrafo profissional</div>
              </div>
              
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img src={heroFood} alt="Fotos profissionais de comida" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-background rounded-2xl p-6 shadow-xl border">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="font-semibold">Vendas aumentaram</div>
                  <div className="text-sm text-muted-foreground">em 57% no primeiro mês</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};