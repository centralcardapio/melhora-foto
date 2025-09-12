import { supabase } from '@/integrations/supabase/client';

export interface PaymentRecord {
  id?: string;
  user_id: string;
  payment_id: string;
  plan_name: string;
  value: number;
  status: string;
  external_reference: string;
  payment_link?: string;
  created_at?: string;
  updated_at?: string;
  payment_date?: string;
  due_date?: string;
  description?: string;
  billing_type?: string;
  charge_type?: string;
  max_installment_count?: number;
  due_date_limit_days?: number;
  notification_enabled?: boolean;
  callback_success_url?: string;
  callback_auto_redirect?: boolean;
}

export class PaymentDatabaseService {
  /**
   * Salva um pagamento no banco de dados
   */
  static async savePayment(paymentData: PaymentRecord): Promise<PaymentRecord> {
    try {
      console.log('💾 Salvando pagamento no banco:', {
        user_id: paymentData.user_id,
        payment_id: paymentData.payment_id,
        plan_name: paymentData.plan_name,
        value: paymentData.value
      });

      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao salvar pagamento:', error);
        throw new Error(`Erro ao salvar pagamento: ${error.message}`);
      }

      console.log('✅ Pagamento salvo com sucesso:', data);
      return data;

    } catch (error) {
      console.error('❌ Erro no PaymentDatabaseService.savePayment:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um pagamento
   */
  static async updatePaymentStatus(
    paymentId: string, 
    status: string, 
    additionalData?: Partial<PaymentRecord>
  ): Promise<PaymentRecord> {
    try {
      console.log('🔄 Atualizando status do pagamento:', {
        payment_id: paymentId,
        status: status
      });

      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        ...additionalData
      };

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('payment_id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar pagamento:', error);
        throw new Error(`Erro ao atualizar pagamento: ${error.message}`);
      }

      console.log('✅ Status do pagamento atualizado:', data);
      return data;

    } catch (error) {
      console.error('❌ Erro no PaymentDatabaseService.updatePaymentStatus:', error);
      throw error;
    }
  }

  /**
   * Busca um pagamento pelo ID do Asaas
   */
  static async getPaymentByAsaasId(paymentId: string): Promise<PaymentRecord | null> {
    try {
      console.log('🔍 Buscando pagamento por ID do Asaas:', paymentId);

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_id', paymentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ Pagamento não encontrado');
          return null;
        }
        console.error('❌ Erro ao buscar pagamento:', error);
        throw new Error(`Erro ao buscar pagamento: ${error.message}`);
      }

      console.log('✅ Pagamento encontrado:', data);
      return data;

    } catch (error) {
      console.error('❌ Erro no PaymentDatabaseService.getPaymentByAsaasId:', error);
      throw error;
    }
  }

  /**
   * Busca pagamentos de um usuário
   */
  static async getUserPayments(userId: string): Promise<PaymentRecord[]> {
    try {
      console.log('🔍 Buscando pagamentos do usuário:', userId);

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar pagamentos do usuário:', error);
        throw new Error(`Erro ao buscar pagamentos: ${error.message}`);
      }

      console.log('✅ Pagamentos do usuário encontrados:', data?.length || 0);
      return data || [];

    } catch (error) {
      console.error('❌ Erro no PaymentDatabaseService.getUserPayments:', error);
      throw error;
    }
  }

  /**
   * Busca pagamentos por status
   */
  static async getPaymentsByStatus(status: string): Promise<PaymentRecord[]> {
    try {
      console.log('🔍 Buscando pagamentos por status:', status);

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar pagamentos por status:', error);
        throw new Error(`Erro ao buscar pagamentos: ${error.message}`);
      }

      console.log('✅ Pagamentos por status encontrados:', data?.length || 0);
      return data || [];

    } catch (error) {
      console.error('❌ Erro no PaymentDatabaseService.getPaymentsByStatus:', error);
      throw error;
    }
  }

  /**
   * Cria a tabela de pagamentos (migração)
   */
  static async createPaymentsTable(): Promise<void> {
    try {
      console.log('🏗️ Criando tabela de pagamentos...');

      const { error } = await supabase.rpc('create_payments_table');

      if (error) {
        console.error('❌ Erro ao criar tabela:', error);
        throw new Error(`Erro ao criar tabela: ${error.message}`);
      }

      console.log('✅ Tabela de pagamentos criada com sucesso');

    } catch (error) {
      console.error('❌ Erro no PaymentDatabaseService.createPaymentsTable:', error);
      throw error;
    }
  }
}

export default PaymentDatabaseService;
