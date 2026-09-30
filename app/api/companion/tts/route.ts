import { NextResponse } from 'next/server';
import { getAiClient } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { text, voice = 'Kore' } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required for TTS.' }, { status: 400 });
    }

    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500),
              speechMetadata: {
                style: 'Gentle, soothing, calm, contemplative reflection guide',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return NextResponse.json({ error: 'Audio generation produced no data' }, { status: 404 });
    }

    return NextResponse.json({ audioBase64: base64Audio });
  } catch (error: any) {
    console.warn('TTS error (falling back to client speech synthesis):', error.message);
    return NextResponse.json(
      {
        error: error.message,
        fallbackToBrowser: true,
      },
      { status: 500 }
    );
  }
}
