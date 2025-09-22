import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { translateErrorMessage } from "@/lib/errorMessages";

const validatePassword = (password: string) => {
  const errors = [];
  if (password.length < 8) errors.push("Comprimento mínimo: A senha deve ter pelo menos 8 caracteres");
  if (!/[A-Z]/.test(password)) errors.push("Letra maiúscula: Deve conter ao menos uma letra maiúscula");
  if (!/[a-z]/.test(password)) errors.push("Letra minúscula: Deve conter ao menos uma letra minúscula");
  if (!/[0-9]/.test(password)) errors.push("Número: Deve conter ao menos um número");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push("Caractere especial: Deve conter ao menos um caractere especial");
  return errors;
};

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há tokens de reset na URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    const tokenHash = searchParams.get('token_hash');
    
    console.log('Parâmetros da URL:', { 
      accessToken: !!accessToken, 
      refreshToken: !!refreshToken, 
      token: !!token, 
      type, 
      tokenHash: !!tokenHash,
      fullUrl: window.location.href 
    });
    
    // Verificar se é um link de recovery válido
    const hasValidTokens = (accessToken && refreshToken) || 
                          (token && type === 'recovery') || 
                          tokenHash;
    
    if (hasValidTokens) {
      // Se temos tokens de access/refresh, definir a sessão
      if (accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ error }) => {
          if (error) {
            console.error('Erro ao definir sessão:', error);
            toast({
              title: "Erro de autenticação",
              description: "Não foi possível validar o link de recuperação. Solicite um novo link.",
              variant: "destructive",
            });
            setTimeout(() => navigate("/auth"), 2000);
          }
        });
      }
      console.log('Tokens de recuperação encontrados na URL');
    } else {
      // Se não há tokens válidos, redirecionar para login
      console.log('Nenhum token válido encontrado, redirecionando...');
      toast({
        title: "Link inválido",
        description: "Este link de redefinição de senha é inválido ou expirou. Solicite um novo link.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/auth"), 3000);
    }
  }, [searchParams, navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar senha
      const passwordValidationErrors = validatePassword(password);
      if (passwordValidationErrors.length > 0) {
        toast({
          title: "Senha não atende aos requisitos",
          description: passwordValidationErrors.join("; "),
          variant: "destructive",
        });
        setPasswordErrors(passwordValidationErrors);
        setIsLoading(false);
        return;
      }

      // Verificar se as senhas coincidem
      if (password !== confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verificar se o usuário está autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Sessão expirada",
          description: "Sua sessão expirou. Solicite um novo link de recuperação.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/auth"), 2000);
        setIsLoading(false);
        return;
      }

      // Atualizar a senha
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        toast({
          title: "Erro ao atualizar senha",
          description: translateErrorMessage(error.message),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Senha atualizada com sucesso!",
          description: "Sua senha foi redefinida com sucesso. Você pode fazer login com sua nova senha.",
        });
        // Redirecionar para login após 2 segundos
        setTimeout(() => navigate("/auth?mode=login"), 2000);
      }
    } catch (error) {
      console.error('Erro inesperado ao resetar senha:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Fotos Profissionais</span>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Redefinir senha
            </h1>
            <p className="text-muted-foreground mt-2">
              Digite sua nova senha abaixo
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nova senha</CardTitle>
              <CardDescription>
                Sua nova senha deve atender aos requisitos de segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      placeholder="Mínimo 8 caracteres"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordErrors(validatePassword(e.target.value));
                      }}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.length > 0 && (
                    <div className="text-xs space-y-1">
                      {passwordErrors.map((error, index) => (
                        <div key={index} className="text-destructive flex items-center gap-1">
                          <span>•</span> {error}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Indicador de força da senha */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">Força da senha:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordErrors.length === 0 ? 'bg-green-500' :
                              passwordErrors.length <= 2 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.max(0, (5 - passwordErrors.length) * 20)}%` 
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {passwordErrors.length === 0 ? 'Forte' :
                           passwordErrors.length <= 2 ? 'Média' : 'Fraca'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      placeholder="Confirme sua nova senha"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Atualizando..." : "Atualizar senha"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;