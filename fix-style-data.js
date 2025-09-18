// Script para corrigir dados de estilo no banco
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixStyleData() {
  console.log('🔧 Corrigindo dados de estilo no banco...\n');

  try {
    // Buscar todas as transformações
    const { data: transformations, error: fetchError } = await supabase
      .from('photo_transformations')
      .select('*');

    if (fetchError) {
      console.error('❌ Erro ao buscar transformações:', fetchError);
      return;
    }

    console.log(`📊 Encontradas ${transformations.length} transformações`);

    let fixedCount = 0;

    for (const transformation of transformations) {
      if (!transformation.transformed_images || !Array.isArray(transformation.transformed_images)) {
        continue;
      }

      let needsUpdate = false;
      const updatedImages = transformation.transformed_images.map(image => {
        // Se o estilo é "Custom_prompt" ou similar, tentar inferir do contexto
        if (image.style === 'Custom_prompt' || image.style === 'custom_prompt' || !image.style) {
          needsUpdate = true;
          
          // Tentar inferir o estilo baseado na descrição ou usar padrão
          if (image.ai_description && image.ai_description.includes('Clássico Italiano')) {
            return { ...image, style: 'classico-italiano' };
          } else if (image.ai_description && image.ai_description.includes('Pub Moderno')) {
            return { ...image, style: 'pub-moderno' };
          } else if (image.ai_description && image.ai_description.includes('Café Aconchegante')) {
            return { ...image, style: 'cafe-aconchegante' };
          } else if (image.ai_description && image.ai_description.includes('Rústico de Madeira')) {
            return { ...image, style: 'rustico-madeira' };
          } else if (image.ai_description && image.ai_description.includes('Contemporâneo Asiático')) {
            return { ...image, style: 'contemporaneo-asiatico' };
          } else if (image.ai_description && image.ai_description.includes('Moderno Gourmet')) {
            return { ...image, style: 'moderno-gourmet' };
          } else if (image.ai_description && image.ai_description.includes('Saudável & Vibrante')) {
            return { ...image, style: 'saudavel-vibrante' };
          } else if (image.ai_description && image.ai_description.includes('Clean & Minimalista')) {
            return { ...image, style: 'clean-minimalista' };
          } else if (image.ai_description && image.ai_description.includes('Alta Gastronomia')) {
            return { ...image, style: 'alta-gastronomia' };
          } else {
            // Usar estilo padrão
            return { ...image, style: 'moderno-gourmet' };
          }
        }
        return image;
      });

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('photo_transformations')
          .update({ transformed_images: updatedImages })
          .eq('id', transformation.id);

        if (updateError) {
          console.error(`❌ Erro ao atualizar transformação ${transformation.id}:`, updateError);
        } else {
          console.log(`✅ Transformação ${transformation.id} corrigida`);
          fixedCount++;
        }
      }
    }

    console.log(`\n🎯 Correção concluída! ${fixedCount} transformações foram atualizadas.`);

  } catch (error) {
    console.error('❌ Erro durante a correção:', error);
  }
}

// Executar correção
fixStyleData();
