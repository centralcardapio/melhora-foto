import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChefHat, Camera, User, ShoppingCart, LogOut, ChevronDown } from "lucide-react";
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
  const [availablePhotos, setAvailablePhotos] = useState(0);

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
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Fotos Profissionais</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                <Camera className="h-3 w-3 mr-1" />
                {availablePhotos} fotos disponíveis
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold">
              Olá, {user.user_metadata?.full_name || user.email}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/style-selection")}>
                <User className="h-4 w-4 mr-2" />
                Alterar estilo
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => navigate("/plans")}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Comprar mais fotos
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span className="font-bold">{user.user_metadata?.full_name || user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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

          {availablePhotos > 0 ? (
            // User has credits - show photo upload/selection
            <PhotoUpload availablePhotos={availablePhotos} />
          ) : (
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
          )}
        </div>
      </main>
    </div>;
};
export default Dashboard;