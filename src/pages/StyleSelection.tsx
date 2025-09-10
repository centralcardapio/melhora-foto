import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, ArrowLeft } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
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
  const { user, checkUserStyle } = useAuth();
  const { toast } = useToast();
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasPendingPhotos, setHasPendingPhotos] = useState(false);
  
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

  // Check if user already has a selected style and if there are pending photos
  useEffect(() => {
    // Check for pending photos
    const pendingPhotos = localStorage.getItem('pendingPhotos');
    if (pendingPhotos) {
      setHasPendingPhotos(true);
    }

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

    setIsLoading(true);
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

      // Update the AuthContext state
      await checkUserStyle();

      // Check if there are pending photos to process
      const pendingPhotos = localStorage.getItem('pendingPhotos');
      if (pendingPhotos) {
        // Clear pending photos and redirect to dashboard
        localStorage.removeItem('pendingPhotos');
        navigate("/dashboard?autoStart=true");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Error saving style:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o estilo selecionado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {hasPendingPhotos ? 
                "Escolha o estilo antes de processar suas fotos" : 
                "Escolha o estilo que melhor representa o seu restaurante"
              }
            </h1>
            <div className="max-w-6xl mx-auto">
              <div className={`border rounded-lg p-4 sm:p-6 ${
                hasPendingPhotos ? 
                  'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' :
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
                <p className={`text-sm sm:text-base ${
                  hasPendingPhotos ? 
                    'text-orange-800 dark:text-orange-200' : 
                    'text-blue-800 dark:text-blue-200'
                }`}>
                  {hasPendingPhotos ? (
                    <>
                      <strong>⚠️ Atenção:</strong> Você tem fotos aguardando processamento. Selecione um estilo para continuar com a transformação.
                    </>
                  ) : (
                    <>
                      <strong>💡 Dica importante:</strong> A seleção adequada do estilo conforme o perfil do seu restaurante é essencial para otimizar suas fotos de acordo com o perfil dos seus clientes e maximizar a conversão de vendas.
                    </>
                  )}
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

          <div className="flex justify-center px-4">
            <Button 
              onClick={handleContinue} 
              size="lg"
              disabled={isLoading || !selectedStyle}
              className={`px-6 sm:px-12 py-4 text-sm sm:text-lg w-full sm:w-auto ${selectedStyle ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-400 text-gray-600 cursor-default'}`}
            >
              {isLoading ? (
                "Salvando estilo..."
              ) : hasPendingPhotos ? (
                <>
                  <span className="hidden sm:inline">Processar fotos com este estilo</span>
                  <span className="sm:hidden">Processar fotos</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Profissionalizar fotos com o estilo escolhido</span>
                  <span className="sm:hidden">Continuar com estilo escolhido</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>;
};
export default StyleSelection;