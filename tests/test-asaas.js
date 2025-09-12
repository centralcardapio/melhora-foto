// Teste simples para verificar a API do Asaas

const testData = {
  billingType: 'CREDIT_CARD',
  chargeType: 'DETACHED',
  value: 99,
  name: 'Plano Teste',
  description: 'Teste de integração',
  externalReference: 'test-' + Date.now(),
  maxInstallmentCount: 1,
  dueDateLimitDays: 3,
  notificationEnabled: true,
  callback: {
    successUrl: 'http://localhost:8080/payment/status',
    autoRedirect: true
  }
};

console.log('🧪 Testando dados do Asaas:');
console.log(JSON.stringify(testData, null, 2));

// Teste com curl
const curlCommand = `curl --request POST \\
     --url https://api-sandbox.asaas.com/v3/paymentLinks \\
     --header 'accept: application/json' \\
     --header 'access_token: $aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjNjM2QxY2MyLTUwMzctNDlhOS1iYTM4LTE5NTllMzU1NzU0MTo6JGFhY2hfNmJhN2YxZWEtODNiZS00ZTM1LTk4NDUtYmI2MDNjZmU0MmFi' \\
     --header 'content-type: application/json' \\
     --data '${JSON.stringify(testData)}'`;

console.log('\n🔧 Comando curl para testar:');
console.log(curlCommand);
