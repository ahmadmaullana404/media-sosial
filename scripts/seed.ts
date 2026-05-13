import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

/**
 * Script untuk mengisi database dengan data sampel (DEMO)
 */
async function seed() {
    const host = process.env.DB_HOST || 'localhost';
    
    // Safety check: jika host adalah "host" secara literal (mungkin typo di env), paksa ke localhost
    const finalHost = (host === 'host') ? 'localhost' : host;

    let connection: any;
    try {
        connection = await mysql.createConnection({
            host: finalHost,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'socialhub_db',
        });

        console.log(`🌱 Memulai proses seeding data di host: ${finalHost}...`);

        // Hapus data lama agar bersih (Hati-hati: Hanya untuk demo!)
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE reports');
        await connection.query('TRUNCATE TABLE messages');
        await connection.query('TRUNCATE TABLE follows');
        await connection.query('TRUNCATE TABLE comments');
        await connection.query('TRUNCATE TABLE likes');
        await connection.query('TRUNCATE TABLE posts');
        await connection.query('TRUNCATE TABLE users');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // 1. Buat User Admin
        const adminPass = await bcrypt.hash('admin123', 10);
        await connection.query(
            'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
            ['admin', 'admin@sosmed.id', adminPass, 'Super Admin', 'admin']
        );

        // 2. Buat Beberapa User Biasa
        const users = [
            ['budi_santoso', 'budi@mail.com', 'Budi Santoso', 'Lagi suka ngoding React!'],
            ['susi_latifa', 'susi@mail.com', 'Susi Latifa', 'Traveler & Food Enthusiast'],
            ['andi_pro', 'andi@mail.com', 'Andi Programmer', 'Debian Linux enjoyer'],
            ['rara_01', 'rara@mail.com', 'Rara Amelia', 'Seni desain grafis adalah hidupku'],
            ['ikhsan_dev', 'ikhsan@mail.com', 'Ahmad Ikhsan', 'Senior Fullstack Developer AI Studio'],
        ];

        const userIds = [];
        for (const u of users) {
            const pass = await bcrypt.hash('password123', 10);
            const [res]: any = await connection.query(
                'INSERT INTO users (username, email, password, full_name, bio) VALUES (?, ?, ?, ?, ?)',
                [u[0], u[1], pass, u[2], u[3]]
            );
            userIds.push(res.insertId);
        }

        // 3. Buat Postingan Sampel
        const posts = [
            [userIds[4], 'Halo dunia! SocialHub resmi diluncurkan hari ini 🚀', null],
            [userIds[0], 'Belajar Debian 12 ternyata seru juga ya :D', null],
            [userIds[2], 'Ada yang tau kenapa Nginx reverse proxy gagal connect ke Node.js?', null],
            [userIds[4], 'Sesi 1: Database Setup sudah berhasil kita selesaikan!', null],
            [userIds[1], 'Liburan ke Bali minggu depan, asik!', null],
        ];

        const postIds = [];
        for (const p of posts) {
            const [res]: any = await connection.query(
                'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
                p
            );
            postIds.push(res.insertId);
        }

        // 4. Tambah Like & Follow
        await connection.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userIds[0], postIds[0]]);
        await connection.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userIds[1], postIds[0]]);
        await connection.query('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [userIds[0], userIds[4]]);
        await connection.query('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [userIds[1], userIds[4]]);

        console.log('✅ Seeding selesai! Gunakan user "admin" password "admin123" untuk login dashboard.');
    } catch (err) {
        console.error('❌ Gagal seeding:', err);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

seed();
