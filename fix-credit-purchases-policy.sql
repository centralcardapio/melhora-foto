-- Criar política RLS para permitir inserções na tabela credit_purchases
-- Esta política permite que qualquer usuário autenticado insira registros
CREATE POLICY "Allow authenticated users to insert credit purchases" ON public.credit_purchases
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Verificar as políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'credit_purchases';
