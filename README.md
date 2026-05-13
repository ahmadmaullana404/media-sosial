# SocialHub - Fullstack Social Media Platform

SocialHub adalah platform media sosial modern yang dibangun dengan arsitektur Fullstack menggunakan React, Express, dan MySQL. Platform ini menawarkan pengalaman pengguna yang dinamis dengan fitur real-time melalui Socket.io dan desain antarmuka yang elegan menggunakan Tailwind CSS dan Framer Motion.

## 🚀 Fitur Utama

### 📱 User Features
- **Autentikasi Aman:** Sistem Login dan Register menggunakan JWT (JSON Web Token) dan enkripsi password dengan bcrypt.
- **Feed & Interaksi:** Timeline yang menampilkan postingan dari pengguna lain. Pengguna dapat membuat post foto, menyukai (like), dan memberikan komentar.
- **Profil Pengguna:** Halaman profil yang menampilkan informasi pengguna, statistik post, dan riwayat postingan.
- **Sistem Pesan Real-time:** Fitur chat antar pengguna yang didukung oleh Socket.io untuk pengiriman pesan instan.
- **Notifikasi:** Pemberitahuan real-time untuk aktivitas seperti like, komentar, dan pesan baru.
- **Pencarian & Jelajah:** Fitur untuk mencari pengguna lain dan menjelajahi konten populer.

### 🛠️ Admin Features (Dashboard Admin)
- **Dashboard Statistik:** Ringkasan jumlah pengguna, postingan, dan aktivitas platform.
- **Manajemen Pengguna:** Admin dapat melihat daftar pengguna, mengubah status akun (Active/Banned/Suspended), dan mengelola peran.
- **Audit Postingan:** Fitur untuk meninjau dan menghapus postingan yang melanggar kebijakan platform.

## 💻 Tech Stack

### Frontend
- **React 19** dengan **Vite** sebagai build tool.
- **Tailwind CSS** untuk styling responsif.
- **Framer Motion** untuk animasi dan transisi UI yang halus.
- **Lucide React** untuk ikon sistem.
- **React Router 7** untuk navigasi SPA.

### Backend
- **Node.js & Express** sebagai server API.
- **MySQL** sebagai database relasional.
- **Socket.io** untuk komunikasi dua arah (real-time).
- **JWT (Jsonwebtoken)** untuk otentikasi berbasis token.
- **Multer** untuk penanganan unggahan file gambar.

## 🛠️ Cara Instalasi & Setup

### 1. Prasyarat
- Node.js (v18 atau lebih baru)
- MySQL / MariaDB

### 2. Kloning Proyek & Install Dependensi
```bash
# Clone repository ini (jika dari git)
# Masuk ke direktori proyek
npm install
```

### 3. Konfigurasi Database
1. Buat database baru di MySQL dengan nama `socialhub_db`.
2. Jalankan schema SQL yang tersedia di `/database/schema.sql` untuk membuat tabel-tabel yang dibutuhkan.
3. (Opsional) Jalankan script seeding untuk mengisi data sampel:
   ```bash
   npx tsx scripts/seed.ts
   ```

### 4. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
```env
DB_HOST="localhost"
DB_USER="username_mysql"
DB_PASSWORD="password_mysql"
DB_NAME="socialhub_db"
JWT_SECRET="kode_rahasia_anda"
GEMINI_API_KEY="api_key_gemini_anda"
PORT=3000
```

### 5. Menjalankan Aplikasi
```bash
# Jalankan mode development (Server & Client bersamaan)
npm run dev
```
Aplikasi akan dapat diakses di `http://localhost:3000`.

## 📁 Struktur Direktori
- `/src`: Kode sumber frontend (React components, pages, hooks, services).
- `/server`: Logika backend (routes, controllers, socket handlers).
- `/database`: Konfigurasi database, pool koneksi, dan schema SQL.
- `/scripts`: Script utilitas seperti database seeder.
- `/uploads`: Folder penyimpanan lokal untuk gambar yang diunggah.

## 🛡️ Keamanan & Optimasi
- **Helmet.js:** Proteksi header HTTP.
- **Input Validation:** Validasi data input menggunakan `express-validator`.
- **Error Handling:** Logger error terpusat dan penanganan koneksi database yang tangguh (termasuk auto-recovery untuk EAI_AGAIN errors).
- **Responsive Design:** Antarmuka yang dioptimalkan untuk mobile dan desktop.

---
Dikembangkan dalam sesi AI Studio Build.
