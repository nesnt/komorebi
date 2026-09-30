# 🌿 Komorebi - Jurnal Refleksi & Second Brain (Next.js Edition)

Aplikasi jembatan interaktif antara pikiran acak dengan sistem pencatatan **Obsidian**, ditenagai oleh **Next.js 15 (App Router)**, **Prisma ORM**, **PostgreSQL Lokal**, **Tailwind CSS v4**, dan **Google Gemini AI**.

---

## ✨ Fitur Utama

- 🎙️ **Mode Teman Bicara (Voice Companion)**:
  - Obrolan refleksi *voice-to-voice* atau ketik santai di penghujung hari.
  - Persona AI zen, hangat, dan berempati untuk mengatasi *writer's block* dan kelelahan mental.
- ✍️ **Editor Markdown Manual**:
  - Editor minimalis dengan tipografi *JetBrains Mono*, *Live Split Preview*, dan tombol pintas callouts Obsidian.
- 🔮 **Penyulingan Otomatis (AI Distill to Obsidian)**:
  - Menyuling percakapan atau draf bebas menjadi catatan Obsidian lengkap dengan YAML frontmatter, [[Wikilinks]], tag, dan task checkbox.
- 📓 **Arsip Vault & Second Brain**:
  - Pelacakan konsep wikilinks, filter tag, ekspor langsung ke file `.md`, dan deep-link `obsidian://new`.
- 🗄️ **Penyimpanan Database PostgreSQL & Prisma ORM**:
  - Seluruh catatan tersimpan terstruktur di database PostgreSQL lokal Anda melalui Prisma ORM, dengan *fallback* aman ke penyimpanan lokal (browser cache).
- 🌧️ **Suara Hujan Zen (Ambient Rain)**:
  - Generator suara hujan pink-noise dan frekuensi hening 136.1 Hz langsung via Web Audio API.

---

## 🚀 Panduan Memulai Cepat

### 1. Prasyarat
- **Node.js** (v18.x, v20.x, atau v24.x)
- **PostgreSQL** aktif di komputer lokal Anda (misal via PostgreSQL service, Docker, atau Postgres.app).

---

### 2. Instalasi Dependensi
Buka terminal di folder project `komorebi`:
```bash
npm install
```

---

### 3. Konfigurasi Environment (`.env`)
Salin atau edit file `.env` di root project:

```env
# Koneksi Database PostgreSQL Lokal
# Format: postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]?schema=[SCHEMA]
DATABASE_URL="postgresql://postgres:password123@localhost:5432/komorebi_db?schema=public"

# Google Gemini API Key (Dapatkan gratis di https://aistudio.google.com/app/apikey)
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Port aplikasi
PORT=3000
NODE_ENV=development
```

> [!NOTE]
> Ganti `postgres` dan `password123` dengan username dan password PostgreSQL di komputer Anda. Pastikan database `komorebi_db` sudah dibuat di PostgreSQL (atau biarkan Prisma membuatnya jika menggunakan user yang memiliki hak akses CREATE DATABASE).

---

### 4. Sinkronisasi Database dengan Prisma

Setelah mengisi `DATABASE_URL` yang valid:

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Sinkronkan skema tabel ke PostgreSQL**:
   ```bash
   npx prisma db push
   ```
   *(Atau gunakan `npx prisma migrate dev --name init` jika ingin menyimpan file riwayat migrasi SQL)*

3. **(Opsional) Buka Prisma Studio GUI**:
   ```bash
   npx prisma studio
   ```
   Prisma Studio akan terbuka di `http://localhost:5555` untuk melihat atau mengedit data catatan secara visual di browser.

---

### 5. Menjalankan Aplikasi

Jalankan development server:
```bash
npm run dev
```

Buka browser di **[http://localhost:3000](http://localhost:3000)**.

---

## 📂 Struktur Direktori

```text
komorebi/
├── app/
│   ├── api/
│   │   ├── entries/             # Endpoint CRUD catatan (Prisma / PostgreSQL)
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── companion/           # Endpoint AI Gemini
│   │       ├── chat/route.ts    # AI Voice chat companion
│   │       ├── distill/route.ts # AI Distill ke format Obsidian
│   │       └── tts/route.ts     # Gemini Text-To-Speech
│   ├── globals.css              # Tailwind CSS v4 & custom keyframe styling
│   ├── layout.tsx               # Root layout & Google typography
│   └── page.tsx                 # Halaman utama aplikasi Komorebi
├── components/
│   ├── Header.tsx               # Header, navigasi tab, tombol tema, suara hujan
│   ├── HomePage.tsx             # Halaman sambutan beranda & kartu ringkasan
│   ├── CompanionMode.tsx        # Mode suara AI interaktif
│   ├── ManualEditor.tsx         # Editor Markdown manual & live preview
│   ├── VaultArchive.tsx         # Arsip catatan, tag, & wikilinks filter
│   └── DistillModal.tsx         # Modal hasil sulingan Obsidian
├── lib/
│   ├── prisma.ts                # Prisma client singleton
│   ├── gemini.ts                # Google GenAI client helper
│   ├── storage.ts               # Adapter data API + offline fallback
│   ├── obsidian.ts              # Obsidian Markdown formatter & deep link
│   └── ambientSound.ts          # Web Audio API Zen ambient sound
├── prisma/
│   └── schema.prisma            # Skema model JournalEntry untuk PostgreSQL
├── types/
│   └── journal.ts               # Definisi tipe TypeScript
├── .env                         # Konfigurasi environment (Dummy sementara disediakan)
├── .env.example
├── package.json
└── tsconfig.json
```
