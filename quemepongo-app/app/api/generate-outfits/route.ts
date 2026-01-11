import { NextRequest, NextResponse } from 'next/server';

interface ProfileData {
  gender: string;
  build: string;
  styles: string[];
  fit: string;
}

interface EventData {
  description: string;
  timeOfDay: string;
  weather: string;
  location: string;
}

export async function POST(request: NextRequest) {
  try {
    const { profile, event }: { profile: ProfileData; event: EventData } = await request.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    const prompt = `Eres un experto estilista de moda. Basándote en el siguiente perfil y evento, genera exactamente 3 sugerencias de outfits diferentes.

PERFIL DEL USUARIO:
- Género: ${profile.gender || 'No especificado'}
- Complexión: ${profile.build || 'No especificada'}
- Estilos preferidos: ${profile.styles?.length > 0 ? profile.styles.join(', ') : 'No especificados'}
- Preferencia de ajuste: ${profile.fit || 'No especificada'}

EVENTO:
- Descripción: ${event.description || 'No especificada'}
- Momento del día: ${event.timeOfDay || 'No especificado'}
- Clima estimado: ${event.weather ? event.weather + '°C' : 'No especificado'}
- Lugar: ${event.location || 'No especificado'}

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin explicaciones adicionales) con el siguiente formato:
{
  "outfits": [
    {
      "id": 1,
      "title": "Nombre corto del estilo (ej: Elegante Casual)",
      "description": "Descripción detallada del outfit incluyendo prendas específicas, colores y accesorios recomendados. 2-3 oraciones.",
      "searchQuery": "términos de búsqueda en inglés para encontrar una imagen similar en Unsplash (ej: elegant casual outfit woman summer)"
    },
    {
      "id": 2,
      "title": "...",
      "description": "...",
      "searchQuery": "..."
    },
    {
      "id": 3,
      "title": "...",
      "description": "...",
      "searchQuery": "..."
    }
  ]
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://app.quemepongo.help',
        'X-Title': 'QueMePongo',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto estilista de moda que responde únicamente en formato JSON válido.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json({ error: 'Error generating outfits' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No content in response' }, { status: 500 });
    }

    // Parse the JSON response from OpenRouter
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    const outfitsData = JSON.parse(jsonMatch[0]);

    return NextResponse.json(outfitsData);
  } catch (error) {
    console.error('Error in generate-outfits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
