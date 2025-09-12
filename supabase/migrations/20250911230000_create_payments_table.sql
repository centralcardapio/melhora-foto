-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL UNIQUE, -- ID do pagamento no Asaas
  plan_name TEXT NOT NULL,
  value INTEGER NOT NULL, -- Valor em centavos
  status TEXT NOT NULL DEFAULT 'PENDING',
  external_reference TEXT,
  payment_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  billing_type TEXT DEFAULT 'CREDIT_CARD',
  charge_type TEXT DEFAULT 'DETACHED',
  max_installment_count INTEGER DEFAULT 1,
  due_date_limit_days INTEGER DEFAULT 3,
  notification_enabled BOOLEAN DEFAULT true,
  callback_success_url TEXT,
  callback_auto_redirect BOOLEAN DEFAULT true
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_external_reference ON payments(external_reference);

-- RLS (Row Level Security)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Política: usuários só podem ver seus próprios pagamentos
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Política: usuários podem inserir seus próprios pagamentos
CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: usuários podem atualizar seus próprios pagamentos
CREATE POLICY "Users can update own payments" ON payments
  FOR UPDATE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE payments IS 'Tabela para armazenar informações de pagamentos do Asaas';
COMMENT ON COLUMN payments.payment_id IS 'ID único do pagamento no Asaas';
COMMENT ON COLUMN payments.value IS 'Valor do pagamento em centavos';
COMMENT ON COLUMN payments.status IS 'Status do pagamento (PENDING, CONFIRMED, RECEIVED, etc.)';
COMMENT ON COLUMN payments.external_reference IS 'Referência externa para rastreamento';
COMMENT ON COLUMN payments.payment_link IS 'URL do link de pagamento gerado';
