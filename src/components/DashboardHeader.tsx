import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChefHat, Camera, User, ShoppingCart, LogOut, ChevronDown, Eye, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [availablePhotos, setAvailablePhotos] = useState<number | null>(null);

  // Fetch available credits using the new system
  useEffect(() => {
    const fetchAvailableCredits = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.rpc('get_user_available_credits', {
            user_id_param: user.id
          });

          if (error) {
            console.error('Error fetching available credits:', error);
            return;
          }

          setAvailablePhotos(data || 0);
        } catch (error) {
          console.error('Error fetching available credits:', error);
        }
      }
    };

    fetchAvailableCredits();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
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
              <DropdownMenuItem onClick={() => navigate("/credit-statement")}>
                <FileText className="h-4 w-4 mr-2" />
                Extrato de créditos
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
  );
};