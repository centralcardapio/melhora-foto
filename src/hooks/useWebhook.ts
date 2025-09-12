import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useWebhook = () => {
  /**
   * Simula um webhook para testes (apenas para desenvolvimento)
   */
  const simulateWebhook = useCallback(async (eventType: string, paymentData: any) => {
    try {
      // Simula notificação local para testes
      console.log(`🧪 Webhook simulado: ${eventType}`, paymentData);
      
      switch (eventType) {
        case 'PAYMENT_CONFIRMED':
          toast.success('Pagamento Confirmado!', {
            description: `Seu pagamento foi processado com sucesso.`,
            duration: 5000,
          });
          break;
        case 'PAYMENT_RECEIVED':
          toast.success('Pagamento Recebido!', {
            description: `Valor: R$ ${((paymentData?.value || 0) / 100).toFixed(2)}`,
            duration: 5000,
          });
          break;
        case 'PAYMENT_OVERDUE':
          toast.error('Pagamento Atrasado', {
            description: 'O prazo para pagamento expirou. Realize um novo pagamento.',
            duration: 8000,
          });
          break;
        case 'PAYMENT_REFUNDED':
          toast.warning('Pagamento Estornado', {
            description: 'Seu pagamento foi estornado. Entre em contato com o suporte.',
            duration: 8000,
          });
          break;
        default:
          toast.info('Evento de Webhook', {
            description: `Tipo: ${eventType}`,
            duration: 3000,
          });
      }
    } catch (error) {
      console.error('❌ Erro ao simular webhook:', error);
    }
  }, []);

  /**
   * Configura notificações do navegador
   */
  const setupNotifications = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Notificações permitidas');
      } else {
        console.log('❌ Notificações negadas');
      }
    }
  }, []);

  useEffect(() => {
    // Configura notificações quando o hook é montado
    setupNotifications();

    // Cleanup quando o hook é desmontado
    return () => {
      console.log('🧹 Limpando listeners de webhook');
    };
  }, [setupNotifications]);

  return {
    simulateWebhook,
    setupNotifications
  };
};

export default useWebhook;
