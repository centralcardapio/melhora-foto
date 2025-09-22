export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, access_token');
  
  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Usar variável de ambiente do servidor (não VITE_)
    const apiKey = process.env.ASAAS_API_KEY;
    
    console.log('🔍 Verificando variável de ambiente ASAAS_API_KEY:', {
      ASAAS_API_KEY: process.env.ASAAS_API_KEY ? 'Definida' : 'Não definida',
      NODE_ENV: process.env.NODE_ENV
    });
    
    if (!apiKey) {
      console.error('❌ API key não configurada em nenhuma variável');
      return res.status(500).json({ 
        error: 'API key not configured',
        availableEnvVars: Object.keys(process.env).filter(key => key.includes('ASAAS'))
      });
    }

    console.log('🔑 API Key encontrada:', apiKey.substring(0, 20) + '...');

    // Usar URL configurável da API
    const asaasApiUrl = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';
    const paymentLinksUrl = `${asaasApiUrl}/paymentLinks`;

    console.log('📤 Fazendo requisição para API Asaas:', {
      method: req.method,
      url: paymentLinksUrl,
      body: req.body
    });

    // Fazer a requisição para a API do Asaas
    const response = await fetch(paymentLinksUrl, {
      method: req.method,
      headers: {
        'access_token': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    console.log('📡 Resposta da API Asaas:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Obter a resposta
    const responseData = await response.text();
    
    // Configurar Content-Type
    res.setHeader('Content-Type', 'application/json');
    
    // Retornar a resposta
    return res.status(response.status).send(responseData);

  } catch (error) {
    console.error('❌ Erro no proxy da API do Asaas:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
