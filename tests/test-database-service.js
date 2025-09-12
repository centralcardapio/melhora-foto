// Script para testar o serviço de banco de dados
import { PaymentDatabaseService } from './src/services/paymentDatabaseService.ts';

async function testDatabaseService() {
  try {
    console.log('🧪 Testando PaymentDatabaseService...');

    // 1. Testar salvamento de pagamento
    console.log('\n1️⃣ Testando salvamento de pagamento...');
    const testPayment = {
      user_id: '00000000-0000-0000-0000-000000000000',
      payment_id: 'asaas-test-' + Date.now(),
      plan_name: 'Plano Teste',
      value: 25000, // R$ 250,00
      status: 'PENDING',
      external_reference: 'test-external-' + Date.now(),
      payment_link: 'https://sandbox.asaas.com/p/' + Date.now(),
      description: 'Teste de pagamento via serviço',
      billing_type: 'CREDIT_CARD',
      charge_type: 'DETACHED',
      max_installment_count: 1,
      due_date_limit_days: 3,
      notification_enabled: true,
      callback_success_url: 'https://centraldocardapio.com.br/payment/status',
      callback_auto_redirect: true
    };

    const savedPayment = await PaymentDatabaseService.savePayment(testPayment);
    console.log('✅ Pagamento salvo:', savedPayment);

    // 2. Testar busca por ID do Asaas
    console.log('\n2️⃣ Testando busca por ID do Asaas...');
    const foundPayment = await PaymentDatabaseService.getPaymentByAsaasId(testPayment.payment_id);
    console.log('✅ Pagamento encontrado:', foundPayment);

    // 3. Testar atualização de status
    console.log('\n3️⃣ Testando atualização de status...');
    const updatedPayment = await PaymentDatabaseService.updatePaymentStatus(
      testPayment.payment_id,
      'CONFIRMED',
      {
        payment_date: new Date().toISOString(),
        description: 'Pagamento confirmado via teste'
      }
    );
    console.log('✅ Status atualizado:', updatedPayment);

    // 4. Testar busca por usuário
    console.log('\n4️⃣ Testando busca por usuário...');
    const userPayments = await PaymentDatabaseService.getUserPayments(testPayment.user_id);
    console.log('✅ Pagamentos do usuário:', userPayments.length);

    // 5. Testar busca por status
    console.log('\n5️⃣ Testando busca por status...');
    const confirmedPayments = await PaymentDatabaseService.getPaymentsByStatus('CONFIRMED');
    console.log('✅ Pagamentos confirmados:', confirmedPayments.length);

    console.log('\n🎉 Todos os testes passaram!');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testDatabaseService();
