// Script para corrigir o arquivo .env
import fs from 'fs';

const envContent = `# Configurações do Asaas
VITE_ASAAS_API_KEY=$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjNjM2QxY2MyLTUwMzctNDlhOS1iYTM4LTE5NTllMzU1NzU0MTo6JGFhY2hfNmJhN2YxZWEtODNiZS00ZTM1LTk4NDUtYmI2MDNjZmU0MmFi

# Configurações do Supabase
VITE_SUPABASE_URL=https://tskdtjqxrqjfntushmup.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRza2R0anF4cnFqZm50dXNobXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzA5NzYsImV4cCI6MjA3MDg0Njk3Nn0.coeMbQ-Zmk3og8K6atGZtk-Vw8s5tubuogR8D-3aKV4`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ Arquivo .env corrigido com sucesso!');
  console.log('📋 Conteúdo:');
  console.log(envContent);
} catch (error) {
  console.error('❌ Erro ao corrigir .env:', error);
}
