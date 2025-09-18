// Teste de integração com o serviço de melhoria de imagens
import { imageImprovementService } from './src/services/imageImprovementService.js';

async function testImageImprovementIntegration() {
  console.log('🧪 Testando integração com endpoint de melhoria...\n');

  try {
    // Teste 1: Conexão com endpoint
    console.log('1️⃣ Testando conexão...');
    const connectionTest = await imageImprovementService.testConnection();
    console.log(`   ${connectionTest ? '✅' : '❌'} Conexão: ${connectionTest ? 'OK' : 'FALHOU'}\n`);

    // Teste 2: Estilos disponíveis
    console.log('2️⃣ Estilos disponíveis:');
    const styles = imageImprovementService.getAvailableStyles();
    styles.forEach(style => console.log(`   - ${style}`));
    console.log('');

    // Teste 3: Transformação de imagem (usando uma imagem de teste)
    console.log('3️⃣ Testando transformação de imagem...');
    const testImageUrl = 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Test+Image';
    
    const result = await imageImprovementService.transformImage({
      originalImageUrl: testImageUrl,
      style: 'moderno-gourmet',
      prompt: 'Teste de integração'
    });

    console.log('   Resultado da transformação:');
    console.log(`   - Sucesso: ${result.success ? '✅' : '❌'}`);
    console.log(`   - Tempo: ${result.processingTime}ms`);
    
    if (result.success) {
      console.log(`   - URL da imagem: ${result.imageUrl}`);
      console.log(`   - URL de download: ${result.downloadUrl}`);
      console.log(`   - Estilo usado: ${result.styleUsed}`);
      console.log(`   - Arquivo: ${result.filename}`);
      console.log(`   - Mensagem: ${result.message}`);
    } else {
      console.log(`   - Erro: ${result.error}`);
    }

    console.log('\n🎯 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testImageImprovementIntegration();
