import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import beforeAfterDemo from "@/assets/before-after-demo.jpg";

export const BeforeAfter = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Veja a Transformação
          </Badge>
          
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            De foto amadora para
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> profissional</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nossa IA aplica técnicas avançadas de iluminação, composição e realce de cores para tornar seus pratos irresistíveis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={beforeAfterDemo} 
                  alt="Comparação antes e depois do processamento de foto de comida"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="bg-background/90 backdrop-blur rounded-lg p-4 text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-1">ANTES</div>
                      <div className="text-lg font-bold">Foto Amadora</div>
                      <div className="text-xs text-muted-foreground">Iluminação ruim, cores opacas</div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="bg-primary rounded-full p-3">
                        <ArrowRight className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                    
                    <div className="bg-background/90 backdrop-blur rounded-lg p-4 text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-1">DEPOIS</div>
                      <div className="text-lg font-bold">Foto Profissional</div>
                      <div className="text-xs text-muted-foreground">Cores vibrantes, super apetitosa</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3 mt-12">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold">Upload da Foto</h3>
              <p className="text-sm text-muted-foreground">Envie sua foto tirada com celular</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold">IA Processa</h3>
              <p className="text-sm text-muted-foreground">Nossa IA aplica técnicas profissionais</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <span className="text-success font-bold">3</span>
              </div>
              <h3 className="font-semibold">Download</h3>
              <p className="text-sm text-muted-foreground">Baixe sua foto profissional</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};