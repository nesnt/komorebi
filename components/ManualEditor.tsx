'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  Eye,
  Columns,
  Sparkles,
  Download,
  Copy,
  Check,
  Link2,
  CheckSquare,
  Quote,
} from 'lucide-react';
import { downloadMarkdown, copyMarkdownToClipboard } from '@/lib/obsidian';

interface ManualEditorProps {
  onDistillDraft: (draftText: string) => void;
  isDistilling: boolean;
  onSaveToVault: (markdown: string, title?: string) => void;
  theme: 'light' | 'dark';
}

const DEFAULT_SAMPLE_MARKDOWN = `---
title: "Refleksi Malam: Membongkar Keraguan & Menata Energi"
date: ${new Date().toISOString().split('T')[0]}
tags:
  - daily-journal
  - second-brain
  - produktivitas
---

# Catatan Refleksi Malam Ini

> [!quote] Pengingat Sederhana
> "Ketenangan pikiran tercapai bukan saat tidak ada badai, melainkan saat kita tidak membiarkan badai itu masuk ke dalam ruang batin kita."

## 💭 Aliran Pikiran Bebas
Hari ini terasa cukup dinamis. Ada momen di mana saya merasa sedikit kewalahan dengan ekspektasi diri sendiri mengenai progres proyek. Namun setelah menguraikannya ke langkah-langkah kecil, beban tersebut perlahan terurai.

## 💡 Pembelajaran Utama
- Menulis sebelum tidur membantu membuang beban pikiran (*cognitive load*) yang tidak perlu.
- Konsep [[Time Blocking]] sangat menolong dalam mempertahankan fokus, tapi saya tetap perlu fleksibel saat ada interupsi.
- Merawat energi emosional sama pentingnya dengan menjaga stamina fisik.

## 🔗 Second Brain Links
- [[Deep Work]]
- [[Regulasi Emosi]]
- [[Prinsip Stoik]]

## ✅ Tindak Lanjut Esok Hari
- [ ] Mulai hari dengan sesi *brain dump* 10 menit sebelum membuka email.
- [ ] Tuntaskan draf arsitektur sebelum istirahat siang.
- [ ] Luangkan 20 menit membaca buku tanpa gangguan ponsel.
`;

export const ManualEditor: React.FC<ManualEditorProps> = ({
  onDistillDraft,
  isDistilling,
  onSaveToVault,
  theme,
}) => {
  const isLight = theme === 'light';

  const [markdown, setMarkdown] = useState<string>(DEFAULT_SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('editor');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordsCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charsCount = markdown.length;
  const readingTimeMinutes = Math.ceil(wordsCount / 200);

  const insertTextAtCursor = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const replacement = `${before}${selectedText}${after}`;

    const newMarkdown =
      markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(newMarkdown);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleCopy = async () => {
    const success = await copyMarkdownToClipboard(markdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const today = new Date().toISOString().split('T')[0];
    downloadMarkdown(`${today}-refleksi-manual.md`, markdown);
  };

  const renderPreview = () => {
    const lines = markdown.split('\n');
    let insideYaml = false;
    const yamlLines: string[] = [];
    const contentElements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      if (index === 0 && line.trim() === '---') {
        insideYaml = true;
        return;
      }
      if (insideYaml) {
        if (line.trim() === '---') {
          insideYaml = false;
          contentElements.push(
            <div
              key="yaml-block"
              className={`mb-4 sm:mb-6 rounded-xl border p-3 text-xs font-mono transition-colors ${
                isLight
                  ? 'border-amber-200 bg-amber-50/70 text-amber-900'
                  : 'border-amber-500/20 bg-amber-500/[0.04] text-amber-200/80'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider font-semibold mb-1 opacity-70">
                YAML Frontmatter
              </div>
              <pre className="whitespace-pre-wrap text-[11px] sm:text-xs">{yamlLines.join('\n')}</pre>
            </div>
          );
          return;
        }
        yamlLines.push(line);
        return;
      }

      // Obsidian Callout Quote
      if (line.startsWith('> [!quote]')) {
        contentElements.push(
          <div
            key={`callout-${index}`}
            className={isLight ? 'obsidian-callout-quote-light' : 'obsidian-callout-quote-dark'}
          >
            <span
              className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wider block mb-1 ${
                isLight ? 'text-violet-700' : 'text-purple-300'
              }`}
            >
              Kutipan Reflektif
            </span>
            <p className={`text-xs sm:text-sm italic ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
              {line.replace('> [!quote]', '').trim()}
            </p>
          </div>
        );
        return;
      }

      // Obsidian Callout Tip/Insight
      if (line.startsWith('> [!tip]') || line.startsWith('> [!insight]')) {
        contentElements.push(
          <div
            key={`callout-${index}`}
            className={isLight ? 'obsidian-callout-learn-light' : 'obsidian-callout-learn-dark'}
          >
            <span
              className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wider block mb-1 ${
                isLight ? 'text-emerald-700' : 'text-emerald-300'
              }`}
            >
              Wawasan & Hikmah
            </span>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
              {line.replace(/> \[!(tip|insight)\]/, '').trim()}
            </p>
          </div>
        );
        return;
      }

      // Regular blockquote
      if (line.startsWith('>')) {
        contentElements.push(
          <blockquote
            key={`quote-${index}`}
            className={`border-l-3 pl-3 my-2 text-xs sm:text-sm italic ${
              isLight
                ? 'border-amber-400 text-stone-700 bg-amber-50/40 py-1 rounded-r-md'
                : 'border-amber-500/50 text-amber-100/90'
            }`}
          >
            {line.replace(/^>\s?/, '')}
          </blockquote>
        );
        return;
      }

      // Headings
      if (line.startsWith('# ')) {
        contentElements.push(
          <h1
            key={`h1-${index}`}
            className={`text-xl sm:text-2xl font-bold tracking-tight mt-4 sm:mt-6 mb-2 sm:mb-3 ${
              isLight ? 'text-stone-900' : 'text-white'
            }`}
          >
            {line.replace('# ', '')}
          </h1>
        );
        return;
      }
      if (line.startsWith('## ')) {
        contentElements.push(
          <h2
            key={`h2-${index}`}
            className={`text-base sm:text-lg font-semibold mt-4 mb-2 pb-1 border-b ${
              isLight ? 'text-stone-800 border-stone-200' : 'text-zinc-100 border-white/[0.06]'
            }`}
          >
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        contentElements.push(
          <h3
            key={`h3-${index}`}
            className={`text-xs sm:text-sm font-semibold mt-3 mb-1 ${
              isLight ? 'text-amber-800' : 'text-amber-300'
            }`}
          >
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Checkbox tasks
      if (line.match(/^-\s*\[([ xX])\]/)) {
        const isChecked = line.includes('[x]') || line.includes('[X]');
        const taskText = line.replace(/^-\s*\[([ xX])\]\s*/, '');
        return contentElements.push(
          <div
            key={`task-${index}`}
            className={`flex items-center gap-2 text-xs sm:text-sm my-1 ${
              isLight ? 'text-stone-700' : 'text-zinc-300'
            }`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              readOnly
              className="h-3.5 w-3.5 rounded border-stone-300 text-amber-500 focus:ring-0"
            />
            <span className={isChecked ? 'line-through opacity-50' : ''}>
              {formatInlineMarkdown(taskText)}
            </span>
          </div>
        );
      }

      // Bullets
      if (line.startsWith('- ') || line.startsWith('* ')) {
        contentElements.push(
          <li
            key={`bullet-${index}`}
            className={`text-xs sm:text-sm ml-4 list-disc my-1 ${
              isLight ? 'text-stone-700' : 'text-zinc-300'
            }`}
          >
            {formatInlineMarkdown(line.substring(2))}
          </li>
        );
        return;
      }

      // Empty line
      if (!line.trim()) {
        contentElements.push(<div key={`empty-${index}`} className="h-2" />);
        return;
      }

      // Regular paragraph
      contentElements.push(
        <p
          key={`p-${index}`}
          className={`text-xs sm:text-sm leading-relaxed my-1.5 ${
            isLight ? 'text-stone-700' : 'text-zinc-300'
          }`}
        >
          {formatInlineMarkdown(line)}
        </p>
      );
    });

    return contentElements;
  };

  const formatInlineMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(/(\[\[.*?\]\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const linkName = part.slice(2, -2);
        return (
          <span
            key={i}
            className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-mono font-medium transition-colors cursor-pointer border ${
              isLight
                ? 'bg-violet-50 border-violet-200 text-violet-800'
                : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
            }`}
            title="Obsidian Second Brain Wikilink"
          >
            <span>[[</span>
            <span className="underline decoration-violet-400/40">{linkName}</span>
            <span>]]</span>
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`flex flex-col transition-colors duration-200 pb-14 md:pb-0 h-full ${
        isLight ? 'bg-[#FAF9F5]' : 'bg-[#121316]'
      }`}
    >
      {/* Editor Toolbar */}
      <div
        className={`flex items-center justify-between gap-1.5 border-b px-2 sm:px-6 py-2 transition-colors overflow-x-auto no-scrollbar ${
          isLight ? 'border-stone-200/80 bg-white' : 'border-white/[0.06] bg-[#15161a]'
        }`}
      >
        {/* Left: Quick Obsidian helpers */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => insertTextAtCursor('[[', ']]')}
            title="Sisipkan [[Wikilink]]"
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-mono transition-colors cursor-pointer ${
              isLight
                ? 'border-violet-200 bg-violet-50 text-violet-700'
                : 'border-white/[0.08] text-purple-300 hover:bg-purple-500/10'
            }`}
          >
            <Link2 className="h-3 w-3" />
            <span className="text-[11px]">[[Link]]</span>
          </button>

          <button
            onClick={() => insertTextAtCursor('> [!insight] Hikmah\n> ')}
            title="Sisipkan Callout"
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors cursor-pointer ${
              isLight
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-white/[0.08] text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Quote className="h-3 w-3" />
            <span className="text-[11px] hidden xs:inline">[!Callout]</span>
          </button>

          <button
            onClick={() => insertTextAtCursor('- [ ] ')}
            title="Sisipkan Tugas"
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors cursor-pointer ${
              isLight
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-white/[0.08] text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <CheckSquare className="h-3 w-3" />
            <span className="text-[11px] hidden xs:inline">Tugas</span>
          </button>
        </div>

        {/* Center: View Switcher */}
        <div
          className={`flex items-center gap-0.5 rounded-lg p-0.5 border shrink-0 ${
            isLight ? 'bg-stone-100 border-stone-200' : 'bg-zinc-900 border-white/[0.06]'
          }`}
        >
          <button
            onClick={() => setViewMode('editor')}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'editor'
                ? isLight
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'bg-zinc-800 text-amber-300'
                : isLight
                ? 'text-stone-600'
                : 'text-zinc-400'
            }`}
          >
            <FileText className="h-3 w-3 inline" />
            <span className="hidden sm:inline ml-1">Editor</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`hidden md:inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'split'
                ? isLight
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'bg-zinc-800 text-amber-300'
                : isLight
                ? 'text-stone-600'
                : 'text-zinc-400'
            }`}
          >
            <Columns className="h-3 w-3 mr-1 inline" />
            <span>Split</span>
          </button>

          <button
            onClick={() => setViewMode('preview')}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'preview'
                ? isLight
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'bg-zinc-800 text-amber-300'
                : isLight
                ? 'text-stone-600'
                : 'text-zinc-400'
            }`}
          >
            <Eye className="h-3 w-3 inline" />
            <span className="hidden sm:inline ml-1">Preview</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            title="Salin Markdown"
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors cursor-pointer ${
              isLight
                ? 'border-stone-200 bg-white text-stone-700'
                : 'border-white/[0.08] text-zinc-300'
            }`}
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin'}</span>
          </button>

          <button
            onClick={handleDownload}
            title="Unduh .md"
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors cursor-pointer ${
              isLight
                ? 'border-stone-200 bg-white text-stone-700'
                : 'border-white/[0.08] text-zinc-300'
            }`}
          >
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">.md</span>
          </button>

          <button
            onClick={() => onDistillDraft(markdown)}
            disabled={isDistilling || !markdown.trim()}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isLight
                ? 'border-amber-300 bg-amber-50 text-amber-800 shadow-2xs'
                : 'border-amber-500/30 bg-amber-500/15 text-amber-300'
            }`}
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span className="text-[11px]">{isDistilling ? '...' : 'Suling AI'}</span>
          </button>

          <button
            onClick={() => onSaveToVault(markdown)}
            className={`rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
              isLight
                ? 'bg-stone-800 text-white hover:bg-stone-900'
                : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-white/10'
            }`}
          >
            Simpan
          </button>
        </div>
      </div>

      {/* Editor & Preview Panes */}
      <div className="flex flex-1 overflow-hidden">
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div
            className={`relative flex flex-col ${
              viewMode === 'split'
                ? isLight
                  ? 'w-1/2 border-r border-stone-200/80'
                  : 'w-1/2 border-r border-white/[0.06]'
                : 'w-full'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Tuliskan isi kepalamu di sini dalam format Markdown..."
              spellCheck={false}
              className={`h-full w-full resize-none p-3.5 sm:p-6 font-mono text-xs sm:text-[13px] leading-relaxed focus:outline-none transition-colors ${
                isLight
                  ? 'bg-white text-stone-800 placeholder-stone-400 selection:bg-amber-200'
                  : 'bg-[#121316] text-zinc-200 placeholder-zinc-600 selection:bg-amber-500/20'
              }`}
            />
          </div>
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`flex flex-col overflow-y-auto p-3.5 sm:p-6 transition-colors ${
              viewMode === 'split' ? 'w-1/2' : 'w-full max-w-3xl mx-auto'
            } ${isLight ? 'bg-[#F9F8F5]' : 'bg-[#141518]/70'}`}
          >
            <div className="max-w-2xl">{renderPreview()}</div>
          </div>
        )}
      </div>

      {/* Footer Metrics Bar */}
      <div
        className={`flex items-center justify-between border-t px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs transition-colors shrink-0 ${
          isLight ? 'border-stone-200/80 bg-white text-stone-500' : 'border-white/[0.06] bg-[#141518] text-zinc-500'
        }`}
      >
        <div className="flex items-center gap-1.5 font-mono tabular-nums">
          <span>{wordsCount} kata</span>
          <span aria-hidden="true">·</span>
          <span>{charsCount} kar</span>
          <span aria-hidden="true">·</span>
          <span>~{readingTimeMinutes} mnt</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] sm:text-[11px] font-mono ${isLight ? 'text-amber-700 font-semibold' : 'text-amber-400'}`}>
            Obsidian Ready
          </span>
        </div>
      </div>
    </div>
  );
};
