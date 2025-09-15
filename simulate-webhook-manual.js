// Simular webhook manualmente
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://tskdtjqxrqjfntushmup.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados do webhook
const webhookData = {
  "id": "evt_15e444ff9b9ab9ec29294aa1abe68025&10431924",
  "event": "PAYMENT_CONFIRMED",
  "dateCreated": "2025-09-15 11:25:10",
  "payment": {
    "object": "payment",
    "id": "pay_mg01w2t00uny75kk",
    "dateCreated": "2025-09-15",
    "customer": "cus_000007021091",
    "checkoutSession": null,
    "paymentLink": "6vk8k639g1hn6rxt",
    "value": 159,
    "netValue": 155.35,
    "originalValue": null,
    "interestValue": null,
    "description": "Assinatura do plano Chef - Jean Almeida",
    "billingType": "CREDIT_CARD",
    "confirmedDate": "2025-09-15",
    "creditCard": {
      "creditCardNumber": "4444",
      "creditCardBrand": "VISA",
      "creditCardToken": "534c82fb-a6f5-4bb9-b44b-0db7afbf8bf8"
    },
    "pixTransaction": null,
    "status": "CONFIRMED",
    "dueDate": "2025-09-15",
    "originalDueDate": "2025-09-15",
    "paymentDate": null,
    "clientPaymentDate": "2025-09-15",
    "installmentNumber": null,
    "invoiceUrl": "https://sandbox.asaas.com/i/mg01w2t00uny75kk",
    "invoiceNumber": "11324529",
    "externalReference": "user-pietromoura10@hotmail.com-1757946263620",
    "deleted": false,
    "anticipated": false,
    "anticipable": false,
    "creditDate": "2025-10-17",
    "estimatedCreditDate": "2025-10-17",
    "transactionReceiptUrl": "https://sandbox.asaas.com/comprovantes/7003989496176253",
    "nossoNumero": null,
    "bankSlipUrl": null,
    "lastInvoiceViewedDate": null,
    "lastBankSlipViewedDate": null,
    "discount": {
      "value": 0,
      "limitDate": null,
      "dueDateLimitDays": 0,
      "type": "FIXED"
    },
    "fine": {
      "value": 0,
      "type": "FIXED"
    },
    "interest": {
      "value": 0,
      "type": "PERCENTAGE"
    },
    "postalService": false,
    "escrow": null,
    "refunds": null
  }
};

// Mapeamento de planos para créditos
const planCredits = {
  'Degustação': 10,
  'Chef': 20,
  'Reserva': 30
};

async function simulateWebhook() {
  try {
    console.log('🔔 Simulando webhook do Asaas...');
    console.log('Payment ID:', webhookData.payment.id);
    console.log('External Reference:', webhookData.payment.externalReference);
    
    // 1. Buscar dados do pagamento no banco pelo external_reference
    console.log('\n🔍 Buscando pagamento no banco...');
    const { data: paymentRecord, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('external_reference', webhookData.payment.externalReference)
      .single();
    
    if (fetchError) {
      console.error('❌ Pagamento não encontrado no banco:', fetchError);
      return;
    }
    
    console.log('✅ Pagamento encontrado:', paymentRecord.plan_name);
    console.log('Status atual:', paymentRecord.status);
    console.log('User ID:', paymentRecord.user_id);
    
    // 2. Atualizar status do pagamento
    console.log('\n🔄 Atualizando status do pagamento...');
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_id: webhookData.payment.id, // Salvar o ID real do pagamento
        status: 'CONFIRMED',
        payment_date: webhookData.payment.paymentDate || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('external_reference', webhookData.payment.externalReference);
    
    if (updateError) {
      console.error('❌ Erro ao atualizar pagamento:', updateError);
      return;
    }
    
    console.log('✅ Status do pagamento atualizado para CONFIRMED');
    
    // 3. Liberar créditos
    console.log('\n🎁 Liberando créditos...');
    const creditsToRelease = planCredits[paymentRecord.plan_name] || 0;
    console.log('Plano:', paymentRecord.plan_name);
    console.log('Créditos a liberar:', creditsToRelease);
    
    if (creditsToRelease > 0) {
      await releaseCredits(paymentRecord.user_id, paymentRecord.plan_name, webhookData.payment.id, creditsToRelease);
      console.log(`🎁 ${creditsToRelease} créditos liberados para ${paymentRecord.plan_name}`);
    } else {
      console.warn(`⚠️ Nenhum crédito mapeado para o plano: ${paymentRecord.plan_name}`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao simular webhook:', error);
  }
}

// Função para liberar créditos
async function releaseCredits(userId, planName, paymentId, credits) {
  try {
    console.log('🎁 Liberando créditos:', { userId, planName, credits });
    
    // 1. Criar registro na tabela credit_purchases (sistema principal)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 ano de validade
    
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('credit_purchases')
      .insert({
        user_id: userId,
        amount: credits,
        used_amount: 0,
        available_amount: credits,
        purchase_type: 'paid',
        expiration_date: expirationDate.toISOString(),
        order_reference: `webhook-${planName}-${paymentId}`
      })
      .select();
    
    if (purchaseError) {
      console.error('❌ Erro ao criar compra:', purchaseError);
      return;
    }
    
    console.log('✅ Compra registrada em credit_purchases:', purchaseData[0]);
    
    // 2. Atualizar photo_credits para compatibilidade
    const { data: existingCredits, error: fetchError } = await supabase
      .from('photo_credits')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar créditos existentes:', fetchError);
      return;
    }
    
    if (existingCredits) {
      // Atualizar créditos existentes
      const newTotalPurchased = existingCredits.total_purchased + credits;
      const newAvailable = existingCredits.available + credits;
      
      const { error: updateError } = await supabase
        .from('photo_credits')
        .update({
          total_purchased: newTotalPurchased,
          available: newAvailable,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('❌ Erro ao atualizar photo_credits:', updateError);
        return;
      }
      
      console.log('✅ photo_credits atualizado:', { total: newTotalPurchased, available: newAvailable });
      
    } else {
      // Criar novo registro de créditos
      const { error: insertError } = await supabase
        .from('photo_credits')
        .insert([{
          user_id: userId,
          total_purchased: credits,
          total_used: 0,
          available: credits
        }]);
      
      if (insertError) {
        console.error('❌ Erro ao criar photo_credits:', insertError);
        return;
      }
      
      console.log('✅ photo_credits criado:', { total: credits, available: credits });
    }
    
  } catch (error) {
    console.error('❌ Erro ao liberar créditos:', error);
  }
}

simulateWebhook();
