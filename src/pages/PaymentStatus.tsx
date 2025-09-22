import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, ExternalLink, CreditCard, Smartphone, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  const [paymentData, setPaymentData] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [checkCount, setCheckCount] = useState(0);
  const [isAutoChecking, setIsAutoChecking] = useState(false);

  const checkPaymentStatus = useCallback(async (isManual = false) => {
    try {
      if (isManual) {
        setIsAutoChecking(true);
        setCheckCount(prev => prev + 1);
      }
      
      console.log(`🔍 Verificando status do pagamento... (${isManual ? 'manual' : 'automático'})`);
      
      if (!user?.id) {
        console.error('Usuário não encontrado');
        setError('Usuário não encontrado');
        return;
      }
      
      // Buscar o último pagamento do usuário
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (paymentsError) {
        console.error('Erro ao buscar pagamentos:', paymentsError);
        setError('Erro ao buscar pagamentos');
        return;
      }
      
      if (payments && payments.length > 0) {
        const latestPayment = payments[0];
        setPaymentData(latestPayment);
        
        console.log('🔍 Último pagamento encontrado:', {
          id: latestPayment.id,
          status: latestPayment.status,
          plan: latestPayment.plan_name,
          created: latestPayment.created_at
        });
        
        if (latestPayment.status === 'CONFIRMED' || latestPayment.status === 'RECEIVED') {
          console.log('✅ Pagamento confirmado! Atualizando status...');
          setStatus('CONFIRMED');
          setIsLoading(false);
          setIsAutoChecking(false);
          
          // Atualizar a URL para refletir o status real
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('status', 'CONFIRMED');
          window.history.replaceState({}, '', newUrl.toString());
          
          toast.success('Pagamento aprovado com sucesso!');
          return;
        } else if (latestPayment.status === 'PENDING') {
          console.log('⏳ Pagamento ainda pendente...');
          setStatus('PENDING');
          setIsLoading(false);
          return;
        } else {
          setStatus(latestPayment.status as PaymentStatus);
          setIsLoading(false);
          return;
        }
      }
      
      console.log('❌ Nenhum pagamento encontrado');
      setError('Nenhum pagamento encontrado');
      setIsLoading(false);
      
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      setError('Erro ao verificar status do pagamento');
      setIsLoading(false);
    } finally {
      if (isManual) {
        setIsAutoChecking(false);
      }
    }
  }, [user?.id, navigate]);

  // Timer para mostrar tempo decorrido
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Verificação automática do status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    
    const initializeStatus = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const paymentIdParam = params.get('payment_id');
        const statusParam = params.get('status');
        
        setPaymentId(paymentIdParam);
        
        // Se temos um status na URL, usamos ele inicialmente
        if (statusParam && ['PENDING', 'CONFIRMED', 'RECEIVED', 'OVERDUE', 'REFUNDED'].includes(statusParam)) {
          setStatus(statusParam as PaymentStatus);
          setIsLoading(false);
          
          // Se for PENDING, iniciamos verificação automática
          if (statusParam === 'PENDING') {
            // Verificar imediatamente
            await checkPaymentStatus();
            
            // Iniciar polling a cada 10 segundos
            pollInterval = setInterval(() => {
              checkPaymentStatus();
            }, 10000);
          }
          
          return;
        }

        // Se não temos status na URL, verificar do banco
        await checkPaymentStatus();
        
        // Se ainda for PENDING, iniciar polling
        if (status === 'PENDING') {
          pollInterval = setInterval(() => {
            checkPaymentStatus();
          }, 10000);
        }
        
      } catch (err) {
        console.error('Erro ao inicializar status:', err);
        setError('Erro ao verificar status do pagamento');
        setIsLoading(false);
      }
    };

    initializeStatus();
    
    // Cleanup
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [location, user, checkPaymentStatus, status]);

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
      // Se o erro for "Nenhuma informação de pagamento encontrada" e status for PENDING, 
      // tratamos como aguardando pagamento
      const isWaitingForPayment = error === 'Nenhuma informação de pagamento encontrada' && status === 'PENDING';
      
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
          {isWaitingForPayment ? (
            <Clock className="h-16 w-16 text-amber-500" />
          ) : (
            <AlertCircle className="h-16 w-16 text-destructive" />
          )}
          <h2 className="text-2xl font-bold">
            {isWaitingForPayment ? 'Aguardando Pagamento' : 'Ocorreu um erro'}
          </h2>
          <p className="text-muted-foreground">
            {isWaitingForPayment 
              ? 'Seu pagamento está sendo processado. Clique em "Verificar Status" para atualizar.'
              : error
            }
          </p>
          <div className="mt-6 space-x-4">
            <Button 
              onClick={async () => {
                if (isWaitingForPayment) {
                  await checkPaymentStatus();
                } else {
                  window.location.reload();
                }
              }} 
              variant="outline"
            >
              {isWaitingForPayment ? 'Verificar Status' : 'Tentar novamente'}
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
          <div className="space-y-6">
            {/* Header de sucesso */}
            <div className="text-center space-y-4">
              <div className="relative">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-700">Pagamento Aprovado!</h2>
              <Badge className="bg-green-100 text-green-800 border-green-300">
                ✅ Processado com Sucesso
              </Badge>
            </div>

            {/* Informações do pagamento */}
            {paymentData && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Plano:</span>
                      <span className="font-medium text-green-800">{paymentData.plan_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor:</span>
                      <span className="font-medium text-green-800">R$ {(paymentData.value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="font-medium text-green-800">Confirmado</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tempo total:</span>
                      <span className="font-medium text-green-800">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mensagem de sucesso */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">🎉 Parabéns!</h4>
              <p className="text-sm text-green-800">
                Seu pagamento foi processado com sucesso. Agora você tem acesso completo ao plano selecionado e pode começar a transformar suas fotos.
              </p>
            </div>

            {/* Ações */}
            <div className="space-y-4">
              <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Acessar Painel
              </Button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button 
                  onClick={() => navigate('/style-selection')} 
                  variant="outline"
                  className="flex-1"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Escolher Estilo
                </Button>
                <Button 
                  onClick={() => navigate('/plans')} 
                  variant="outline"
                  className="flex-1"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Ver Planos
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'PENDING':
        return (
          <div className="space-y-6">
            {/* Header com status */}
            <div className="text-center space-y-4">
              <div className="relative">
                <Clock className="h-16 w-16 text-amber-500 mx-auto animate-pulse" />
                {isAutoChecking && (
                  <div className="absolute -top-2 -right-2">
                    <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold">Pagamento em Análise</h2>
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                Aguardando Confirmação
              </Badge>
            </div>

            {/* Informações do pagamento */}
            {paymentData && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Plano:</span>
                      <span className="font-medium">{paymentData.plan_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor:</span>
                      <span className="font-medium">R$ {(paymentData.value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tempo decorrido:</span>
                      <span className="font-medium">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Verificações:</span>
                      <span className="font-medium">{checkCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processando pagamento...</span>
                <span>{Math.min(30, Math.floor(elapsedTime / 10) * 10)}%</span>
              </div>
              <Progress value={Math.min(30, Math.floor(elapsedTime / 10) * 10)} className="h-2" />
            </div>

            {/* Status automático */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {isAutoChecking 
                  ? 'Verificando status automaticamente...' 
                  : 'Verificação automática ativa a cada 10 segundos'
                }
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Monitoramento ativo</span>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => checkPaymentStatus(true)} 
                  disabled={isAutoChecking}
                  className="flex-1"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isAutoChecking ? 'animate-spin' : ''}`} />
                  Verificar Agora
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="outline"
                  className="flex-1"
                >
                  Painel Principal
                </Button>
              </div>

              {/* Informações úteis */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 Dicas importantes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Pagamentos por cartão são processados instantaneamente</li>
                  <li>• Pagamentos por PIX podem levar até 5 minutos</li>
                  <li>• Você receberá um e-mail de confirmação</li>
                  <li>• Esta página atualiza automaticamente</li>
                </ul>
              </div>

              {/* Botões de simulação (apenas em desenvolvimento) */}
              {paymentId && import.meta.env.DEV && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2 text-center">Modo Desenvolvimento:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button 
                      onClick={() => simulateWebhook('PAYMENT_CONFIRMED', { 
                        id: paymentId, 
                        status: 'CONFIRMED', 
                        value: paymentData?.value || 15900,
                        description: 'Pagamento confirmado via webhook'
                      })}
                      variant="secondary"
                      size="sm"
                    >
                      ✅ Confirmar
                    </Button>
                    <Button 
                      onClick={() => simulateWebhook('PAYMENT_RECEIVED', { 
                        id: paymentId, 
                        status: 'RECEIVED', 
                        value: paymentData?.value || 15900,
                        description: 'Pagamento recebido via webhook'
                      })}
                      variant="secondary"
                      size="sm"
                    >
                      💰 Recebido
                    </Button>
                    <Button 
                      onClick={() => simulateWebhook('PAYMENT_OVERDUE', { 
                        id: paymentId, 
                        status: 'OVERDUE', 
                        value: paymentData?.value || 15900,
                        description: 'Pagamento atrasado via webhook'
                      })}
                      variant="destructive"
                      size="sm"
                    >
                      ⏰ Atrasado
                    </Button>
                  </div>
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
