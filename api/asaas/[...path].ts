import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extrair o path dos parâmetros
  const { path } = req.query;
  const pathArray = Array.isArray(path) ? path : [path];
  
  return handleRequest(req, res, pathArray);
}

async function handleRequest(req: VercelRequest, res: VercelResponse, path: string[]) {
  try {
    const apiKey = process.env.VITE_ASAAS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Construir a URL da API do Asaas
    const pathString = path.join('/');
    const url = `https://api-sandbox.asaas.com/v3/${pathString}`;
    
    // Obter o corpo da requisição se existir
    let body = null;
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      body = JSON.stringify(req.body);
    }

    // Fazer a requisição para a API do Asaas
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'access_token': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: body
    });

    // Obter a resposta
    const responseData = await response.text();
    
    // Configurar headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, access_token');
    res.setHeader('Content-Type', 'application/json');
    
    // Retornar a resposta
    return res.status(response.status).send(responseData);

  } catch (error) {
    console.error('Erro no proxy da API do Asaas:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
