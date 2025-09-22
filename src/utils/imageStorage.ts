import { supabase } from '@/integrations/supabase/client';

export interface StoredImage {
  url: string;
  downloadUrl: string;
  filename: string;
  path: string;
}

/**
 * Baixa uma imagem de uma URL externa e a armazena no Supabase Storage
 */
export async function downloadAndStoreImage(
  imageUrl: string,
  userId: string,
  originalFilename: string,
  style: string
): Promise<StoredImage | null> {
  try {
    console.log('🔄 Baixando imagem transformada:', imageUrl);
    
    // Converter HTTP para HTTPS se necessário
    const httpsUrl = imageUrl.startsWith('http://') 
      ? imageUrl.replace('http://', 'https://') 
      : imageUrl;

    // Baixar a imagem
    const response = await fetch(httpsUrl);
    if (!response.ok) {
      throw new Error(`Erro ao baixar imagem: ${response.status} ${response.statusText}`);
    }

    const imageBlob = await response.blob();
    console.log('✅ Imagem baixada com sucesso, tamanho:', imageBlob.size, 'bytes');

    // Gerar nome do arquivo
    const timestamp = Date.now();
    const fileExt = imageUrl.split('.').pop() || 'png';
    const sanitizedStyle = style.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `transformed_${timestamp}_${sanitizedStyle}.${fileExt}`;
    
    // Caminho no storage: transformed/{user_id}/{filename}
    const filePath = `transformed/${userId}/${filename}`;

    // Upload para Supabase Storage
    console.log('📤 Fazendo upload para Supabase Storage:', filePath);
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, imageBlob, {
        contentType: imageBlob.type,
        upsert: false // Não sobrescrever se já existir
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // Obter URLs públicas
    const { data: publicData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);

    const { data: downloadData } = supabase.storage
      .from('photos')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 ano de validade

    const result: StoredImage = {
      url: publicData.publicUrl,
      downloadUrl: downloadData?.signedUrl || publicData.publicUrl,
      filename,
      path: filePath
    };

    console.log('✅ Imagem armazenada com sucesso:', result);
    return result;

  } catch (error) {
    console.error('❌ Erro ao baixar e armazenar imagem:', error);
    return null;
  }
}

/**
 * Remove uma imagem do Supabase Storage
 */
export async function deleteStoredImage(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('photos')
      .remove([filePath]);

    if (error) {
      console.error('❌ Erro ao deletar imagem:', error);
      return false;
    }

    console.log('✅ Imagem removida com sucesso:', filePath);
    return true;
  } catch (error) {
    console.error('❌ Erro ao deletar imagem:', error);
    return false;
  }
}

/**
 * Verifica se uma URL é do Supabase Storage
 */
export function isSupabaseUrl(url: string): boolean {
  return url.includes('supabase.co') || url.includes('supabase.com');
}

/**
 * Obtém o caminho do arquivo a partir de uma URL do Supabase Storage
 */
export function getFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/photos\/(.+)/);
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}

