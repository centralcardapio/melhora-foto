// Script para testar com usuário real
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tskdtjqxrqjfntushmup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWithRealUser() {
  try {
    console.log('👤 Testando com usuário real...');

    // 1. Primeiro, vamos ver se existe algum usuário
    console.log('\n1️⃣ Verificando usuários existentes...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(5);

    if (usersError) {
      console.error('❌ Erro ao listar usuários:', usersError);
      
      // Se não conseguir acessar a tabela users, vamos tentar auth.users
      console.log('\n🔍 Tentando acessar auth.users...');
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('id, email')
        .limit(5);

      if (authError) {
        console.error('❌ Erro ao acessar auth.users:', authError);
        console.log('\n💡 Soluções:');
        console.log('1. Criar um usuário de teste');
        console.log('2. Usar um ID de usuário existente');
        console.log('3. Remover temporariamente a foreign key constraint');
        return;
      } else {
        console.log('✅ Usuários encontrados em auth.users:', authUsers);
        if (authUsers && authUsers.length > 0) {
          await testWithUserId(authUsers[0].id);
        }
      }
    } else {
      console.log('✅ Usuários encontrados:', users);
      if (users && users.length > 0) {
        await testWithUserId(users[0].id);
      } else {
        console.log('❌ Nenhum usuário encontrado');
        await createTestUser();
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

async function testWithUserId(userId) {
  try {
    console.log(`\n🧪 Testando com usuário ID: ${userId}`);

    const testPayment = {
      user_id: userId,
      payment_id: 'test-' + Date.now(),
      plan_name: 'Teste Real User',
      value: 15000,
      status: 'PENDING',
      external_reference: 'test-real-user-' + Date.now()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('payments')
      .insert([testPayment])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError);
    } else {
      console.log('✅ Pagamento inserido com sucesso:', insertData);
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
    console.error('❌ Erro ao testar com usuário:', error);
  }
}

async function createTestUser() {
  try {
    console.log('\n👤 Criando usuário de teste...');
    
    // Tentar criar um usuário de teste
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'teste@exemplo.com',
      password: '123456789',
      options: {
        data: {
          full_name: 'Usuário Teste'
        }
      }
    });

    if (signUpError) {
      console.error('❌ Erro ao criar usuário:', signUpError);
      console.log('\n💡 Alternativa: Execute este SQL no Supabase Dashboard:');
      console.log(`
        -- Remover temporariamente a foreign key constraint
        ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;
        
        -- Ou criar um usuário manualmente
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
        VALUES (
          '00000000-0000-0000-0000-000000000000',
          'teste@exemplo.com',
          'hashed_password',
          NOW(),
          NOW(),
          NOW()
        );
      `);
    } else {
      console.log('✅ Usuário criado:', signUpData);
      if (signUpData.user) {
        await testWithUserId(signUpData.user.id);
      }
    }

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  }
}

testWithRealUser();
