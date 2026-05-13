import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import pool from '../../database/db';

const router = Router();

/**
 * GET /api/messages/:userId
 * Ambil riwayat chat dengan user tertentu
 */
router.get('/:userId', verifyToken, async (req: AuthRequest, res: Response) => {
    const myId = req.user?.id;
    const otherId = req.params.userId;

    try {
        const [messages]: any = await pool.query(`
            SELECT * FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        `, [myId, otherId, otherId, myId]);

        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/messages/:userId
 * Kirim pesan baru
 */
router.post('/:userId', verifyToken, async (req: AuthRequest, res: Response) => {
    const { content } = req.body;
    const senderId = req.user?.id;
    const receiverId = req.params.userId;

    try {
        const [result]: any = await pool.query(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            [senderId, receiverId, content]
        );
        res.json({ success: true, data: { id: result.insertId, content }, message: 'Pesan terkirim' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
