import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, access_token');
  
  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.VITE_ASAAS_API_KEY;
    
    if (!apiKey) {
      console.error('❌ API key não configurada');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('🔑 API Key encontrada:', apiKey.substring(0, 20) + '...');

    // Fazer a requisição para a API do Asaas
    const response = await fetch('https://api-sandbox.asaas.com/v3/paymentLinks', {
      method: req.method,
      headers: {
        'access_token': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    console.log('📡 Resposta da API Asaas:', response.status, response.statusText);

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
