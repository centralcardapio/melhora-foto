import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChefHat, Camera, User, ShoppingCart, LogOut, ChevronDown, Eye } from "lucide-react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { PricingPlans } from "@/components/PricingPlans";
import { supabase } from "@/integrations/supabase/client";
const Dashboard = () => {
  const {
    user,
    signOut,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [availablePhotos, setAvailablePhotos] = useState<number | null>(null);

  // Fetch photo credits from database
  useEffect(() => {
    const fetchPhotoCredits = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('photo_credits')
            .select('available')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching photo credits:', error);
            return;
          }

          setAvailablePhotos(data?.available || 0);
        } catch (error) {
          console.error('Error fetching photo credits:', error);
        }
      }
    };

    fetchPhotoCredits();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Redirect to Plans if user has 0 credits (only after credits are loaded)
  useEffect(() => {
    if (user && availablePhotos === 0) {
      navigate("/plans");
    }
  }, [user, availablePhotos, navigate]);
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>;
  }
  if (!user) {
    return null;
  }
  return <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-sm sm:text-xl font-bold text-foreground hidden sm:block">Fotos Profissionais</span>
            </div>
            
            <div className="hidden md:flex items-center gap-3">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                <Camera className="h-3 w-3 mr-1" />
                {availablePhotos ?? 0} fotos
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm"
                onClick={() => navigate("/plans")}
              >
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden lg:inline">Comprar mais fotos</span>
                <span className="lg:hidden">Comprar</span>
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <span className="font-bold truncate max-w-[100px] sm:max-w-none">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <Camera className="h-4 w-4 mr-2" />
                  Seleção de fotos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/photo-results")}>
                  <Eye className="h-4 w-4 mr-2" />
                  Resultados
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/style-selection")}>
                  <User className="h-4 w-4 mr-2" />
                  Seleção de estilo
                </DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden" onClick={() => navigate("/plans")}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Comprar mais fotos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo à criação das fotos profissionais do seu cardápio</p>
          </div>

          {availablePhotos !== null && availablePhotos > 0 ? (
            // User has credits - show photo upload/selection
            <PhotoUpload 
              availablePhotos={availablePhotos ?? 0} 
              onProcessingComplete={() => navigate("/photo-results")}
            />
          ) : availablePhotos === 0 ? (
            // User has no credits - show pricing plans
            <Card>
              <CardHeader>
                <CardTitle>Planos Disponíveis</CardTitle>
                <CardDescription>
                  Escolha um dos planos disponíveis para começar a transformar suas fotos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PricingPlans />
              </CardContent>
            </Card>
          ) : (
            // Loading credits
            <div className="text-center py-8">
              <ChefHat className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Carregando créditos...</p>
            </div>
          )}
        </div>
      </main>
    </div>;
};
export default Dashboard;