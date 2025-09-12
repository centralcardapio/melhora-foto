// Script simples para testar webhooks
const express = require('express');
const app = express();

app.use(express.json());

// Endpoint para receber webhooks
app.post('/api/webhooks/asaas', (req, res) => {
  console.log('\n🔔 WEBHOOK RECEBIDO DO ASAAS!');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('📋 Evento:', req.body.event);
  console.log('💳 Pagamento ID:', req.body.payment?.id);
  console.log('💰 Valor:', req.body.payment?.value);
  console.log('📊 Status:', req.body.payment?.status);
  console.log('📝 Descrição:', req.body.payment?.description);
  console.log('📦 Body completo:', JSON.stringify(req.body, null, 2));
  
  // Responde com sucesso
  res.status(200).json({ 
    success: true, 
    message: 'Webhook recebido com sucesso!',
    timestamp: new Date().toISOString()
  });
});

// Endpoint de teste
app.get('/test', (req, res) => {
  res.json({ 
    message: '✅ Servidor de webhook funcionando!',
    timestamp: new Date().toISOString(),
    webhookUrl: '/api/webhooks/asaas',
    status: 'online'
  });
});

// Inicia o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log('🚀 Servidor de webhook iniciado!');
  console.log('🔗 URL local: http://localhost:' + PORT);
  console.log('🧪 Teste: http://localhost:' + PORT + '/test');
  console.log('📡 Webhook: http://localhost:' + PORT + '/api/webhooks/asaas');
  console.log('\n📋 Para expor publicamente:');
  console.log('1. Abra outro terminal');
  console.log('2. Execute: npx ngrok http ' + PORT);
  console.log('3. Use a URL do ngrok no Asaas');
  console.log('\n⏹️  Pressione Ctrl+C para parar');
});
