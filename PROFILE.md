
# 🌿 Profil Aplikasi: Komorebi (木漏れ日)
> **Jurnal Refleksi & Second Brain (Next.js Edition)**  
> *Menjembatani pikiran acak, refleksi harian, dan sistem manajemen pengetahuan Obsidian.*

---

## 📌 Ringkasan Eksekutif (Executive Summary)

| Parameter | Detail |
| :--- | :--- |
| **Nama Aplikasi** | **Komorebi** (木漏れ日) |
| **Versi** | `0.1.0` |
| **Tipe Aplikasi** | Fullstack Web Application (Personal Knowledge Management / Second Brain Companion) |
| **Arsitektur** | Next.js 15 (App Router), React 19, TypeScript, Prisma ORM, PostgreSQL Lokal |
| **Integrasi AI** | Google Gemini AI (`@google/genai` v2.4.0) |
| **Format Output** | Markdown standar Obsidian (`YAML frontmatter`, `[[Wikilinks]]`, `Obsidian Callouts`, `Checklist`) |
| **Target Pengguna** | Praktisi *journaling*, pengguna Obsidian, pencatat *Second Brain*, profesional/mahasiswa yang ingin mengurai beban mental (*mental unburdening*) |

---

## 🍃 Filosofi & Konsep di Balik Nama

Kata **"Komorebi" (木漏れ日)** dalam bahasa Jepang mendeskripsikan:
> *"Sinar matahari yang menyaring menembus celah-celah dedaunan pohon."*

Filosofi ini diwujudkan dalam aplikasi melalui:
1. **Penerang Pikiran Keruh**: Mengurai pikiran yang ruwet, lelah, atau tidak beraturan di penghujung hari menjadi butiran hikmah yang jernih.
2. **Suasana Zen & Tenang**: Visual bernuansa sage-emerald yang menyejukkan mata serta audio generator suara hujan *pink-noise* dan frekuensi hening 136.1 Hz.
3. **Tanpa Tekanan (*Zero Friction*)**: Pengguna tidak dipaksa langsung menulis catatan rapi; mereka cukup bercerita/mengobrol dengan AI atau menuangkan draf mentah, lalu sistem yang menyulapnya menjadi format terstruktur.

---

## 🎯 Masalah yang Diselesaikan & Solusi

### 1. *The Blank Page Syndrome* (Sindrom Kertas Kosong)
- **Masalah**: Banyak orang ingin *journaling*, namun sering kali bingung harus mulai menulis apa ketika membuka editor kosong.
- **Solusi Komorebi**: **Voice & Text Companion Mode**. AI berperan sebagai teman refleksi hangat yang mengajukan pertanyaan reflektif memancing pemikiran tanpa menghakimi.

### 2. Beban Mengkategorikan & Menata Catatan
- **Masalah**: Catatan harian sering berserakan dan sulit dihubungkan ke jejaring pengetahuan (*knowledge graph*).
- **Solusi Komorebi**: **AI Distillation**. Sekali klik, AI mengekstraksi inti pembelajaran, emosi dominan, tingkat energi, *action items*, dan membuat rekomendasi `[[Wikilinks]]` otomatis untuk sistem Second Brain.

### 3. Kompatibilitas Ekosistem Obsidian
- **Masalah**: Pengguna Obsidian membutuhkan format catatan Markdown dengan *frontmatter* yang valid dan tautan dwiarah (*bi-directional links*).
- **Solusi Komorebi**: Integrasi instan via deep link `obsidian://new`, tombol salin cepat, dan download file `.md` langsung ke *vault*.

---

## ⚡ Fitur Utama & Fungsionalitas

### 1. 🎙️ Mode Teman Bicara (Voice / Text Companion)
- Obrolan refleksi interaktif di malam hari atau sela kesibukan.
- Dukungan *Speech-to-Text* (input suara langsung) dan *Text-to-Speech* (suara tanggapan balik).
- Persona AI empatik, bijak, dan berkesadaran penuh (*mindful*).
- Prompt pemantik yang dapat dipilih sesuai topik (Refleksi Harian, Mengurai Cemas, Syukur & Pencapaian, Pengambilan Keputusan).

### 2. ✍️ Editor Markdown Manual
- Editor teks minimalis dengan tipografi ramah koding (*JetBrains Mono*).
- Fitur *Live Split-Screen Preview*.
- Tombol pintas untuk menyisipkan sintaks Obsidian:
  - Callouts (`> [!note]`, `> [!tip]`, `> [!quote]`, `> [!warning]`)
  - Wikilinks (`[[Konsep]]`)
  - Checklist interaktif (`- [ ] Rencana`)
  - Tagar (`#refleksi`)

### 3. 🔮 Penyulingan Cerdas (AI Distill to Obsidian)
- Memproses seluruh transkrip percakapan atau catatan draf menjadi entri Obsidian lengkap:
  - **YAML Frontmatter**: `title`, `date`, `time`, `tags`, `mood`, `mood_score`, `energy_level`.
  - **Kutipan Introspeksi**: Callout ringkasan hari.
  - **Hikmah & Pembelajaran**: Poin-poin wawasan utama.
  - **Rencana Tindak Lanjut**: To-do checklist.
  - **Second Brain Wikilinks**: Konsep yang dapat dihubungkan ke catatan lain.
  - **Arsip Mentah**: Opsi melipat transkrip asli dalam tag `<details>`.

### 4. 📓 Arsip Vault & Manajemen Entri
- Menyimpan riwayat catatan secara aman di database PostgreSQL lokal.
- Fitur filter berdasarkan tag, pencarian teks, dan penjelajah konsep *wikilinks*.
- Tombol ekspor instan:
  - 📥 **Download `.md`**
  - 📋 **Copy Markdown**
  - 🔗 **Buka di Obsidian App** (`obsidian://new?vault=...`)

### 5. 🌧️ Ambient Sound Generator (Hujan Zen)
- Generator audio hujan alami berbasis **Web Audio API** sintetis (tanpa perlu streaming file audio besar eksternal).
- Kombinasi *pink noise*, filter resonansi tetesan air, dan frekuensi gelombang tenang.

---

## 🏗️ Arsitektur Teknologi & Dependensi

```text
               +-------------------------------------------------------+
               |                  Browser (Klien Web)                  |
               |  Next.js 15 App Router + React 19 + Tailwind CSS v4   |
               +---------------------------+---------------------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
            [REST API Routes]                             [Web Audio API]
         /api/entries & /api/companion                   Ambient Rain Sound
                    |
      +-------------+-------------+
      |                           |
[Prisma ORM]             [Google Gemini AI]
      |                   @google/genai SDK
[PostgreSQL Lokal]                |
komorebi_db / journal_entries     +---> Distilasi & Dialog AI
```

### Rincian Dependensi Utama:
- **Framework Web**: [Next.js](https://nextjs.org/) 15.1.7 (React 19, App Router)
- **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/) 5.7
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4.0 + PostCSS
- **ORM & Database**: [Prisma ORM](https://www.prisma.io/) v6.4 + PostgreSQL (Lokal)
- **Kecerdasan Buatan**: [@google/genai](https://www.npmjs.com/package/@google/genai) v2.4 (Gemini 2.5 Flash / Pro)
- **Komponen Ikon**: [Lucide React](https://lucide.dev/)
- **Efek Interaktif**: Canvas Confetti (untuk perayaan penyelesaian refleksi)

---

## 🗄️ Model Data (Prisma Schema)

Tabel `journal_entries` di PostgreSQL didefinisikan sebagai berikut:

```prisma
model JournalEntry {
  id                String   @id @default(cuid())
  title             String
  date              String
  time              String?
  tags              String[] @default([])
  dominantEmotion   String   @default("Reflektif")
  moodScore         Int      @default(3)
  energyLevel       String   @default("Sedang")
  summary           String   @db.Text
  keyInsights       String[] @default([])
  actionItems       String[] @default([])
  connectedConcepts String[] @default([])
  sourceMode        String   @default("voice") // 'voice' | 'manual'
  rawTranscript     String?  @db.Text
  markdownContent   String   @db.Text
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("journal_entries")
}
```

---

## 🛡️ Keamanan, Privasi, & Offline Resilience

1. **Privasi Tingkat Lokal**:
   - Seluruh catatan tersimpan di instans PostgreSQL milik pengguna di mesin lokal (`localhost`), bukan di server cloud pihak ketiga.
2. **Offline Fallback Storage**:
   - Lapisan `lib/storage.ts` memiliki mekanisme *fail-safe* otomatis. Jika database PostgreSQL lokal sedang mati atau belum dikonfigurasi, aplikasi tetap dapat beroperasi normal menggunakan penyimpanan lokal browser (`localStorage`).
3. **Kerahasiaan API Key**:
   - Kunci API Google Gemini disimpan aman di variabel lingkungan server (`.env`) dan hanya dipanggil via Route Handlers sisi server (`/api/companion/*`), sehingga tidak bocor ke browser pengguna.

---

## 🚀 Panduan Ringkas Menjalankan Aplikasi

1. **Pasang Paket Dependensi**:
   ```bash
   npm install
   ```
2. **Konfigurasi Lingkungan (`.env`)**:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/komorebi_db?schema=public"
   GEMINI_API_KEY="AIzaSy..."
   ```
3. **Sinkronisasi Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
   Akses di [http://localhost:3000](http://localhost:3000).

---

## 🗺️ Roadmap & Ide Pengembangan Masa Depan

- [ ] **Sinkronisasi Langsung ke Obsidian Vault**: Integrasi file-system API untuk menyimpan langsung ke folder `.obsidian/vault`.
- [ ] **Knowledge Graph Visualization**: Visualisasi grafik interaktif relasi antarentri dan `[[Wikilinks]]` langsung di browser.
- [ ] **Lokal LLM Provider**: Opsi integrasi dengan Ollama / Llama 3 untuk pengguna yang menginginkan 100% pemrosesan AI lokal tanpa koneksi internet.
- [ ] **Analitik Emosi & Tren Mingguan**: Visualisasi grafik fluktuasi suasana hati (*mood score*) dan energi sepanjang bulan.
