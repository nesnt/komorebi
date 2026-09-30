import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_SAMPLE_ENTRIES } from '@/lib/storage';

export async function GET() {
  try {
    const entries = await prisma.journalEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (entries.length === 0) {
      // If DB has no records yet, we can optionally seed with initial sample
      return NextResponse.json(INITIAL_SAMPLE_ENTRIES);
    }

    const mapped = entries.map((e) => ({
      ...e,
      createdAt: e.createdAt.getTime(),
      updatedAt: e.updatedAt.getTime(),
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.warn('Prisma journal entries fetch error (DB may not be connected yet):', error.message);
    // Graceful fallback to initial sample so frontend keeps working
    return NextResponse.json(INITIAL_SAMPLE_ENTRIES);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      title,
      date,
      time,
      tags = [],
      dominantEmotion = 'Reflektif',
      moodScore = 3,
      energyLevel = 'Sedang',
      summary = '',
      keyInsights = [],
      actionItems = [],
      connectedConcepts = [],
      sourceMode = 'voice',
      rawTranscript,
      markdownContent,
    } = body;

    if (!title || !markdownContent) {
      return NextResponse.json({ error: 'Title and markdownContent are required.' }, { status: 400 });
    }

    // Upsert into PostgreSQL via Prisma
    const entry = await prisma.journalEntry.upsert({
      where: { id: id || 'new-id' },
      update: {
        title,
        date: date || new Date().toISOString().split('T')[0],
        time: time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        tags,
        dominantEmotion,
        moodScore: Number(moodScore) || 3,
        energyLevel,
        summary,
        keyInsights,
        actionItems,
        connectedConcepts,
        sourceMode,
        rawTranscript: rawTranscript || null,
        markdownContent,
      },
      create: {
        id: id && !id.startsWith('entry-') && !id.startsWith('sample-') ? id : undefined,
        title,
        date: date || new Date().toISOString().split('T')[0],
        time: time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        tags,
        dominantEmotion,
        moodScore: Number(moodScore) || 3,
        energyLevel,
        summary,
        keyInsights,
        actionItems,
        connectedConcepts,
        sourceMode,
        rawTranscript: rawTranscript || null,
        markdownContent,
      },
    });

    return NextResponse.json({
      ...entry,
      createdAt: entry.createdAt.getTime(),
      updatedAt: entry.updatedAt.getTime(),
    });
  } catch (error: any) {
    console.error('Error saving journal entry with Prisma:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan catatan ke database.' },
      { status: 500 }
    );
  }
}
