// Serviço para integração direta com a API do Google Gemini
// Usa a API oficial do Google em vez do OpenRouter

import { openRouterConfig } from '../config/openRouter';

export interface GeminiImageRequest {
  originalImageUrl: string;
  style: string;
  prompt?: string;
}

export interface GeminiImageResponse {
  success: boolean;
  transformedImageUrl?: string;
  aiDescription?: string;
  processingTime: number;
  error?: string;
}

class GeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBNMmv0FZKgJ3k3tlwCBk4Hemx202qp17Q';
  }

  // Converte imagem para base64
  private async convertImageToBase64(imageUrl: string): Promise<string> {
    try {
      console.log('🔄 Convertendo imagem para base64:', imageUrl);
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Erro ao buscar imagem: ${response.status}`);
      }
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1]; // Remove o prefixo data:image/...
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('❌ Erro ao converter imagem:', error);
      throw error;
    }
  }

  // Gera imagem usando Gemini 2.0 Flash Image Generation
  async generateImage(prompt: string, originalImageBase64?: string): Promise<string> {
    try {
      console.log('🎨 Gerando imagem com Gemini:', prompt);

      const requestBody: any = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1000
        }
      };

      // Se temos uma imagem original, adicionar como referência
      if (originalImageBase64) {
        requestBody.contents[0].parts.push({
          inline_data: {
            mime_type: "image/jpeg",
            data: originalImageBase64
          }
        });
      }

      const response = await fetch(`${this.baseUrl}/models/gemini-2.0-flash-exp-image-generation:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('🔍 Gemini Response:', data);

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const content = data.candidates[0].content.parts[0];
        
        if (content.text) {
          // Procurar por URL de imagem na resposta
          const imageUrlMatch = content.text.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|webp)/i);
          if (imageUrlMatch) {
            console.log('✅ URL de imagem encontrada:', imageUrlMatch[0]);
            return imageUrlMatch[0];
          }
        }
        
        // Se não encontrou URL, verificar se há dados de imagem inline
        if (content.inline_data) {
          console.log('✅ Dados de imagem inline encontrados');
          return `data:${content.inline_data.mime_type};base64,${content.inline_data.data}`;
        }
      }

      throw new Error('Nenhuma imagem foi gerada pelo Gemini');
    } catch (error) {
      console.error('❌ Erro ao gerar imagem:', error);
      throw error;
    }
  }

  // Transforma imagem usando o estilo selecionado
  async transformImage(request: GeminiImageRequest): Promise<GeminiImageResponse> {
    const startTime = Date.now();
    
    try {
      console.log('🚀 Iniciando transformação com Gemini:', {
        originalImageUrl: request.originalImageUrl,
        style: request.style,
        customPrompt: request.prompt
      });

      // Converter imagem original para base64
      const imageBase64 = await this.convertImageToBase64(request.originalImageUrl);
      
      // Gerar prompt baseado no estilo
      const stylePrompt = this.getStylePrompt(request.style);
      const fullPrompt = request.prompt ? `${stylePrompt}\n\nCustom request: ${request.prompt}` : stylePrompt;
      
      console.log('📝 Prompt gerado:', fullPrompt);

      // Gerar nova imagem
      const transformedImageUrl = await this.generateImage(fullPrompt, imageBase64);
      
      const processingTime = Date.now() - startTime;
      
      console.log('🎯 Transformação concluída:', {
        success: true,
        transformedImageUrl,
        processingTime
      });

      return {
        success: true,
        transformedImageUrl,
        aiDescription: `Imagem transformada no estilo ${request.style}`,
        processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('❌ Erro na transformação:', error);
      
      return {
        success: false,
        processingTime,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Obtém o prompt específico para cada estilo
  private getStylePrompt(style: string): string {
    const stylePrompts: Record<string, string> = {
      'classico-italiano': 'Generate a professional food photography image in Classic Italian style: rustic dishes on dark wood, soft lighting, olive oil, grated cheese, antique utensils. High quality, restaurant menu ready.',
      'pub-moderno': 'Generate a professional food photography image in Modern Pub style: urban industrial setting, drinks in background, diffused light, casual composition. High quality, restaurant menu ready.',
      'cafe-aconchegante': 'Generate a professional food photography image in Cozy Cafe style: hot beverages, warm light, intimate atmosphere, cups, napkins, light wood. High quality, restaurant menu ready.',
      'rustico-madeira': 'Generate a professional food photography image in Rustic Wood style: served on wooden boards, natural setting, organic textures, soft light, simple accessories. High quality, restaurant menu ready.',
      'contemporaneo-asiatico': 'Generate a professional food photography image in Contemporary Asian style: refined presentation, dark dishes, neutral background, elegant balance, symmetric composition. High quality, restaurant menu ready.',
      'moderno-gourmet': 'Generate a professional food photography image in Modern Gourmet style: artistic presentation, textured dishes, minimalist background, sophisticated and elegant aesthetic. High quality, restaurant menu ready.',
      'saudavel-vibrante': 'Generate a professional food photography image in Healthy & Vibrant style: natural beverages, clear light, energetic composition, vibrant colors, fresh elements. High quality, restaurant menu ready.',
      'clean-minimalista': 'Generate a professional food photography image in Clean & Minimalist style: white background, centered composition, clean aesthetic, simple dishes, focus on freshness. High quality, restaurant menu ready.',
      'alta-gastronomia': 'Generate a professional food photography image in High Gastronomy style: artistic presentation, dark background, sophisticated setting, wine glass, refined dishes, dramatic lighting. High quality, restaurant menu ready.'
    };

    return stylePrompts[style] || 'Generate a professional food photography image. High quality, restaurant menu ready.';
  }

  // Testa a conexão com a API
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testando conexão com Gemini API...');
      
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'X-goog-api-key': this.apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conexão com Gemini API estabelecida');
        console.log('📋 Modelos disponíveis:', data.models?.length || 0);
        return true;
      } else {
        console.error('❌ Falha na conexão com Gemini API:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao testar conexão:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();
