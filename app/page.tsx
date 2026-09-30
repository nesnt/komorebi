'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HomePage } from '@/components/HomePage';
import { CompanionMode } from '@/components/CompanionMode';
import { ManualEditor } from '@/components/ManualEditor';
import { VaultArchive } from '@/components/VaultArchive';
import { DistillModal } from '@/components/DistillModal';
import { JournalEntry, JournalMetadata, ChatMessage } from '@/types/journal';
import { fetchEntries, saveEntry, deleteEntry, getLocalEntries } from '@/lib/storage';
import { formatObsidianMarkdown } from '@/lib/obsidian';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'home' | 'companion' | 'manual' | 'vault'>('home');
  const [vaultEntries, setVaultEntries] = useState<JournalEntry[]>([]);
  const [isDistilling, setIsDistilling] = useState(false);
  const [activeModalEntry, setActiveModalEntry] = useState<
    (JournalMetadata & Partial<JournalEntry>) | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme state: defaults to 'light' for warm paper look
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('komorebi_theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('komorebi_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#121316';
        document.body.style.color = '#e4e4e7';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#FAF9F5';
        document.body.style.color = '#292524';
      }
    } catch (_) {}
  }, [theme]);

  // Load vault entries on initial mount from API/PostgreSQL (with localStorage fallback)
  useEffect(() => {
    let isMounted = true;
    // Initial fast load from cache
    setVaultEntries(getLocalEntries());

    fetchEntries().then((entries) => {
      if (isMounted && entries && entries.length > 0) {
        setVaultEntries(entries);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Suling percakapan suara dari Companion Mode
  const handleDistillConversation = async (messages: ChatMessage[]) => {
    if (messages.length <= 1) {
      showToast('Belum ada cukup obrolan untuk disuling. Ceritakan harimu terlebih dahulu.');
      return;
    }

    setIsDistilling(true);
    try {
      const response = await fetch('/api/companion/distill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: messages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error (${response.status})`);
      }

      const distilled: JournalMetadata & { markdownContent: string } = await response.json();

      const newEntry: Partial<JournalEntry> & JournalMetadata = {
        ...distilled,
        id: `entry-${Date.now()}`,
        createdAt: Date.now(),
        sourceMode: 'voice',
        rawTranscript: messages
          .map((m) => `${m.role === 'user' ? 'Kamu' : 'Komorebi'}: ${m.text}`)
          .join('\n'),
        markdownContent:
          distilled.markdownContent ||
          formatObsidianMarkdown(
            distilled,
            messages.map((m) => `${m.role === 'user' ? 'Kamu' : 'Komorebi'}: ${m.text}`).join('\n')
          ),
      };

      setActiveModalEntry(newEntry);
      setIsModalOpen(true);
    } catch (err: any) {
      console.error('Distill error:', err);
      showToast(err.message || 'Gagal menyuling percakapan ke format Obsidian.');
    } finally {
      setIsDistilling(false);
    }
  };

  // Suling draf manual dari Manual Editor
  const handleDistillManualDraft = async (draftText: string) => {
    if (!draftText.trim()) {
      showToast('Tuliskan draf pemikiranmu terlebih dahulu sebelum disuling.');
      return;
    }

    setIsDistilling(true);
    try {
      const response = await fetch('/api/companion/distill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manualNotes: draftText,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error (${response.status})`);
      }

      const distilled: JournalMetadata & { markdownContent: string } = await response.json();

      const newEntry: Partial<JournalEntry> & JournalMetadata = {
        ...distilled,
        id: `entry-${Date.now()}`,
        createdAt: Date.now(),
        sourceMode: 'manual',
        rawTranscript: draftText,
        markdownContent: distilled.markdownContent || formatObsidianMarkdown(distilled),
      };

      setActiveModalEntry(newEntry);
      setIsModalOpen(true);
    } catch (err: any) {
      console.error('Distill draft error:', err);
      showToast(err.message || 'Gagal menyuling draf teks ke format Obsidian.');
    } finally {
      setIsDistilling(false);
    }
  };

  // Simpan manual langsung tanpa suling AI
  const handleSaveManualDirectly = async (markdown: string) => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const titleMatch = markdown.match(/^#\s+(.*)$/m) || markdown.match(/title:\s*["']?(.*?)["']?$/m);
    const title = titleMatch ? titleMatch[1].trim() : `Refleksi Manual ${today}`;

    const newEntry: JournalEntry = {
      id: `manual-${Date.now()}`,
      createdAt: Date.now(),
      title,
      date: today,
      time,
      tags: ['daily-journal', 'manual-mode', 'second-brain'],
      dominantEmotion: 'Reflektif Mandiri',
      moodScore: 4,
      energyLevel: 'Sedang',
      summary: markdown.slice(0, 150).replace(/[#*`_>]/g, '').trim() + '...',
      keyInsights: ['Catatan refleksi langsung ditulis tangan dalam format Markdown murni.'],
      actionItems: [],
      connectedConcepts: ['Second Brain'],
      sourceMode: 'manual',
      markdownContent: markdown,
    };

    const updated = await saveEntry(newEntry);
    setVaultEntries(updated);
    showToast('Catatan Markdown tersimpan ke Vault & Database.');
  };

  // Simpan hasil suling ke vault
  const handleSaveAndArchive = async (entry: JournalEntry) => {
    const updated = await saveEntry(entry);
    setVaultEntries(updated);
    showToast('Catatan berhasil ditambahkan ke Arsip Vault.');
  };

  // Hapus entry dari vault
  const handleDeleteEntry = async (id: string) => {
    const updated = await deleteEntry(id);
    setVaultEntries(updated);
    showToast('Catatan dihapus dari vault.');
  };

  // Buka entry dari vault
  const handleSelectEntryToView = (entry: JournalEntry) => {
    setActiveModalEntry(entry);
    setIsModalOpen(true);
  };

  const handleStartVoiceSession = () => {
    setActiveTab('companion');
    showToast('Membuka sesi obrolan suara interaktif.');
  };

  const handleStartManualSession = () => {
    setActiveTab('manual');
    showToast('Membuka editor Markdown.');
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`flex h-screen w-screen flex-col overflow-hidden transition-colors duration-200 ${
        isLight ? 'bg-[#FAF9F5] text-stone-800' : 'bg-[#121316] text-[#e4e4e7]'
      }`}
    >
      {/* Top Header with Home Tab */}
      <Header
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        onNewSession={handleStartVoiceSession}
        vaultCount={vaultEntries.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && (
          <HomePage
            onStartVoice={handleStartVoiceSession}
            onStartManual={handleStartManualSession}
            onOpenVault={() => setActiveTab('vault')}
            onSelectEntry={handleSelectEntryToView}
            recentEntries={vaultEntries}
            theme={theme}
          />
        )}

        {activeTab === 'companion' && (
          <CompanionMode
            onDistill={handleDistillConversation}
            isDistilling={isDistilling}
            theme={theme}
          />
        )}

        {activeTab === 'manual' && (
          <ManualEditor
            onDistillDraft={handleDistillManualDraft}
            isDistilling={isDistilling}
            onSaveToVault={handleSaveManualDirectly}
            theme={theme}
          />
        )}

        {activeTab === 'vault' && (
          <VaultArchive
            entries={vaultEntries}
            onDeleteEntry={handleDeleteEntry}
            onSelectEntryToView={handleSelectEntryToView}
            onOpenNewSession={handleStartVoiceSession}
            theme={theme}
          />
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2.5 text-xs font-medium shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 border ${
              isLight
                ? 'border-amber-200 bg-white/95 text-stone-800'
                : 'border-amber-500/30 bg-[#16171b]/95 text-amber-200'
            }`}
          >
            <span>{toastMessage}</span>
          </div>
        )}
      </main>

      {/* Obsidian Distill & Export Modal */}
      {activeModalEntry && (
        <DistillModal
          entry={activeModalEntry}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveAndArchive={handleSaveAndArchive}
          theme={theme}
        />
      )}
    </div>
  );
}
