import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script untuk inisialisasi database SocialHub
 * Membaca schema.sql dan menjalankannya
 */
async function init() {
    const host = process.env.DB_HOST || 'localhost';
    const finalHost = (host === 'host') ? 'localhost' : host;

    const dbConfig = {
        host: finalHost,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true // Penting untuk menjalankan banyak query sekaligus
    };

    let connection;
    try {
        console.log(`🔍 Mencoba menghubungkan ke MySQL di ${finalHost}...`);
        connection = await mysql.createConnection(dbConfig);

        const dbName = process.env.DB_NAME || 'socialhub_db';
        console.log(`🛠️ Membuat database (jika belum ada): ${dbName}`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        await connection.query(`USE ${dbName}`);

        console.log(`📜 Membaca skema dari database/schema.sql...`);
        const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log(`⚙️ Menjalankan skema SQL...`);
        await connection.query(schemaSql);

        console.log('✅ Inisialisasi database berhasil!');
        console.log('💡 Sekarang Anda bisa menjalankan "npm run seed" untuk mengisi data demo.');
    } catch (err: any) {
        console.error('❌ Gagal inisialisasi database:');
        console.error(err.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

init();
