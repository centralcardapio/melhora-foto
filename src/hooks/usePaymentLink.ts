import { useState, useCallback } from 'react';
import { asaasPaymentLinkService, PaymentLinkData, PaymentLinkResponse } from '@/services/asaasPaymentLinkService';
import { PaymentDatabaseService } from '@/services/paymentDatabaseService';
import { asaasConfig } from '@/config/asaas';

interface CreatePaymentLinkOptions {
  planName: string;
  value: number;
  userEmail: string;
  userName: string;
  userId: string; // ID do usuário no banco de dados
  billingType?: 'CREDIT_CARD' | 'BOLETO' | 'PIX' | 'UNDEFINED';
  successUrl?: string;
  dueDateLimitDays?: number;
  maxInstallmentCount?: number;
  notificationEnabled?: boolean;
  additionalInfo?: Record<string, any>;
}

export const usePaymentLink = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<PaymentLinkResponse | null>(null);

  const createPaymentLink = useCallback(async ({
    planName,
    value,
    userEmail,
    userName,
    userId,
    billingType = 'CREDIT_CARD',
    successUrl = asaasConfig.successUrl,
    dueDateLimitDays = 3,
    maxInstallmentCount = 1,
    notificationEnabled = true,
    additionalInfo = {}
  }: CreatePaymentLinkOptions): Promise<PaymentLinkResponse | null> => {
    setLoading(true);
    setError(null);
    
    console.log('Iniciando criação de link de pagamento com os seguintes dados:', {
      planName,
      value,
      userEmail,
      userName,
      userId,
      billingType,
      successUrl,
      dueDateLimitDays,
      maxInstallmentCount,
      notificationEnabled,
      additionalInfo
    });
    
    try {
      const paymentData: PaymentLinkData = {
        billingType,
        chargeType: 'DETACHED',
        value,
        name: `Plano ${planName}`,
        description: `Assinatura do plano ${planName} - ${userName}`,
        externalReference: `user-${userEmail}-${Date.now()}`,
        maxInstallmentCount,
        dueDateLimitDays,
        notificationEnabled: true,
        callback: {
          successUrl,
          autoRedirect: true
        },
        ...additionalInfo
      };

      console.log('🔍 Dados completos do pagamento que serão enviados:', JSON.stringify(paymentData, null, 2));
      
      // Log no console do navegador também
      console.group('🚀 Criando Link de Pagamento');
      console.log('📋 Dados enviados:', paymentData);
      console.log('🔗 URL da API:', '/api/asaas/paymentLinks');
      console.groupEnd();
      
      const response = await asaasPaymentLinkService.createPaymentLink(paymentData);
      
      console.log('Resposta do serviço de pagamento:', response);
      
      // Salva o pagamento no banco de dados
      try {
        const paymentRecord = {
          user_id: userId,
          payment_id: response.id,
          plan_name: planName,
          value: value,
          status: 'PENDING',
          external_reference: paymentData.externalReference,
          payment_link: response.url,
          description: paymentData.description,
          billing_type: billingType,
          charge_type: paymentData.chargeType,
          max_installment_count: maxInstallmentCount,
          due_date_limit_days: dueDateLimitDays,
          notification_enabled: notificationEnabled,
          callback_success_url: successUrl,
          callback_auto_redirect: true
        };

        console.log('💾 Salvando pagamento no banco de dados:', paymentRecord);
        
        const savedPayment = await PaymentDatabaseService.savePayment(paymentRecord);
        
        console.log('✅ Pagamento salvo no banco:', savedPayment);
        
      } catch (dbError) {
        console.error('❌ Erro ao salvar pagamento no banco:', dbError);
        // Não falha a operação se não conseguir salvar no banco
        // O link de pagamento já foi criado com sucesso
      }
      
      setPaymentLink(response);
      return response;
    } catch (err) {
      console.error('Erro detalhado ao criar link de pagamento:', {
        error: err,
        message: err instanceof Error ? err.message : 'Erro desconhecido',
        stack: err instanceof Error ? err.stack : undefined
      });
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Não foi possível criar o link de pagamento. Tente novamente mais tarde.';
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPaymentLink(null);
    setError(null);
  }, []);

  return { 
    createPaymentLink, 
    paymentLink, 
    loading, 
    error,
    reset
  };
};
