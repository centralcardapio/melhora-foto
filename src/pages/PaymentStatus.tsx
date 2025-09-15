import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentStatusService } from '@/services/paymentStatusService';
import { useWebhook } from '@/hooks/useWebhook';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type PaymentStatus = 
  | 'PENDING' // Aguardando pagamento
  | 'RECEIVED' // Pagamento confirmado
  | 'CONFIRMED' // Pagamento aprovado
  | 'OVERDUE' // Pagamento atrasado
  | 'REFUNDED' // Pagamento estornado
  | 'RECEIVED_IN_CASH' // Recebido em dinheiro
  | 'REFUND_REQUESTED' // Estorno solicitado
  | 'REFUND_IN_PROGRESS' // Estorno em processamento
  | 'CHARGEBACK_REQUESTED' // Chargeback solicitado
  | 'CHARGEBACK_DISPUTE' // Em disputa de chargeback
  | 'AWAITING_CHARGEBACK_REVERSAL' // Aguardando reversão do chargeback
  | 'DUNNING_REQUESTED' // Em processo de recuperação
  | 'DUNNING_RECEIVED' // Recuperação efetivada
  | 'AWAITING_RISK_ANALYSIS' // Aguardando análise de risco
  | 'UNKNOWN'; // Status desconhecido

export const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { simulateWebhook } = useWebhook();
  const [status, setStatus] = useState<PaymentStatus>('PENDING');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    
    const checkPaymentStatus = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get('payment_id');
        const statusParam = params.get('status');
        
        // Se já tivermos um status na URL, verificamos se é PENDING para buscar o status real
        if (statusParam && ['PENDING', 'CONFIRMED', 'RECEIVED', 'OVERDUE', 'REFUNDED'].includes(statusParam)) {
          // Se for PENDING, tentamos buscar o status real do banco
          if (statusParam === 'PENDING') {
            try {
              console.log('🔍 Verificando status real do pagamento...');
              
              // Buscar o último pagamento do usuário
              const { data: payments, error: paymentsError } = await supabase
                .from('payments')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false })
                .limit(1);
              
              if (paymentsError) {
                console.error('Erro ao buscar pagamentos:', paymentsError);
                setStatus('PENDING');
                setIsLoading(false);
                return;
              }
              
              if (payments && payments.length > 0) {
                const latestPayment = payments[0];
                console.log('🔍 Último pagamento encontrado:', {
                  id: latestPayment.id,
                  status: latestPayment.status,
                  plan: latestPayment.plan_name,
                  created: latestPayment.created_at
                });
                
                if (latestPayment.status === 'CONFIRMED') {
                  console.log('✅ Pagamento confirmado! Atualizando status...');
                  setStatus('CONFIRMED');
                  toast.success('Pagamento aprovado com sucesso!');
                  setIsLoading(false);
                  
                  // Atualizar a URL para refletir o status real
                  const newUrl = new URL(window.location.href);
                  newUrl.searchParams.set('status', 'CONFIRMED');
                  window.history.replaceState({}, '', newUrl.toString());
                  
                  // Limpar o polling se existir
                  if (pollInterval) {
                    clearInterval(pollInterval);
                    pollInterval = null;
                  }
                  
                  return;
                } else if (latestPayment.status === 'PENDING') {
                  console.log('⏳ Pagamento ainda pendente...');
                  setStatus('PENDING');
                  setIsLoading(false);
                  
                  // Iniciar polling para verificar status a cada 5 segundos
                  if (!pollInterval) {
                    console.log('🔄 Iniciando polling para verificar status...');
                    pollInterval = setInterval(async () => {
                      console.log('🔄 Verificando status novamente...');
                      await checkPaymentStatus();
                    }, 5000); // Verificar a cada 5 segundos
                  }
                  
                  return;
                }
              }
            } catch (error) {
              console.error('Erro ao verificar status real:', error);
            }
          }
          
          setStatus(statusParam as PaymentStatus);
          setIsLoading(false);
          
          // Se o status for CONFIRMED, mostramos mensagem de sucesso
          if (statusParam === 'CONFIRMED') {
            toast.success('Pagamento aprovado com sucesso!');
          }
          
          return;
        }

        // Se tivermos um paymentId, buscamos o status do pagamento
        if (paymentId) {
          setPaymentId(paymentId);
          
          try {
            console.log('🔍 Consultando status do pagamento:', paymentId);
            
            const payment = await PaymentStatusService.getPaymentStatus(paymentId);
            const statusFromApi = payment.status as PaymentStatus;
            
            console.log('✅ Status do pagamento obtido:', {
              id: payment.id,
              status: statusFromApi,
              value: payment.value,
              description: payment.description
            });
            
            setStatus(statusFromApi);
            setIsLoading(false);
            
            // Atualiza a URL com o status para permitir compartilhamento
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('status', statusFromApi);
            window.history.replaceState({}, '', newUrl.toString());
            
            // Mostra toast com o status
            const statusDescription = PaymentStatusService.getStatusDescription(statusFromApi);
            toast.success(`Status do pagamento: ${statusDescription}`);
            
            return;
          } catch (error) {
            console.error('❌ Erro ao consultar status do pagamento:', error);
            throw new Error('Não foi possível consultar o status do pagamento. Tente novamente mais tarde.');
          }
        }

        // Se não tivermos nem status nem paymentId, exibimos uma mensagem de erro
        throw new Error('Nenhuma informação de pagamento encontrada');
      } catch (err) {
        console.error('Erro ao verificar status do pagamento:', err);
        const errorMessage = err instanceof Error ? err.message : 'Não foi possível verificar o status do pagamento';
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
    
    // Cleanup function para limpar o polling
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    };
  }, [location, user]);

  const getStatusContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="text-2xl font-bold">Verificando pagamento</h2>
          <p className="text-muted-foreground text-center">
            Estamos confirmando o status do seu pagamento. Por favor, aguarde alguns instantes.
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h2 className="text-2xl font-bold">Ocorreu um erro</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="mt-6 space-x-4">
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar novamente
            </Button>
            <Button onClick={() => navigate('/plans')}>
              Voltar para planos
            </Button>
          </div>
        </div>
      );
    }

    switch (status) {
      case 'CONFIRMED':
      case 'RECEIVED':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Pagamento Aprovado!</h2>
            <p className="text-muted-foreground">
              Seu pagamento foi processado com sucesso. Agora você tem acesso completo ao plano selecionado.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/dashboard')} size="lg">
                Acessar Painel
              </Button>
            </div>
          </div>
        );
      
      case 'PENDING':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
            <Clock className="h-16 w-16 text-amber-500" />
            <h2 className="text-2xl font-bold">Pagamento em Análise</h2>
            <p className="text-muted-foreground">
              Seu pagamento está sendo processado. Você receberá um e-mail de confirmação assim que o pagamento for aprovado.
            </p>
            <div className="mt-6 space-x-4">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Painel Principal
              </Button>
              <Button onClick={() => window.location.reload()}>
                Atualizar Status
              </Button>
              {paymentId && (
                <div className="space-y-2">
                  <Button 
                    onClick={() => simulateWebhook('PAYMENT_CONFIRMED', { 
                      id: paymentId, 
                      status: 'CONFIRMED', 
                      value: 15900,
                      description: 'Pagamento confirmado via webhook'
                    })}
                    variant="secondary"
                  >
                    ✅ Simular Pagamento Confirmado
                  </Button>
                  <Button 
                    onClick={() => simulateWebhook('PAYMENT_RECEIVED', { 
                      id: paymentId, 
                      status: 'RECEIVED', 
                      value: 15900,
                      description: 'Pagamento recebido via webhook'
                    })}
                    variant="secondary"
                  >
                    💰 Simular Pagamento Recebido
                  </Button>
                  <Button 
                    onClick={() => simulateWebhook('PAYMENT_OVERDUE', { 
                      id: paymentId, 
                      status: 'OVERDUE', 
                      value: 15900,
                      description: 'Pagamento atrasado via webhook'
                    })}
                    variant="destructive"
                  >
                    ⏰ Simular Pagamento Atrasado
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'OVERDUE':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
            <XCircle className="h-16 w-16 text-destructive" />
            <h2 className="text-2xl font-bold">Pagamento Atrasado</h2>
            <p className="text-muted-foreground">
              O prazo para pagamento expirou. Por favor, realize um novo pagamento para continuar.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/plans')}>
                Escolher Plano
              </Button>
            </div>
          </div>
        );
      
      case 'REFUNDED':
      case 'REFUND_REQUESTED':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
            <AlertCircle className="h-16 w-16 text-amber-500" />
            <h2 className="text-2xl font-bold">Estorno Solicitado</h2>
            <p className="text-muted-foreground">
              O estorno do seu pagamento está em processamento. O valor será devolvido conforme as políticas da operadora do cartão.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/support')} variant="outline">
                Falar com Suporte
              </Button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
            <AlertCircle className="h-16 w-16 text-amber-500" />
            <h2 className="text-2xl font-bold">Status Desconhecido</h2>
            <p className="text-muted-foreground">
              Não foi possível determinar o status do pagamento. Entre em contato com o suporte para mais informações.
            </p>
            <div className="mt-6 space-x-4">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Painel Principal
              </Button>
              <Button onClick={() => navigate('/support')}>
                Suporte
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Status do Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          {getStatusContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatus;
