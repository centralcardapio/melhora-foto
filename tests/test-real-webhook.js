// Script para testar webhook com pagamento real
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tskdtjqxrqjfntushmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealWebhook() {
  try {
    console.log('🧪 Testando webhook com pagamento real...');

    // 1. Buscar pagamentos PENDING
    const { data: pendingPayments, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Erro ao buscar pagamentos:', fetchError);
      return;
    }

    if (!pendingPayments || pendingPayments.length === 0) {
      console.log('ℹ️ Nenhum pagamento PENDING encontrado');
      return;
    }

    console.log(`📋 Encontrados ${pendingPayments.length} pagamentos PENDING`);

    // 2. Simular webhook para cada pagamento
    for (const payment of pendingPayments) {
      console.log(`\n🔄 Simulando webhook para: ${payment.plan_name} - R$ ${(payment.value / 100).toFixed(2)}`);

      const webhookData = {
        event: 'PAYMENT_CONFIRMED',
        payment: {
          id: payment.payment_id,
          status: 'CONFIRMED',
          value: payment.value,
          description: payment.description || `Pagamento confirmado - ${payment.plan_name}`,
          externalReference: payment.external_reference,
          paymentDate: new Date().toISOString()
        }
      };

      // Enviar webhook
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
      }

      // Aguardar um pouco entre os webhooks
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 3. Verificar resultado
    console.log('\n📊 Verificando resultado...');
    
    const { data: allPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (paymentsError) {
      console.error('❌ Erro ao buscar pagamentos:', paymentsError);
    } else {
      console.log('💳 Status dos pagamentos:');
      allPayments?.forEach((payment, index) => {
        console.log(`  ${index + 1}. ${payment.plan_name} - R$ ${(payment.value / 100).toFixed(2)} - ${payment.status}`);
      });
    }

    const { data: allCredits, error: creditsError } = await supabase
      .from('photo_credits')
      .select('*')
      .eq('user_id', '00000000-0000-0000-0000-000000000000');

    if (creditsError) {
      console.error('❌ Erro ao buscar créditos:', creditsError);
    } else {
      console.log('🎁 Créditos liberados:');
      allCredits?.forEach((credit, index) => {
        console.log(`  ${index + 1}. Total comprado: ${credit.total_purchased}, Disponível: ${credit.available}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testRealWebhook();
