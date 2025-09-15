import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path);
}

async function handleRequest(request: NextRequest, path: string[]) {
  try {
    const apiKey = process.env.VITE_ASAAS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Construir a URL da API do Asaas
    const pathString = path.join('/');
    const url = `https://api-sandbox.asaas.com/v3/${pathString}`;
    
    // Obter o corpo da requisição se existir
    let body = null;
    if (request.method !== 'GET' && request.method !== 'DELETE') {
      body = await request.text();
    }

    // Fazer a requisição para a API do Asaas
    const response = await fetch(url, {
      method: request.method,
      headers: {
        'access_token': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Manter outros headers importantes
        ...Object.fromEntries(
          Array.from(request.headers.entries()).filter(([key]) => 
            !['host', 'origin', 'referer'].includes(key.toLowerCase())
          )
        )
      },
      body: body
    });

    // Obter a resposta
    const responseData = await response.text();
    
    // Retornar a resposta com os headers corretos
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, access_token'
      }
    });

  } catch (error) {
    console.error('Erro no proxy da API do Asaas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
