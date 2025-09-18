# 🔍 Guia de Debug - Logs do OpenRouter

Este documento explica como interpretar os logs do sistema para entender o que está acontecendo com a geração de imagens.

## 📊 **Logs Implementados**

### **1. Log de Início da Transformação**
```javascript
🚀 Iniciando transformação: {
  originalImageUrl: "https://...",
  style: "moderno-gourmet",
  customPrompt: "prompt do usuário",
  generatedPrompt: "prompt final gerado",
  model: "google/gemini-2.5-flash-image-preview"
}
```

**O que verificar:**
- ✅ `originalImageUrl` está correto
- ✅ `style` está definido
- ✅ `generatedPrompt` foi criado corretamente

### **2. Log da Resposta Principal**
```javascript
🔍 OpenRouter Response: {
  model: "google/gemini-2.5-flash-image-preview",
  response: { /* resposta completa da API */ },
  messageContent: "conteúdo da mensagem",
  usage: { /* tokens usados */ },
  finishReason: "stop"
}
```

**O que verificar:**
- ✅ `response` não tem erros
- ✅ `messageContent` contém texto
- ✅ `finishReason` é "stop" (sucesso)

### **3. Log do Conteúdo da Mensagem**
```javascript
📝 Message Content: "Texto retornado pelo Gemini..."
```

**O que procurar:**
- 🔍 **URLs de imagem**: `https://...jpg`, `https://...png`
- 🔍 **Descrições de imagem**: Texto descrevendo a imagem
- 🔍 **Erros**: Mensagens de erro ou limitações

### **4. Log de Busca por URL**
```javascript
🔗 Image URL Match: ["https://exemplo.com/imagem.jpg"] // ou null
```

**Interpretação:**
- ✅ **Array com URL**: Imagem encontrada!
- ❌ **null**: Nenhuma URL de imagem encontrada

### **5. Log de Fallback**
```javascript
🔄 Fallback Response: { /* segunda tentativa */ }
```

**Quando aparece:**
- Quando a primeira tentativa não retornou URL de imagem
- Segunda chamada para o Gemini com prompt diferente

### **6. Log de Resultado Final**
```javascript
🎯 Resultado final da transformação: {
  success: true,
  transformedImageUrl: "URL final",
  processingTime: 5000,
  method: "fallback"
}
```

**Interpretação:**
- ✅ **success: true**: Transformação concluída
- 🔗 **transformedImageUrl**: URL da imagem final
- ⏱️ **processingTime**: Tempo em milissegundos
- 🔄 **method**: "fallback" = usou segunda tentativa

## 🔍 **Cenários Comuns**

### **Cenário 1: Sucesso Total**
```
🚀 Iniciando transformação: {...}
🔍 OpenRouter Response: {...}
📝 Message Content: "Aqui está a imagem: https://..."
🔗 Image URL Match: ["https://..."]
✅ Imagem encontrada na resposta: https://...
🎯 Resultado final: { success: true, ... }
```

### **Cenário 2: Fallback Necessário**
```
🚀 Iniciando transformação: {...}
🔍 OpenRouter Response: {...}
📝 Message Content: "Vou gerar uma imagem de comida..."
❌ Nenhuma URL de imagem encontrada na resposta
🔄 Tentando fallback para geração de imagem...
🔄 Fallback Response: {...}
📝 Fallback Message Content: "https://..."
✅ Imagem encontrada no fallback: https://...
🎯 Resultado final: { success: true, method: "fallback" }
```

### **Cenário 3: Fallback Final**
```
🚀 Iniciando transformação: {...}
🔍 OpenRouter Response: {...}
📝 Message Content: "Não posso gerar imagens..."
❌ Nenhuma URL de imagem encontrada na resposta
🔄 Tentando fallback para geração de imagem...
🔄 Fallback Response: {...}
📝 Fallback Message Content: "Desculpe, não posso..."
❌ Gemini não retornou URL de imagem em nenhuma tentativa
🎯 Resultado final: { success: true, method: "fallback" }
```

## 🚨 **Problemas Identificáveis**

### **1. Erro de API**
```
OpenRouter API error: Invalid API key
```
**Solução**: Verificar chave da API

### **2. Modelo Inválido**
```
OpenRouter API error: model is not a valid model ID
```
**Solução**: Verificar se o modelo está disponível

### **3. Sem Créditos**
```
OpenRouter API error: Insufficient credits
```
**Solução**: Adicionar créditos na conta OpenRouter

### **4. Gemini Não Gera Imagens**
```
📝 Message Content: "Não posso gerar imagens, mas posso descrever..."
```
**Solução**: O modelo pode não suportar geração de imagens

## 📋 **Checklist de Debug**

### **Antes de Analisar:**
- [ ] Abrir DevTools (F12)
- [ ] Ir para aba Console
- [ ] Limpar logs anteriores
- [ ] Fazer upload de uma imagem

### **Durante a Análise:**
- [ ] Verificar se todos os logs aparecem
- [ ] Procurar por URLs de imagem
- [ ] Verificar se há erros
- [ ] Anotar o método usado (principal/fallback)

### **Após a Análise:**
- [ ] Copiar logs relevantes
- [ ] Identificar onde o processo falha
- [ ] Aplicar solução apropriada

## 💡 **Dicas de Debug**

### **1. Filtrar Logs**
No console, use filtros:
- `🚀` - Logs de início
- `🔍` - Respostas da API
- `✅` - Sucessos
- `❌` - Erros

### **2. Logs Detalhados**
Para mais detalhes, adicione:
```javascript
console.log('Full response:', JSON.stringify(data, null, 2));
```

### **3. Teste com Imagem Simples**
Use uma imagem de comida simples para testar:
- Pizza
- Hambúrguer
- Salada

---

**💡 Dica:** Os logs mostram exatamente o que o Gemini está retornando. Se não houver URLs de imagem, o problema pode ser que o modelo não gera imagens ou precisa de um prompt diferente!
