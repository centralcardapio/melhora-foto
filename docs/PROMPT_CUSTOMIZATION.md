# 🎨 Personalização de Prompts - OpenRouter AI

Este guia mostra como personalizar e criar prompts para o OpenRouter AI na sua aplicação.

## 📍 **Onde Editar os Prompts**

### **1. Prompts por Estilo (Configuração Principal)**

**Arquivo:** `src/config/openRouter.ts`

```typescript
export const imageTransformationStyles = {
  'classico-italiano': {
    name: 'Clássico Italiano',
    description: 'Fundo escuro, madeira rústica, iluminação suave',
    prompt: 'SEU_PROMPT_AQUI'
  },
  // ... outros estilos
};
```

### **2. Prompts Customizados pelo Usuário**

**Interface:** Campo "Prompt Personalizado" no PhotoUpload
**Arquivo:** `src/components/PhotoUpload.tsx`

## 🎯 **Como Personalizar Prompts**

### **Opção 1: Editar Prompts Existentes**

1. Abra `src/config/openRouter.ts`
2. Encontre o estilo que deseja modificar
3. Edite o campo `prompt`

**Exemplo:**
```typescript
'classico-italiano': {
  name: 'Clássico Italiano',
  description: 'Fundo escuro, madeira rústica, iluminação suave',
  prompt: 'Transforme esta foto de comida em um estilo clássico italiano autêntico. Use fundo escuro de madeira rústica, iluminação suave e quente, composição equilibrada com elementos decorativos italianos. Melhore dramaticamente as cores, contraste e profundidade para criar uma imagem de cardápio profissional que desperte o apetite. Adicione toques de elegância e sofisticação típicos da culinária italiana.'
}
```

### **Opção 2: Adicionar Novos Estilos**

1. Adicione um novo objeto no `imageTransformationStyles`
2. Defina um ID único, nome, descrição e prompt

**Exemplo:**
```typescript
'meu-estilo-personalizado': {
  name: 'Meu Estilo Personalizado',
  description: 'Descrição do meu estilo',
  prompt: 'Transforme esta foto seguindo meu estilo específico...'
}
```

### **Opção 3: Prompts Dinâmicos**

O sistema já suporta prompts customizados pelo usuário através do campo na interface.

## 📝 **Dicas para Escrever Prompts Eficazes**

### **1. Estrutura Recomendada**
```
[Contexto] + [Estilo Visual] + [Elementos Específicos] + [Qualidade Técnica] + [Resultado Esperado]
```

### **2. Exemplos de Prompts Bem Escritos**

#### **Para Restaurantes Elegantes:**
```
Transforme esta foto de comida em uma imagem de cardápio de restaurante de alta qualidade. Use fundo escuro elegante, iluminação dramática que destaque os ingredientes, composição sofisticada com elementos decorativos sutis. Melhore significativamente as cores, contraste e profundidade para criar uma imagem que desperte o apetite e transmita luxo e qualidade.
```

#### **Para Cafés Aconchegantes:**
```
Transforme esta foto em um estilo de café aconchegante e acolhedor. Use iluminação quente e suave, fundo de madeira ou textura natural, composição que transmita calor humano e conforto. Adicione elementos como xícara de café, guardanapo ou utensílios que reforcem a atmosfera acolhedora. Melhore as cores para tons mais quentes e convidativos.
```

#### **Para Comida Saudável:**
```
Transforme esta foto em um estilo saudável e vibrante. Use cores naturais e vivas, iluminação clara que destaque a frescura dos ingredientes, composição que transmita energia e vitalidade. Adicione elementos verdes ou naturais ao fundo. Melhore a saturação das cores para destacar a qualidade e frescor dos alimentos.
```

### **3. Palavras-Chave Poderosas**

- **Qualidade:** "profissional", "alta qualidade", "sofisticado", "elegante"
- **Iluminação:** "dramática", "suave", "natural", "quente", "fria"
- **Cores:** "vibrantes", "saturadas", "naturais", "quentes", "frias"
- **Composição:** "equilibrada", "dinâmica", "centralizada", "assimétrica"
- **Atmosfera:** "aconchegante", "elegante", "moderna", "rústica", "luxuosa"

### **4. Instruções Técnicas**

- **Resolução:** "alta resolução", "detalhes nítidos"
- **Contraste:** "alto contraste", "contraste equilibrado"
- **Foco:** "foco nítido", "profundidade de campo"
- **Cores:** "cores saturadas", "balanço de branco correto"

## 🔧 **Implementação Técnica**

### **Como o Sistema Funciona**

1. **Usuário seleciona estilo** → Sistema busca prompt base
2. **Usuário adiciona prompt customizado** → Sistema combina os dois
3. **Prompt final** = `prompt_base + " " + prompt_customizado`
4. **OpenRouter recebe** o prompt combinado

### **Código de Exemplo**

```typescript
// Em openRouterService.ts
private generatePrompt(style: string, customPrompt?: string): string {
  const styleConfig = imageTransformationStyles[style];
  const basePrompt = styleConfig?.prompt || 'Prompt padrão';
  
  return customPrompt ? `${basePrompt} ${customPrompt}` : basePrompt;
}
```

## 🎨 **Exemplos de Prompts por Categoria**

### **Restaurantes de Luxo**
```
Transforme esta foto em uma imagem de restaurante de alta gastronomia. Use fundo escuro elegante, iluminação dramática, composição sofisticada com elementos decorativos de luxo. Melhore dramaticamente as cores, contraste e profundidade para criar uma imagem que transmita exclusividade e qualidade premium.
```

### **Cafés e Bistrôs**
```
Transforme esta foto em um estilo de café aconchegante e charmoso. Use iluminação quente e suave, fundo de madeira ou textura natural, composição que transmita calor humano e conforto. Adicione elementos como xícara de café ou guardanapo para reforçar a atmosfera acolhedora.
```

### **Comida Saudável**
```
Transforme esta foto em um estilo saudável e energético. Use cores naturais e vivas, iluminação clara que destaque a frescura, composição que transmita vitalidade. Adicione elementos verdes ou naturais ao fundo. Melhore a saturação para destacar a qualidade dos ingredientes.
```

### **Fast Food Moderno**
```
Transforme esta foto em um estilo de fast food moderno e dinâmico. Use cores vibrantes e contrastantes, iluminação brilhante, composição que transmita energia e velocidade. Adicione elementos urbanos ou tecnológicos ao fundo. Torne a imagem perfeita para redes sociais.
```

## 🚀 **Próximos Passos**

1. **Teste diferentes prompts** com suas imagens
2. **Monitore os resultados** no OpenRouter
3. **Ajuste baseado no feedback** dos usuários
4. **Crie prompts específicos** para seu nicho
5. **Implemente A/B testing** para otimizar

## 📊 **Monitoramento**

- Acesse [OpenRouter Activity](https://openrouter.ai/activity) para ver os prompts enviados
- Monitore custos por prompt
- Analise quais estilos são mais usados
- Ajuste prompts baseado no feedback

---

**💡 Dica:** Comece com prompts simples e vá refinando baseado nos resultados. O OpenRouter é muito sensível à qualidade dos prompts!
