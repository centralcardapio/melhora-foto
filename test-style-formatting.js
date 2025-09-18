// Teste da formatação de estilos
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

console.log('🧪 Testando formatação de estilos...\n');

const testStyles = [
  'classico-italiano',
  'pub-moderno',
  'cafe-aconchegante',
  'rustico-madeira',
  'contemporaneo-asiatico',
  'moderno-gourmet',
  'saudavel-vibrante',
  'clean-minimalista',
  'alta-gastronomia',
  'estilo-desconhecido' // Teste de fallback
];

testStyles.forEach(style => {
  const formatted = formatStyleName(style);
  console.log(`   ${style} → ${formatted}`);
});

console.log('\n✅ Teste de formatação concluído!');
console.log('\n📝 Exemplos de exibição:');
console.log('   Foto Profissional (Clássico Italiano)');
console.log('   Foto Profissional (Moderno Gourmet)');
console.log('   Foto Profissional (Saudável & Vibrante)');
console.log('   IA: Contemporâneo Asiático');
console.log('   IA: Clean & Minimalista');
