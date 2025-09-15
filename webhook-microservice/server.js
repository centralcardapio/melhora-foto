// Microserviço de Webhook do Asaas
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

console.log('🚀 Iniciando microserviço de webhook...');
console.log('📋 Variáveis de ambiente carregadas');
console.log('🔧 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('🔧 PORT:', process.env.PORT || '3001');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://tskdtjqxrqjfntushmup.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4';

console.log('🔧 Configuração do Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NÃO DEFINIDA');

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeamento de planos para créditos
const planCredits = {
  'Degustação': 10,
  'Chef': 20,
  'Reserva': 30
};

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  try {
    console.log('🏥 Health check solicitado');
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'asaas-webhook-microservice',
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('❌ Erro no health check:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      service: 'asaas-webhook-microservice',
      error: error.message
    });
  }
});

// Endpoint principal para webhooks do Asaas
app.post('/api/webhooks/asaas', async (req, res) => {
  try {
    console.log('🔔 Webhook recebido do Asaas:', {
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString()
    });

    const webhookData = req.body;
    
    // Verificar se é um evento de pagamento confirmado
    if (webhookData.event === 'PAYMENT_CONFIRMED' && webhookData.payment) {
      await processPaymentConfirmed(webhookData.payment);
    }

    // Responder com sucesso
    res.status(200).json({ 
      message: 'Webhook processado com sucesso',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    
    res.status(500).json({ 
      message: 'Erro ao processar webhook',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Função para processar pagamento confirmado
async function processPaymentConfirmed(payment) {
  try {
    console.log('✅ Processando pagamento confirmado:', payment.id);
    console.log('🔍 External Reference:', payment.externalReference);

    // 1. Buscar dados do pagamento no banco pelo external_reference
    const { data: paymentRecord, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('external_reference', payment.externalReference)
      .single();

    if (fetchError) {
      console.error('❌ Pagamento não encontrado no banco:', payment.id);
      return;
    }

    console.log('📋 Pagamento encontrado:', paymentRecord.plan_name);

    // 2. Atualizar status do pagamento
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_id: payment.id, // Salvar o ID real do pagamento
        status: 'CONFIRMED',
        payment_date: payment.paymentDate || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('external_reference', payment.externalReference);

    if (updateError) {
      console.error('❌ Erro ao atualizar pagamento:', updateError);
      return;
    }

    console.log('✅ Status do pagamento atualizado para CONFIRMED');

    // 3. Liberar créditos
    const creditsToRelease = planCredits[paymentRecord.plan_name] || 0;
    
    if (creditsToRelease > 0) {
      await releaseCredits(paymentRecord.user_id, paymentRecord.plan_name, payment.id, creditsToRelease);
      console.log(`🎁 ${creditsToRelease} créditos liberados para ${paymentRecord.plan_name}`);
    } else {
      console.warn(`⚠️ Nenhum crédito mapeado para o plano: ${paymentRecord.plan_name}`);
    }

  } catch (error) {
    console.error('❌ Erro ao processar pagamento confirmado:', error);
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Microserviço de Webhook rodando na porta ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/webhooks/asaas`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Servidor iniciado com sucesso!`);
}).on('error', (error) => {
  console.error('❌ Erro ao iniciar servidor:', error);
  process.exit(1);
});
