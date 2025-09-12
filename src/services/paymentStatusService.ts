import { asaasConfig } from '@/config/asaas';

export interface PaymentStatusResponse {
  id: string;
  status: string;
  value: number;
  description: string;
  dueDate: string;
  originalDueDate: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  installmentNumber?: number;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  transactionReceiptUrl?: string;
  invoiceNumber?: string;
  externalReference?: string;
  deleted: boolean;
  postalService: boolean;
  additionalInfo?: string;
  pixTransaction?: string;
  pixQrCodeId?: string;
  discount?: {
    value: number;
    dueDateLimitDays: number;
    type: string;
  };
  fine?: {
    value: number;
    type: string;
  };
  interest?: {
    value: number;
    type: string;
  };
  split?: Array<{
    walletId: string;
    fixedValue?: number;
    percentualValue?: number;
    totalValue?: number;
  }>;
  chargeback?: {
    status: string;
    reason: string;
  };
  refunds?: Array<{
    id: string;
    dateCreated: string;
    status: string;
    value: number;
    description: string;
    originalPayment: string;
    originalPaymentId: string;
  }>;
}

export class PaymentStatusService {
  private static async makeRequest(endpoint: string): Promise<PaymentStatusResponse> {
    const response = await fetch(`${asaasConfig.apiUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'access_token': asaasConfig.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro na API: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  /**
   * Consulta o status de um pagamento específico
   */
  static async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    try {
      console.log(`🔍 Consultando status do pagamento: ${paymentId}`);
      
      const payment = await this.makeRequest(`/payments/${paymentId}`);
      
      console.log('✅ Status do pagamento consultado:', {
        id: payment.id,
        status: payment.status,
        value: payment.value,
        description: payment.description
      });
      
      return payment;
    } catch (error) {
      console.error('❌ Erro ao consultar status do pagamento:', error);
      throw error;
    }
  }

  /**
   * Lista todos os pagamentos de um cliente
   */
  static async getClientPayments(customerId: string, limit: number = 20): Promise<{
    object: string;
    hasMore: boolean;
    totalCount: number;
    data: PaymentStatusResponse[];
  }> {
    try {
      console.log(`🔍 Consultando pagamentos do cliente: ${customerId}`);
      
      const response = await this.makeRequest(`/payments?customer=${customerId}&limit=${limit}`);
      
      console.log('✅ Pagamentos do cliente consultados:', {
        totalCount: response.totalCount,
        hasMore: response.hasMore,
        dataCount: response.data.length
      });
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao consultar pagamentos do cliente:', error);
      throw error;
    }
  }

  /**
   * Lista pagamentos por referência externa
   */
  static async getPaymentsByReference(externalReference: string): Promise<{
    object: string;
    hasMore: boolean;
    totalCount: number;
    data: PaymentStatusResponse[];
  }> {
    try {
      console.log(`🔍 Consultando pagamentos por referência: ${externalReference}`);
      
      const response = await this.makeRequest(`/payments?externalReference=${externalReference}`);
      
      console.log('✅ Pagamentos por referência consultados:', {
        totalCount: response.totalCount,
        hasMore: response.hasMore,
        dataCount: response.data.length
      });
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao consultar pagamentos por referência:', error);
      throw error;
    }
  }

  /**
   * Verifica se um pagamento foi aprovado
   */
  static isPaymentApproved(payment: PaymentStatusResponse): boolean {
    return ['CONFIRMED', 'RECEIVED'].includes(payment.status);
  }

  /**
   * Verifica se um pagamento está pendente
   */
  static isPaymentPending(payment: PaymentStatusResponse): boolean {
    return ['PENDING', 'AWAITING_RISK_ANALYSIS'].includes(payment.status);
  }

  /**
   * Verifica se um pagamento foi rejeitado
   */
  static isPaymentRejected(payment: PaymentStatusResponse): boolean {
    return ['OVERDUE', 'REFUNDED', 'CHARGEBACK_REQUESTED', 'CHARGEBACK_DISPUTE'].includes(payment.status);
  }

  /**
   * Obtém a descrição amigável do status
   */
  static getStatusDescription(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'Aguardando pagamento',
      'RECEIVED': 'Pagamento recebido',
      'CONFIRMED': 'Pagamento confirmado',
      'OVERDUE': 'Pagamento atrasado',
      'REFUNDED': 'Pagamento estornado',
      'RECEIVED_IN_CASH': 'Recebido em dinheiro',
      'REFUND_REQUESTED': 'Estorno solicitado',
      'REFUND_IN_PROGRESS': 'Estorno em processamento',
      'CHARGEBACK_REQUESTED': 'Chargeback solicitado',
      'CHARGEBACK_DISPUTE': 'Em disputa de chargeback',
      'AWAITING_CHARGEBACK_REVERSAL': 'Aguardando reversão do chargeback',
      'DUNNING_REQUESTED': 'Em processo de recuperação',
      'DUNNING_RECEIVED': 'Recuperação efetivada',
      'AWAITING_RISK_ANALYSIS': 'Aguardando análise de risco'
    };

    return statusMap[status] || 'Status desconhecido';
  }
}

export default PaymentStatusService;
