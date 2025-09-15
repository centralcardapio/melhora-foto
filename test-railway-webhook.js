// Testar webhook diretamente no Railway
const webhookData = {
  "id": "evt_15e444ff9b9ab9ec29294aa1abe68025&10431924",
  "event": "PAYMENT_CONFIRMED",
  "dateCreated": "2025-09-15 11:25:10",
  "payment": {
    "object": "payment",
    "id": "pay_mg01w2t00uny75kk",
    "dateCreated": "2025-09-15",
    "customer": "cus_000007021091",
    "checkoutSession": null,
    "paymentLink": "6vk8k639g1hn6rxt",
    "value": 159,
    "netValue": 155.35,
    "originalValue": null,
    "interestValue": null,
    "description": "Assinatura do plano Chef - Jean Almeida",
    "billingType": "CREDIT_CARD",
    "confirmedDate": "2025-09-15",
    "creditCard": {
      "creditCardNumber": "4444",
      "creditCardBrand": "VISA",
      "creditCardToken": "534c82fb-a6f5-4bb9-b44b-0db7afbf8bf8"
    },
    "pixTransaction": null,
    "status": "CONFIRMED",
    "dueDate": "2025-09-15",
    "originalDueDate": "2025-09-15",
    "paymentDate": null,
    "clientPaymentDate": "2025-09-15",
    "installmentNumber": null,
    "invoiceUrl": "https://sandbox.asaas.com/i/mg01w2t00uny75kk",
    "invoiceNumber": "11324529",
    "externalReference": "user-pietromoura10@hotmail.com-1757946263620",
    "deleted": false,
    "anticipated": false,
    "anticipable": false,
    "creditDate": "2025-10-17",
    "estimatedCreditDate": "2025-10-17",
    "transactionReceiptUrl": "https://sandbox.asaas.com/comprovantes/7003989496176253",
    "nossoNumero": null,
    "bankSlipUrl": null,
    "lastInvoiceViewedDate": null,
    "lastBankSlipViewedDate": null,
    "discount": {
      "value": 0,
      "limitDate": null,
      "dueDateLimitDays": 0,
      "type": "FIXED"
    },
    "fine": {
      "value": 0,
      "type": "FIXED"
    },
    "interest": {
      "value": 0,
      "type": "PERCENTAGE"
    },
    "postalService": false,
    "escrow": null,
    "refunds": null
  }
};

async function testRailwayWebhook() {
  try {
    console.log('🚀 Testando webhook no Railway...');
    
    const response = await fetch('https://melhora-foto-production.up.railway.app/api/webhooks/asaas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Asaas_Hmlg/3.0'
      },
      body: JSON.stringify(webhookData)
    });
    
    console.log('📡 Status da resposta:', response.status);
    console.log('📡 Status Text:', response.statusText);
    
    const responseData = await response.text();
    console.log('📡 Resposta:', responseData);
    
    if (response.ok) {
      console.log('✅ Webhook enviado com sucesso!');
    } else {
      console.log('❌ Erro no webhook:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar webhook:', error);
  }
}

testRailwayWebhook();
