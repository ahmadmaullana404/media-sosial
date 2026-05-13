#!/bin/bash

# Script Auto-Update SocialHub ke GitHub
# Memberikan kemudahan sinkronisasi dalam satu perintah

echo "🔍 Mengecek perubahan..."
git add .

# Mendapatkan waktu saat ini untuk pesan commit
NOW=$(date +"%d-%m-%Y %H:%M:%S")

echo "💾 Melakukan commit..."
git commit -m "Auto-update: $NOW"

echo "🚀 Mengirim ke GitHub (Push)..."
git push origin main

echo "✅ Selesai! Kode Anda sudah sinkron di GitHub."
