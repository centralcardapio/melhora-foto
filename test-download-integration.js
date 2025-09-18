// Teste da integração de download com o endpoint
const ENDPOINT_URL = 'https://gemini-production.up.railway.app/improve-image';

async function testDownloadIntegration() {
  console.log('🧪 Testando integração de download...\n');

  try {
    // Criar um arquivo de teste simples
    const testContent = 'Test image content for download';
    const testBlob = new Blob([testContent], { type: 'image/jpeg' });
    const testFile = new File([testBlob], 'test-download.jpg', { type: 'image/jpeg' });

    // Preparar FormData
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('style', 'moderno_gourmet');
    formData.append('output_dir', 'test');

    console.log('📤 Enviando requisição para endpoint...');
    console.log(`   URL: ${ENDPOINT_URL}`);
    console.log(`   Estilo: moderno_gourmet`);
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
      console.log(`\n✅ Sucesso!`);
      console.log(`   Success: ${data.success}`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Image URL: ${data.image_url}`);
      console.log(`   Download URL: ${data.download_url}`);
      console.log(`   Filename: ${data.filename}`);
      console.log(`   Style Used: ${data.style_used}`);
      console.log(`   Original Filename: ${data.original_filename}`);

      // Testar se as URLs são diferentes (como esperado)
      if (data.image_url && data.download_url) {
        console.log(`\n🔗 URLs de download:`);
        console.log(`   Visualização: ${data.image_url}`);
        console.log(`   Download: ${data.download_url}`);
        console.log(`   URLs diferentes: ${data.image_url !== data.download_url ? '✅' : '❌'}`);
      }

      // Simular o comportamento do botão de download
      console.log(`\n📥 Simulando download...`);
      console.log(`   Usando download_url: ${data.download_url || data.image_url}`);
      
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
testDownloadIntegration();
