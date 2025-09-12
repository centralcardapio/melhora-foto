// Script simples para testar pagamentos
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tskdtjqxrqjfntushmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPayments() {
  try {
    console.log('🧪 Testando sistema de pagamentos...');

    // 1. Verificar se a tabela existe
    console.log('\n1️⃣ Verificando tabela...');
    const { data: payments, error: listError } = await supabase
      .from('payments')
      .select('*')
      .limit(1);

    if (listError) {
      console.error('❌ Erro ao acessar tabela payments:', listError);
      return;
    }

    console.log('✅ Tabela payments acessível');
    console.log('📊 Total de pagamentos:', payments?.length || 0);

    // 2. Testar inserção com dados mínimos
    console.log('\n2️⃣ Testando inserção...');
    const testPayment = {
      user_id: '00000000-0000-0000-0000-000000000000',
      payment_id: 'test-' + Date.now(),
      plan_name: 'Teste',
      value: 10000,
      status: 'PENDING',
      external_reference: 'test-ref-' + Date.now()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('payments')
      .insert([testPayment])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError);
      
      // Se for erro de RLS, vamos tentar uma abordagem diferente
      if (insertError.code === '42501') {
        console.log('\n🔧 Erro de RLS detectado. Soluções:');
        console.log('1. Execute o SQL em fix-payments-table.sql no Supabase Dashboard');
        console.log('2. Ou desabilite RLS temporariamente: ALTER TABLE payments DISABLE ROW LEVEL SECURITY;');
        console.log('3. Ou use uma chave de service_role em vez de anon');
      }
    } else {
      console.log('✅ Pagamento inserido com sucesso:', insertData);
    }

    // 3. Listar todos os pagamentos
    console.log('\n3️⃣ Listando todos os pagamentos...');
    const { data: allPayments, error: allError } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Erro ao listar pagamentos:', allError);
    } else {
      console.log('📋 Pagamentos encontrados:', allPayments?.length || 0);
      allPayments?.forEach((payment, index) => {
        console.log(`  ${index + 1}. ${payment.plan_name} - R$ ${(payment.value / 100).toFixed(2)} - ${payment.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testPayments();
