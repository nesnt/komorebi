import { NextResponse } from 'next/server';
import { getAiClient } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { messages, promptTemplate } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    const ai = getAiClient();

    const systemInstruction = `Kamu adalah Komorebi, AI companion jurnal refleksi dan pemikir second-brain yang tenang, berempati, dan bijaksana.
Tujuan utamamu adalah menjadi teman refleksi di penghujung hari untuk pengguna yang lelah, mengalami writer's block, atau ingin menumpahkan isi kepala (brain dump).

Prinsip & Karakter:
1. Suasana Zen & Hangat: Bicaralah dengan nada tenang, lembut, menerima tanpa menghakimi, dan memvalidasi perasaan pengguna terlebih dahulu.
2. Mendengarkan Aktif & Menggali Lebih Dalam: Tangkap emosi tersirat di balik cerita pengguna, lalu ajukan 1 pertanyaan reflektif yang membimbing (probing question) agar pengguna bisa menguraikan benang kusut di kepalanya.
3. Alami & Ringkas untuk Suara: Jawabanmu akan disuarakan (voice-to-voice). Buat jawabanmu tetap ringkas (2-3 kalimat santai dan mengalir, maksimal 4 kalimat). JANGAN gunakan bullet points, formatting markdown tebal-miring berlebih, atau daftar angka saat berbicara.
4. Bahasa: Gunakan Bahasa Indonesia yang natural, hangat, akrab dan sopan (gunakan sapaan 'kamu').
5. Hindari Solusi Instan yang Menggurui: Jangan langsung memberi daftar nasihat teknis kecuali pengguna meminta. Fokus pada eksplorasi diri, memvalidasi rasa lelah/cemas/senang, dan menemukan esensi hari ini.
${promptTemplate ? `Fokus sesi saat ini: ${promptTemplate}` : ''}`;

    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    const reply =
      response.text ||
      'Aku mendengarkanmu... Coba ceritakan lebih lanjut apa yang sedang terasa berat di pikiranmu.';
    return NextResponse.json({ text: reply });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal berkomunikasi dengan AI Companion.' },
      { status: 500 }
    );
  }
}
