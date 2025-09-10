import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChefHat } from "lucide-react";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const { user, loading, hasSelectedStyle } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // User is authenticated, check if they have selected a style
      if (hasSelectedStyle === false) {
        // User needs to select a style first
        navigate("/style-selection", { replace: true });
      } else {
        // User has style selected, redirect to dashboard
        navigate("/dashboard", { replace: true });
      }
    } else if (!loading && !user) {
      // User is not authenticated
      navigate("/", { replace: true });
    }
  }, [user, loading, hasSelectedStyle, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <ChefHat className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
};

export default AuthRedirect;