// Teste da integração de reprocessamento com custom_prompt
const ENDPOINT_URL = 'https://gemini-production.up.railway.app/improve-image';

async function testReprocessIntegration() {
  console.log('🧪 Testando integração de reprocessamento...\n');

  try {
    // Simular uma imagem já melhorada (URL de exemplo)
    const improvedImageUrl = 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Improved+Image';
    
    // Feedback do usuário
    const userFeedback = 'Transforme esta imagem em uma foto profissional de restaurante com iluminação dramática e fundo escuro';

    console.log('📝 Dados do teste:');
    console.log(`   Imagem melhorada: ${improvedImageUrl}`);
    console.log(`   Feedback do usuário: ${userFeedback}`);

    // Criar um arquivo de teste baseado na URL da imagem melhorada
    const testContent = 'Improved image content for reprocessing';
    const testBlob = new Blob([testContent], { type: 'image/jpeg' });
    const testFile = new File([testBlob], 'improved-image.jpg', { type: 'image/jpeg' });

    // Preparar FormData para reprocessamento
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('custom_prompt', userFeedback);
    formData.append('output_dir', 'output');

    console.log('\n📤 Enviando reprocessamento para endpoint...');
    console.log(`   URL: ${ENDPOINT_URL}`);
    console.log(`   Custom Prompt: ${userFeedback}`);
    console.log(`   Arquivo: ${testFile.name} (${testFile.size} bytes)`);

    // Fazer requisição
    const response = await fetch(ENDPOINT_URL, {
      method: 'POST',
      body: formData
    });

    console.log(`\n📥 Resposta recebida:`);
    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`\n✅ Reprocessamento bem-sucedido!`);
      console.log(`   Success: ${data.success}`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Image URL: ${data.image_url}`);
      console.log(`   Download URL: ${data.download_url}`);
      console.log(`   Filename: ${data.filename}`);
      console.log(`   Style Used: ${data.style_used}`);
      console.log(`   Original Filename: ${data.original_filename}`);

      // Verificar se o custom_prompt foi processado
      if (data.message && data.message.toLowerCase().includes('custom')) {
        console.log(`\n🎯 Custom prompt processado: ✅`);
      } else {
        console.log(`\n🎯 Custom prompt processado: ❓ (verificar se foi aplicado)`);
      }

    } else {
      const errorText = await response.text();
      console.log(`\n❌ Erro:`);
      console.log(`   ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testReprocessIntegration();
