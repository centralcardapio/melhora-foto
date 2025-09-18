# Integração com OpenRouter AI

Este documento descreve como configurar e usar a integração com OpenRouter AI para transformação de imagens.

## 📋 Pré-requisitos

1. **Conta no OpenRouter**: Crie uma conta em [https://openrouter.ai](https://openrouter.ai)
2. **API Key**: Obtenha sua chave de API do OpenRouter
3. **Modelo com Visão**: Use um modelo que suporte análise de imagens (ex: GPT-4o)

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# OpenRouter AI Configuration
VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_OPENROUTER_MODEL=openai/gpt-4o
VITE_OPENROUTER_SITE_URL=https://melhora-foto.com
VITE_OPENROUTER_SITE_NAME=Melhora Foto
```

### 2. Modelos Suportados

Os seguintes modelos são suportados para análise de imagens:

- `openai/gpt-4o` (Recomendado)
- `openai/gpt-4o-mini`
- `openai/gpt-4-turbo`
- `anthropic/claude-3-5-sonnet`
- `anthropic/claude-3-5-haiku`
- `google/gemini-pro-vision`

## 🔧 Como Funciona

### 1. Fluxo de Processamento

1. **Upload da Imagem**: Usuário faz upload da imagem
2. **Conversão para Base64**: Imagem é convertida para base64
3. **Chamada para OpenRouter**: Envia imagem + prompt para o modelo de IA
4. **Análise da IA**: Modelo analisa a imagem e gera descrição/melhorias
5. **Salvamento**: Resultado é salvo no banco de dados
6. **Exibição**: Imagem transformada é exibida ao usuário

### 2. Sistema de Prompts Unificado

O sistema agora usa um **prompt base unificado** que garante qualidade profissional e consistência. Cada estilo fotográfico adiciona suas características específicas ao prompt base:

- **Clássico Italiano**: Louças rústicas sobre madeira escura, iluminação suave
- **Pub Moderno**: Ambientação urbana e industrial, bebidas ao fundo
- **Café Aconchegante**: Acompanhados de bebidas quentes, atmosfera intimista
- **Rústico de Madeira**: Pratos sobre tábuas de madeira, ambientação natural
- **Contemporâneo Asiático**: Montagem refinada, louças escuras, fundo neutro
- **Moderno Gourmet**: Apresentação artística, louças texturizadas, fundo minimalista
- **Saudável & Vibrante**: Bebidas naturais, luz clara, composição energética
- **Clean & Minimalista**: Fundo branco, composição centralizada, estética limpa
- **Alta Gastronomia**: Montagem artística, fundo escuro, ambientação sofisticada

### 3. Características do Prompt Unificado

O prompt base inclui diretrizes profissionais para:
- ✅ **Contexto Comercial**: Adequado para cardápios e delivery
- ✅ **Qualidade Fotográfica**: Imagens realistas e profissionais
- ✅ **Fidelidade ao Prato**: Preserva ingredientes e proporções originais
- ✅ **Iluminação Profissional**: Luz natural e difusa
- ✅ **Food Styling**: Apresentação cuidadosa e apetitosa
- ✅ **Segurança de Conteúdo**: Apenas elementos gastronômicos
- ✅ **Adaptação Inteligente**: Correção automática de problemas visuais

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   └── openRouterService.ts      # Serviço principal de integração
├── config/
│   └── openRouter.ts             # Configurações e estilos
└── components/
    └── PhotoProcessing.tsx       # Componente de processamento
```

## 🔌 API Reference

### OpenRouterService

#### `transformImage(request: ImageTransformationRequest)`

Transforma uma imagem usando OpenRouter AI.

**Parâmetros:**
- `originalImageUrl`: URL da imagem original
- `style`: Estilo fotográfico selecionado
- `prompt`: Prompt customizado (opcional)

**Retorno:**
```typescript
{
  success: boolean;
  transformedImageUrl?: string;
  error?: string;
  processingTime?: number;
}
```

#### `saveTransformationResult(...)`

Salva o resultado da transformação no banco de dados.

**Parâmetros:**
- `userId`: ID do usuário
- `originalImageUrl`: URL da imagem original
- `originalImageName`: Nome da imagem original
- `transformedImageUrl`: URL da imagem transformada
- `style`: Estilo aplicado
- `aiDescription`: Descrição gerada pela IA

## 🚀 Uso

### 1. Configuração Inicial

```typescript
import { openRouterService } from '@/services/openRouterService';

// O serviço é configurado automaticamente com as variáveis de ambiente
```

### 2. Transformação de Imagem

```typescript
const result = await openRouterService.transformImage({
  originalImageUrl: 'https://example.com/image.jpg',
  style: 'moderno-gourmet',
  prompt: 'Melhore a iluminação e contraste'
});

if (result.success) {
  console.log('Imagem transformada:', result.transformedImageUrl);
} else {
  console.error('Erro:', result.error);
}
```

### 3. Salvamento no Banco

```typescript
await openRouterService.saveTransformationResult(
  userId,
  originalImageUrl,
  originalImageName,
  transformedImageUrl,
  style,
  aiDescription
);
```

## 🐛 Troubleshooting

### Erro: "API Key não encontrada"
- Verifique se `VITE_OPENROUTER_API_KEY` está definida no `.env`
- Reinicie o servidor de desenvolvimento

### Erro: "Modelo não suportado"
- Verifique se o modelo suporta análise de imagens
- Use `openai/gpt-4o` para melhor compatibilidade

### Erro: "Falha na conversão da imagem"
- Verifique se a URL da imagem é acessível
- Certifique-se de que a imagem está em formato suportado (JPG, PNG, WebP)

### Erro: "Rate limit exceeded"
- Aguarde alguns minutos antes de tentar novamente
- Considere usar um modelo mais barato para testes

## 💰 Custos

O OpenRouter cobra por token usado. Para análise de imagens:

- **GPT-4o**: ~$0.01-0.03 por imagem
- **GPT-4o-mini**: ~$0.001-0.003 por imagem
- **Claude 3.5 Sonnet**: ~$0.01-0.02 por imagem

## 🔒 Segurança

- A API key é armazenada apenas no frontend
- Imagens são enviadas diretamente para OpenRouter
- Nenhuma imagem é armazenada permanentemente no OpenRouter
- Use HTTPS em produção

## 📈 Monitoramento

Para monitorar o uso da API:

1. Acesse [https://openrouter.ai/activity](https://openrouter.ai/activity)
2. Monitore custos e uso
3. Configure alertas de limite de gastos

## 🔄 Próximos Passos

1. **Integração com Serviço de Geração de Imagens**: Para gerar imagens reais transformadas
2. **Cache de Resultados**: Para evitar reprocessamento
3. **Batch Processing**: Para processar múltiplas imagens simultaneamente
4. **Feedback Loop**: Para melhorar prompts baseado no feedback do usuário
