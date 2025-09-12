# 🔔 Configuração de Webhooks - Asaas

## 📋 **Visão Geral**

Webhooks permitem que o Asaas notifique sua aplicação em tempo real sobre mudanças no status de pagamentos, eliminando a necessidade de consultas manuais.

## 🚀 **Implementação Atual**

### ✅ **Frontend (React)**
- **Serviço de Webhook**: `src/services/webhookService.ts`
- **Hook de Webhook**: `src/hooks/useWebhook.ts`
- **Endpoint Simulado**: `src/services/webhookEndpoint.ts`
- **Página de Status**: Atualizada para usar webhooks

### 🔧 **Funcionalidades Implementadas**
- ✅ Listeners para eventos de pagamento
- ✅ Notificações em tempo real
- ✅ Simulação de webhooks para testes
- ✅ Validação de assinatura (estrutura)
- ✅ Interface de usuário responsiva

## 🌐 **Configuração no Asaas**

### **1. Acesse o Painel do Asaas**
```
https://sandbox.asaas.com/ (Desenvolvimento)
https://www.asaas.com/ (Produção)
```

### **2. Configure o Webhook**
1. Vá em **"Integrações"** → **"Webhooks"**
2. Clique em **"Novo Webhook"**
3. Configure:
   - **URL**: `https://centraldocardapio.com.br/api/webhooks/asaas`
   - **Eventos**: Selecione os eventos desejados
   - **Status**: Ativo

### **3. Eventos Recomendados**
```
✅ PAYMENT_CONFIRMED    - Pagamento confirmado
✅ PAYMENT_RECEIVED     - Pagamento recebido  
✅ PAYMENT_OVERDUE      - Pagamento atrasado
✅ PAYMENT_REFUNDED     - Pagamento estornado
✅ PAYMENT_LINK_CREATED - Link criado
```

## 🔧 **Implementação do Backend**

### **Node.js + Express (Exemplo)**
```javascript
const express = require('express');
const crypto = require('crypto');
const { WebhookEndpoint } = require('./src/services/webhookEndpoint');

const app = express();
app.use(express.json());

// Endpoint para receber webhooks
app.post('/api/webhooks/asaas', async (req, res) => {
  try {
    const signature = req.headers['asaas-signature'];
    const payload = req.body;
    
    const result = await WebhookEndpoint.handleWebhook(payload, signature);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
```

### **Python + Flask (Exemplo)**
```python
from flask import Flask, request, jsonify
import hmac
import hashlib
import json

app = Flask(__name__)

@app.route('/api/webhooks/asaas', methods=['POST'])
def handle_webhook():
    try:
        signature = request.headers.get('asaas-signature')
        payload = request.get_json()
        
        # Valida assinatura
        if not validate_signature(payload, signature):
            return jsonify({'success': False, 'message': 'Assinatura inválida'}), 400
        
        # Processa webhook
        result = process_webhook(payload)
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f'Erro no webhook: {e}')
        return jsonify({'success': False, 'message': 'Erro interno'}), 500

def validate_signature(payload, signature):
    # Implementar validação HMAC
    secret = 'seu_secret_aqui'
    expected_signature = hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    
    return signature == expected_signature

if __name__ == '__main__':
    app.run(debug=True)
```

## 🧪 **Testando Webhooks**

### **1. Simulação no Frontend**
```javascript
import { useWebhook } from '@/hooks/useWebhook';

const { simulateWebhook } = useWebhook();

// Simula pagamento confirmado
await simulateWebhook('PAYMENT_CONFIRMED', {
  id: 'pay_123456',
  status: 'CONFIRMED',
  value: 15900,
  description: 'Teste de webhook'
});
```

### **2. Teste com ngrok (Desenvolvimento)**
```bash
# Instale o ngrok
npm install -g ngrok

# Exponha sua aplicação local
ngrok http 3000

# Use a URL do ngrok no Asaas
# Ex: https://abc123.ngrok.io/api/webhooks/asaas
```

### **3. Teste com curl**
```bash
curl -X POST https://centraldocardapio.com.br/api/webhooks/asaas \
  -H "Content-Type: application/json" \
  -H "asaas-signature: sua_assinatura_aqui" \
  -d '{
    "event": "PAYMENT_CONFIRMED",
    "payment": {
      "id": "pay_123456",
      "status": "CONFIRMED",
      "value": 15900,
      "description": "Teste de webhook"
    }
  }'
```

## 🔒 **Segurança**

### **1. Validação de Assinatura**
```javascript
const crypto = require('crypto');

function validateSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === expectedSignature;
}
```

### **2. Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 webhooks por IP
});

app.use('/api/webhooks', webhookLimiter);
```

### **3. Logs de Auditoria**
```javascript
function logWebhook(event, payload, result) {
  console.log(`[${new Date().toISOString()}] Webhook: ${event}`, {
    payload,
    result,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
}
```

## 📊 **Monitoramento**

### **1. Logs de Webhook**
```javascript
// Adicione logs detalhados
console.log('🔔 Webhook recebido:', {
  event: payload.event,
  timestamp: new Date().toISOString(),
  ip: req.ip,
  userAgent: req.get('User-Agent')
});
```

### **2. Métricas**
```javascript
// Contadores de eventos
const webhookCounters = {
  'PAYMENT_CONFIRMED': 0,
  'PAYMENT_RECEIVED': 0,
  'PAYMENT_OVERDUE': 0,
  'PAYMENT_REFUNDED': 0
};
```

## 🚀 **Deploy em Produção**

### **1. Variáveis de Ambiente**
```env
ASAAS_WEBHOOK_SECRET=sua_chave_secreta_aqui
ASAAS_API_KEY=sua_chave_api_aqui
WEBHOOK_URL=https://centraldocardapio.com.br/api/webhooks/asaas
```

### **2. SSL/HTTPS**
- Webhooks **DEVEM** usar HTTPS
- Certificado SSL válido obrigatório
- Asaas não aceita webhooks HTTP

### **3. Timeout e Retry**
- Asaas tenta reenviar webhooks por 24h
- Timeout de 30 segundos
- Resposta HTTP 200 obrigatória

## 📝 **Checklist de Implementação**

- [ ] Configurar webhook no painel do Asaas
- [ ] Implementar endpoint no backend
- [ ] Validar assinatura dos webhooks
- [ ] Configurar logs de auditoria
- [ ] Testar com ngrok (desenvolvimento)
- [ ] Deploy em produção com HTTPS
- [ ] Monitorar logs de webhook
- [ ] Configurar alertas de erro

## 🎯 **Vantagens dos Webhooks**

- ✅ **Tempo Real**: Notificações instantâneas
- ✅ **Eficiência**: Menos requisições à API
- ✅ **Confiabilidade**: Asaas garante entrega
- ✅ **Experiência**: Usuário não precisa atualizar
- ✅ **Escalabilidade**: Suporta alto volume

## 🔗 **Links Úteis**

- [Documentação Asaas - Webhooks](https://docs.asaas.com/reference/webhooks)
- [Exemplos de Webhook](https://docs.asaas.com/reference/exemplos-de-webhook)
- [Validação de Assinatura](https://docs.asaas.com/reference/validacao-de-assinatura)
