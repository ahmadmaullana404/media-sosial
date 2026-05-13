import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../../database/db';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_hub_social';

/**
 * @route   POST /api/auth/register
 * @desc    Registrasi user baru
 */
router.post(
    '/register',
    [
        body('username').isLength({ min: 3 }).trim().escape(),
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('full_name').notEmpty().trim().escape()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { username, email, password, full_name } = req.body;

        try {
            // Cek apakah user sudah ada
            const [existingUser]: any = await pool.query(
                'SELECT id FROM users WHERE username = ? OR email = ?',
                [username, email]
            );

            if (existingUser.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Username atau Email sudah terdaftar.'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Simpan ke database
            const [result]: any = await pool.query(
                'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, full_name]
            );

            res.status(201).json({
                success: true,
                message: 'Registrasi berhasil. Silakan login.',
                data: { id: result.insertId, username }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user & get token
 */
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ success: false, message: 'Username atau Password salah.' });
        }

        // Cek status user (is_banned diubah ke status === 'banned' sesuai schema)
        if (user.status === 'banned') {
            return res.status(403).json({ success: false, message: 'Akun Anda telah diblokir.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Username atau Password salah.' });
        }

        // Buat token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    full_name: user.full_name,
                    role: user.role,
                    avatar: user.avatar
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
