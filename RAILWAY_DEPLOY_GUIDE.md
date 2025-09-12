# 🚀 Guia de Deploy Completo - Railway + Vercel

## 📋 Arquitetura Final
- **Frontend React** → Vercel
- **Microserviço Webhook** → Railway
- **Banco de Dados** → Supabase

## 🔧 Deploy do Microserviço (Railway)

### 1. Preparar o Código
```bash
# Fazer commit de tudo
git add .
git commit -m "Add Railway deployment config"
git push origin main
```

### 2. Deploy no Railway
1. Acesse [railway.app](https://railway.app)
2. **New Project** > **Deploy from GitHub repo**
3. Selecione seu repositório
4. **Root Directory**: `webhook-microservice`
5. Clique em **Deploy**

### 3. Configurar Variáveis de Ambiente
No Railway Dashboard > **Variables**:
```
SUPABASE_URL=https://tskdtjqxrqjfntushmup.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4
NODE_ENV=production
PORT=3001
```

### 4. Obter URL do Webhook
- Railway Dashboard > **Settings** > **Domains**
- URL: `https://seu-projeto.railway.app`

## 🌐 Deploy do Frontend (Vercel)

### 1. Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. **New Project**
3. Importe seu repositório GitHub
4. Framework: **Vite**

### 2. Configurar Variáveis de Ambiente
No Vercel > **Settings** > **Environment Variables**:
```
VITE_ASAAS_API_KEY=$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjNjM2QxY2MyLTUwMzctNDlhOS1iYTM4LTE5NTllMzU1NzU0MTo6JGFhY2hfNmJhN2YxZWEtODNiZS00ZTM1LTk4NDUtYmI2MDNjZmU0MmFi
VITE_SUPABASE_URL=https://tskdtjqxrqjfntushmup.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4
```

### 3. Deploy
- Clique em **Deploy**
- Aguarde o build
- URL: `https://seu-projeto.vercel.app`

## 🔗 Configurar Webhook no Asaas

### 1. Acesse o Painel do Asaas
1. Vá em **Configurações** > **Webhooks**
2. **Adicionar Webhook**
3. **URL**: `https://seu-projeto.railway.app/api/webhooks/asaas`
4. **Eventos**: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`

## 🧪 Testar o Sistema

### 1. Testar Frontend
- Acesse `https://seu-projeto.vercel.app`
- Faça login
- Teste criação de pagamento

### 2. Testar Webhook
```bash
# Health check
curl https://seu-projeto.railway.app/health

# Teste webhook
curl -X POST https://seu-projeto.railway.app/api/webhooks/test
```

### 3. Testar Pagamento Real
- Crie um pagamento no frontend
- Complete o pagamento no Asaas
- Verifique se os créditos foram liberados

## 📊 Monitoramento

### Railway
- **Metrics** → CPU, RAM, Requests
- **Logs** → Logs em tempo real
- **Deployments** → Histórico de deploys

### Vercel
- **Analytics** → Tráfego e performance
- **Functions** → Logs de API calls

### Supabase
- **Logs** → Queries e erros
- **Database** → Status das tabelas

## 💰 Custos Estimados

| Serviço | Plano | Custo |
|---------|-------|-------|
| Railway | Hobby | $0/mês |
| Vercel | Hobby | $0/mês |
| Supabase | Free | $0/mês |
| **Total** | | **$0/mês** |

## 🆘 Troubleshooting

### Webhook não funciona
1. Verifique se a URL do Railway está correta
2. Teste o health check
3. Verifique logs no Railway

### Frontend não carrega
1. Verifique variáveis de ambiente no Vercel
2. Verifique build logs
3. Teste localmente

### Créditos não são liberados
1. Verifique logs do webhook no Railway
2. Verifique conexão com Supabase
3. Execute migração de créditos

## 🎯 URLs Finais

- **Frontend**: `https://seu-projeto.vercel.app`
- **Webhook**: `https://seu-projeto.railway.app/api/webhooks/asaas`
- **Health Check**: `https://seu-projeto.railway.app/health`
