'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Plus, Sparkles, BookOpen, Archive, Sun, Moon, Home } from 'lucide-react';
import { ambientSound } from '@/lib/ambientSound';

interface HeaderProps {
  currentTab: 'home' | 'companion' | 'manual' | 'vault';
  onSelectTab: (tab: 'home' | 'companion' | 'manual' | 'vault') => void;
  onNewSession: () => void;
  vaultCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onNewSession,
  vaultCount,
  theme,
  onToggleTheme,
}) => {
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(ambientSound.getIsPlaying());

  const toggleAmbient = () => {
    const active = ambientSound.toggle();
    setIsAmbientPlaying(active);
  };

  const isLight = theme === 'light';

  return (
    <>
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${
          isLight
            ? 'border-stone-200/80 bg-[#FAF9F5]/95 text-stone-800 backdrop-blur-md'
            : 'border-white/[0.08] bg-[#141518]/95 text-zinc-200 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-3 sm:px-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onSelectTab('home')}
              className="text-left group cursor-pointer flex items-center gap-2 focus:outline-none"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-sm transition-transform group-hover:scale-105 shrink-0 ${
                  isLight
                    ? 'bg-amber-100 text-amber-800 border border-amber-200/80 shadow-2xs'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                木
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-base sm:text-lg font-bold tracking-tight transition-colors leading-tight ${
                    isLight ? 'text-stone-900 group-hover:text-amber-700' : 'text-white group-hover:text-amber-300'
                  }`}
                >
                  Komorebi
                </span>
                <span
                  className={`hidden md:inline-block text-[11px] font-normal ${
                    isLight ? 'text-stone-500' : 'text-zinc-500'
                  }`}
                >
                  Second Brain Journal
                </span>
              </div>
            </button>
          </div>

          {/* Desktop / Tablet Navigation Segments */}
          <nav
            className={`hidden md:flex items-center gap-1 rounded-xl p-1 border transition-colors ${
              isLight ? 'bg-stone-100/90 border-stone-200/60' : 'bg-[#1a1b20] border-white/[0.06]'
            }`}
          >
            <button
              onClick={() => onSelectTab('home')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'home'
                  ? isLight
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'bg-[#25272e] text-amber-300 shadow-2xs font-semibold'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Home className="h-3.5 w-3.5 opacity-75" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => onSelectTab('companion')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'companion'
                  ? isLight
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'bg-[#25272e] text-amber-300 shadow-2xs font-semibold'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles
                className={`h-3.5 w-3.5 ${
                  currentTab === 'companion' ? (isLight ? 'text-amber-600' : 'text-amber-400') : 'opacity-70'
                }`}
              />
              <span>Teman Bicara</span>
            </button>

            <button
              onClick={() => onSelectTab('manual')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'manual'
                  ? isLight
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'bg-[#25272e] text-emerald-300 shadow-2xs font-semibold'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen
                className={`h-3.5 w-3.5 ${
                  currentTab === 'manual' ? (isLight ? 'text-emerald-600' : 'text-emerald-400') : 'opacity-70'
                }`}
              />
              <span>Tulis Bebas</span>
            </button>

            <button
              onClick={() => onSelectTab('vault')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'vault'
                  ? isLight
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'bg-[#25272e] text-purple-300 shadow-2xs font-semibold'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Archive
                className={`h-3.5 w-3.5 ${
                  currentTab === 'vault' ? (isLight ? 'text-purple-600' : 'text-purple-400') : 'opacity-70'
                }`}
              />
              <span>Arsip Vault</span>
              {vaultCount > 0 && (
                <span className="font-mono text-xs opacity-75">
                  ({vaultCount})
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              title={isLight ? 'Beralih ke Mode Malam' : 'Beralih ke Mode Terang'}
              aria-label="Toggle theme"
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border transition-all cursor-pointer shrink-0 ${
                isLight
                  ? 'border-stone-200 bg-white text-amber-700 hover:bg-stone-50 shadow-2xs'
                  : 'border-white/10 bg-[#1e2025] text-amber-300 hover:bg-white/[0.06]'
              }`}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Ambient Rain Audio */}
            <button
              onClick={toggleAmbient}
              title={isAmbientPlaying ? 'Matikan Suara Hujan' : 'Nyalakan Suara Hujan'}
              aria-label="Toggle ambient rain"
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer shrink-0 ${
                isAmbientPlaying
                  ? isLight
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  : isLight
                  ? 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  : 'border-white/10 bg-[#1e2025] text-zinc-400 hover:bg-white/[0.06]'
              }`}
            >
              {isAmbientPlaying ? (
                <>
                  <Volume2 className={`h-3.5 w-3.5 animate-pulse ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                  <span className="hidden lg:inline">Hujan Aktif</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 opacity-60" />
                  <span className="hidden lg:inline">Suara Hujan</span>
                </>
              )}
            </button>

            {/* Quick Sesi Baru Button */}
            <button
              onClick={onNewSession}
              className={`flex items-center gap-1 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer shrink-0 ${
                isLight
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-500/20'
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refleksi Baru</span>
              <span className="sm:hidden">Sesi Baru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb-friendly & Fixed) */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t pb-safe transition-colors duration-200 ${
          isLight
            ? 'bg-[#FAF9F5]/95 border-stone-200/90 text-stone-700 backdrop-blur-lg shadow-lg'
            : 'bg-[#141518]/95 border-white/[0.08] text-zinc-300 backdrop-blur-lg shadow-2xl'
        }`}
      >
        <div className="grid grid-cols-4 h-14 items-center justify-around px-1 max-w-lg mx-auto">
          <button
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              currentTab === 'home'
                ? isLight
                  ? 'text-amber-600 font-bold'
                  : 'text-amber-400 font-bold'
                : 'opacity-65 hover:opacity-100'
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="text-[10px] mt-0.5">Beranda</span>
          </button>

          <button
            onClick={() => onSelectTab('companion')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              currentTab === 'companion'
                ? isLight
                  ? 'text-amber-600 font-bold'
                  : 'text-amber-400 font-bold'
                : 'opacity-65 hover:opacity-100'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] mt-0.5">Teman Suara</span>
          </button>

          <button
            onClick={() => onSelectTab('manual')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              currentTab === 'manual'
                ? isLight
                  ? 'text-emerald-600 font-bold'
                  : 'text-emerald-400 font-bold'
                : 'opacity-65 hover:opacity-100'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span className="text-[10px] mt-0.5">Tulis Bebas</span>
          </button>

          <button
            onClick={() => onSelectTab('vault')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative ${
              currentTab === 'vault'
                ? isLight
                  ? 'text-purple-600 font-bold'
                  : 'text-purple-400 font-bold'
                : 'opacity-65 hover:opacity-100'
            }`}
          >
            <Archive className="h-4 w-4" />
            <span className="text-[10px] mt-0.5">Vault</span>
            {vaultCount > 0 && (
              <span className="absolute top-1 right-5 flex h-2 w-2 rounded-full bg-purple-500" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
