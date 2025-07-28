import { NextRequest, NextResponse } from 'next/server';
import { generateTitlesWithGemini } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required and must be a string' },
        { status: 400 }
      );
    }

    const titles = await generateTitlesWithGemini(description);
    
    return NextResponse.json({ titles });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate titles' },
      { status: 500 }
    );
  }
}