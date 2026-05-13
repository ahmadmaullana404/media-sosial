# Panduan Setup Server Debian 12 - SocialHub

Panduan ini akan membantu Anda menyiapkan server lokal menggunakan Debian 12 untuk menjalankan aplikasi SocialHub.

## 1. Persiapan Awal
Pastikan sistem Anda up-to-date.
```bash
sudo apt update && sudo apt upgrade -y
```

## 2. Instalasi Node.js (v20 LTS)
Kita akan menggunakan NodeSource agar mendapatkan versi terbaru.
```bash
# Download dan eksekusi script instalasi
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
# Install Node.js
sudo apt install -y nodejs
# Verifikasi
node -v && npm -v
```

## 3. Instalasi MySQL (MariaDB)
MariaDB adalah drop-in replacement untuk MySQL yang sangat stabil di Debian.
```bash
sudo apt install mariadb-server -y
# Amankan instalasi (set password root)
sudo mysql_secure_installation
```

### Membuat User Database Khusus Proyek
Jangan gunakan user `root` untuk aplikasi.
```bash
sudo mysql -u root -p
```
Di dalam console MySQL:
```sql
CREATE DATABASE socialhub_db;
CREATE USER 'socialuser'@'localhost' IDENTIFIED BY 'password_aman_anda';
GRANT ALL PRIVILEGES ON socialhub_db.* TO 'socialuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4. Instalasi Nginx (Reverse Proxy)
Nginx akan menerima traffic dan meneruskannya ke Node.js.
```bash
sudo apt install nginx -y
```

## 5. Instalasi phpMyAdmin (Visualisasi Database)
```bash
sudo apt install phpmyadmin -y
# Pilih 'apache2' saat ditanya (meskipun pake nginx, pilih saja agar setup dasar selesai)
# Pilih 'Yes' untuk dbconfig-common
```
Agar bisa diakses via Nginx, buat symlink:
```bash
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
```
Akses di: `http://ip-server-anda/phpmyadmin`

## 6. Mengelola Service
- `sudo systemctl start mariadb` (Mulai database)
- `sudo systemctl stop mariadb` (Berhenti)
- `sudo systemctl status mariadb` (Cek status)

## 7. Verifikasi Koneksi
Test koneksi mysql dengan user baru:
```bash
mysql -u socialuser -p socialhub_db
```
Jika berhasil masuk, database siap!

## 7. Inisialisasi Database (Cara Cepat)
Kami sudah menyediakan script otomatis untuk membuat tabel dan database. Pastikan MySQL/MariaDB sudah running.

```bash
# 1. Jalankan inisialisasi tabel (Membuat database & tabel)
npm run db:init

# 2. Jalankan pengisian data demo (Opsional, agar ada postingan awal)
npm run db:seed
```

## 8. Menjalankan Aplikasi
Setelah database siap, Anda bisa menjalankan aplikasi:

```bash
# 1. Jalankan server development
npm run dev
```

**Troubleshooting:**
1. **`ERR_MODULE_NOT_FOUND`:** Pastikan Anda berada di direktori project yang benar (`~/project/sosialmedia`). Jika server.ts tidak ditemukan, pastikan file tersebut ada di folder utama (root).
2. **Server Error Saat Login:** Biasanya disebabkan database belum siap. Jalankan `npm run db:init` dan `npm run db:seed` untuk memastikan semua tabel ada.
3. **Koneksi Database Gagal:** Periksa file `.env`. Pastikan `DB_USER` dan `DB_PASSWORD` sesuai dengan akun yang Anda buat di langkah 3.
