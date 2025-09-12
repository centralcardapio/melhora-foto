# 🗄️ Integração com Banco de Dados - Pagamentos

## 📋 **Visão Geral**

Sistema completo para salvar e gerenciar pagamentos no banco de dados, incluindo:
- ✅ Criação de pagamentos
- ✅ Atualização de status via webhooks
- ✅ Consulta de histórico
- ✅ Rastreamento de transações

## 🏗️ **Estrutura da Tabela**

### **Tabela: `payments`**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,                    -- ID único do registro
  user_id UUID NOT NULL,                  -- ID do usuário (FK)
  payment_id TEXT NOT NULL UNIQUE,        -- ID do pagamento no Asaas
  plan_name TEXT NOT NULL,                -- Nome do plano
  value INTEGER NOT NULL,                 -- Valor em centavos
  status TEXT NOT NULL DEFAULT 'PENDING', -- Status do pagamento
  external_reference TEXT,                -- Referência externa
  payment_link TEXT,                      -- URL do link de pagamento
  created_at TIMESTAMP DEFAULT NOW(),     -- Data de criação
  updated_at TIMESTAMP DEFAULT NOW(),     -- Data de atualização
  payment_date TIMESTAMP,                 -- Data do pagamento
  due_date TIMESTAMP,                     -- Data de vencimento
  description TEXT,                       -- Descrição do pagamento
  billing_type TEXT DEFAULT 'CREDIT_CARD', -- Tipo de cobrança
  charge_type TEXT DEFAULT 'DETACHED',    -- Tipo de cobrança
  max_installment_count INTEGER DEFAULT 1, -- Máximo de parcelas
  due_date_limit_days INTEGER DEFAULT 3,  -- Dias para vencimento
  notification_enabled BOOLEAN DEFAULT true, -- Notificações habilitadas
  callback_success_url TEXT,              -- URL de sucesso
  callback_auto_redirect BOOLEAN DEFAULT true -- Redirecionamento automático
);
```

## 🔧 **Implementação**

### **1. Serviço de Banco de Dados**
- **Arquivo**: `src/services/paymentDatabaseService.ts`
- **Funções**:
  - `savePayment()` - Salva novo pagamento
  - `updatePaymentStatus()` - Atualiza status
  - `getPaymentByAsaasId()` - Busca por ID do Asaas
  - `getUserPayments()` - Busca pagamentos do usuário

### **2. Integração com Webhooks**
- **Arquivo**: `src/services/webhookService.ts`
- **Funcionalidade**: Atualiza status automaticamente via webhooks

### **3. Hook de Pagamento**
- **Arquivo**: `src/hooks/usePaymentLink.ts`
- **Funcionalidade**: Salva pagamento ao criar link

## 🚀 **Como Usar**

### **1. Executar Migração**
```bash
# Execute a migração no Supabase
node run-migration.js
```

### **2. Criar Pagamento**
```javascript
import { usePaymentLink } from '@/hooks/usePaymentLink';

const { createPaymentLink } = usePaymentLink();

const paymentLink = await createPaymentLink({
  planName: 'Chef',
  value: 15900, // R$ 159,00 em centavos
  userEmail: 'usuario@email.com',
  userName: 'João Silva',
  userId: 'uuid-do-usuario', // ID do usuário no banco
});
```

### **3. Consultar Pagamentos**
```javascript
import { PaymentDatabaseService } from '@/services/paymentDatabaseService';

// Buscar pagamentos do usuário
const payments = await PaymentDatabaseService.getUserPayments(userId);

// Buscar pagamento específico
const payment = await PaymentDatabaseService.getPaymentByAsaasId(paymentId);

// Buscar por status
const pendingPayments = await PaymentDatabaseService.getPaymentsByStatus('PENDING');
```

### **4. Atualizar Status via Webhook**
```javascript
// Webhook automaticamente atualiza o banco
// Quando o Asaas envia webhook, o status é atualizado
```

## 📊 **Fluxo Completo**

### **1. Criação do Pagamento**
```
Usuário seleciona plano
    ↓
Cria link de pagamento no Asaas
    ↓
Salva pagamento no banco (status: PENDING)
    ↓
Retorna link para o usuário
```

### **2. Processamento do Pagamento**
```
Usuário realiza pagamento
    ↓
Asaas processa pagamento
    ↓
Asaas envia webhook
    ↓
Sistema atualiza status no banco
    ↓
Usuário recebe notificação
```

### **3. Consulta de Status**
```
Usuário acessa página de status
    ↓
Sistema consulta banco de dados
    ↓
Exibe status atualizado
```

## 🔒 **Segurança**

### **1. Row Level Security (RLS)**
- Usuários só veem seus próprios pagamentos
- Políticas de segurança configuradas

### **2. Validação de Dados**
- Validação de tipos
- Verificação de permissões
- Sanitização de inputs

### **3. Logs de Auditoria**
- Logs detalhados de todas as operações
- Rastreamento de mudanças de status
- Monitoramento de erros

## 📈 **Monitoramento**

### **1. Logs Importantes**
```javascript
// Criação de pagamento
console.log('💾 Salvando pagamento no banco:', paymentRecord);

// Atualização de status
console.log('🔄 Atualizando status do pagamento:', { payment_id, status });

// Erros
console.error('❌ Erro ao salvar pagamento:', error);
```

### **2. Métricas Recomendadas**
- Total de pagamentos por status
- Valor total processado
- Taxa de conversão
- Tempo médio de processamento

## 🧪 **Testes**

### **1. Teste de Criação**
```javascript
// Testa criação de pagamento
const payment = await PaymentDatabaseService.savePayment({
  user_id: 'test-user-id',
  payment_id: 'test-payment-id',
  plan_name: 'Test Plan',
  value: 10000,
  status: 'PENDING'
});
```

### **2. Teste de Atualização**
```javascript
// Testa atualização de status
await PaymentDatabaseService.updatePaymentStatus(
  'test-payment-id',
  'CONFIRMED'
);
```

### **3. Teste de Consulta**
```javascript
// Testa consulta de pagamentos
const payments = await PaymentDatabaseService.getUserPayments('test-user-id');
```

## 🚀 **Deploy**

### **1. Variáveis de Ambiente**
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
```

### **2. Migração em Produção**
```bash
# Execute a migração no Supabase
supabase db push
```

### **3. Verificação**
```sql
-- Verificar se a tabela foi criada
SELECT * FROM payments LIMIT 1;

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'payments';
```

## 📝 **Checklist de Implementação**

- [ ] Tabela `payments` criada
- [ ] Políticas RLS configuradas
- [ ] Serviço de banco implementado
- [ ] Integração com webhooks
- [ ] Hook de pagamento atualizado
- [ ] Testes funcionando
- [ ] Logs configurados
- [ ] Deploy em produção

## 🔗 **Arquivos Relacionados**

- `src/services/paymentDatabaseService.ts` - Serviço de banco
- `src/hooks/usePaymentLink.ts` - Hook de pagamento
- `src/services/webhookService.ts` - Webhooks
- `supabase/migrations/` - Migrações do banco
- `docs/DATABASE_INTEGRATION.md` - Esta documentação

## 🎯 **Próximos Passos**

1. **Executar migração** no Supabase
2. **Testar criação** de pagamentos
3. **Configurar webhooks** para atualização automática
4. **Implementar dashboard** de pagamentos
5. **Adicionar relatórios** e métricas
