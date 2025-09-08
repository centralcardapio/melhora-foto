import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import all style images
import classicoItalianoImg from "@/assets/classico-italiano.jpg";
import pubModernoImg from "@/assets/pub-moderno.jpg";
import cafeAconchegante from "@/assets/cafe-aconchegante.jpg";
import modernoGourmet from "@/assets/moderno-gourmet.jpg";
import cleanMinimalista from "@/assets/clean-minimalista.jpg";
import altaGastronomia from "@/assets/alta-gastronomia.jpg";
import contemporaneoAsiatico from "@/assets/contemporaneo-asiatico.jpg";
import saudavelVibrante from "@/assets/saudavel-vibrante.jpg";
import rusticoMadeira from "@/assets/rustico-madeira.jpg";

const StyleSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const styles = [
    {
      id: "classico-italiano",
      name: "Clássico Italiano",
      description: "Prato rústico com massa, fundo escuro, madeira e luz suave",
      image: classicoItalianoImg
    },
    {
      id: "pub-moderno",
      name: "Pub Moderno",
      description: "Ambientação urbana e bebida ao fundo",
      image: pubModernoImg
    },
    {
      id: "cafe-aconchegante",
      name: "Café Aconchegante",
      description: "Prato acompanhado de bebida quente, luz quente e composição afetiva",
      image: cafeAconchegante
    },
    {
      id: "rustico-madeira",
      name: "Rústico de Madeira",
      description: "Fundo de madeira e estilo acolhedor",
      image: rusticoMadeira
    },
    {
      id: "contemporaneo-asiatico",
      name: "Contemporâneo Asiático",
      description: "Louça escura, fundo neutro, composição refinada",
      image: contemporaneoAsiatico
    },
    {
      id: "moderno-gourmet",
      name: "Moderno Gourmet",
      description: "Prato sofisticado, louça texturizada, fundo neutro",
      image: modernoGourmet
    },
    {
      id: "saudavel-vibrante",
      name: "Saudável & Vibrante",
      description: "Ingredientes frescos e bebida natural",
      image: saudavelVibrante
    },
    {
      id: "clean-minimalista",
      name: "Clean & Minimalista",
      description: "Prato leve, fundo branco, composição centralizada",
      image: cleanMinimalista
    },
    {
      id: "alta-gastronomia",
      name: "Alta Gastronomia",
      description: "Montagem artística, fundo escuro, taça de vinho",
      image: altaGastronomia
    }
  ];

  // Check if user already has a selected style
  useEffect(() => {
    const checkExistingStyle = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_styles')
          .select('selected_style')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking existing style:', error);
          return;
        }

        if (data?.selected_style) {
          setSelectedStyle(data.selected_style);
        }
      } catch (error) {
        console.error('Error checking existing style:', error);
      }
    };

    checkExistingStyle();
  }, [user]);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleContinue = async () => {
    if (!selectedStyle) {
      alert('É necessário escolher um estilo para avançar');
      return;
    }

    if (!user) {
      // If no user, save to localStorage and redirect to auth
      localStorage.setItem('selectedStyle', selectedStyle);
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from('user_styles')
        .upsert({
          user_id: user.id,
          selected_style: selectedStyle,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error('Error saving style:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o estilo selecionado. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  return <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Fotos Profissionais</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Escolha o estilo que melhor representa o seu restaurante</h1>
            <div className="max-w-6xl mx-auto">
              <p className="text-muted-foreground mb-4">
            </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="text-base text-blue-800 dark:text-blue-200">
                  <strong>💡 Dica importante:</strong> A seleção adequada do estilo conforme o perfil do seu restaurante é essencial para otimizar suas fotos de acordo com o perfil dos seus clientes e maximizar a conversão de vendas.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map(style => <Card key={style.id} className={`cursor-pointer transition-all hover:shadow-lg ${selectedStyle === style.id ? 'ring-2 ring-primary' : ''}`} onClick={() => handleStyleSelect(style.id)}>
                <CardHeader className="p-0">
                  <img src={style.image} alt={style.name} className="w-full h-48 object-cover rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg">{style.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {style.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={handleContinue} 
              size="lg"
              className={`px-12 py-4 text-lg ${selectedStyle ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-400 text-gray-600 cursor-default'}`}
            >
              Profissionalizar fotos com o estilo escolhido
            </Button>
          </div>
        </div>
      </main>
    </div>;
};
export default StyleSelection;