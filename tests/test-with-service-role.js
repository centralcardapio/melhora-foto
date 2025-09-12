// Script usando service_role (mais permissivo)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tskdtjqxrqjfntushmup.supabase.co';
// IMPORTANTE: Substitua pela sua chave de service_role do Supabase
const supabaseServiceKey = 'SUA_CHAVE_SERVICE_ROLE_AQUI';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testWithServiceRole() {
  try {
    console.log('🔑 Testando com service_role...');

    // Testar inserção
    const testPayment = {
      user_id: '00000000-0000-0000-0000-000000000000',
      payment_id: 'test-service-' + Date.now(),
      plan_name: 'Teste Service Role',
      value: 15000,
      status: 'PENDING',
      external_reference: 'test-service-ref-' + Date.now()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('payments')
      .insert([testPayment])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError);
    } else {
      console.log('✅ Pagamento inserido com service_role:', insertData);
    }

    // Listar pagamentos
    const { data: payments, error: listError } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (listError) {
      console.error('❌ Erro ao listar:', listError);
    } else {
      console.log('📋 Total de pagamentos:', payments?.length || 0);
      payments?.forEach((payment, index) => {
        console.log(`  ${index + 1}. ${payment.plan_name} - R$ ${(payment.value / 100).toFixed(2)} - ${payment.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testWithServiceRole();
