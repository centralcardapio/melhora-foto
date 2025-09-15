import axios from 'axios';
import { asaasConfig } from '@/config/asaas';
import { 
  PaymentLinkData, 
  PaymentLinkResponse,
  BillingType,
  ChargeType
} from '@/types/asaas';

// Configuração do Axios para usar o proxy do Vite/Vercel
const api = axios.create({
  baseURL: asaasConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // 30 segundos de timeout
  validateStatus: (status) => status >= 200 && status < 500
});

// Adiciona o token de acesso em todas as requisições
api.interceptors.request.use(config => {
  // Em produção, o Vercel proxy já adiciona o token via headers
  // Em desenvolvimento, o Vite proxy adiciona o token
  if (import.meta.env.DEV && asaasConfig.apiKey) {
    config.headers['access_token'] = asaasConfig.apiKey;
  }
  return config;
});

// Interceptor para log em desenvolvimento
api.interceptors.request.use(config => {
  if (import.meta.env.DEV) {
    console.log('Enviando requisição para:', config.url);
    console.log('Método:', config.method?.toUpperCase());
    console.log('Headers:', config.headers);
    console.log('Dados:', config.data);
  }
  return config;
}, error => {
  console.error('Erro na requisição:', error);
  return Promise.reject(error);
});

// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
  response => {
    if (import.meta.env.DEV) {
      console.log('✅ Resposta recebida:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
    }
    return response;
  },
  error => {
    console.error('❌ Erro na resposta:', error);
    if (error.response) {
      // O servidor respondeu com um status fora do intervalo 2xx
      console.error('🔍 Detalhes do erro da API:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Log específico para erro 400
      if (error.response.status === 400) {
        console.error('🚨 ERRO 400 - Dados inválidos:', JSON.stringify(error.response.data, null, 2));
        console.error('🚨 Headers da resposta:', error.response.headers);
        console.error('🚨 Status da resposta:', error.response.status);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Algo aconteceu na configuração da requisição
      console.error('Erro ao configurar a requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export type { PaymentLinkData, PaymentLinkResponse };

export const asaasPaymentLinkService = {
  // Criar um novo link de pagamento
  createPaymentLink: async (data: PaymentLinkData): Promise<PaymentLinkResponse> => {
    try {
      console.log('Criando link de pagamento com dados:', {
        ...data,
        // Não logar dados sensíveis
        apiKey: '***' + (asaasConfig.apiKey ? asaasConfig.apiKey.slice(-4) : '')
      });
      
      const response = await api.post<PaymentLinkResponse>('/paymentLinks', data);
      
      console.log('Resposta da API ao criar link de pagamento:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      if (response.status >= 400) {
        console.error('❌ Erro na API do Asaas:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        
        // Log específico para erro 400
        if (response.status === 400) {
          console.error('🚨 ERRO 400 - Dados inválidos:', JSON.stringify(response.data, null, 2));
        }
        
        throw new Error(`Erro na API: ${response.status} - ${response.statusText} - ${JSON.stringify(response.data)}`);
      }
      
      return response.data;
    } catch (error) {
      if (error.response) {
        // A requisição foi feita e o servidor respondeu com um status fora do intervalo 2xx
        console.error('Erro na resposta da API:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('Sem resposta da API:', error.request);
      } else {
        // Algo aconteceu na configuração da requisição
        console.error('Erro ao configurar a requisição:', error.message);
      }
      
      // Lança um erro mais amigável
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido ao criar link de pagamento';
      console.error('Erro detalhado ao criar link de pagamento:', error);
      throw new Error(`Não foi possível criar o link de pagamento: ${errorMessage}`);
    }
  },

  // Obter um link de pagamento existente
  getPaymentLink: async (id: string): Promise<PaymentLinkResponse> => {
    try {
      const response = await api.get<PaymentLinkResponse>(`/paymentLinks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter link de pagamento:', error);
      throw error;
    }
  },

  // Listar links de pagamento
  listPaymentLinks: async (): Promise<PaymentLinkResponse[]> => {
    try {
      const response = await api.get<{ data: PaymentLinkResponse[] }>('/paymentLinks');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao listar links de pagamento:', error);
      throw error;
    }
  },

  // Atualizar um link de pagamento
  updatePaymentLink: async (id: string, data: Partial<PaymentLinkData>): Promise<PaymentLinkResponse> => {
    try {
      const response = await api.put<PaymentLinkResponse>(`/paymentLinks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar link de pagamento:', error);
      throw error;
    }
  },

  // Deletar um link de pagamento
  deletePaymentLink: async (id: string): Promise<void> => {
    try {
      await api.delete(`/paymentLinks/${id}`);
    } catch (error) {
      console.error('Erro ao deletar link de pagamento:', error);
      throw error;
    }
  }
};
