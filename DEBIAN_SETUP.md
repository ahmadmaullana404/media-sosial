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

## 8. Menjalankan Aplikasi
Setelah database siap, Anda bisa menjalankan aplikasi:

```bash
# 1. Install dependensi
npm install

# 2. Jalankan migrasi database
npx tsx scripts/seed.ts

# 3. Jalankan server development
npm run dev
```

**Troubleshooting `ERR_MODULE_NOT_FOUND`:**
Jika Anda mendapati error `server.ts` tidak ditemukan padahal file ada di folder, pastikan Anda berada di direktori project yang benar (`~/project/sosialmedia`) dan coba jalankan:
```bash
npx tsx ./server.ts
```
Atau jika masih bermasalah, pastikan file `package.json` Anda memiliki `"type": "module"`.
