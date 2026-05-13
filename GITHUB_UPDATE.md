# Panduan Sinkronisasi & Update via GitHub

Dokumen ini menjelaskan cara memindahkan proyek ini ke GitHub dan bagaimana cara melakukan update (push/pull) saat Anda melakukan perubahan.

## 1. Memindahkan Proyek ke GitHub (Pertama Kali)

### Langkah 1: Buat Repository di GitHub
1. Login ke akun [GitHub](https://github.com).
2. Klik tombol **"New"** untuk membuat repository baru.
3. Beri nama (misal: `socialhub-app`), pilih **Public** atau **Private**, lalu klik **"Create repository"**.
4. Salin URL repository Anda (contoh: `https://github.com/username/socialhub-app.git`).

### Langkah 2: Inisialisasi Git Secara Lokal
Buka terminal di folder proyek Anda:
```bash
# Inisialisasi git
git init

# Tambahkan semua file (pastikan .gitignore sudah ada agar node_modules tidak ikut)
git add .

# Buat commit pertama
git commit -m "Initial commit from SocialHub AI Builder"

# Hubungkan ke repository GitHub Anda
git remote add origin https://github.com/username/socialhub-app.git

# Push ke branch utama
git branch -M main
git push -u origin main
```

---

## 2. Cara Melakukan Update Tercepat (Auto Sync)

Saya telah membuatkan script khusus agar Anda bisa melakukan update hanya dengan **satu perintah**. Cukup ketik ini di terminal:

```bash
npm run sync
```
*Script ini akan otomatis melakukan git add, commit dengan timestamp, dan push ke server GitHub Anda.*

---

## 3. Cara Manual Update (Push Changes)

## 3. Cara Mengambil Update (Pull Changes)

Jika Anda bekerja di dua komputer berbeda atau ingin mengambil update terbaru dari repository:

```bash
# Tarik data terbaru dari GitHub
git pull origin main

# Jalankan install jika ada library baru ditambahkan di package.json
npm install
```

---

## 4. Tips Deployment & Pemeliharaan

1. **Jangan Upload .env:** Pastikan file `.env` terdaftar di `.gitignore`. Rahasia database dan API Key tidak boleh ada di GitHub.
2. **Setup di Server (VPS):**
   - Clone repository di VPS.
   - Setup file `.env` secara manual di server.
   - Pake **PM2** untuk menjaga server Node.js tetap jalan di background:
     ```bash
     npm install -g pm2
     pm2 start npm --name "socialhub" -- run start
     ```
3. **Optimasi Build:**
   Sebelum dideploy ke produksi, jalankan:
   ```bash
   npm run build
   ```

---
**SocialHub Automation Team**
