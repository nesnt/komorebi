import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { getAiClient } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { transcript, manualNotes, contextTags = [] } = await request.json();

    const sourceContent = transcript
      ? Array.isArray(transcript)
        ? transcript.map((m: any) => `${m.role === 'user' ? 'Pengguna' : 'Komorebi'}: ${m.text}`).join('\n')
        : String(transcript)
      : String(manualNotes || '');

    if (!sourceContent.trim()) {
      return NextResponse.json({ error: 'Sumber refleksi kosong.' }, { status: 400 });
    }

    const ai = getAiClient();

    const todayDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const systemInstruction = `Anda adalah seorang ahli Second Brain dan Personal Knowledge Management (PKM) yang ahli dalam sintesis catatan terstruktur untuk Obsidian.
Tugas Anda adalah membaca sesi percakapan refleksi malam atau draft bebas pengguna, lalu menyulingnya secara cerdas menjadi catatan Markdown yang indah, mendalam, dan siap dimasukkan ke vault Obsidian.

Format yang harus dihasilkan:
1. Metadata JSON terstruktur:
   - title: Judul reflektif yang puitis atau bernas (misal: "Refleksi: Menemukan Hening di Tengah Hiruk Pikuk")
   - date: "${todayDate}"
   - time: "${currentTime}"
   - tags: Array tag Obsidian yang relevan (misal: ["daily-journal", "second-brain", "mindset", "fokus"])
   - dominantEmotion: Emosi dominan yang teridentifikasi (misal: "Lega & Berharap", "Kelelahan Mental", "Puas & Bangga")
   - moodScore: 1-5 (1: sangat lelah/drop, 3: netral/reflektif, 5: sangat gembira/berdaya)
   - energyLevel: Kategori energi (misal: "Rendah", "Sedang", "Tinggi")
   - summary: Rangkuman 2-3 kalimat esensi hari ini
   - keyInsights: Array 2-4 hikmah atau pembelajaran utama
   - actionItems: Array 1-3 ide tindak lanjut konkret untuk besok
   - connectedConcepts: Array 3-6 konsep terkait untuk Obsidian Wikilinks (misal: ["Deep Work", "Regulasi Emosi", "Batas Diri", "Manajemen Energi"])
   - markdownContent: Dokumen Markdown murni yang lengkap dengan YAML frontmatter, header ##, Obsidian Callouts (> [!quote], > [!note], > [!tip]), Wikilinks [[Konsep]], dan task checkbox (- [ ]).`;

    const prompt = `Berikut adalah transkrip atau catatan refleksi hari ini:
---
${sourceContent}
---
Tags konteks yang diinginkan: ${contextTags.join(', ')}

Suling bahan di atas menjadi dokumen Obsidian Second Brain terstruktur sesuai skema. Pastikan bahasa Indonesia yang digunakan hangat, tajam, dan memuat esensi batin terdalam pengguna.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            date: { type: Type.STRING },
            time: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            dominantEmotion: { type: Type.STRING },
            moodScore: { type: Type.INTEGER },
            energyLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            connectedConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            markdownContent: { type: Type.STRING },
          },
          required: [
            'title',
            'date',
            'tags',
            'dominantEmotion',
            'moodScore',
            'energyLevel',
            'summary',
            'keyInsights',
            'actionItems',
            'connectedConcepts',
            'markdownContent',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Distill endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menyuling catatan ke format Obsidian.' },
      { status: 500 }
    );
  }
}
