-- Desabilitar RLS da tabela credit_purchases para permitir webhooks
ALTER TABLE public.credit_purchases DISABLE ROW LEVEL SECURITY;

-- Verificar se foi desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'credit_purchases';
