#!/bin/bash

# SocialHub Startup Script
# Menjalankan server dalam mode latar belakang (background) jika di Debian asli
# Di sini cukup jalankan node server.ts

echo "🚀 Menjalankan SocialHub Engine..."

# Di Debian production biasanya pakai PM2
# sudo npm install -g pm2
# pm2 start server.ts --interpreter tsx

npm run dev
