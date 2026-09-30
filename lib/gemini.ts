import { GoogleGenAI } from '@google/genai';

export const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('DummyKey') || apiKey === 'your-gemini-api-key-here') {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi. Silakan isi API key di file .env');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};
