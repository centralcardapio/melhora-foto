import JSZip from 'jszip';

export interface PhotoForZip {
  url: string;
  downloadUrl?: string;
  name: string;
}

/**
 * Baixa uma imagem de uma URL e retorna como ArrayBuffer
 */
async function downloadImageAsBuffer(url: string): Promise<ArrayBuffer> {
  try {
    // Converter HTTP para HTTPS se necessário
    const httpsUrl = url.startsWith('http://') 
      ? url.replace('http://', 'https://') 
      : url;

    console.log('🔄 Baixando imagem para ZIP:', httpsUrl);
    
    const response = await fetch(httpsUrl);
    if (!response.ok) {
      throw new Error(`Erro ao baixar imagem: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('✅ Imagem baixada com sucesso, tamanho:', arrayBuffer.byteLength, 'bytes');
    
    return arrayBuffer;
  } catch (error) {
    console.error('❌ Erro ao baixar imagem:', error);
    throw error;
  }
}

/**
 * Cria e baixa um arquivo ZIP com as fotos fornecidas
 */
export async function createAndDownloadZip(
  photos: PhotoForZip[],
  zipFileName: string = 'fotos_profissionais.zip'
): Promise<void> {
  try {
    console.log('📦 Criando ZIP com', photos.length, 'fotos...');
    
    const zip = new JSZip();
    const downloadPromises: Promise<void>[] = [];

    // Adicionar cada foto ao ZIP
    photos.forEach((photo, index) => {
      const promise = downloadImageAsBuffer(photo.downloadUrl || photo.url)
        .then(buffer => {
          // Usar o nome fornecido ou gerar um nome baseado no índice
          const fileName = photo.name || `foto_${index + 1}.jpg`;
          
          // Adicionar ao ZIP
          zip.file(fileName, buffer);
          console.log(`✅ Foto ${index + 1}/${photos.length} adicionada ao ZIP:`, fileName);
        })
        .catch(error => {
          console.error(`❌ Erro ao baixar foto ${index + 1}:`, error);
          // Continuar mesmo se uma foto falhar
        });
      
      downloadPromises.push(promise);
    });

    // Aguardar todas as fotos serem baixadas
    await Promise.allSettled(downloadPromises);

    // Verificar se pelo menos uma foto foi adicionada
    const fileNames = Object.keys(zip.files);
    if (fileNames.length === 0) {
      throw new Error('Nenhuma foto foi baixada com sucesso');
    }

    console.log('📦 Gerando arquivo ZIP...');
    
    // Gerar o arquivo ZIP
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6 // Nível de compressão balanceado
      }
    });

    console.log('✅ ZIP gerado com sucesso, tamanho:', zipBlob.size, 'bytes');

    // Criar link de download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = zipFileName;
    link.style.display = 'none';
    
    // Adicionar ao DOM, clicar e remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpar o objeto URL após um tempo
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 1000);

    console.log('🎉 Download do ZIP iniciado:', zipFileName);

  } catch (error) {
    console.error('❌ Erro ao criar ZIP:', error);
    throw error;
  }
}

/**
 * Gera um nome de arquivo único para o ZIP baseado na data
 */
export function generateZipFileName(prefix: string = 'fotos_profissionais'): string {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_');
  return `${prefix}_${timestamp}.zip`;
}
