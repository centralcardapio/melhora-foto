// Script para corrigir a função get_user_available_credits
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tskdtjqxrqjfntushmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCreditsFunction() {
  try {
    console.log('🔧 Corrigindo função get_user_available_credits...');
    
    // SQL para atualizar a função
    const sql = `
      CREATE OR REPLACE FUNCTION public.get_user_available_credits(user_id_param UUID)
      RETURNS INTEGER AS $$
      BEGIN
        RETURN COALESCE(
          (SELECT available 
           FROM public.photo_credits 
           WHERE user_id = user_id_param
          ), 0
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
    `;
    
    // Executar via query direta
    const { data, error } = await supabase
      .from('_sql')
      .select('*')
      .eq('query', sql);
    
    if (error) {
      console.error('❌ Erro ao executar SQL:', error);
      
      // Tentar método alternativo
      console.log('🔄 Tentando método alternativo...');
      
      // Usar rpc para executar SQL
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('exec', { sql });
      
      if (rpcError) {
        console.error('❌ Erro no RPC:', rpcError);
        console.log('\n📋 Execute este SQL manualmente no Supabase Dashboard:');
        console.log(sql);
      } else {
        console.log('✅ Função atualizada com sucesso!');
      }
    } else {
      console.log('✅ Função atualizada com sucesso!');
    }
    
    // Testar a função após atualização
    console.log('\n🧪 Testando função atualizada...');
    
    const { data: testResult, error: testError } = await supabase
      .rpc('get_user_available_credits', { 
        user_id_param: '6f3b20bb-a906-4b57-be89-c0e7419a263d' 
      });
    
    if (testError) {
      console.error('❌ Erro no teste:', testError);
    } else {
      console.log(`✅ Teste: User 6f3b20bb... retorna ${testResult} (deveria ser 22)`);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

fixCreditsFunction();
