# Panduan Lengkap Instalasi & Penggunaan SocialHub

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi SocialHub di komputer lokal Anda.

## 1. Persiapan Lingkungan (Prasyarat)
Pastikan Anda sudah menginstal:
- **Node.js** (Versi 18 atau lebih baru)
- **MySQL Server** atau **MariaDB**
- **Git** (Opsional, untuk melakukan clone repository)

---

## 2. Instalasi Langkah-Demi-Langkah

### Langkah 1: Persiapkan Folder Proyek
Jika Anda mengunduh dalam bentuk ZIP, ekstrak folder tersebut. Jika menggunakan Git:
```bash
git clone <url-repository-anda>
cd socialhub-app
```

### Langkah 2: Instal Library (Dependencies)
Buka terminal/command prompt di dalam folder proyek dan jalankan:
```bash
npm install
```
*Tunggu hingga proses selesai. Ini akan mengunduh semua library yang dibutuhkan seperti React, Express, dan Tailwind.*

### Langkah 3: Setup Database MySQL
1. Buka MySQL Client Anda (seperti MySQL Workbench, phpMyAdmin, atau terminal `mysql -u root -p`).
2. Buat database baru:
   ```sql
   CREATE DATABASE socialhub_db;
   ```
3. Impor tabel-tabel aplikasi menggunakan file yang sudah disediakan:
   - Jika menggunakan terminal:
     ```bash
     mysql -u root -p socialhub_db < database/schema.sql
     ```
   - Atau buka file `/database/schema.sql`, salin seluruh isinya, dan jalankan (paste) di SQL editor Anda.

### Langkah 4: Konfigurasi Environment (.env)
1. Cari file bernama `.env.example` di root folder.
2. Salin dan ganti namanya menjadi `.env`.
3. Buka file `.env` dan sesuaikan nilainya:
   ```env
   DB_HOST="localhost"
   DB_USER="root"        # Ganti dengan username MySQL Anda
   DB_PASSWORD="password" # Ganti dengan password MySQL Anda
   DB_NAME="socialhub_db"
   JWT_SECRET="apa_saja_yang_acak"
   PORT=3000
   ```

### Langkah 5: Mengisi Data Sampel (Seeding)
Agar aplikasi tidak kosong saat pertama kali dibuka, berikan data demo (users, posts, comments):
```bash
npx tsx scripts/seed.ts
```
*Jika muncul pesan "🌱 Memulai proses seeding data...", berarti database sudah berhasil terisi.*

---

## 3. Menjalankan Aplikasi

Sekarang Anda siap menjalankan aplikasi:
```bash
npm run dev
```

**Informasi Penting:**
- Aplikasi akan berjalan di: `http://localhost:3000`
- **Dashboard Admin** bisa diakses di: `http://localhost:3000/admin/login`
- Gunakan data dari proses *seeding* untuk login pertama kali (biasanya email: `admin@socialhub.com` atau `user1@test.com`).

---

## 5. Cara Membuat Akun Admin

Ada tiga cara untuk memiliki akun admin:

### Cara A: Menggunakan Akun Bawaan (Default)
Jika Anda sudah menjalankan `npx tsx scripts/seed.ts`, akun admin berikut sudah tersedia:
- **Email**: `admin@sosmed.id`
- **Password**: `admin123`

### Cara B: Membuat Admin Baru via Terminal
Saya telah menyediakan script khusus untuk membuat admin baru secara instan:
```bash
# Format: npx tsx scripts/create-admin.ts <username> <email> <password>
npx tsx scripts/create-admin.ts admin_baru admin@demo.com rahasia123
```

### Cara C: Mengubah User Biasa menjadi Admin (via SQL)
Jika Anda sudah mendaftar (register) sebagai user biasa dan ingin menjadi admin:
1. Buka MySQL Client.
2. Jalankan perintah SQL ini:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'email_anda@mail.com';
   ```

---

## 6. Akses Halaman Admin
Halaman khusus admin (Dashboard) dapat diakses melalui link:
**`http://localhost:3000/admin/login`**

---

## 7. Sinkronisasi ke GitHub & Cloud
Jika Anda ingin menyimpan kode ini di GitHub atau menghubungkannya ke layanan hosting:
- Lihat panduan lengkap di: **`GITHUB_UPDATE.md`**

---

## 8. Troubleshooting (Jika Ada Masalah)

### Masalah: "Database connection failed" (EAI_AGAIN atau ECONNREFUSED)
- Pastikan MySQL Server Anda sudah menyala.
- Cek kembali `DB_HOST`, `DB_USER`, dan `DB_PASSWORD` di file `.env`.
- Jika menggunakan Docker, gunakan IP container atau `host.docker.internal`.

### Masalah: "Port 3000 already in use"
- Ada aplikasi lain yang menggunakan port 3000. Anda bisa mengubah `PORT=3001` di file `.env` lalu restart aplikasi.

### Masalah: Gambar Postingan Tidak Muncul
- Pastikan folder `/public/uploads` atau `/uploads` (tergantung konfigurasi) ada dan memiliki izin tulis.

---
**Selesai!** Anda sekarang sudah bisa menjelajahi fitur SocialHub.
