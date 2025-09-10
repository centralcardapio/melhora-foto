// Função para traduzir mensagens de erro do Supabase para português
export const translateErrorMessage = (errorMessage: string): string => {
  const errorTranslations: Record<string, string> = {
    // Mensagens de autenticação
    "Invalid login credentials": "Credenciais de login inválidas",
    "Email not confirmed": "E-mail não confirmado",
    "User not found": "Usuário não encontrado",
    "Invalid email": "E-mail inválido",
    "Password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres",
    "Password should be at least 8 characters": "A senha deve ter pelo menos 8 caracteres",
    "Signup is disabled": "Cadastro está desabilitado",
    "User already registered": "Usuário já cadastrado",
    "Email already exists": "E-mail já existe",
    "Email rate limit exceeded": "Limite de e-mails excedido",
    "SMS rate limit exceeded": "Limite de SMS excedido",
    "Captcha verification process failed": "Falha na verificação do captcha",
    "Phone number is invalid": "Número de telefone inválido",
    "Token has expired or is invalid": "Token expirou ou é inválido",
    "Invalid refresh token": "Token de refresh inválido",
    "Session not found": "Sessão não encontrada",
    "User is not authenticated": "Usuário não autenticado",
    "Email address is invalid": "Endereço de e-mail inválido",
    "Invalid email or password": "E-mail ou senha inválidos",
    "Account confirmation required": "Confirmação de conta necessária",
    "Password is too weak": "A senha é muito fraca",
    
    // Mensagens de reset de senha
    "Password reset token has expired": "Token de redefinição de senha expirou",
    "Password reset token is invalid": "Token de redefinição de senha é inválido",
    "New password should be different from the old password": "A nova senha deve ser diferente da senha anterior",
    
    // Mensagens genéricas
    "Network error": "Erro de rede",
    "Service temporarily unavailable": "Serviço temporariamente indisponível",
    "Internal server error": "Erro interno do servidor",
    "Database error": "Erro de banco de dados",
    "Too many requests": "Muitas solicitações",
    "Unauthorized": "Não autorizado",
    "Forbidden": "Proibido",
    "Not found": "Não encontrado",
    "Bad request": "Solicitação inválida",
    "Conflict": "Conflito",
    "Gone": "Recurso não disponível",
    "Payload too large": "Arquivo muito grande",
    "Unprocessable entity": "Dados inválidos",
    
    // Mensagens OAuth
    "OAuth provider error": "Erro do provedor OAuth",
    "OAuth state mismatch": "Erro no estado OAuth",
    "OAuth callback error": "Erro no callback OAuth",
    
    // Mensagens de storage/upload
    "File too large": "Arquivo muito grande",
    "Invalid file type": "Tipo de arquivo inválido",
    "Upload failed": "Falha no upload",
    "Storage quota exceeded": "Cota de armazenamento excedida",
    
    // Mensagens adicionais comuns
    "Something went wrong": "Algo deu errado",
    "Try again later": "Tente novamente mais tarde",
    "Connection failed": "Falha na conexão",
    "Request timeout": "Tempo limite da solicitação",
    "Server unavailable": "Servidor indisponível",
  };

  return errorTranslations[errorMessage] || errorMessage;
};