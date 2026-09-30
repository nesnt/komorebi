'use client';

import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Save,
  Heart,
  Zap,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JournalEntry, JournalMetadata } from '@/types/journal';
import {
  downloadMarkdown,
  copyMarkdownToClipboard,
  getObsidianAppUri,
} from '@/lib/obsidian';

interface DistillModalProps {
  entry: Partial<JournalEntry> & JournalMetadata;
  isOpen: boolean;
  onClose: () => void;
  onSaveAndArchive: (entry: JournalEntry) => void;
  theme: 'light' | 'dark';
}

export const DistillModal: React.FC<DistillModalProps> = ({
  entry,
  isOpen,
  onClose,
  onSaveAndArchive,
  theme,
}) => {
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'visual' | 'raw'>('visual');
  const [copied, setCopied] = useState(false);
  const [vaultName, setVaultName] = useState('MyVault');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const fullMarkdown = entry.markdownContent || '';

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#8b5cf6'],
      });
    } catch (_) {}
  };

  const handleCopy = async () => {
    const ok = await copyMarkdownToClipboard(fullMarkdown);
    if (ok) {
      setCopied(true);
      triggerCelebration();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const filename = `${entry.date}-${entry.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    downloadMarkdown(filename, fullMarkdown);
    triggerCelebration();
  };

  const handleOpenObsidian = () => {
    const uri = getObsidianAppUri(vaultName, entry.title, fullMarkdown);
    window.location.href = uri;
  };

  const handleSaveToVault = () => {
    const completeEntry: JournalEntry = {
      ...entry,
      id: entry.id || `entry-${Date.now()}`,
      createdAt: entry.createdAt || Date.now(),
      sourceMode: entry.sourceMode || 'voice',
      markdownContent: fullMarkdown,
    };
    onSaveAndArchive(completeEntry);
    setSaved(true);
    triggerCelebration();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`relative flex max-h-[92vh] sm:max-h-[88vh] w-full max-w-3xl flex-col rounded-t-3xl sm:rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
          isLight
            ? 'bg-white border-stone-200 text-stone-800'
            : 'bg-[#16171b] border-white/10 text-zinc-200'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between border-b px-4 py-3 sm:px-5 sm:py-3.5 transition-colors shrink-0 ${
            isLight ? 'border-stone-200/80 bg-[#FAF9F5]' : 'border-white/[0.08] bg-[#141518]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border shrink-0 ${
                isLight
                  ? 'bg-amber-100 border-amber-200 text-amber-700'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold tracking-tight truncate max-w-[170px] sm:max-w-none">
                Hasil Rangkuman Obsidian
              </div>
              <div className={`hidden sm:block text-xs ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                YAML frontmatter, wikilinks, dan callouts
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`flex rounded-lg p-0.5 border ${
                isLight ? 'bg-stone-100 border-stone-200' : 'bg-zinc-900 border-white/[0.06]'
              }`}
            >
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'visual'
                    ? isLight
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'bg-zinc-800 text-amber-300'
                    : isLight
                    ? 'text-stone-600'
                    : 'text-zinc-400'
                }`}
              >
                Rapi
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'raw'
                    ? isLight
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'bg-zinc-800 text-amber-300'
                    : isLight
                    ? 'text-stone-600'
                    : 'text-zinc-400'
                }`}
              >
                .md
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1 opacity-60 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {activeTab === 'visual' ? (
            <div className="space-y-3.5">
              {/* Title & Date */}
              <div className={`border-b pb-2.5 ${isLight ? 'border-stone-200/80' : 'border-white/[0.06]'}`}>
                <span className={`text-[11px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                  {entry.date} · {entry.time || 'Refleksi'}
                </span>
                <h2 className="text-base sm:text-xl font-bold tracking-tight mt-0.5">
                  {entry.title}
                </h2>
              </div>

              {/* Status & Emotion summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div
                  className={`rounded-xl border p-2.5 ${
                    isLight ? 'border-amber-200/80 bg-amber-50/50' : 'border-white/[0.08] bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] text-amber-700 mb-0.5">
                    <Heart className="h-3 w-3 text-amber-500" />
                    <span>Emosi</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold truncate">{entry.dominantEmotion}</div>
                </div>

                <div
                  className={`rounded-xl border p-2.5 ${
                    isLight ? 'border-emerald-200/80 bg-emerald-50/50' : 'border-white/[0.08] bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 mb-0.5">
                    <Zap className="h-3 w-3 text-emerald-500" />
                    <span>Energi</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold">
                    {entry.energyLevel} ({entry.moodScore}/5)
                  </div>
                </div>

                <div
                  className={`col-span-2 sm:col-span-1 rounded-xl border p-2.5 ${
                    isLight ? 'border-violet-200/80 bg-violet-50/50' : 'border-white/[0.08] bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] text-violet-700 mb-0.5">
                    <Layers className="h-3 w-3 text-violet-500" />
                    <span>Wikilinks</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold font-mono">
                    {entry.connectedConcepts?.length || 0} konsep
                  </div>
                </div>
              </div>

              {/* Introspection Quote Callout */}
              <div className={isLight ? 'obsidian-callout-quote-light' : 'obsidian-callout-quote-dark'}>
                <span
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1 ${
                    isLight ? 'text-violet-700' : 'text-purple-300'
                  }`}
                >
                  Intisari Hari Ini
                </span>
                <p className="text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;{entry.summary}&rdquo;
                </p>
              </div>

              {/* Key Insights */}
              <div
                className={`rounded-xl border p-3.5 ${
                  isLight ? 'border-stone-200 bg-[#FAF9F5]' : 'border-white/[0.08] bg-white/[0.01]'
                }`}
              >
                <h3
                  className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-emerald-700' : 'text-emerald-300'
                  }`}
                >
                  💡 Hikmah Utama
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm">
                  {entry.keyInsights?.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-mono text-xs mt-0.5">•</span>
                      <span className="leading-relaxed">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action items */}
              {entry.actionItems && entry.actionItems.length > 0 && (
                <div
                  className={`rounded-xl border p-3.5 ${
                    isLight ? 'border-stone-200 bg-[#FAF9F5]' : 'border-white/[0.08] bg-white/[0.01]'
                  }`}
                >
                  <h3
                    className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 ${
                      isLight ? 'text-amber-800' : 'text-amber-300'
                    }`}
                  >
                    ✅ Tindak Lanjut Besok
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    {entry.actionItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          readOnly
                          className="h-3.5 w-3.5 rounded border-stone-300 text-amber-500"
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected concepts */}
              <div
                className={`rounded-xl border p-3.5 ${
                  isLight ? 'border-stone-200 bg-[#FAF9F5]' : 'border-white/[0.08] bg-white/[0.01]'
                }`}
              >
                <h3
                  className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-violet-700' : 'text-purple-300'
                  }`}
                >
                  🔗 Second Brain Wikilinks
                </h3>
                <div className="flex flex-wrap gap-1">
                  {entry.connectedConcepts?.map((concept, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[11px] font-mono border ${
                        isLight
                          ? 'bg-violet-50 border-violet-200 text-violet-800'
                          : 'bg-purple-500/10 border-purple-500/25 text-purple-300'
                      }`}
                    >
                      <span>[[</span>
                      <span className="font-medium underline decoration-violet-400/40">{concept}</span>
                      <span>]]</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-2 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                <span>{entry.date}-refleksi.md</span>
                <span>Obsidian Vault Format</span>
              </div>
              <pre
                className={`rounded-xl border p-3 text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap select-all ${
                  isLight ? 'bg-stone-50 border-stone-200 text-stone-800' : 'bg-[#101114] border-white/[0.08] text-zinc-300'
                }`}
              >
                {fullMarkdown}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t p-3 sm:px-5 sm:py-3.5 transition-colors shrink-0 ${
            isLight ? 'border-stone-200/80 bg-[#FAF9F5]' : 'border-white/[0.08] bg-[#141518]'
          }`}
        >
          {/* Obsidian Vault Deep Link */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={vaultName}
              onChange={(e) => setVaultName(e.target.value)}
              placeholder="Vault"
              className={`h-8 w-20 sm:w-28 rounded-lg border px-2 text-xs focus:outline-none ${
                isLight
                  ? 'border-stone-300 bg-white text-stone-800'
                  : 'border-white/10 bg-[#1a1b20] text-zinc-200'
              }`}
            />
            <button
              onClick={handleOpenObsidian}
              className={`flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isLight
                  ? 'border-violet-300 bg-violet-50 text-violet-800'
                  : 'border-purple-500/30 bg-purple-500/10 text-purple-300'
              }`}
            >
              <ExternalLink className="h-3 w-3" />
              <span>Buka Obsidian</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            <button
              onClick={handleCopy}
              className={`flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors cursor-pointer ${
                isLight
                  ? 'border-stone-300 bg-white text-stone-700'
                  : 'border-white/10 text-zinc-300'
              }`}
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>

            <button
              onClick={handleDownload}
              className={`flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors cursor-pointer ${
                isLight
                  ? 'border-stone-300 bg-white text-stone-700'
                  : 'border-white/10 text-zinc-300'
              }`}
            >
              <Download className="h-3 w-3" />
              <span>Unduh</span>
            </button>

            <button
              onClick={handleSaveToVault}
              className={`flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                isLight
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-amber-500 text-stone-950 font-bold'
              }`}
            >
              <Save className="h-3 w-3" />
              <span>{saved ? 'Tersimpan' : 'Simpan Vault'}</span>
              <ArrowRight className="h-3 w-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
