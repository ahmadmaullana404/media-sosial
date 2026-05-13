import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import pool from '../../database/db';

const router = Router();

/**
 * GET /api/notifications
 * Ambil notifikasi user
 */
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const [notifications]: any = await pool.query(`
            SELECT n.*, u.username as from_username, u.avatar as from_avatar
            FROM notifications n
            JOIN users u ON n.from_user_id = u.id
            WHERE n.user_id = ?
            ORDER BY n.created_at DESC
        `, [req.user?.id]);

        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * PUT /api/notifications/read
 * Tandai semua notifikasi sudah dibaca
 */
router.put('/read', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [req.user?.id]);
        res.json({ success: true, message: 'Semua notifikasi ditandai telah dibaca' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
