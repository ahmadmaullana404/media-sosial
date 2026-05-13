#!/bin/bash

# SocialHub Automated Setup Script
# Bahasa: Bash Shell

echo "--- SocialHub Setup Dimulai ---"

# 1. Update system
echo "[1/4] Mengupdate sistem debian..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install dependencies (NodeJS, MySQL, Nginx)
echo "[2/4] Menginstall Node.js, MySQL, Nginx..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs mariadb-server nginx

# 3. Setup Project
echo "[3/4] Menginstall project dependencies..."
npm install

# 4. Setup Database
echo "[4/4] Mempersiapkan database..."
echo "Silakan pastikan Anda sudah membuat database 'socialhub_db' dan user 'socialuser' sesuai panduan DEBIAN_SETUP.md"

# Jalankan seed data
echo "Menjalankan seeding data demo..."
node scripts/seed.js

echo "--- Setup Selesai! ---"
echo "Silakan konfigurasi Nginx dan jalankan dengan 'npm run dev' atau 'sh start.sh'"
