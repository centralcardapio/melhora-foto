import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChefHat } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PhotoUpload } from "@/components/PhotoUpload";
import { PricingPlans } from "@/components/PricingPlans";
import { supabase } from "@/integrations/supabase/client";
const Dashboard = () => {
  const { user, loading } = useAuth();
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
      <DashboardHeader />

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