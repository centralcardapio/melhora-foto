import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
export const BeforeAfter = () => {
  return <section id="antes-depois" className="bg-gradient-to-br from-background to-muted/20 py-[13px]">
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
            Nossa solução aplica técnicas avançadas de fotografia profissional incluindo iluminação, composição e realce de cores para tornar seus pratos irresistíveis
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* ANTES */}
            <div className="space-y-4">
              <Card className="overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src="/lovable-uploads/b1837eb4-00a7-4669-8b54-7dad2438e2d2.png" 
                      alt="Foto amadora de hambúrguer com iluminação ruim" 
                      className="w-full h-[300px] md:h-[400px] object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="destructive" className="text-sm font-bold">
                        ANTES
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Foto Amadora</h3>
                <p className="text-muted-foreground">Iluminação ruim, cores opacas, sem apelo visual</p>
              </div>
            </div>

            {/* Seta central */}
            <div className="flex justify-center lg:justify-start">
              <div className="bg-primary rounded-full p-4 shadow-lg">
                <ArrowRight className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>

            {/* DEPOIS */}
            <div className="space-y-4 lg:col-start-2 lg:row-start-1">
              <Card className="overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src="/lovable-uploads/81458f3f-c86e-44ca-8710-af37b95899cd.png" 
                      alt="Foto profissional de hambúrguer com iluminação perfeita" 
                      className="w-full h-[300px] md:h-[400px] object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                    <div className="absolute top-4 left-4">
                      <Badge className="text-sm font-bold bg-green-600 hover:bg-green-700">
                        DEPOIS
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Foto Profissional</h3>
                <p className="text-muted-foreground">Cores vibrantes, iluminação perfeita, super apetitosa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};