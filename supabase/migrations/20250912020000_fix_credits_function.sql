-- Atualizar função para buscar créditos da tabela photo_credits
CREATE OR REPLACE FUNCTION public.get_user_available_credits(user_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT available 
     FROM public.photo_credits 
     WHERE user_id = user_id_param
    ), 0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Atualizar função de uso de créditos para trabalhar com photo_credits
CREATE OR REPLACE FUNCTION public.use_credits(user_id_param UUID, credits_to_use INTEGER, description_param TEXT, photo_transformation_id_param UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Buscar créditos disponíveis
  SELECT available INTO current_credits
  FROM public.photo_credits 
  WHERE user_id = user_id_param;

  -- Verificar se tem créditos suficientes
  IF current_credits IS NULL OR current_credits < credits_to_use THEN
    RETURN FALSE;
  END IF;

  -- Atualizar créditos na tabela photo_credits
  UPDATE public.photo_credits 
  SET 
    available = available - credits_to_use,
    total_used = total_used + credits_to_use,
    updated_at = now()
  WHERE user_id = user_id_param;

  -- Registrar uso no histórico (opcional)
  INSERT INTO public.credit_usage_history (user_id, amount_used, description, photo_transformation_id)
  VALUES (user_id_param, credits_to_use, description_param, photo_transformation_id_param);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
