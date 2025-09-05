import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, ArrowLeft } from "lucide-react";

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
  const [selectedStyle, setSelectedStyle] = useState<string>("");

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
      description: "Prato robusto, ambientação urbana, bebida ao fundo",
      image: pubModernoImg
    },
    {
      id: "cafe-aconchegante",
      name: "Café Aconchegante",
      description: "Sobremesa acompanhada de bebida quente, luz quente e composição afetiva",
      image: cafeAconchegante
    },
    {
      id: "moderno-gourmet",
      name: "Moderno Gourmet",
      description: "Prato sofisticado, louça texturizada, fundo neutro",
      image: modernoGourmet
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
    },
    {
      id: "contemporaneo-asiatico",
      name: "Contemporâneo Asiático",
      description: "Louça escura, fundo neutro, composição refinada", 
      image: contemporaneoAsiatico
    },
    {
      id: "saudavel-vibrante",
      name: "Saudável & Vibrante",
      description: "Ingredientes frescos e bebida natural",
      image: saudavelVibrante
    },
    {
      id: "rustico-madeira",
      name: "Rústico de Madeira",
      description: "Fundo de madeira e estilo acolhedor",
      image: rusticoMadeira
    }
  ];

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleContinue = () => {
    // Save selected style to localStorage for now
    // Later this should be saved to the database
    localStorage.setItem('selectedStyle', selectedStyle);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">FotoCardápio IA</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Selecione o Estilo</h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-muted-foreground mb-4">
                Escolha o estilo que melhor representa o seu restaurante
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>💡 Dica importante:</strong> A seleção adequada do estilo conforme o perfil do seu restaurante é essencial para otimizar suas fotos de acordo com o perfil dos seus clientes e maximizar a conversão de vendas.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style) => (
              <Card 
                key={style.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedStyle === style.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleStyleSelect(style.id)}
              >
                <CardHeader className="p-0">
                  <img 
                    src={style.image} 
                    alt={style.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg">{style.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {style.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedStyle && (
            <div className="flex justify-center">
              <Button onClick={handleContinue} size="lg">
                Selecionar fotos
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StyleSelection;