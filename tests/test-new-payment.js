// Script para testar novo pagamento e webhook
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = 'https://tskdtjqxrqjfntushmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testNewPayment() {
  try {
    console.log('🧪 Testando novo pagamento e webhook...');

    // 1. Criar um novo pagamento
    const paymentData = {
      user_id: '00000000-0000-0000-0000-000000000000',
      payment_id: 'asaas-test-final-' + Date.now(),
      plan_name: 'Degustação',
      value: 9900, // R$ 99,00
      status: 'PENDING',
      external_reference: 'test-final-' + Date.now(),
      payment_link: 'https://sandbox.asaas.com/p/test-final',
      description: 'Teste final - Degustação',
      billing_type: 'CREDIT_CARD',
      charge_type: 'DETACHED',
      max_installment_count: 1,
      due_date_limit_days: 3,
      notification_enabled: true,
      callback_success_url: 'https://centraldocardapio.com.br/payment/status',
      callback_auto_redirect: true
    };

    const { data: savedPayment, error: paymentError } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();

    if (paymentError) {
      console.error('❌ Erro ao salvar pagamento:', paymentError);
      return;
    }

    console.log('✅ Pagamento criado:', savedPayment.payment_id);

    // 2. Simular webhook
    console.log('🔄 Simulando webhook...');
    
    const webhookData = {
      event: 'PAYMENT_CONFIRMED',
      payment: {
        id: savedPayment.payment_id,
        status: 'CONFIRMED',
        value: savedPayment.value,
        description: savedPayment.description,
        externalReference: savedPayment.external_reference,
        paymentDate: new Date().toISOString()
      }
    };

    const response = await fetch('http://localhost:3001/api/webhooks/asaas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Webhook processado com sucesso');
    } else {
      console.error('❌ Erro ao processar webhook:', result);
      return;
    }

    // 3. Verificar resultado
    console.log('\n📊 Verificando resultado...');
    
    const { data: finalPayment, error: finalPaymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', savedPayment.payment_id)
      .single();

    if (finalPaymentError) {
      console.error('❌ Erro ao buscar pagamento final:', finalPaymentError);
    } else {
      console.log('💳 Pagamento final:', {
        id: finalPayment.payment_id,
        status: finalPayment.status,
        plan: finalPayment.plan_name,
        value: `R$ ${(finalPayment.value / 100).toFixed(2)}`,
        payment_date: finalPayment.payment_date
      });
    }

    const { data: finalCredits, error: finalCreditsError } = await supabase
      .from('photo_credits')
      .select('*')
      .eq('user_id', savedPayment.user_id)
      .single();

    if (finalCreditsError) {
      console.error('❌ Erro ao buscar créditos finais:', finalCreditsError);
    } else {
      console.log('🎁 Créditos finais:', {
        total_purchased: finalCredits.total_purchased,
        total_used: finalCredits.total_used,
        available: finalCredits.available
      });
    }

    console.log('\n🎉 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testNewPayment();
