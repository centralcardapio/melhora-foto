import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Brevo API configuration
const BREVO_CONFIG = {
  apiKey: Deno.env.get('BREVO_API_KEY') || '',
  apiUrl: 'https://api.brevo.com/v3/smtp/email'
}

// Function to send email via Brevo API
async function sendEmailViaBrevo(to: string, subject: string, html: string) {
  try {
    const fromEmail = 'noreply@centraldocardapio.com.br'
    const fromName = 'Central do Cardápio'

    const response = await fetch(BREVO_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_CONFIG.apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: fromName,
          email: fromEmail
        },
        to: [
          {
            email: to,
            name: to.split('@')[0]
          }
        ],
        subject: subject,
        htmlContent: html,
        textContent: html.replace(/<[^>]*>/g, ''),
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Erro ao enviar email via Brevo: ${errorData.message || response.statusText}`)
    }

    const result = await response.json()

    return {
      success: true,
      messageId: result.messageId || `brevo_reset_${Date.now()}`,
      message: 'Email de recuperação de senha enviado com sucesso via Brevo!'
    }

  } catch (error) {
    console.error('Erro ao enviar email de reset via Brevo:', error)
    throw error
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, resetLink } = await req.json()

    if (!email || !resetLink) {
      return new Response(
        JSON.stringify({ error: 'Email e link de reset são obrigatórios' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Embedded HTML template for password recovery
    let template = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Central do Cardápio - Recuperação de Senha</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #ff6b35, #ff8c42); padding: 40px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; color: #ffffff; margin-bottom: 10px; }
        .tagline { color: #fff3e6; font-size: 16px; }
        .content { padding: 40px 30px; }
        .icon-section { text-align: center; margin-bottom: 30px; }
        .security-icon { font-size: 48px; }
        .greeting { font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 20px; text-align: center; }
        .message { font-size: 16px; color: #4a5568; margin-bottom: 30px; line-height: 1.7; text-align: center; }
        .cta-button { display: inline-block; background-color: #ff6b35; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 10px auto; transition: transform 0.2s ease; }
        .cta-button:hover { transform: translateY(-2px); }
        .footer { background-color: #1a1a1a; color: #a0a0a0; padding: 30px; text-align: center; font-size: 12px; }
        .contact-info { margin-bottom: 20px; }
        .contact-item { margin: 8px 0; font-size: 14px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🍽️ Central do Cardápio</div>
            <div class="tagline">Transforme suas fotos de pratos com inteligência artificial</div>
        </div>
        <div class="content">
            <div class="icon-section">
                <span class="security-icon">🔒</span>
            </div>
            <h1 class="greeting">Redefinição de Senha</h1>
            <p class="message">
                Recebemos uma solicitação para redefinir a senha da sua conta.
                Clique no botão abaixo para criar uma nova senha.
            </p>
            <div style="text-align: center;">
                <a href="${resetLink}" class="cta-button">
                    Redefinir Minha Senha
                </a>
            </div>
            <p class="message" style="margin-top: 30px;">
                Se você não solicitou a redefinição de senha, por favor, ignore este e-mail.
                Sua senha atual permanecerá inalterada.
            </p>
            <p class="message" style="font-size: 12px; color: #718096;">
                Link direto: <a href="${resetLink}" style="color: #ff6b35; text-decoration: underline;">${resetLink}</a>
            </p>
        </div>
        <div class="footer">
            <div class="contact-info">
                <div class="contact-item">📧 contato@centraldocardapio.com.br</div>
                <div class="contact-item">🌐 www.centraldocardapio.com.br</div>
            </div>
            <div class="copyright">
                © 2024 Central do Cardápio. Todos os direitos reservados.
            </div>
        </div>
    </div>
</body>
</html>`

    template = template.replace('{{RESET_LINK}}', resetLink)

    const result = await sendEmailViaBrevo(
      email,
      '🔒 Redefina sua senha da Central do Cardápio',
      template
    )

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.messageId,
        message: 'Email de recuperação de senha enviado com sucesso via Brevo!'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Erro ao enviar email de reset de senha:', error)

    return new Response(
      JSON.stringify({
        error: 'Erro interno do servidor',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
