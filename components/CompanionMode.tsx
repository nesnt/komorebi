'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { ChatMessage, CompanionPrompt } from '@/types/journal';

interface CompanionModeProps {
  onDistill: (transcript: ChatMessage[]) => void;
  isDistilling: boolean;
  theme: 'light' | 'dark';
}

const FRIENDLY_PRESET_PROMPTS: CompanionPrompt[] = [
  {
    id: 'evening-unwind',
    title: '🌾 Melepas lelah hari ini',
    category: 'Relaksasi',
    starterMessage: 'Hari ini cukup panjang ya... Apa momen yang paling menguras energimu, dan bagaimana perasaanmu sekarang?',
    systemContext: 'Fokus pada kehangatan dan validasi rasa lelah, melepaskan ketegangan kerja, dan menghargai usaha pengguna dengan bahasa santai dan bersahabat.',
  },
  {
    id: 'overthinking-untangle',
    title: '🧶 Mengurai benang kusut',
    category: 'Kejelasan',
    starterMessage: 'Pikiran apa yang belakangan ini sering muter-muter di kepala? Ceritakan santai aja, nggak perlu teratur.',
    systemContext: 'Bantu pengguna mengurai pikiran yang menumpuk tanpa menghakimi, dengan empati dan tenang.',
  },
  {
    id: 'small-wins',
    title: '✨ Kemenangan kecil hari ini',
    category: 'Apresiasi',
    starterMessage: 'Sering kali kita lupa menghargai diri sendiri. Ada satu hal kecil—sekecil apapun—yang bikin kamu tersenyum atau lega hari ini?',
    systemContext: 'Ajak pengguna melihat hal-hal sederhana yang berhasil dilalui dengan penuh rasa syukur.',
  },
  {
    id: 'brain-dump',
    title: '☕ Curhat bebas tanpa filter',
    category: 'Bebas',
    starterMessage: 'Tumpahkan semua yang ada di kepalamu saat ini. Ruang ini tenang dan privat hanya untukmu.',
    systemContext: 'Terima semua uneg-uneg atau ide acak dan bantu merangkum inti sari perasaan pengguna.',
  },
];

export const CompanionMode: React.FC<CompanionModeProps> = ({
  onDistill,
  isDistilling,
  theme,
}) => {
  const isLight = theme === 'light';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: 'Halo... Tarik napas santai ya. Ruang ini hening untukmu. Bagaimana harimu berjalan, atau ada hal yang lagi terasa mengganjal di pikiran?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const [activePrompt, setActivePrompt] = useState<CompanionPrompt | null>(null);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const [transcriptInterim, setTranscriptInterim] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, transcriptInterim, isAiThinking]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'id-ID';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTrans += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (finalTrans) {
          setInputText((prev) => (prev ? `${prev} ${finalTrans}` : finalTrans).trim());
          setTranscriptInterim('');
        } else {
          setTranscriptInterim(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Izin mikrofon belum aktif. Silakan izinkan akses mikrofon di browser.');
        } else if (event.error !== 'no-speech') {
          setErrorMessage(`Mikrofon: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition init failed:', e);
      setSpeechRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!isVoiceOutputEnabled) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[*#_`>]/g, '')
        .replace(/\[\[(.*?)\]\]/g, '$1');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(
        (v) => v.lang.startsWith('id') || v.lang.includes('ID') || v.name.includes('Indonesian')
      );
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (!speechRecognitionSupported) {
      setErrorMessage('Browser ini tidak mendukung speech-to-text. Kamu bisa langsung mengetik pesan di bawah.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (inputText.trim()) {
        sendMessage(inputText);
      }
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAiSpeaking(false);

      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setErrorMessage(null);
      } catch (err: any) {
        console.warn('Recording start error:', err);
        setIsListening(false);
      }
    }
  };

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isAiThinking) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText('');
    setTranscriptInterim('');
    setIsAiThinking(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, text: m.text })),
          promptTemplate: activePrompt?.systemContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      const aiReply = data.text || 'Aku mendengarkanmu... Coba ceritakan lebih lanjut apa yang sedang kamu rasakan.';

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
      speakText(aiReply);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err.message || 'Gagal tersambung dengan teman AI. Silakan coba lagi.');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleApplyPrompt = (prompt: CompanionPrompt) => {
    setActivePrompt(prompt);
    const starterMsg: ChatMessage = {
      id: `prompt-${Date.now()}`,
      role: 'model',
      text: prompt.starterMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, starterMsg]);
    speakText(prompt.starterMessage);
  };

  const handleReset = () => {
    if (confirm('Mulai obrolan refleksi dari awal?')) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAiSpeaking(false);
      setMessages([
        {
          id: 'init-fresh',
          role: 'model',
          text: 'Mari kita mulai lembaran baru. Ceritakan santai apa saja yang sedang terpikirkan.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setActivePrompt(null);
      setInputText('');
      setTranscriptInterim('');
      setErrorMessage(null);
    }
  };

  return (
    <div
      className={`flex h-full flex-col transition-colors duration-200 pb-14 md:pb-0 ${
        isLight ? 'bg-[#FAF9F5]' : 'bg-[#121316]'
      }`}
    >
      {/* Top Status & Controls Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 sm:px-6 transition-colors ${
          isLight ? 'border-stone-200/80 bg-white/70' : 'border-white/[0.06] bg-[#141518]'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isListening
                  ? 'animate-ping bg-amber-500'
                  : isAiSpeaking
                  ? 'animate-ping bg-emerald-500'
                  : isAiThinking
                  ? 'animate-ping bg-violet-500'
                  : isLight
                  ? 'bg-stone-300'
                  : 'bg-zinc-600'
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                isListening
                  ? 'bg-amber-500'
                  : isAiSpeaking
                  ? 'bg-emerald-500'
                  : isAiThinking
                  ? 'bg-violet-500'
                  : isLight
                  ? 'bg-stone-400'
                  : 'bg-zinc-500'
              }`}
            />
          </span>
          <span className={`text-[11px] sm:text-xs font-medium truncate max-w-[130px] sm:max-w-none ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
            {isListening
              ? 'Mendengar suara...'
              : isAiSpeaking
              ? 'Komorebi berbicara...'
              : isAiThinking
              ? 'Menenun ide...'
              : 'Siap diajak ngobrol'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Suara AI switch */}
          <button
            onClick={() => {
              if (isAiSpeaking && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                setIsAiSpeaking(false);
              }
              setIsVoiceOutputEnabled(!isVoiceOutputEnabled);
            }}
            title={isVoiceOutputEnabled ? 'Matikan Suara AI' : 'Nyalakan Suara AI'}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
              isVoiceOutputEnabled
                ? isLight
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                : isLight
                ? 'border-stone-200 bg-white text-stone-500'
                : 'border-white/[0.08] text-zinc-400'
            }`}
          >
            {isVoiceOutputEnabled ? (
              <Volume2 className={`h-3.5 w-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
            ) : (
              <VolumeX className="h-3.5 w-3.5 opacity-60" />
            )}
            <span className="hidden sm:inline">{isVoiceOutputEnabled ? 'Suara On' : 'Mute'}</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset Obrolan"
            className={`flex items-center gap-1 rounded-lg border p-1 sm:px-2.5 sm:py-1 text-xs transition-colors cursor-pointer ${
              isLight
                ? 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.04]'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Suling ke Obsidian */}
          <button
            onClick={() => onDistill(messages)}
            disabled={isDistilling || messages.length <= 1}
            className={`flex items-center gap-1 rounded-xl px-2.5 sm:px-3.5 py-1 text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isLight
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">{isDistilling ? 'Menyuling...' : 'Suling ke Obsidian'}</span>
            <span className="sm:hidden">{isDistilling ? '...' : 'Suling .md'}</span>
          </button>
        </div>
      </div>

      {/* Main Friendly Visual Stage */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Friendly Sun / Zen Breathing Orb */}
        <div className="relative flex flex-col items-center justify-center pt-3 sm:pt-6 pb-2 shrink-0">
          <div className="relative flex items-center justify-center">
            {/* Outer halo */}
            <div
              className={`absolute h-28 w-28 sm:h-40 sm:w-40 rounded-full transition-all duration-700 blur-xl ${
                isListening
                  ? isLight
                    ? 'bg-amber-400/35 scale-120'
                    : 'bg-amber-500/20 scale-125'
                  : isAiSpeaking
                  ? isLight
                    ? 'bg-emerald-400/30 scale-120 animate-pulse'
                    : 'bg-emerald-500/20 scale-125 animate-pulse'
                  : isAiThinking
                  ? isLight
                    ? 'bg-violet-400/30 scale-110'
                    : 'bg-purple-500/20 scale-110'
                  : isLight
                  ? 'bg-amber-200/50 scale-100'
                  : 'bg-amber-500/10 scale-100'
              }`}
            />

            {/* Inner ring */}
            <div
              className={`absolute h-20 w-20 sm:h-28 sm:w-28 rounded-full border transition-all duration-500 ${
                isListening
                  ? isLight
                    ? 'border-amber-400/70 bg-amber-100/70 animate-friendly-breath-fast'
                    : 'border-amber-400/40 bg-amber-500/10 animate-friendly-breath-fast'
                  : isAiSpeaking
                  ? isLight
                    ? 'border-emerald-400/70 bg-emerald-50/80 animate-friendly-breath'
                    : 'border-emerald-400/40 bg-emerald-500/10 animate-friendly-breath'
                  : isAiThinking
                  ? isLight
                    ? 'border-violet-400/70 bg-violet-50/80 animate-friendly-breath'
                    : 'border-purple-400/40 bg-purple-500/10 animate-friendly-breath'
                  : isLight
                  ? 'border-amber-200/80 bg-amber-50/60 animate-friendly-breath'
                  : 'border-white/10 bg-white/[0.02] animate-friendly-breath'
              }`}
            />

            {/* Core Mic Button */}
            <button
              onClick={toggleRecording}
              aria-label={isListening ? 'Selesai bicara' : 'Mulai bicara'}
              className={`relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full transition-all duration-300 shadow-md cursor-pointer ${
                isListening
                  ? isLight
                    ? 'bg-amber-500 text-white scale-105 shadow-amber-300/80'
                    : 'bg-amber-500 text-stone-950 scale-105 shadow-amber-500/60'
                  : isAiSpeaking
                  ? isLight
                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                    : 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300'
                  : isAiThinking
                  ? isLight
                    ? 'bg-violet-500 text-white animate-pulse'
                    : 'bg-purple-500/20 border border-purple-400/50 text-purple-300 animate-pulse'
                  : isLight
                  ? 'bg-white hover:bg-amber-50 border-2 border-amber-300 text-amber-700 hover:scale-105 shadow-sm'
                  : 'bg-[#1e2025] hover:bg-[#25282f] border border-white/15 text-amber-300'
              }`}
            >
              {isListening ? (
                <div className="flex flex-col items-center">
                  <MicOff className="h-5 w-5 sm:h-6 sm:w-6 animate-bounce" />
                  <span className="text-[9px] sm:text-[10px] font-bold mt-0.5 tracking-wide">Selesai</span>
                </div>
              ) : isAiSpeaking ? (
                <div className="flex items-center gap-1">
                  <span className="h-3 w-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-5 w-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-1 bg-white rounded-full animate-bounce" />
                </div>
              ) : isAiThinking ? (
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
              ) : (
                <div className="flex flex-col items-center">
                  <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-[9px] sm:text-[10px] font-semibold mt-0.5">Bicara</span>
                </div>
              )}
            </button>
          </div>

          <div className="mt-2 text-center px-4">
            <p className={`text-[11px] sm:text-xs font-medium ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
              {isListening ? (
                <span className={isLight ? 'text-amber-700 font-semibold' : 'text-amber-300'}>
                  Sedang mendengar... Tekan lagi jika selesai
                </span>
              ) : isAiSpeaking ? (
                <span className={isLight ? 'text-emerald-700 font-semibold' : 'text-emerald-300'}>
                  Mendengarkan jawaban Komorebi...
                </span>
              ) : (
                <span>Ketuk tombol untuk bersuara, atau ketik di bawah</span>
              )}
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div
            className={`mx-3 sm:mx-6 mb-2 flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs border ${
              isLight
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span className="flex-1 text-[11px] sm:text-xs">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="opacity-70 hover:opacity-100 text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto px-3 py-2 sm:px-6 space-y-3">
          <div className="mx-auto max-w-2xl space-y-3">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex items-center gap-2 mb-1 px-1 text-[10px] sm:text-[11px] ${
                      isLight ? 'text-stone-400' : 'text-zinc-500'
                    }`}
                  >
                    <span className="font-medium">{isUser ? 'Kamu' : 'Komorebi'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`relative max-w-[90%] sm:max-w-[78%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed transition-colors shadow-2xs ${
                      isUser
                        ? isLight
                          ? 'bg-amber-100/80 border border-amber-200/80 text-stone-900 rounded-br-xs'
                          : 'bg-amber-500/20 border border-amber-500/30 text-amber-50 rounded-br-xs'
                        : isLight
                        ? 'bg-white border border-stone-200/80 text-stone-800 rounded-bl-xs'
                        : 'bg-[#1a1b20] border border-white/[0.08] text-zinc-200 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {isListening && transcriptInterim && (
              <div className="flex flex-col items-end">
                <div className="text-[10px] text-amber-600 mb-1 px-1">Mendengar...</div>
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm italic border ${
                    isLight
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}
                >
                  &ldquo;{transcriptInterim}...&rdquo;
                </div>
              </div>
            )}

            {isAiThinking && (
              <div className="flex flex-col items-start">
                <div className="text-[10px] text-violet-600 mb-1 px-1">Komorebi</div>
                <div
                  className={`rounded-2xl px-3.5 py-2 text-xs flex items-center gap-2 border ${
                    isLight
                      ? 'bg-white border-violet-200 text-stone-600'
                      : 'bg-[#1a1b20] border-purple-500/30 text-zinc-300'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-ping" />
                  <span className="italic">Sedang merenungkan pikiranmu...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        </div>

        {/* Suggestion Chips */}
        <div
          className={`border-t px-3 py-2 sm:px-6 transition-colors ${
            isLight ? 'border-stone-200/70 bg-stone-50/80' : 'border-white/[0.05] bg-[#141518]/60'
          }`}
        >
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className={`text-[10px] sm:text-[11px] font-medium shrink-0 flex items-center gap-1 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Pemicu:</span>
              </span>
              {FRIENDLY_PRESET_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handleApplyPrompt(prompt)}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                    isLight
                      ? 'border-stone-200 bg-white text-stone-700 hover:border-amber-300 shadow-2xs'
                      : 'border-white/[0.08] bg-[#1a1b20] text-zinc-300 hover:border-amber-500/30'
                  }`}
                >
                  <span>{prompt.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div
          className={`border-t p-2.5 sm:p-4 transition-colors ${
            isLight ? 'border-stone-200/80 bg-white' : 'border-white/[0.08] bg-[#141518]'
          }`}
        >
          <div className="mx-auto max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputText);
              }}
              className="relative flex items-center gap-1.5 sm:gap-2"
            >
              <button
                type="button"
                onClick={toggleRecording}
                title={isListening ? 'Hentikan merekam' : 'Bicara lewat suara'}
                className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'border-amber-400 bg-amber-500 text-white animate-pulse'
                    : isLight
                    ? 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-amber-50'
                    : 'border-white/10 bg-white/[0.04] text-zinc-400'
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? 'Mendengar suaramu...'
                    : 'Ketik apa yang ada di pikiranmu...'
                }
                disabled={isAiThinking}
                className={`flex-1 rounded-xl border px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-all focus:outline-none disabled:opacity-50 ${
                  isLight
                    ? 'border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-amber-400 focus:bg-white'
                    : 'border-white/10 bg-[#191a1f] text-zinc-100 placeholder-zinc-500 focus:border-amber-500/50'
                }`}
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isAiThinking}
                aria-label="Kirim pesan"
                className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl transition-all active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  isLight
                    ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-xs'
                    : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
