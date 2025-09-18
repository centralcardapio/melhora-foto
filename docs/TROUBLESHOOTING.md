# 🔧 Guia de Solução de Problemas

Este documento ajuda a resolver problemas comuns no sistema de processamento de imagens.

## 🚨 **Problemas Comuns e Soluções**

### **1. Erro de Storage (RLS Policy)**

#### **Sintoma:**
```
StorageApiError: new row violates row-level security policy
POST https://...supabase.co/storage/v1/object/photos/transformed/... 400 (Bad Request)
```

#### **Causa:**
O Supabase Storage está rejeitando uploads devido às políticas de Row Level Security (RLS).

#### **Solução:**
Execute o script SQL no Supabase Dashboard:

```sql
-- Execute este script no SQL Editor do Supabase
-- Arquivo: supabase/fix-storage-rls.sql

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload photos
CREATE POLICY "Allow authenticated users to upload photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'photos');

-- Create policy to allow authenticated users to read photos
CREATE POLICY "Allow authenticated users to read photos" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'photos');
```

### **2. Erro de JSON Parse**

#### **Sintoma:**
```
safeParseJson "undefined" is not valid JSON
```

#### **Causa:**
Este é um erro comum do React DevTools, não afeta o funcionamento da aplicação.

#### **Solução:**
- **Ignorar** - Este erro não afeta o funcionamento
- **Opcional**: Atualizar React DevTools para versão mais recente

### **3. Gemini não Retorna URL de Imagem**

#### **Sintoma:**
```
Gemini não retornou URL de imagem, usando fallback
```

#### **Causa:**
O modelo Gemini 2.5 Flash Image Preview pode não retornar URL de imagem em todas as respostas.

#### **Solução:**
O sistema já tem fallback implementado:
- **Fallback 1**: Tenta gerar imagem com prompt apenas
- **Fallback 2**: Retorna URL original com parâmetros de transformação

### **4. Erro de API Key**

#### **Sintoma:**
```
OpenRouter API error: Invalid API key
```

#### **Causa:**
Chave da API OpenRouter não configurada ou inválida.

#### **Solução:**
1. Verificar arquivo `.env`:
```env
VITE_OPENROUTER_API_KEY=sk-or-v1-...
```

2. Verificar se a chave está ativa no OpenRouter Dashboard

3. Verificar se tem créditos suficientes

### **5. Erro de Modelo Inválido**

#### **Sintoma:**
```
OpenRouter API error: model is not a valid model ID
```

#### **Causa:**
Modelo especificado não está disponível no OpenRouter.

#### **Solução:**
Verificar modelos disponíveis em: https://openrouter.ai/models

Modelos suportados atualmente:
- `google/gemini-2.5-flash-image-preview`
- `openai/gpt-4o`
- `openai/gpt-4o-mini`

## 🔍 **Debugging**

### **1. Verificar Logs do Console**
```javascript
// Adicionar logs detalhados
console.log('OpenRouter response:', data);
console.log('Message content:', messageContent);
console.log('Image URL match:', imageUrlMatch);
```

### **2. Verificar Configuração**
```javascript
// Verificar se as variáveis estão definidas
console.log('API Key:', import.meta.env.VITE_OPENROUTER_API_KEY);
console.log('Model:', import.meta.env.VITE_OPENROUTER_MODEL);
```

### **3. Testar API Diretamente**
```bash
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-2.5-flash-image-preview",
    "messages": [{"role": "user", "content": "Generate a food image"}]
  }'
```

## 📋 **Checklist de Verificação**

### **Antes de Reportar Problema:**

- [ ] ✅ API Key do OpenRouter configurada
- [ ] ✅ Créditos disponíveis no OpenRouter
- [ ] ✅ Modelo suportado pelo OpenRouter
- [ ] ✅ Políticas RLS do Supabase configuradas
- [ ] ✅ Bucket 'photos' existe no Supabase
- [ ] ✅ Usuário autenticado no Supabase
- [ ] ✅ Console sem erros críticos

### **Informações para Suporte:**

Ao reportar problemas, inclua:

1. **Erro completo** do console
2. **Passos para reproduzir**
3. **Configuração** (modelo, API key)
4. **Logs** do OpenRouter (se disponível)
5. **Screenshot** da tela de erro

## 🚀 **Soluções Rápidas**

### **Reset Completo:**
1. Limpar cache do navegador
2. Verificar variáveis de ambiente
3. Executar script RLS do Supabase
4. Testar com nova imagem

### **Fallback de Emergência:**
Se nada funcionar, o sistema usa fallback:
- Retorna URL original com parâmetros
- Marca como "transformada" para demonstração
- Mantém funcionalidade básica

---

**💡 Dica:** A maioria dos problemas são de configuração. Verifique sempre as variáveis de ambiente e políticas do Supabase primeiro!
