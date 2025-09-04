import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, ArrowLeft } from "lucide-react";

const StyleSelection = () => {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState<string>("");

  const styles = [
    {
      id: "professional",
      name: "Profissional",
      description: "Fotos com iluminação profissional e fundo neutro",
      image: "https://picsum.photos/300/200?random=style1"
    },
    {
      id: "rustic",
      name: "Rústico",
      description: "Estilo caseiro com elementos naturais",
      image: "https://picsum.photos/300/200?random=style2"
    },
    {
      id: "elegant",
      name: "Elegante",
      description: "Apresentação sofisticada com detalhes refinados",
      image: "https://picsum.photos/300/200?random=style3"
    }
  ];

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleContinue = () => {
    // Here you would save the selected style to the database
    // For now, we'll just navigate to the dashboard
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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Selecione o Estilo</h1>
            <p className="text-muted-foreground mt-2">
              Escolha o estilo que melhor representa o seu restaurante
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Continuar com estilo selecionado
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StyleSelection;