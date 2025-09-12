// Serviço para gerenciar créditos dos usuários
import { supabase } from '@/integrations/supabase/client';

export interface CreditRecord {
  id?: string;
  user_id: string;
  total_purchased?: number;
  total_used?: number;
  available?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreditTransaction {
  id?: string;
  user_id: string;
  type: 'EARNED' | 'USED' | 'EXPIRED' | 'REFUNDED';
  amount: number;
  description: string;
  payment_id?: string;
  created_at?: string;
}

export class CreditService {
  /**
   * Libera créditos para o usuário após pagamento confirmado
   */
  static async releaseCredits(
    userId: string, 
    planName: string, 
    paymentId: string,
    credits: number
  ): Promise<CreditRecord> {
    try {
      console.log('🎁 Liberando créditos para usuário:', {
        userId,
        planName,
        paymentId,
        credits
      });

      // Verificar se o usuário já tem registro de créditos
      const { data: existingCredits, error: fetchError } = await supabase
        .from('photo_credits')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar créditos existentes:', fetchError);
        throw new Error(`Erro ao buscar créditos: ${fetchError.message}`);
      }

      if (existingCredits) {
        // Atualizar créditos existentes
        const newTotalPurchased = existingCredits.total_purchased + credits;
        const newAvailable = existingCredits.available + credits;

        const { data, error } = await supabase
          .from('photo_credits')
          .update({
            total_purchased: newTotalPurchased,
            available: newAvailable,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao atualizar créditos:', error);
          throw new Error(`Erro ao atualizar créditos: ${error.message}`);
        }

        console.log('✅ Créditos atualizados com sucesso:', data);
        return data;

      } else {
        // Criar novo registro de créditos
        const creditRecord: CreditRecord = {
          user_id: userId,
          total_purchased: credits,
          total_used: 0,
          available: credits
        };

        const { data, error } = await supabase
          .from('photo_credits')
          .insert([creditRecord])
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao criar créditos:', error);
          throw new Error(`Erro ao criar créditos: ${error.message}`);
        }

        console.log('✅ Créditos criados com sucesso:', data);
        return data;
      }

    } catch (error) {
      console.error('❌ Erro no CreditService.releaseCredits:', error);
      throw error;
    }
  }

  /**
   * Usa créditos do usuário
   */
  static async useCredits(
    userId: string, 
    amount: number, 
    description: string
  ): Promise<boolean> {
    try {
      console.log('💳 Usando créditos:', { userId, amount, description });

      // Verificar se tem créditos suficientes
      const availableCredits = await this.getAvailableCredits(userId);
      
      if (availableCredits < amount) {
        throw new Error('Créditos insuficientes');
      }

      // Buscar créditos atuais
      const { data: currentCredits, error: fetchError } = await supabase
        .from('photo_credits')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        console.error('❌ Erro ao buscar créditos:', fetchError);
        throw new Error(`Erro ao buscar créditos: ${fetchError.message}`);
      }

      // Atualizar créditos
      const newTotalUsed = currentCredits.total_used + amount;
      const newAvailable = currentCredits.available - amount;

      const { error } = await supabase
        .from('photo_credits')
        .update({ 
          total_used: newTotalUsed,
          available: newAvailable,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Erro ao usar créditos:', error);
        throw new Error(`Erro ao usar créditos: ${error.message}`);
      }

      // Registrar transação
      await this.recordTransaction({
        user_id: userId,
        type: 'USED',
        amount: amount,
        description: description
      });

      console.log('✅ Créditos usados com sucesso');
      return true;

    } catch (error) {
      console.error('❌ Erro no CreditService.useCredits:', error);
      throw error;
    }
  }

  /**
   * Obtém créditos disponíveis do usuário
   */
  static async getAvailableCredits(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('photo_credits')
        .select('available')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ Usuário não possui créditos ainda');
          return 0;
        }
        console.error('❌ Erro ao buscar créditos:', error);
        return 0;
      }

      const availableCredits = data?.available || 0;
      console.log('💳 Créditos disponíveis:', availableCredits);
      return availableCredits;

    } catch (error) {
      console.error('❌ Erro no CreditService.getAvailableCredits:', error);
      return 0;
    }
  }

  /**
   * Obtém histórico de créditos do usuário
   */
  static async getCreditHistory(userId: string): Promise<CreditTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar histórico:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('❌ Erro no CreditService.getCreditHistory:', error);
      return [];
    }
  }

  /**
   * Registra uma transação de crédito
   */
  private static async recordTransaction(transaction: CreditTransaction): Promise<void> {
    try {
      const { error } = await supabase
        .from('credit_transactions')
        .insert([transaction]);

      if (error) {
        console.error('❌ Erro ao registrar transação:', error);
      }

    } catch (error) {
      console.error('❌ Erro no CreditService.recordTransaction:', error);
    }
  }

  /**
   * Mapeia planos para créditos (baseado nos planos reais da aplicação)
   */
  static getCreditsForPlan(planName: string): number {
    const planCredits: Record<string, number> = {
      'Degustação': 10,   // 10 fotos
      'Chef': 20,         // 20 fotos  
      'Reserva': 30,      // 30 fotos
      // Planos antigos (caso existam)
      'Básico': 10,
      'Profissional': 20,
      'Premium': 30,
      'Enterprise': 100
    };

    return planCredits[planName] || 0;
  }
}

export default CreditService;
