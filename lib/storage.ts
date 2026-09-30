import { JournalEntry } from '@/types/journal';

const STORAGE_KEY = 'komorebi_journal_vault_v1';

export const INITIAL_SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: 'sample-entry-1',
    title: 'Refleksi Senja: Melepaskan Friksi Mental & Menata Ulang Energi',
    date: '2026-09-24',
    time: '21:45',
    createdAt: Date.now() - 86400000,
    sourceMode: 'voice',
    tags: ['daily-journal', 'second-brain', 'manajemen-energi', 'deep-work'],
    dominantEmotion: 'Lega & Reflektif',
    moodScore: 4,
    energyLevel: 'Sedang',
    summary:
      'Hari ini diwarnai oleh tumpukan meeting yang cukup menguras fokus di pagi hari, namun berhasil diselamatkan dengan sesi hening 45 menit tanpa notifikasi sebelum sore berakhir.',
    keyInsights: [
      'Kelelahan bukan hanya karena banyaknya pekerjaan, tetapi akibat terlalu sering berganti konteks (context switching).',
      'Waktu hening tanpa input eksternal sangat penting sebelum mulai merancang keputusan strategis.',
      'Menuliskan isi kepala membuat masalah terasa jauh lebih terdefinisi dan tidak lagi menakutkan.',
    ],
    actionItems: [
      'Alokasikan blok 90 menit tanpa Slack di pagi hari esok untuk tugas utama.',
      'Minum segelas air hangat dan hindari layar gadget 30 menit sebelum tidur.',
    ],
    connectedConcepts: ['Context Switching', 'Deep Work', 'Regulasi Emosi', 'Digital Minimalisme'],
    markdownContent: `---
title: "Refleksi Senja: Melepaskan Friksi Mental & Menata Ulang Energi"
date: 2026-09-24
time: 21:45
tags:
  - daily-journal
  - second-brain
  - manajemen-energi
  - deep-work
mood: "Lega & Reflektif"
mood_score: 4
energy_level: "Sedang"
---

# Refleksi Senja: Melepaskan Friksi Mental & Menata Ulang Energi

> [!quote] Introspeksi Malam
> "Kelelahan sering kali bukan bersumber dari kerja keras, melainkan dari friksi batin saat pikiran kita terpecah ke terlalu banyak arah sekaligus."

## 🌅 Rangkuman Hari
Hari ini terasa cukup padat dengan rentetan komunikasi asinkron dan diskusi tim. Sempat muncul rasa cemas di awal siang karena daftar tugas tampak tak kunjung berkurang. Namun, setelah meluangkan waktu 15 menit berjalan kaki sore tanpa earphone, pikiran berangsur tenang dan esensi prioritas kembali terlihat jernih.

## 💡 Hikmah & Pembelajaran
- **[[Context Switching]]:** Mengalihkan perhatian antar aplikasi setiap 10 menit menghabiskan energi lebih cepat daripada mengetik kode intensif selama dua jam.
- **[[Deep Work]]:** Perlu benteng perlindungan yang lebih tegas untuk jam produktif pagi.
- **[[Digital Minimalisme]]:** Mengurangi konsumsi informasi di penghujung hari secara drastis meningkatkan kualitas istirahat.

## 🌿 Refleksi Batin & Emosi
- **Emosi Dominan:** Lega dan mulai merasa damai setelah menuangkan apa yang mengganjal.
- **Tingkat Energi:** 3.5 / 5 (Cukup tenang, butuh tidur berkualitas).

## ✅ Tindak Lanjut Besok
- [ ] Buat blok *focus time* 90 menit pertama di kalender untuk proyek prioritas.
- [ ] Rapikan catatan inbox mingguan ke folder proyek Obsidian.
- [ ] Luangkan 10 menit meditasi pernapasan sebelum membuka laptop.

---
*Disintesis oleh Komorebi Companion · Siap diimpor ke vault Obsidian*
`,
  },
];

export const getLocalEntries = (): JournalEntry[] => {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_ENTRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_ENTRIES));
      return INITIAL_SAMPLE_ENTRIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
    return INITIAL_SAMPLE_ENTRIES;
  }
};

export const saveLocalEntry = (entry: JournalEntry): JournalEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const current = getLocalEntries();
    const existingIndex = current.findIndex((item) => item.id === entry.id);
    let updated: JournalEntry[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = entry;
    } else {
      updated = [entry, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return [];
  }
};

export const deleteLocalEntry = (id: string): JournalEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const current = getLocalEntries();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete from localStorage:', e);
    return [];
  }
};

/**
 * Fetch entries from PostgreSQL API with graceful fallback to localStorage
 */
export const fetchEntries = async (): Promise<JournalEntry[]> => {
  try {
    const res = await fetch('/api/entries');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('API entries fetch failed, using local storage cache:', err);
  }
  return getLocalEntries();
};

/**
 * Save entry to PostgreSQL API with localStorage backup
 */
export const saveEntry = async (entry: JournalEntry): Promise<JournalEntry[]> => {
  saveLocalEntry(entry);
  try {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (res.ok) {
      const saved = await res.json();
      if (saved && saved.id) {
        // update local entry if ID was assigned
        const current = getLocalEntries();
        const idx = current.findIndex((item) => item.id === entry.id || item.id === saved.id);
        if (idx >= 0) {
          current[idx] = saved;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        }
      }
    }
  } catch (err) {
    console.warn('API entry save failed, saved locally only:', err);
  }
  return getLocalEntries();
};

/**
 * Delete entry from PostgreSQL API with localStorage backup
 */
export const deleteEntry = async (id: string): Promise<JournalEntry[]> => {
  const updated = deleteLocalEntry(id);
  try {
    await fetch(`/api/entries/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('API entry delete failed, deleted locally only:', err);
  }
  return updated;
};
