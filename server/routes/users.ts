import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import pool from '../../database/db';
import multer from 'multer';
import path from 'path';

const router = Router();

// Konfigurasi Multer untuk Upload Avatar
const storage = multer.diskStorage({
    destination: './uploads/avatars/',
    filename: (req, file, cb) => {
        cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

/**
 * GET /api/users/:id
 * Mendapatkan profil detail user
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const [userRows]: any = await pool.query(
            'SELECT id, username, full_name, bio, avatar, created_at FROM users WHERE id = ?',
            [req.params.id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        const user = userRows[0];

        // Hitung stats
        const [[{ postCount }]]: any = await pool.query('SELECT COUNT(*) as postCount FROM posts WHERE user_id = ?', [user.id]);
        const [[{ followers }]]: any = await pool.query('SELECT COUNT(*) as followers FROM follows WHERE following_id = ?', [user.id]);
        const [[{ following }]]: any = await pool.query('SELECT COUNT(*) as following FROM follows WHERE follower_id = ?', [user.id]);

        res.json({
            success: true,
            data: { ...user, stats: { postCount, followers, following } }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * PUT /api/users/:id
 * Update profil (Bio/Nama)
 */
router.put('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
    if (req.user?.id !== parseInt(req.params.id)) {
        return res.status(403).json({ success: false, message: 'Bukan milik Anda' });
    }

    const { full_name, bio } = req.body;
    try {
        await pool.query('UPDATE users SET full_name = ?, bio = ? WHERE id = ?', [full_name, bio, req.user.id]);
        res.json({ success: true, message: 'Profil berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
