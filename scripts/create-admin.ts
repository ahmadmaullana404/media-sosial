import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script untuk membuat akun Admin baru tanpa menghapus data lain
 * Penggunaan: npx tsx scripts/create-admin.ts <username> <email> <password>
 */
async function createAdmin() {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log('❌ Penggunaan: npx tsx scripts/create-admin.ts <username> <email> <password>');
        console.log('Contoh: npx tsx scripts/create-admin.ts boss boss@sosmed.id rahasia123');
        process.exit(1);
    }

    const [username, email, password] = args;
    const host = process.env.DB_HOST || 'localhost';
    const finalHost = (host === 'host') ? 'localhost' : host;

    let connection: any;
    try {
        connection = await mysql.createConnection({
            host: finalHost,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'socialhub_db',
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await connection.query(
            'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, 'Administrator', 'admin']
        );

        console.log(`✅ Admin "${username}" berhasil dibuat!`);
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log(`🌐 Dashboard Admin: http://localhost:3000/admin/login`);

    } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.error('❌ Error: Username atau Email sudah terdaftar.');
        } else {
            console.error('❌ Gagal membuat admin:', err.message);
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

createAdmin();
