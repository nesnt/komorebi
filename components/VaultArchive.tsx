'use client';

import React, { useState, useMemo } from 'react';
import {
  Archive,
  Search,
  Download,
  Copy,
  Trash2,
  Calendar,
  BookOpen,
  Sparkles,
  Link2,
  FileText
} from 'lucide-react';
import { JournalEntry } from '@/types/journal';
import { downloadMarkdown, copyMarkdownToClipboard } from '@/lib/obsidian';

interface VaultArchiveProps {
  entries: JournalEntry[];
  onDeleteEntry: (id: string) => void;
  onSelectEntryToView: (entry: JournalEntry) => void;
  onOpenNewSession: () => void;
  theme: 'light' | 'dark';
}

export const VaultArchive: React.FC<VaultArchiveProps> = ({
  entries,
  onDeleteEntry,
  onSelectEntryToView,
  onOpenNewSession,
  theme,
}) => {
  const isLight = theme === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach((e) => {
      e.tags?.forEach((t) => {
        const clean = t.replace(/^#/, '');
        map.set(clean, (map.get(clean) || 0) + 1);
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const allConcepts = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach((e) => {
      e.connectedConcepts?.forEach((c) => {
        map.set(c, (map.get(c) || 0) + 1);
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.summary?.toLowerCase().includes(q) ||
        entry.markdownContent.toLowerCase().includes(q);

      const matchesTag =
        !selectedTag || entry.tags?.some((t) => t.replace(/^#/, '') === selectedTag);

      const matchesConcept =
        !selectedConcept ||
        entry.connectedConcepts?.some((c) => c === selectedConcept);

      return matchesSearch && matchesTag && matchesConcept;
    });
  }, [entries, searchQuery, selectedTag, selectedConcept]);

  const handleBatchDownloadAll = () => {
    if (entries.length === 0) return;
    entries.forEach((entry, idx) => {
      setTimeout(() => {
        const filename = `${entry.date}-${entry.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
        downloadMarkdown(filename, entry.markdownContent);
      }, idx * 150);
    });
  };

  return (
    <div
      className={`flex h-full flex-col overflow-y-auto px-3.5 py-4 sm:p-8 pb-20 md:pb-8 transition-colors duration-200 ${
        isLight ? 'bg-[#FAF9F5]' : 'bg-[#121316]'
      }`}
    >
      <div className="mx-auto w-full max-w-5xl space-y-4 sm:space-y-6">
        {/* Header & Second Brain Info */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b transition-colors ${
            isLight ? 'border-stone-200 text-stone-800' : 'border-white/[0.08] text-zinc-100'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Archive className={`h-5 w-5 ${isLight ? 'text-violet-600' : 'text-purple-400'}`} />
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
                Arsip Catatan & Second Brain
              </h1>
            </div>
            <p className={`mt-0.5 text-xs sm:text-sm ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
              Kumpulan refleksi harian yang tersimpan dan terhubung langsung dengan Obsidian.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <button
                onClick={handleBatchDownloadAll}
                title="Unduh semua berkas .md"
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  isLight
                    ? 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50 shadow-2xs'
                    : 'border-white/10 bg-[#1a1b20] text-zinc-300 hover:text-white'
                }`}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Unduh ({entries.length} .md)</span>
              </button>
            )}

            <button
              onClick={onOpenNewSession}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer ${
                isLight
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sesi Baru</span>
            </button>
          </div>
        </div>

        {/* Second Brain Concept Network (Wikilinks) */}
        {allConcepts.length > 0 && (
          <div
            className={`rounded-2xl border p-3.5 sm:p-5 transition-colors ${
              isLight
                ? 'border-stone-200/90 bg-white shadow-2xs'
                : 'border-white/[0.08] bg-[#16171b]'
            }`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-1.5">
                <Link2 className={`h-4 w-4 ${isLight ? 'text-violet-600' : 'text-purple-400'}`} />
                <span
                  className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                    isLight ? 'text-violet-700' : 'text-purple-300'
                  }`}
                >
                  Second Brain Wikilinks
                </span>
              </div>
              {selectedConcept && (
                <button
                  onClick={() => setSelectedConcept(null)}
                  className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Reset ({selectedConcept}) ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {allConcepts.map(([concept, count]) => {
                const isSelected = selectedConcept === concept;
                return (
                  <button
                    key={concept}
                    onClick={() => setSelectedConcept(isSelected ? null : concept)}
                    className={`flex items-center gap-1 rounded-lg px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-mono transition-all cursor-pointer border ${
                      isSelected
                        ? isLight
                          ? 'bg-violet-600 text-white border-violet-600 font-semibold shadow-2xs'
                          : 'bg-purple-500 text-white border-purple-500 font-semibold'
                        : isLight
                        ? 'border-violet-200/70 bg-violet-50/70 text-violet-800 hover:bg-violet-100'
                        : 'border-purple-500/20 bg-purple-500/5 text-purple-300 hover:bg-purple-500/15'
                    }`}
                  >
                    <span>[[{concept}]]</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Tag Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau wawasan..."
              className={`w-full rounded-xl border pl-9 pr-3.5 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors focus:outline-none ${
                isLight
                  ? 'border-stone-200 bg-white text-stone-900 placeholder-stone-400 focus:border-amber-400'
                  : 'border-white/10 bg-[#16171b] text-zinc-200 placeholder-zinc-500 focus:border-amber-500/50'
              }`}
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedTag(null)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0 cursor-pointer border ${
                  selectedTag === null
                    ? isLight
                      ? 'bg-amber-100/80 border-amber-300 text-amber-900 font-semibold'
                      : 'bg-zinc-800 text-amber-300 border-amber-500/30'
                    : isLight
                    ? 'border-stone-200 bg-white text-stone-600'
                    : 'border-white/[0.06] bg-[#16171b] text-zinc-400'
                }`}
              >
                Semua
              </button>
              {allTags.map(([tag, count]) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-mono transition-colors shrink-0 cursor-pointer border ${
                      isSelected
                        ? isLight
                          ? 'bg-amber-500 text-white border-amber-500 font-semibold shadow-2xs'
                          : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : isLight
                        ? 'border-stone-200 bg-white text-stone-600'
                        : 'border-white/[0.06] bg-[#16171b] text-zinc-400'
                    }`}
                  >
                    <span>#{tag}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Entries Grid */}
        {filteredEntries.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center ${
              isLight ? 'border-stone-300 bg-white/50 text-stone-600' : 'border-white/10 text-zinc-400'
            }`}
          >
            <BookOpen className="h-8 w-8 opacity-40 mb-2" />
            <h3 className="text-xs sm:text-sm font-semibold">
              Belum ada catatan yang cocok
            </h3>
            <button
              onClick={onOpenNewSession}
              className="mt-3 rounded-xl bg-amber-500 text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-amber-600 transition-colors cursor-pointer"
            >
              Mulai Refleksi Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all hover:shadow-md ${
                  isLight
                    ? 'border-stone-200/90 bg-white text-stone-800 hover:border-amber-300'
                    : 'border-white/[0.08] bg-[#16171b] text-zinc-200 hover:border-amber-500/30'
                }`}
              >
                <div>
                  <div
                    className={`flex items-center justify-between text-[11px] mb-2 font-mono ${
                      isLight ? 'text-stone-400' : 'text-zinc-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>{entry.date}</span>
                    </div>
                    <span className={isLight ? 'text-amber-700 font-semibold' : 'text-amber-400/80'}>
                      {entry.sourceMode === 'voice' ? '🎙️ Suara' : '✍️ Manual'}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectEntryToView(entry)}
                    className={`text-sm sm:text-base font-bold transition-colors cursor-pointer line-clamp-2 ${
                      isLight ? 'text-stone-900 group-hover:text-amber-700' : 'text-zinc-100 group-hover:text-amber-300'
                    }`}
                  >
                    {entry.title}
                  </h3>

                  <div
                    className={`mt-1.5 flex items-center gap-2 text-[11px] sm:text-xs ${
                      isLight ? 'text-stone-500' : 'text-zinc-400'
                    }`}
                  >
                    <span className={`font-medium ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
                      {entry.dominantEmotion}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Energi: {entry.energyLevel}</span>
                  </div>

                  <p
                    className={`mt-2 text-xs leading-relaxed line-clamp-2 sm:line-clamp-3 ${
                      isLight ? 'text-stone-600' : 'text-zinc-400'
                    }`}
                  >
                    {entry.summary}
                  </p>

                  {entry.connectedConcepts && entry.connectedConcepts.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {entry.connectedConcepts.slice(0, 3).map((concept, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            isLight
                              ? 'bg-violet-50 border-violet-100 text-violet-700'
                              : 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                          }`}
                        >
                          [[{concept}]]
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div
                  className={`mt-4 flex items-center justify-between border-t pt-2.5 ${
                    isLight ? 'border-stone-100' : 'border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {entry.tags?.slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] sm:text-[11px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}
                      >
                        #{t.replace(/^#/, '')}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const filename = `${entry.date}-${entry.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
                        downloadMarkdown(filename, entry.markdownContent);
                      }}
                      title="Unduh .md"
                      className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                        isLight ? 'text-stone-500 hover:bg-stone-100' : 'text-zinc-400 hover:bg-white/[0.06]'
                      }`}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={async () => {
                        await copyMarkdownToClipboard(entry.markdownContent);
                        alert('Markdown berhasil disalin!');
                      }}
                      title="Salin Markdown"
                      className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                        isLight ? 'text-stone-500 hover:bg-stone-100' : 'text-zinc-400 hover:bg-white/[0.06]'
                      }`}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectEntryToView(entry)}
                      title="Buka & Tinjau"
                      className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                        isLight ? 'text-amber-700 hover:bg-amber-50' : 'text-amber-300 hover:bg-amber-500/10'
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus catatan "${entry.title}"?`)) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      title="Hapus"
                      className="rounded-lg p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
