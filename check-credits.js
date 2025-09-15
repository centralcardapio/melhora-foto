// Verificar se os créditos foram liberados
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://tskdtjqxrqjfntushmup.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCredits() {
  try {
    console.log('🔍 Verificando créditos...');
    
    // Primeiro, buscar o user_id do pagamento
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('user_id')
      .eq('external_reference', 'user-pietromoura10@hotmail.com-1757946263620')
      .single();
    
    if (paymentError) {
      console.error('❌ Erro ao buscar pagamento:', paymentError);
      return;
    }
    
    const userId = payment.user_id;
    console.log('👤 User ID encontrado:', userId);
    
    // Verificar credit_purchases
    console.log('\n🔍 Verificando credit_purchases...');
    const { data: purchases, error: purchasesError } = await supabase
      .from('credit_purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (purchasesError) {
      console.error('❌ Erro ao buscar compras:', purchasesError);
    } else {
      console.log('📋 Compras de créditos:');
      purchases.forEach((p, i) => {
        console.log(`${i + 1}. ID: ${p.id}, Quantidade: ${p.amount}, Disponível: ${p.available_amount}, Tipo: ${p.purchase_type}, Criado: ${p.created_at}`);
      });
    }
    
    // Verificar photo_credits
    console.log('\n🔍 Verificando photo_credits...');
    const { data: photoCredits, error: photoCreditsError } = await supabase
      .from('photo_credits')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (photoCreditsError) {
      console.error('❌ Erro ao buscar photo_credits:', photoCreditsError);
    } else {
      console.log('📋 Créditos de foto:');
      console.log('Total Comprado:', photoCredits.total_purchased);
      console.log('Total Usado:', photoCredits.total_used);
      console.log('Disponível:', photoCredits.available);
      console.log('Criado em:', photoCredits.created_at);
      console.log('Atualizado em:', photoCredits.updated_at);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkCredits();
