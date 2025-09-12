const ngrok = require('ngrok');
const express = require('express');
const { WebhookEndpoint } = require('./src/services/webhookEndpoint');

const app = express();
app.use(express.json());

// Endpoint para receber webhooks
app.post('/api/webhooks/asaas', async (req, res) => {
  try {
    console.log('🔔 Webhook recebido:', req.body);
    
    const result = await WebhookEndpoint.handleWebhook(req.body);
    
    console.log('✅ Webhook processado:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

// Endpoint de teste
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Servidor de webhook funcionando!',
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  try {
    // Inicia o servidor local
    const server = app.listen(3001, () => {
      console.log('🚀 Servidor rodando na porta 3001');
    });

    // Expõe via ngrok
    const url = await ngrok.connect(3001);
    console.log('🌐 URL pública:', url);
    console.log('🔗 Endpoint de webhook:', `${url}/api/webhooks/asaas`);
    console.log('🧪 Endpoint de teste:', `${url}/test`);
    
    console.log('\n📋 Próximos passos:');
    console.log('1. Configure no Asaas: ' + url + '/api/webhooks/asaas');
    console.log('2. Teste com: curl -X POST ' + url + '/test');
    console.log('3. Pressione Ctrl+C para parar');

    // Mantém o servidor rodando
    process.on('SIGINT', async () => {
      console.log('\n🛑 Parando servidor...');
      await ngrok.disconnect();
      server.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
  }
}

startServer();
