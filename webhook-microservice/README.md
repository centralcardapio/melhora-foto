# Microserviço de Webhook do Asaas

Este microserviço processa webhooks do Asaas e libera créditos automaticamente.

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
# Editar .env com suas configurações
```

## 🏃 Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

### Com PM2 (Recomendado)
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar com PM2
npm run pm2

# Ver logs
pm2 logs asaas-webhook

# Reiniciar
pm2 restart asaas-webhook
```

## 📡 Endpoints

- `GET /health` - Health check
- `POST /api/webhooks/asaas` - Webhook do Asaas

## 🔧 Configuração

### Variáveis de Ambiente

- `PORT` - Porta do servidor (padrão: 3001)
- `NODE_ENV` - Ambiente (development/production)
- `SUPABASE_URL` - URL do Supabase
- `SUPABASE_ANON_KEY` - Chave anônima do Supabase

### Webhook no Asaas

1. Acesse o painel do Asaas
2. Vá em Configurações > Webhooks
3. Adicione a URL: `https://seudominio.com/api/webhooks/asaas`
4. Selecione os eventos: `PAYMENT_CONFIRMED`

## 🐳 Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Monitoramento

- Logs em `./logs/`
- Health check em `/health`
- Métricas do PM2: `pm2 monit`

## 🔒 Segurança

- Helmet para headers de segurança
- CORS configurado
- Rate limiting (recomendado)
- Validação de assinatura do webhook (recomendado)
