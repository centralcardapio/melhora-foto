// Verificar se o pagamento existe no banco
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://tskdtjqxrqjfntushmup.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPayment() {
  try {
    console.log('🔍 Verificando pagamento no banco...');
    
    const externalReference = 'user-pietromoura10@hotmail.com-1757946263620';
    
    console.log('🔍 Buscando pelo external_reference:', externalReference);
    
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('external_reference', externalReference)
      .single();
    
    if (error) {
      console.error('❌ Erro ao buscar pagamento:', error);
      
      // Tentar buscar todos os pagamentos para ver o que existe
      console.log('\n🔍 Buscando todos os pagamentos...');
      const { data: allPayments, error: allError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (allError) {
        console.error('❌ Erro ao buscar todos os pagamentos:', allError);
      } else {
        console.log('📋 Últimos 5 pagamentos:');
        allPayments.forEach((p, i) => {
          console.log(`${i + 1}. ID: ${p.id}, External Ref: ${p.external_reference}, Status: ${p.status}, Plano: ${p.plan_name}`);
        });
      }
      
      return;
    }
    
    console.log('✅ Pagamento encontrado:');
    console.log('ID:', payment.id);
    console.log('Payment ID:', payment.payment_id);
    console.log('External Reference:', payment.external_reference);
    console.log('Status:', payment.status);
    console.log('Plano:', payment.plan_name);
    console.log('Valor:', payment.value);
    console.log('Criado em:', payment.created_at);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkPayment();
