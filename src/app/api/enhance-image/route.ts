import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // Initialize Gemini AI
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const config = {
      responseModalities: ['IMAGE', 'TEXT'] as const,
    };

    const model = 'gemini-2.5-flash-image-preview';

    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type,
            },
          },
          {
            text: 'boost colors, sharpen contrast, and add glow for thumbnail image',
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Process the stream to find the image
    for await (const chunk of response) {
      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        const imageBuffer = Buffer.from(inlineData.data || '', 'base64');
        
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': inlineData.mimeType || 'image/png',
            'Content-Length': imageBuffer.length.toString(),
          },
        });
      }
    }

    return NextResponse.json(
      { error: 'No enhanced image generated' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error enhancing image:', error);
    return NextResponse.json(
      { error: 'Failed to enhance image' },
      { status: 500 }
    );
  }
}