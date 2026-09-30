# 📓 Log Aktivitas & Riwayat Perubahan (Activity Log) - Komorebi

File ini berfungsi sebagai pusat catatan data aktivitas harian, pelacakan perubahan kode, perbaikan bug, penambahan fitur, serta dokumentasi progres pengembangan proyek **Komorebi - Jurnal Refleksi & Second Brain (Next.js Edition)**.

---

## 📌 Panduan Pencatatan

Setiap kali Anda atau AI membuat perubahan pada proyek, tambahkan catatan baru di bagian paling atas dari [Riwayat Aktivitas & Perubahan](#-riwayat-aktivitas--perubahan) (**urutan waktu terbaru di atas / newest first**).

### Label Kategori Perubahan:
- `[FEAT]` : Penambahan fitur baru (*Feature*)
- `[FIX]` : Perbaikan bug atau error (*Bugfix*)
- `[REFACTOR]` : Restrukturisasi / perapian kode tanpa mengubah fungsionalitas
- `[STYLE]` : Perubahan styling, tema, atau UI/UX visual
- `[DB]` : Perubahan skema Prisma / migrasi PostgreSQL
- `[DOCS]` : Pembaruan dokumentasi, panduan, atau log
- `[PERF]` : Peningkatan performa atau efisiensi
- `[CHORE]` : Konfigurasi dependensi, build tools, atau struktur proyek

---

## 📋 Template Entri Baru

Salin format berikut setiap kali ingin menambahkan catatan baru:

```markdown
### 📅 [YYYY-MM-DD] - [Judul Singkat Perubahan]
- **Waktu**: HH:MM WIB
- **Tipe**: `[FEAT]` / `[FIX]` / `[REFACTOR]` / `[STYLE]` / `[DB]` / `[DOCS]` / `[CHORE]`
- **File Terkait**:
  - `components/...`
  - `app/...`
  - `lib/...`
- **Ringkasan Perubahan**:
  - Poin 1: Apa yang ditambahkan atau diubah.
  - Poin 2: Alasan atau logika di balik perubahan tersebut.
- **Hasil & Pengujian**:
  - Kondisi setelah perubahan diuji (berhasil/ada kendala).
- **Langkah Selanjutnya (Next Steps)**:
  - Rencana tindak lanjut atau hal yang belum selesai.
```

---

## 📜 Riwayat Aktivitas & Perubahan

### 📅 2026-09-28 - Pembuatan Profil Komprehensif Aplikasi (PROFILE.md)
- **Waktu**: 18:40 WIB
- **Tipe**: `[DOCS]`
- **File Terkait**:
  - `PROFILE.md`
  - `ACTIVITY_LOG.md`
- **Ringkasan Perubahan**:
  - Menyusun dan menambahkan dokumen profil resmi aplikasi di [PROFILE.md](file:///c:/code/Project_for_fun/komorebi/PROFILE.md).
  - Merangkum identitas proyek, filosofi "Komorebi", masalah & solusi, fungsionalitas fitur (Companion Mode, Markdown Editor, AI Distillation, Vault Archive, Ambient Rain Audio), arsitektur teknologi (Next.js 15, React 19, Prisma, PostgreSQL lokal, Google Gemini AI), model data Prisma, serta pertimbangan keamanan dan roadmap masa depan.
- **Hasil & Pengujian**:
  - Dokumen tersusun rapi dalam format Markdown yang terstruktur dan mudah diakses.
- **Langkah Selanjutnya (Next Steps)**:
  - Menyampaikan ringkasan identifikasi kepada pengguna.

### 📅 2026-09-28 - Migrasi Penuh dari React Vite ke Next.js 15 & Integrasi Prisma PostgreSQL
- **Waktu**: 18:05 WIB
- **Tipe**: `[FEAT]` / `[DB]` / `[CHORE]` / `[DOCS]`
- **File Terkait**:
  - `package.json`
  - `tsconfig.json`
  - `next.config.mjs`
  - `postcss.config.mjs`
  - `.env` & `.env.example`
  - `prisma/schema.prisma`
  - `lib/prisma.ts`
  - `lib/gemini.ts`
  - `lib/storage.ts`
  - `lib/obsidian.ts`
  - `lib/ambientSound.ts`
  - `app/api/entries/route.ts` & `app/api/entries/[id]/route.ts`
  - `app/api/companion/chat/route.ts`, `app/api/companion/distill/route.ts`, `app/api/companion/tts/route.ts`
  - `components/Header.tsx`, `components/HomePage.tsx`, `components/CompanionMode.tsx`, `components/ManualEditor.tsx`, `components/VaultArchive.tsx`, `components/DistillModal.tsx`
  - `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
  - `README.md`
- **Ringkasan Perubahan**:
  - Berhasil menginisialisasi proyek baru bernama `komorebi` menggunakan **Next.js 15 (App Router)**.
  - Memporting seluruh UI/UX estetika hangat, ramah, dan interaktif dari proyek React lama (Beranda, Mode Suara AI interaktif, Editor Markdown dengan split live-preview, Arsip Catatan Obsidian Vault, dan Modal Distilasi catatan).
  - Mengonfigurasi **Prisma ORM** dengan provider PostgreSQL lokal dan model `JournalEntry`.
  - Membuat REST API Route Handlers di Next.js untuk integrasi database PostgreSQL (`/api/entries`) serta API AI Gemini (`/api/companion/*`).
  - Menyiapkan file `.env` dan `.env.example` dengan dummy link connection string PostgreSQL lokal yang siap disesuaikan oleh pengguna.
  - Menambahkan *graceful fallback* offline ke cache browser (`localStorage`) sehingga aplikasi tetap dapat berjalan mulus saat database lokal sedang dipersiapkan.
  - Memindahkan file `ACTIVITY_LOG.md` ke dalam repositori utama `komorebi`.
- **Hasil & Pengujian**:
  - Berhasil menjalankan `npm install`, `npx prisma generate`, `npx tsc --noEmit`, dan `npx next build` dengan status kompilasi sukses 100% (0 error).
- **Langkah Selanjutnya (Next Steps)**:
  - Sesuaikan username dan password database di file `.env`.
  - Jalankan `npx prisma db push` untuk membuat tabel database PostgreSQL lokal.

### 📅 2026-09-28 - Inisialisasi File Log Aktivitas & Inventarisasi Proyek
- **Waktu**: 17:48 WIB
- **Tipe**: `[DOCS]` / `[CHORE]`
- **File Terkait**:
  - `ACTIVITY_LOG.md`
- **Ringkasan Perubahan**:
  - Membuat file log aktivitas sebagai media penyimpanan data aktivitas pembaruan harian dan riwayat perubahan aplikasi.
  - Menyediakan panduan label kategori serta template siap pakai untuk pencatatan update berikutnya.
  - Mengidentifikasi status dasar proyek Komorebi sebelum migrasi.
- **Hasil & Pengujian**:
  - Dokumentasi awal berhasil dibuat dan diintegrasikan ke repositori baru.
