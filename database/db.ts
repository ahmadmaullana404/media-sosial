import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST || 'localhost';
const finalHost = (host === 'host') ? 'localhost' : host;

/**
 * Konfigurasi Koneksi Database MySQL/MariaDB
 */
const dbConfig = {
    host: finalHost,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'socialhub_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000 // 10 detik timeout
};

// Buat pool koneksi agar lebih efisien
const pool = mysql.createPool(dbConfig);

// Fungsi untuk mengetes koneksi
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Berhasil terhubung ke database MySQL.');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Gagal terhubung ke database:', error);
        return false;
    }
};

export default pool;
