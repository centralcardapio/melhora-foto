# 🍽️ Exemplos de Prompts - Sistema Unificado

Este documento mostra exemplos de como os prompts finais ficam quando enviados ao OpenRouter AI.

## 📋 **Estrutura do Prompt Final**

```
[PROMPT BASE UNIFICADO] + [ESTILO ESPECÍFICO] + [PROMPT CUSTOMIZADO DO USUÁRIO]
```

## 🎨 **Exemplo Completo - Clássico Italiano**

### **Prompt Base (Sempre Incluído)**
```
🍽️ Prompt Unificado para Geração Profissional de Imagens Gastronômicas
Gere uma imagem realista e apetitosa de um prato para venda no delivery conforme diretrizes abaixo:

🧾 Contexto Comercial e Funcional
• A imagem deve ser adequada para uso comercial, como em cardápios impressos, aplicativos de delivery, redes sociais e campanhas publicitárias.
• Imagem deve se assemelhar a uma fotografia profissional e não uma imagem artificial criada com inteligência artificial
• Evitar composições que dificultem a leitura visual rápida do prato — foco claro, ingredientes reconhecíveis e porção bem definida.
• O prato deve parecer recente e pronto para consumo, sem sinais de ressecamento, derretimento excessivo ou montagem desfeita.

[... resto do prompt base ...]

🎨 ESTILO VISUAL ESPECÍFICO: Clássico Italiano - pratos apresentados em louças rústicas sobre madeira escura. Iluminação suave e elementos como azeite, queijo ralado e talheres antigos reforçam o estilo.
```

### **Com Prompt Customizado do Usuário**
```
[PROMPT BASE] + "Adicione mais contraste e torne as cores mais vibrantes"
```

## 🍕 **Exemplos por Tipo de Prato**

### **Pizza (Top-Down)**
**Estilo:** Pub Moderno
**Prompt Final:**
```
[PROMPT BASE] + "Pub Moderno - pratos com ambientação urbana e industrial. Bebidas ao fundo, luz difusa e composição descontraída criam uma estética contemporânea e acolhedora." + "Torne a pizza mais apetitosa com queijo derretido"
```

### **Hambúrguer (Close-up Lateral)**
**Estilo:** Moderno Gourmet
**Prompt Final:**
```
[PROMPT BASE] + "Moderno Gourmet - pratos sofisticados com apresentação artística, louças texturizadas e fundo minimalista." + "Destaque as camadas do hambúrguer"
```

### **Salada (Top-Down)**
**Estilo:** Saudável & Vibrante
**Prompt Final:**
```
[PROMPT BASE] + "Saudável & Vibrante - bebidas naturais, luz clara e composição energética reforçam o estilo leve e nutritivo." + "Torne os vegetais mais frescos e coloridos"
```

## 🎯 **Vantagens do Sistema Unificado**

### **1. Consistência Profissional**
- Todos os estilos seguem as mesmas diretrizes de qualidade
- Garantia de adequação comercial
- Padrões de segurança e conteúdo

### **2. Flexibilidade**
- Usuários podem adicionar instruções específicas
- Estilos podem ser facilmente modificados
- Fácil adição de novos estilos

### **3. Qualidade Garantida**
- Prompts testados e otimizados
- Diretrizes profissionais de fotografia
- Adaptação inteligente a diferentes tipos de pratos

## 🔧 **Como Personalizar**

### **1. Modificar Estilos Existentes**
Edite `src/config/openRouter.ts`:
```typescript
'meu-estilo': {
  name: 'Meu Estilo',
  description: 'Descrição do estilo',
  prompt: `${BASE_PROMPT} Meu Estilo - características específicas do seu estilo.`
}
```

### **2. Adicionar Novos Estilos**
```typescript
'novo-estilo': {
  name: 'Novo Estilo',
  description: 'Descrição do novo estilo',
  prompt: `${BASE_PROMPT} Novo Estilo - características específicas do novo estilo.`
}
```

### **3. Prompts Customizados**
Os usuários podem adicionar instruções específicas no campo "Prompt Personalizado" da interface.

## 📊 **Monitoramento de Resultados**

### **1. Acesse OpenRouter Activity**
- [https://openrouter.ai/activity](https://openrouter.ai/activity)
- Veja os prompts enviados
- Monitore custos por requisição

### **2. Ajustes Baseados em Resultados**
- Analise quais estilos funcionam melhor
- Ajuste prompts baseado no feedback
- Otimize custos vs qualidade

## 🚀 **Próximos Passos**

1. **Teste com diferentes tipos de pratos**
2. **Monitore qualidade dos resultados**
3. **Ajuste estilos baseado no feedback**
4. **Adicione novos estilos conforme necessário**
5. **Otimize prompts para melhor custo-benefício**

---

**💡 Dica:** O prompt unificado garante que todas as imagens geradas atendam aos mais altos padrões profissionais, independentemente do estilo escolhido!
