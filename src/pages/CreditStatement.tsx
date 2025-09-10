import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowDownCircle, ArrowUpCircle, Calendar, Gift, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DashboardHeader } from '@/components/DashboardHeader';
interface CreditPurchase {
  id: string;
  amount: number;
  used_amount: number;
  available_amount: number;
  purchase_date: string;
  expiration_date: string;
  purchase_type: 'paid' | 'free';
  order_reference?: string;
}
interface CreditUsage {
  id: string;
  amount_used: number;
  used_at: string;
  description: string;
  photo_transformation_id?: string;
  credit_purchase: {
    purchase_date: string;
    purchase_type: 'paid' | 'free';
  };
}
const CreditStatement: React.FC = () => {
  const {
    user
  } = useAuth();
  const [purchases, setPurchases] = useState<CreditPurchase[]>([]);
  const [usageHistory, setUsageHistory] = useState<CreditUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [totalExpired, setTotalExpired] = useState(0);
  useEffect(() => {
    if (user) {
      fetchCreditData();
    }
  }, [user]);
  const fetchCreditData = async () => {
    if (!user) return;
    try {
      // Fetch credit purchases
      const {
        data: purchasesData,
        error: purchasesError
      } = await supabase.from('credit_purchases').select('*').eq('user_id', user.id).order('purchase_date', {
        ascending: false
      });
      if (purchasesError) throw purchasesError;

      // Fetch usage history with purchase info
      const {
        data: usageData,
        error: usageError
      } = await supabase.from('credit_usage_history').select(`
          *,
          credit_purchase:credit_purchases!inner(
            purchase_date,
            purchase_type
          )
        `).eq('user_id', user.id).order('used_at', {
        ascending: false
      });
      if (usageError) throw usageError;
      setPurchases((purchasesData || []) as CreditPurchase[]);
      setUsageHistory((usageData || []) as CreditUsage[]);

      // Calculate totals
      const now = new Date();
      let available = 0;
      let expired = 0;
      purchasesData?.forEach(purchase => {
        const expirationDate = new Date(purchase.expiration_date);
        if (expirationDate > now) {
          available += purchase.available_amount;
        } else {
          expired += purchase.available_amount;
        }
      });
      setTotalAvailable(available);
      setTotalExpired(expired);
    } catch (error) {
      console.error('Error fetching credit data:', error);
    } finally {
      setLoading(false);
    }
  };
  const isExpired = (date: string) => {
    return new Date(date) <= new Date();
  };
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', {
      locale: ptBR
    });
  };
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', {
      locale: ptBR
    });
  };
  if (loading) {
    return <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Extrato de Créditos</h1>
          <p className="text-muted-foreground">
            Acompanhe seu histórico de compras, uso de créditos e vencimentos
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Créditos Disponíveis</CardTitle>
              <CreditCard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalAvailable}</div>
              <p className="text-xs text-muted-foreground">
                Créditos válidos para uso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Créditos Utilizados</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalExpired}</div>
              <p className="text-xs text-muted-foreground">Créditos que foram utilizados</p>
            </CardContent>
          </Card>

          
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Credit Purchases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-green-600" />
                Histórico de Compras
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {purchases.length === 0 ? <p className="text-center text-muted-foreground py-8">
                  Nenhuma compra realizada ainda
                </p> : purchases.map(purchase => <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {purchase.purchase_type === 'free' ? <Gift className="h-8 w-8 text-blue-600" /> : <CreditCard className="h-8 w-8 text-green-600" />}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {purchase.amount} crédito{purchase.amount > 1 ? 's' : ''}
                          </span>
                          <Badge variant={purchase.purchase_type === 'free' ? 'secondary' : 'default'}>
                            {purchase.purchase_type === 'free' ? 'Gratuito' : 'Pago'}
                          </Badge>
                          {isExpired(purchase.expiration_date) && <Badge variant="destructive">Expirado</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Compra: {formatDate(purchase.purchase_date)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Vencimento: {formatDate(purchase.expiration_date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {purchase.available_amount} disponível{purchase.available_amount !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {purchase.used_amount} usado{purchase.used_amount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>)}
            </CardContent>
          </Card>

          {/* Usage History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 text-red-600" />
                Histórico de Uso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {usageHistory.length === 0 ? <p className="text-center text-muted-foreground py-8">
                  Nenhum uso de créditos ainda
                </p> : usageHistory.map(usage => <div key={usage.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <ArrowDownCircle className="h-8 w-8 text-red-600" />
                      <div>
                        <div className="font-medium">{usage.description}</div>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(usage.used_at)}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant={usage.credit_purchase.purchase_type === 'free' ? 'secondary' : 'default'} className="text-xs">
                            {usage.credit_purchase.purchase_type === 'free' ? 'Crédito Gratuito' : 'Crédito Pago'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600">
                        -{usage.amount_used} crédito{usage.amount_used > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>)}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>ℹ️ Como funciona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Validade:</strong> Todos os créditos têm validade de 30 dias a partir da data da compra.
              </p>
              
              
              
            </div>
          </CardContent>
        </Card>
      </main>
    </div>;
};
export default CreditStatement;