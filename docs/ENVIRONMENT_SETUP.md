# Configuração de Variáveis de Ambiente

## 📋 Variáveis Necessárias

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do Asaas
VITE_ASAAS_API_KEY=$sua_chave_api_do_asaas_aqui

# Configurações do Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase_aqui
```

## 🔑 Como Obter as Chaves

### Asaas API Key
1. Acesse o painel do Asaas
2. Vá em **Configurações** > **Integrações** > **API**
3. Copie sua chave de API (começa com `$`)

### Supabase Keys
1. Acesse o painel do Supabase
2. Vá em **Settings** > **API**
3. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env` no Git
- O arquivo `.env` já está no `.gitignore`
- Use `.env.example` como referência para outros desenvolvedores

## 🚀 Uso

Após configurar o `.env`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

As variáveis serão carregadas automaticamente pelo Vite.
