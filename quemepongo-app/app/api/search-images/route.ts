import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query }: { query: string } = await request.json();

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json({ error: 'Unsplash API key not configured' }, { status: 500 });
    }

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`;

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Unsplash API error:', errorData);
      return NextResponse.json({ error: 'Error searching images' }, { status: 500 });
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const image = data.results[0];
      return NextResponse.json({
        imageUrl: image.urls.regular,
        thumbUrl: image.urls.thumb,
        photographer: image.user.name,
        photographerUrl: image.user.links.html,
      });
    }

    // Fallback image if no results found
    return NextResponse.json({
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      thumbUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com',
    });
  } catch (error) {
    console.error('Error in search-images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
