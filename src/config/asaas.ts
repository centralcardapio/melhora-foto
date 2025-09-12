// Configurações do Asaas
export const asaasConfig = {
  // URL base da API (sandbox ou produção)
  apiUrl: import.meta.env.PROD
    ? 'https://api.asaas.com/v3'
    : 'https://api-sandbox.asaas.com/v3',
  
  // Chave de API (obrigatória)
  apiKey: import.meta.env.VITE_ASAAS_API_KEY,
  
  // Configurações de notificação
  webhookUrl: `${window.location.origin}/api/webhook/asaas`,
  
  // Configurações de redirecionamento
  successUrl: `${window.location.origin}/payment/status`,
  dueDateLimitDays: 3, // Dias para vencimento do boleto
};

// Log para debug em desenvolvimento
if (import.meta.env.DEV) {
  console.log('Configuração do Asaas carregada:', {
    apiUrl: asaasConfig.apiUrl,
    apiKey: asaasConfig.apiKey ? '***' + asaasConfig.apiKey.slice(-4) : 'não configurada',
    webhookUrl: asaasConfig.webhookUrl,
    successUrl: asaasConfig.successUrl,
    env: {
      VITE_ASAAS_API_KEY: import.meta.env.VITE_ASAAS_API_KEY ? '***' + String(import.meta.env.VITE_ASAAS_API_KEY).slice(-4) : 'não definida',
      NODE_ENV: import.meta.env.MODE,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV
    }
  });
}

// Tipos de pagamento suportados
export const paymentTypes = {
  CREDIT_CARD: 'CREDIT_CARD',
  BOLETO: 'BOLETO',
  PIX: 'PIX',
  UNDEFINED: 'UNDEFINED',
} as const;

export type PaymentType = keyof typeof paymentTypes;
