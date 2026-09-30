'use client';

import React from 'react';
import {
  Sparkles,
  BookOpen,
  Mic,
  Calendar,
  ArrowRight,
  Heart,
  Zap,
  Archive,
  ChevronRight
} from 'lucide-react';
import { JournalEntry } from '@/types/journal';

interface HomePageProps {
  onStartVoice: () => void;
  onStartManual: () => void;
  onOpenVault: () => void;
  onSelectEntry: (entry: JournalEntry) => void;
  recentEntries: JournalEntry[];
  theme: 'light' | 'dark';
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartVoice,
  onStartManual,
  onOpenVault,
  onSelectEntry,
  recentEntries,
  theme,
}) => {
  const isLight = theme === 'light';

  const hour = new Date().getHours();
  let greeting = 'Selamat Datang';
  let greetingSub = 'Bagaimana perasaanmu di penghujung hari ini?';
  let greetingEmoji = '🌿';

  if (hour >= 4 && hour < 11) {
    greeting = 'Selamat Pagi';
    greetingSub = 'Awali hari dengan pikiran yang hening dan terarah.';
    greetingEmoji = '🌅';
  } else if (hour >= 11 && hour < 15) {
    greeting = 'Selamat Siang';
    greetingSub = 'Luangkan sejenak waktu untuk bernapas di sela aktivitasmu.';
    greetingEmoji = '☀️';
  } else if (hour >= 15 && hour < 18) {
    greeting = 'Selamat Sore';
    greetingSub = 'Matahari mulai condong, mari perlahan urai benang kusut hari ini.';
    greetingEmoji = '🌇';
  } else {
    greeting = 'Selamat Malam';
    greetingSub = 'Hari ini cukup panjang... Tumpahkan apa yang membebani kepalamu sebelum tidur.';
    greetingEmoji = '🌙';
  }

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const previousEntry = recentEntries.length > 0 ? recentEntries[0] : null;

  return (
    <div
      className={`h-full overflow-y-auto px-3.5 py-4 sm:px-8 sm:py-8 pb-20 md:pb-8 transition-colors duration-200 ${
        isLight ? 'bg-[#FAF9F5] text-stone-800' : 'bg-[#121316] text-[#e4e4e7]'
      }`}
    >
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        {/* Warm Welcome Banner */}
        <div
          className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-5 sm:p-8 transition-all ${
            isLight
              ? 'border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 shadow-2xs'
              : 'border-white/[0.08] bg-gradient-to-br from-[#1a1b20] via-[#16171b] to-[#1e1c18] shadow-md'
          }`}
        >
          <div
            className={`absolute -right-12 -top-12 h-36 w-36 sm:h-44 sm:w-44 rounded-full blur-3xl pointer-events-none ${
              isLight ? 'bg-amber-300/25' : 'bg-amber-500/10'
            }`}
          />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2 max-w-xl">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl" role="img" aria-label="greeting icon">
                  {greetingEmoji}
                </span>
                <span
                  className={`text-[11px] sm:text-xs font-semibold tracking-wide uppercase ${
                    isLight ? 'text-amber-800' : 'text-amber-400'
                  }`}
                >
                  {todayFormatted}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                {greeting}, sahabat pemikir.
              </h1>
              <p
                className={`text-xs sm:text-base leading-relaxed ${
                  isLight ? 'text-stone-600' : 'text-zinc-400'
                }`}
              >
                {greetingSub} Tak perlu pusing dengan <em>writer&apos;s block</em> atau lelah mengetik—Komorebi siap menemani dan merapikannya untuk Obsidian.
              </p>
            </div>

            <div
              className={`rounded-xl sm:rounded-2xl border p-3 sm:p-4 sm:w-56 shrink-0 transition-colors ${
                isLight
                  ? 'border-amber-200/70 bg-white/80 shadow-2xs'
                  : 'border-white/[0.08] bg-[#141518]/90'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={isLight ? 'text-stone-700' : 'text-zinc-300'}>
                  Ruang Hening Privat
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs leading-relaxed ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                Catatan tersimpan aman di database lokal dan siap diekspor langsung ke vault Obsidian (.md).
              </p>
            </div>
          </div>
        </div>

        {/* Section: 2 Main Capture Options */}
        <div>
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-sm sm:text-lg font-bold tracking-tight">
              Pilih Cara Refleksimu Hari Ini
            </h2>
            <span
              className={`text-[11px] sm:text-xs ${
                isLight ? 'text-stone-500' : 'text-zinc-500'
              }`}
            >
              Bebas pilih sesuai energimu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Option 1: AI Voice Companion */}
            <div
              onClick={onStartVoice}
              className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border p-4 sm:p-6 transition-all duration-200 cursor-pointer active:scale-[0.99] hover:scale-[1.01] ${
                isLight
                  ? 'border-amber-300/80 bg-white hover:border-amber-400 hover:shadow-md'
                  : 'border-amber-500/30 bg-[#16171b] hover:border-amber-500/60 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border transition-colors ${
                    isLight
                      ? 'border-amber-200 bg-amber-50 text-amber-700 group-hover:bg-amber-100'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20'
                  }`}
                >
                  <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase ${
                    isLight
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  Rekomendasi Malam
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight group-hover:text-amber-600 transition-colors">
                  Obrolan Suara Interaktif (Otomatis)
                </h3>
                <p
                  className={`mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-stone-600' : 'text-zinc-400'
                  }`}
                >
                  Malas mengetik? Bicara santai lewat mikrofon. AI mendengarkan, memvalidasi lelahmu, lalu otomatis merangkumnya jadi file Markdown Obsidian.
                </p>
                <div
                  className={`mt-3 sm:mt-4 flex flex-wrap gap-2 text-[10px] sm:text-[11px] font-medium ${
                    isLight ? 'text-stone-500' : 'text-zinc-400'
                  }`}
                >
                  <span>✓ Bebas ketik</span>
                  <span>✓ Voice-to-voice</span>
                  <span>✓ Suling otomatis</span>
                </div>
              </div>

              <div
                className={`mt-4 sm:mt-6 flex items-center justify-between border-t pt-3 sm:pt-4 ${
                  isLight ? 'border-stone-100' : 'border-white/[0.06]'
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}
                >
                  Mulai Obrolan Suara
                </span>
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl transition-transform group-hover:translate-x-1 ${
                    isLight ? 'bg-amber-500 text-white' : 'bg-amber-500 text-stone-950 font-bold'
                  }`}
                >
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
            </div>

            {/* Option 2: Manual Markdown */}
            <div
              onClick={onStartManual}
              className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border p-4 sm:p-6 transition-all duration-200 cursor-pointer active:scale-[0.99] hover:scale-[1.01] ${
                isLight
                  ? 'border-stone-200/90 bg-white hover:border-emerald-300 hover:shadow-md'
                  : 'border-white/[0.08] bg-[#16171b] hover:border-emerald-500/40 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border transition-colors ${
                    isLight
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100'
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20'
                  }`}
                >
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase ${
                    isLight
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  Fokus Murni
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight group-hover:text-emerald-600 transition-colors">
                  Tulis Bebas Markdown (Manual)
                </h3>
                <p
                  className={`mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-stone-600' : 'text-zinc-400'
                  }`}
                >
                  Sudah tahu apa yang ingin ditulis? Gunakan editor teks minimalis dengan tipografi <em>monospace</em>, wikilinks [[Konsep]], dan callouts.
                </p>
                <div
                  className={`mt-3 sm:mt-4 flex flex-wrap gap-2 text-[10px] sm:text-[11px] font-medium ${
                    isLight ? 'text-stone-500' : 'text-zinc-400'
                  }`}
                >
                  <span>✓ JetBrains Mono</span>
                  <span>✓ Live Preview</span>
                  <span>✓ Suling AI</span>
                </div>
              </div>

              <div
                className={`mt-4 sm:mt-6 flex items-center justify-between border-t pt-3 sm:pt-4 ${
                  isLight ? 'border-stone-100' : 'border-white/[0.06]'
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    isLight ? 'text-emerald-700' : 'text-emerald-400'
                  }`}
                >
                  Buka Editor Markdown
                </span>
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl transition-transform group-hover:translate-x-1 ${
                    isLight
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 text-stone-950 font-bold'
                  }`}
                >
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Rangkuman Hari Sebelumnya */}
        <div>
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar
                className={`h-4 w-4 ${isLight ? 'text-violet-600' : 'text-purple-400'}`}
              />
              <h2 className="text-sm sm:text-lg font-bold tracking-tight">
                Rangkuman Refleksi Sebelumnya
              </h2>
            </div>
            <button
              onClick={onOpenVault}
              className={`text-xs font-semibold flex items-center gap-0.5 transition-colors cursor-pointer ${
                isLight ? 'text-violet-700 hover:text-violet-900' : 'text-purple-300 hover:text-purple-200'
              }`}
            >
              <span>Arsip Vault</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {previousEntry ? (
            <div
              onClick={() => onSelectEntry(previousEntry)}
              className={`group relative rounded-2xl sm:rounded-3xl border p-4 sm:p-6 transition-all cursor-pointer hover:shadow-md ${
                isLight
                  ? 'border-stone-200/90 bg-white hover:border-violet-300'
                  : 'border-white/[0.08] bg-[#16171b] hover:border-purple-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono">
                  <span className="font-semibold">{previousEntry.date}</span>
                  {previousEntry.time && <span>· {previousEntry.time}</span>}
                  <span className="opacity-50">·</span>
                  <span className={isLight ? 'text-amber-700' : 'text-amber-400'}>
                    {previousEntry.sourceMode === 'voice' ? '🎙️ Obrolan Suara' : '✍️ Draf Manual'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-[11px] sm:text-xs">
                  <span className="flex items-center gap-1 font-medium">
                    <Heart className="h-3 w-3 text-red-400" />
                    <span>{previousEntry.dominantEmotion}</span>
                  </span>
                  <span className="flex items-center gap-1 opacity-75">
                    <Zap className="h-3 w-3 text-emerald-400" />
                    <span>Energi: {previousEntry.energyLevel}</span>
                  </span>
                </div>
              </div>

              <h3 className="text-sm sm:text-lg font-bold tracking-tight group-hover:text-violet-700 dark:group-hover:text-purple-300 transition-colors line-clamp-1">
                {previousEntry.title}
              </h3>

              <div
                className={`my-2.5 border-l-3 pl-3 text-xs sm:text-sm italic leading-relaxed line-clamp-2 ${
                  isLight
                    ? 'border-violet-400 bg-violet-50/50 py-1 text-stone-700 rounded-r-lg'
                    : 'border-purple-400 bg-purple-500/[0.06] py-1 text-zinc-300 rounded-r-lg'
                }`}
              >
                &ldquo;{previousEntry.summary}&rdquo;
              </div>

              {previousEntry.connectedConcepts && previousEntry.connectedConcepts.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 pt-2.5 border-t border-stone-100 dark:border-white/[0.06]">
                  {previousEntry.connectedConcepts.slice(0, 4).map((concept, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded border ${
                        isLight
                          ? 'bg-violet-50 border-violet-200 text-violet-700'
                          : 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                      }`}
                    >
                      [[{concept}]]
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div
              className={`rounded-2xl sm:rounded-3xl border border-dashed p-6 text-center ${
                isLight ? 'border-stone-300 bg-white/40' : 'border-white/10 bg-[#16171b]/40'
              }`}
            >
              <Archive className="mx-auto h-7 w-7 opacity-40 mb-1.5" />
              <p className="text-xs sm:text-sm font-medium">Belum ada catatan refleksi</p>
              <button
                onClick={onStartVoice}
                className="mt-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1 text-xs font-semibold cursor-pointer"
              >
                Mulai Sesi Pertama
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
