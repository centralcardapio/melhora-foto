import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { UserConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  // Carrega as variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  // Debug das variáveis de ambiente (removido para limpeza)
  
  return {
    base: '/foto/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    },
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api/asaas': {
          target: 'https://api-sandbox.asaas.com/v3',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => {
            const newPath = path.replace(/^\/api\/asaas/, '');
            console.log(`Proxy: ${path} -> ${newPath}`);
            return newPath;
          },
          // Headers CORS
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, access_token'
          },
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.error('Erro no proxy:', err);
            });
            proxy.on('proxyReq', (proxyReq) => {
              const apiKey = env.VITE_ASAAS_API_KEY || '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjNjM2QxY2MyLTUwMzctNDlhOS1iYTM4LTE5NTllMzU1NzU0MTo6JGFhY2hfNmJhN2YxZWEtODNiZS00ZTM1LTk4NDUtYmI2MDNjZmU0MmFi';
              if (apiKey) {
                // Mantém o $ no início da chave (não remove)
                const cleanApiKey = apiKey.startsWith('$') ? apiKey : '$' + apiKey;
                proxyReq.setHeader('access_token', cleanApiKey);
                console.log('✅ Header access_token adicionado:', cleanApiKey.substring(0, 20) + '...');
                console.log('Headers da requisição:', proxyReq.getHeaders());
              } else {
                console.error('❌ VITE_ASAAS_API_KEY não encontrada!');
              }
            });
            proxy.on('proxyRes', (proxyRes) => {
              console.log('Resposta da API:', {
                statusCode: proxyRes.statusCode,
                headers: proxyRes.headers,
              });
            });
          }
        }
      },
      cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
      }
    },
    plugins: [
      react(),
      ...(mode === 'development' ? [componentTagger()] : [])
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  };
});
