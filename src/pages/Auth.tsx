import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "@/integrations/supabase/client";

// Password validation functions
const validatePassword = (password: string) => {
  const errors = [];
  if (password.length < 8) errors.push("Comprimento mínimo: A senha deve ter pelo menos 8 caracteres");
  if (!/[A-Z]/.test(password)) errors.push("Letra maiúscula: Deve conter ao menos uma letra maiúscula");
  if (!/[a-z]/.test(password)) errors.push("Letra minúscula: Deve conter ao menos uma letra minúscula");
  if (!/[0-9]/.test(password)) errors.push("Número: Deve conter ao menos um número");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push("Caractere especial: Deve conter ao menos um caractere especial");
  return errors;
};

const validatePhone = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 11) return "Digite um telefone válido";
  if (/^(\d)\1+$/.test(cleanPhone)) return "Digite um telefone válido";
  return null;
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  
  const { signUp, signIn, signInWithGoogle, user, hasSelectedStyle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Check if user has selected a style
      if (hasSelectedStyle === true) {
        navigate("/dashboard");
      } else if (hasSelectedStyle === false) {
        navigate("/style-selection");
      }
      // If hasSelectedStyle is null, we're still checking
    }
    
    // Check if URL indicates login mode
    if (searchParams.get("mode") === "login") {
      setIsLogin(true);
    }
  }, [user, navigate, searchParams, hasSelectedStyle]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!email || !password || !name || !phone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate password
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

    // Validate phone
    const phoneError = validatePhone(phone);
    if (phoneError) {
      toast({
        title: "Telefone inválido",
        description: phoneError,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, {
      first_name: name.split(" ")[0],
      last_name: name.split(" ").slice(1).join(" "),
      phone: phone.replace(/\D/g, ''),
      full_name: name
    });

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cadastro realizado!",
        description: "Confirme sua conta no e-mail recebido para continuar.",
      });
    }

    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha e-mail e senha.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast({
        title: "Erro",
        description: "Por favor, digite seu e-mail.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setShowForgotPassword(false);
      setResetEmail("");
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: "Erro no login",
        description: error.message,
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
            onClick={() => navigate("/")}
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

        <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
          {/* Registration Form */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight">
                {isLogin ? "Entrar" : "Criar conta"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isLogin 
                  ? "Acesse sua conta para continuar" 
                  : "Comece a transformar suas fotos de comida agora mesmo"
                }
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{isLogin ? "Login" : "Cadastro"}</CardTitle>
                <CardDescription>
                  {isLogin 
                    ? "Entre com seus dados de acesso"
                    : "Preencha os dados abaixo para criar sua conta"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Seu nome completo"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        placeholder="seu@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Celular *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            // Allow only numbers and format
                            const value = e.target.value.replace(/\D/g, '');
                            let formattedValue = value;
                            if (value.length >= 11) {
                              formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                            } else if (value.length >= 7) {
                              formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                            } else if (value.length >= 3) {
                              formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                            }
                            setPhone(formattedValue);
                          }}
                          className="pl-10"
                          maxLength={15}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        placeholder={isLogin ? "Sua senha" : "Mínimo 8 caracteres"}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (!isLogin) {
                            setPasswordErrors(validatePassword(e.target.value));
                          }
                        }}
                        className="pl-10 pr-10"
                        required
                        minLength={isLogin ? 1 : 8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {!isLogin && passwordErrors.length > 0 && (
                      <div className="text-xs space-y-1">
                        {passwordErrors.map((error, index) => (
                          <div key={index} className="text-destructive flex items-center gap-1">
                            <span>•</span> {error}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {isLogin && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (isLogin ? "Entrando..." : "Criando conta...") 
                      : (isLogin ? "Entrar" : "Criar conta")
                    }
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      ou continue com
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <FaGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-muted-foreground hover:text-primary underline"
                  >
                    {isLogin 
                      ? "Não tem uma conta? Cadastre-se" 
                      : "Já tem uma conta? Entrar"
                    }
                  </button>
                </div>

                {!isLogin && (
                  <p className="text-xs text-muted-foreground text-center">
                    Ao criar uma conta, você concorda com nossos{" "}
                    <a href="#" className="underline hover:text-primary">
                      Termos de Serviço
                    </a>{" "}
                    e{" "}
                    <a href="/politica-privacidade" className="underline hover:text-primary">
                      Política de Privacidade
                    </a>
                  </p>
                )}

                {/* Forgot Password Dialog */}
                {showForgotPassword && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background p-6 rounded-lg border max-w-md w-full">
                      <h3 className="text-lg font-semibold mb-4">Recuperar senha</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Digite seu e-mail para receber um link de recuperação de senha.
                      </p>
                      <div className="space-y-4">
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleForgotPassword}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            {isLoading ? "Enviando..." : "Enviar"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowForgotPassword(false);
                              setResetEmail("");
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;