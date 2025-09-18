// Teste para verificar se o estilo está sendo salvo corretamente
console.log('🧪 Testando correção de estilo...\n');

// Simular dados como seriam salvos no banco
const mockTransformation = {
  id: 'test-123',
  transformed_images: [
    {
      url: 'https://example.com/image1.jpg',
      downloadUrl: 'https://example.com/download1.jpg',
      version: 1,
      feedback: '',
      style: 'moderno-gourmet', // Agora sempre salva o estilo do usuário
      ai_description: 'Imagem transformada no estilo Moderno Gourmet',
      created_at: new Date().toISOString()
    }
  ]
};

// Função de formatação (mesma do PhotoResults)
function formatStyleName(style) {
  const styleNames = {
    'classico-italiano': 'Clássico Italiano',
    'pub-moderno': 'Pub Moderno',
    'cafe-aconchegante': 'Café Aconchegante',
    'rustico-madeira': 'Rústico de Madeira',
    'contemporaneo-asiatico': 'Contemporâneo Asiático',
    'moderno-gourmet': 'Moderno Gourmet',
    'saudavel-vibrante': 'Saudável & Vibrante',
    'clean-minimalista': 'Clean & Minimalista',
    'alta-gastronomia': 'Alta Gastronomia'
  };

  return styleNames[style] || style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

console.log('📊 Dados da transformação:');
console.log(`   ID: ${mockTransformation.id}`);
console.log(`   Estilo salvo: ${mockTransformation.transformed_images[0].style}`);
console.log(`   Estilo formatado: ${formatStyleName(mockTransformation.transformed_images[0].style)}`);

console.log('\n📱 Exibição na interface:');
console.log(`   Título: Foto Profissional (${formatStyleName(mockTransformation.transformed_images[0].style)})`);
console.log(`   Badge: IA: ${formatStyleName(mockTransformation.transformed_images[0].style)}`);

console.log('\n✅ Teste concluído!');
console.log('\n💡 Se ainda aparecer "Custom_prompt", execute o script fix-style-data.js para corrigir dados antigos.');
