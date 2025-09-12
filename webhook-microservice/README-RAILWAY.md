# 🚀 Deploy no Railway

## 📋 Pré-requisitos
- Conta no [Railway](https://railway.app)
- Repositório no GitHub
- Chaves do Supabase

## 🔧 Deploy Passo a Passo

### 1. Preparar o Código
```bash
# Fazer commit
git add .
git commit -m "Add Railway deployment config"
git push origin main
```

### 2. Deploy no Railway

#### Opção A: Via GitHub (Recomendado)
1. Acesse [railway.app](https://railway.app)
2. **New Project** > **Deploy from GitHub repo**
3. Selecione seu repositório
4. **Root Directory**: `webhook-microservice`
5. Clique em **Deploy**

#### Opção B: Via Railway CLI
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd webhook-microservice
railway deploy
```

### 3. Configurar Variáveis de Ambiente

No Railway Dashboard:
1. Vá em **Variables**
2. Adicione:
```
SUPABASE_URL=https://tskdtjqxrqjfntushmup.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4
NODE_ENV=production
PORT=3001
```

### 4. Obter URL do Webhook
1. No Railway Dashboard
2. Vá em **Settings** > **Domains**
3. Copie a URL: `https://seu-projeto.railway.app`

## 🧪 Testar o Deploy

### Health Check
```bash
curl https://seu-projeto.railway.app/health
```

### Teste do Webhook
```bash
curl -X POST https://seu-projeto.railway.app/api/webhooks/test
```

## 🔗 Configurar no Asaas

1. Acesse o painel do Asaas
2. **Configurações** > **Webhooks**
3. **URL**: `https://seu-projeto.railway.app/api/webhooks/asaas`
4. **Eventos**: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`

## 📊 Monitoramento

### Railway Dashboard
- **Metrics** → CPU, RAM, Requests
- **Logs** → Logs em tempo real
- **Deployments** → Histórico de deploys

### Health Check
- **URL**: `https://seu-projeto.railway.app/health`
- **Status**: 200 OK = Funcionando

## 💰 Custos Railway

| Plano | Preço | Limites |
|-------|-------|---------|
| **Hobby** | $0 | 500 horas/mês |
| **Pro** | $5/mês | Ilimitado |

## 🆘 Troubleshooting

### Deploy falha
1. Verifique logs no Railway
2. Verifique variáveis de ambiente
3. Teste localmente

### Webhook não funciona
1. Verifique se a URL está correta
2. Teste o health check
3. Verifique logs do Railway

### Erro de conexão com Supabase
1. Verifique as variáveis de ambiente
2. Teste conexão local
3. Verifique logs do Supabase
